import { SyntheticEvent } from "react";
import { Popover } from "react-tiny-popover";
import styled, { css } from "styled-components";
import { ExpandState } from "../../../../types";
import { color_brand_quaternary } from "../../../../constants/colors";
import { ExpandIcon } from "../../../expand-icon/expand-icon";

type BaseMapsItemProps = {
  children: React.ReactNode;
  id: string;
  optionsContent?: JSX.Element;
  selected: boolean;
  isOptionsPanelOpen?: boolean;
  expandState?: ExpandState;
  onClick: () => void;
  onOptionsClick?: (id: string) => void;
  onExpandClick?: () => void;
  onClickOutside?: () => void;
};

type ContainerProps = {
  checked: boolean;
};

const Container = styled.div<ContainerProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 10px 10px;
  background: transparent;
  cursor: pointer;
  margin-bottom: 8px;
  ${({ checked }) =>
    checked &&
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
  align-items: center;
`;

const OptionsButton = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
`;

const OptionsIcon = styled.div`
  position: relative;
  width: 4px;
  height: 4px;
  background-color: ${color_brand_quaternary};
  border-radius: 50%;
  margin-bottom: 12px;
  &:before,
  &:after {
    content: "";
    position: absolute;
    width: 4px;
    height: 4px;
    left: 0px;
    background-color: ${color_brand_quaternary};
    border-radius: inherit;
  }
  &:before {
    top: 6px;
  }
  &:after {
    top: 12px;
  }
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
    <Container checked={selected} onClick={onClick}>
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
            <OptionsIcon />
          </OptionsButton>
        </Popover>
      )}
      {expandState && (
        <ExpandIcon expandState={expandState} onClick={onExpandClickHandler} />
      )}
    </Container>
  );
};
