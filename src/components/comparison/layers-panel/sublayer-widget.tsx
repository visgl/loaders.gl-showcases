import { useState } from "react";
import styled, { css } from "styled-components";
import { ExpandState, ListItemType } from "../../../types";
import { ActiveSublayer } from "../../../utils/active-sublayer";
import { ListItem } from "./list-item/list-item";

const GroupContainer = styled.div<{ needIndentation: boolean }>`
    ${({ needIndentation = false }) =>
        needIndentation &&
        css`
            margin-left: 44px;
        `}
`;

const nop = () => {}

export interface SublayerWidgetProps { 
    sublayer: ActiveSublayer,
    hasParent?: boolean, 
    onUpdateSublayerVisibility: Function, 
    onUpdate?: Function 
}

export const SublayerWidget = (props: SublayerWidgetProps) => {
    const { sublayer, hasParent = false, onUpdateSublayerVisibility, onUpdate = nop } = props;
    const childLayers = sublayer.sublayers || [];

    const [expanded, setExpanded] = useState(false);

    const toggleSublayer = () => {
        const leafsToUpdate = sublayer.setVisibilityForSubtreeAndReturnChangedLeafs(!Boolean(sublayer.visibility))
        onUpdate()
        leafsToUpdate.forEach(leaf => onUpdateSublayerVisibility(leaf))
    };

    const onChildUpdated = () => {
        sublayer.onChildVisibilityChange()
        onUpdate()
    }
    return (
        <GroupContainer key={sublayer.id} needIndentation={hasParent}>
            <ListItem
                id={sublayer.id.toString()}
                title={sublayer.name}
                type={ListItemType.Checkbox}
                selected={Boolean(sublayer.visibility)}
                expandState={childLayers.length ? expanded ? ExpandState.expanded : ExpandState.collapsed : undefined}
                onChange={() => toggleSublayer()}
                onExpandClick={() => setExpanded(!expanded)}
            />
            {expanded && childLayers.map(layer =>
                <SublayerWidget
                    sublayer={layer}
                    hasParent={true}
                    key={layer.id}
                    onUpdateSublayerVisibility={onUpdateSublayerVisibility}
                    onUpdate={onChildUpdated}
                />)}
        </GroupContainer>
    );
};
