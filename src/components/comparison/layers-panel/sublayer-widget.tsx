import { useState } from "react";
import styled, { css } from "styled-components";
import { SelectionState, ExpandState, ListItemType } from "../../../types";
import { ActiveSublayer } from "../../../utils/active-sublayer";
import { ListItem } from "./list-item/list-item";

const GroupContainer = styled.div<{ needIndentation: boolean }>`
    ${({ needIndentation = false }) =>
        needIndentation &&
        css`
            margin-left: 44px;
        `}
`;

export interface SublayerWidgetProps {
    sublayer: ActiveSublayer,
    hasParent?: boolean,
    onUpdateSublayerVisibility: (sublayer: ActiveSublayer) => void,
    onUpdate?: () => void
}

export const SublayerWidget = ({ sublayer, hasParent = false, onUpdateSublayerVisibility, onUpdate }: SublayerWidgetProps) => {
    const childLayers = sublayer.sublayers || [];

    const [expanded, setExpanded] = useState(false);

    const toggleSublayer = () => {
        const leafsToUpdate = sublayer.setVisibility(!(sublayer.visibility ?? false))
        onUpdate?.()
        leafsToUpdate.forEach(leaf => onUpdateSublayerVisibility(leaf))
    };

    const onChildUpdated = () => {
        sublayer.onChildVisibilityChange()
        onUpdate?.()
    }

    const getSelectedState = (sublayer: ActiveSublayer): SelectionState => {

        if (sublayer.isLeaf()) {
            return sublayer.visibility ? SelectionState.selected : SelectionState.unselected;
        }

        if (sublayer.visibility) {
            return SelectionState.selected;
        }

        const hasAnyChildSelectedSublayer = sublayer.sublayers.some(sublayer => sublayer.visibility);

        if (hasAnyChildSelectedSublayer) {
            return SelectionState.indeterminate;
        }

        return SelectionState.unselected;
    }

    const selected = getSelectedState(sublayer);

    return (
        <GroupContainer key={sublayer.id} needIndentation={hasParent}>
            <ListItem
                id={sublayer.id.toString()}
                title={sublayer.name}
                type={ListItemType.Checkbox}
                selected={selected}
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
