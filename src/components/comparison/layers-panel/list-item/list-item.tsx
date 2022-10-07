import { ExpandState, ListItemType } from "../../../../types";

import React, { SyntheticEvent } from "react";
import { Popover } from "react-tiny-popover";
import styled, { css } from "styled-components";

import { Checkbox } from "../../../checkbox/checkbox";
import { RadioButton } from "../../../radio-button/radio-button";

import { color_brand_quaternary } from "../../../../constants/colors";
import { ExpandIcon } from "../../../expand-icon/expand-icon";

type ListItemProps = {
  id: string;
  parentId?: string;
  title: string;
  icon?: React.ReactNode;
  listItemType: ListItemType;
  optionsContent?: JSX.Element;
  expandState?: ExpandState;
  selected: boolean;
  isOptionsPanelOpen?: boolean;
  usePopoverForOptions?: boolean;
  onClick: (id: string, parentId?: string) => void;
  onOptionsClick?: (id: string) => void;
  onExpandClick?: () => void;
  onClickOutside?: () => void;
  children?: React.ReactNode;
};

type ContainerProps = {
  isChild: boolean;
  checked: boolean;
  hasChildren: boolean;
};

const Container = styled.div<ContainerProps>`
  display: flex;
  width: ${({ isChild }) =>
    isChild ? "calc(100% - 6px)" : "calc(100% - 30px)"};
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px 10px 10px;
  background: transparent;
  cursor: pointer;
  margin-bottom: 8px;

  ${({ checked, hasChildren }) =>
    checked &&
    !hasChildren &&
    css`
      background: ${({ theme }) => theme.colors.mainHiglightColor};
      box-shadow: 0px 17px 80px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    `}

  ${({ hasChildren }) =>
    !hasChildren &&
    css`
      &:hover {
        background: ${({ theme }) => theme.colors.mainDimColor};
        box-shadow: 0px 17px 80px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
      }
    `}
`;

const ItemContentWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
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

const ContentWithOptionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
`;

const Title = styled.div`
  margin-left: 16px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.fontColor};
`;

const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const ListItem = ({
  id,
  parentId,
  title,
  icon = null,
  listItemType,
  selected,
  isOptionsPanelOpen = false,
  usePopoverForOptions = true,
  optionsContent,
  expandState,
  onOptionsClick,
  onClickOutside,
  onClick,
  onExpandClick,
  children,
}: ListItemProps) => {
  const onExpandClickHandler = (event: SyntheticEvent) => {
    event.stopPropagation();
    onExpandClick && onExpandClick();
  };

  const handleClick = (event: SyntheticEvent) => {
    event.stopPropagation();
    onClick(id, parentId);
  };

  const handleOptionsClick = (event: SyntheticEvent) => {
    event.stopPropagation();
    onOptionsClick && onOptionsClick(id);
  };

  return (
    <Container
      isChild={Boolean(parentId)}
      checked={selected}
      onClick={handleClick}
      hasChildren={Boolean(children)}
    >
      <ContentWithOptionsWrapper>
        <ItemContentWrapper>
          <ControlsWrapper>
            {listItemType === ListItemType.Checkbox && (
              <Checkbox
                id={`checkbox-${id}`}
                checked={selected}
                onChange={handleClick}
              />
            )}
            {listItemType === ListItemType.Radio && (
              <RadioButton
                id={`radio-button-${id}`}
                checked={selected}
                onChange={handleClick}
              />
            )}
            {listItemType === ListItemType.Icon && icon}
            <Title>{title}</Title>
          </ControlsWrapper>
        </ItemContentWrapper>
        {expandState && (
          <>
            SUkaaaaaa
            <ExpandIcon
              expandState={expandState}
              onClick={onExpandClickHandler}
            />
          </>
        )}
        {optionsContent && usePopoverForOptions && (
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
              onClick={handleOptionsClick}
            >
              <OptionsIcon />
            </OptionsButton>
          </Popover>
        )}
        {optionsContent && !usePopoverForOptions && optionsContent}
      </ContentWithOptionsWrapper>
      {children && <ItemContentWrapper>{children}</ItemContentWrapper>}
    </Container>
  );
};
