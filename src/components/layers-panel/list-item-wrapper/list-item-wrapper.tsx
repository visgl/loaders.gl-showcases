import { SyntheticEvent } from "react";
import { Popover } from "react-tiny-popover";
import styled, { css } from "styled-components";
import { SelectionState, ExpandState } from "../../../types";
import { ExpandIcon } from "../../expand-icon/expand-icon";
import { OptionsIcon, Panels } from "../../common";

type BaseMapsItemProps = {
  children: React.ReactNode;
  id: string;
  optionsContent?: JSX.Element;
  selected: SelectionState;
  isOptionsPanelOpen?: boolean;
  expandState?: ExpandState;
  onClick: () => void;
  onOptionsClick?: (id: string) => void;
  onExpandClick?: () => void;
  onClickOutside?: () => void;
};

type ContainerProps = {
  $checked: boolean;
};

const Container = styled.div<ContainerProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 10px 10px;
  background: transparent;
  cursor: pointer;
  margin-bottom: 8px;
  ${({ $checked }) =>
    $checked &&
    css`
      background: ${({ theme }) => theme.colors.mainHiglightColor};
      box-shadow: 0px 17px 80px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    `}
  &:hover {
    background: ${({ theme }) => theme.colors.mainDimColor};
    box-shadow: 0px 17px 80px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
`;

const ItemContentWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  min-width: 0;
  align-items: center;
`;

const OptionsButton = styled.div`
  width: 16px;
  min-width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
`;

export const ListItemWrapper = ({
  children,
  id,
  selected,
  isOptionsPanelOpen = false,
  optionsContent,
  expandState,
  onOptionsClick,
  onClickOutside,
  onClick,
  onExpandClick,
}: BaseMapsItemProps) => {
  const onExpandClickHandler = (e: SyntheticEvent) => {
    e.stopPropagation();
    onExpandClick && onExpandClick();
  };

  return (
    <Container
      $checked={selected === SelectionState.selected}
      onClick={onClick}
    >
      <ItemContentWrapper>{children}</ItemContentWrapper>
      {optionsContent && onOptionsClick && (
        <Popover
          isOpen={isOptionsPanelOpen}
          reposition={false}
          positions={["left", "top", "bottom"]}
          align="start"
          content={optionsContent}
          containerStyle={{ zIndex: "2" }}
          onClickOutside={onClickOutside}
        >
          <OptionsButton
            id={id}
            className="settings"
            onClick={(event) => {
              event.stopPropagation();
              onOptionsClick(id);
            }}
          >
            <OptionsIcon $panel={Panels.Layers} />
          </OptionsButton>
        </Popover>
      )}
      {expandState && (
        <ExpandIcon expandState={expandState} onClick={onExpandClickHandler} />
      )}
    </Container>
  );
};
