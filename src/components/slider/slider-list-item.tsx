import React, { useState, forwardRef } from "react";
import styled, { css } from "styled-components";
import {
  color_canvas_secondary,
  color_brand_tertiary,
  color_accent_primary,
  color_canvas_primary_inverted,
} from "../../constants/colors";
import TrashIcon from "../../../public/icons/trash.svg";
import CloseIcon from "../../../public/icons/close.svg";
import ConfirmIcon from "../../../public/icons/confirmation.svg";
import { SliderInnerButton } from "./slider-inner-button";
import { Layout } from "../../utils/enums";
import { ConfirmDeletingPanel } from "./confirm-deleting-panel";
import {
  getCurrentLayoutProperty,
  useAppLayout,
} from "../../utils/hooks/layout";
import { LayoutProps, SliderType } from "../../types";

type ListItemProps = {
  url: string;
  sliderType: SliderType;
  editingMode?: boolean;
  deleteBookmark?: boolean;
  deleting: boolean;
  selected: boolean;
  isMobile: boolean;
  editing?: boolean;
};

const ListItem = styled.div<LayoutProps & ListItemProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  cursor: pointer;
  fill: ${({ theme }) => theme.colors.fontColor};

  ${({ sliderType }) => {
    switch (sliderType) {
      case SliderType.Floors:
        return css`
          width: 67px;
        `;
      case SliderType.Phase:
        return css`
          min-width: 44px;
        `;
      case SliderType.Bookmarks:
        return getCurrentLayoutProperty({
          desktop: "min-width: 144px",
          tablet: "min-width: 106px",
          mobile: "min-width: 68px",
        });
    }
  }};

  ${({ sliderType }) => {
    switch (sliderType) {
      case SliderType.Floors:
        return css`
          min-height: 44px;
        `;
      case SliderType.Phase:
        return css`
          height: 44px;
        `;
      case SliderType.Bookmarks:
        return getCurrentLayoutProperty({
          desktop: "height: 81px",
          tablet: "height: 62px",
          mobile: "height: 44px",
        });
    }
  }};

  border-radius: ${({ sliderType }) =>
    sliderType === SliderType.Bookmarks
      ? getCurrentLayoutProperty({
          desktop: "12px",
          tablet: "10px",
          mobile: "8px",
        })
      : "8px"};

  ${({ sliderType }) => {
    if (sliderType === SliderType.Bookmarks) {
      return css<ListItemProps>`
        background: url(${(props) => props.url}) round;
        opacity: 1;
        gap: 10px;
        ${({ selected }) =>
          selected &&
          css`
            border: 2px solid ${color_brand_tertiary};
          `}

        ${({ editingMode, isMobile }) =>
          editingMode &&
          isMobile &&
          css`
            border: 2px solid ${color_canvas_secondary};
          `}

          ${({ editing }) =>
          editing &&
          css`
            border: 2px solid ${color_canvas_secondary};
          `}

          ${({ isMobile }) =>
          !isMobile &&
          css<ListItemProps>`
            &:hover {
              opacity: 0.6;
              border: 2px solid
                ${({ editingMode }) =>
                  editingMode ? color_canvas_secondary : color_brand_tertiary};

              &:nth-child(n) {
                opacity: 1;
              }
            }
          `}

          ${({ deleting }) =>
          deleting &&
          css`
            border: 2px solid ${color_accent_primary};
          `}
      `;
    } else {
      return css<ListItemProps>`
        background: ${({ selected, theme }) =>
          selected ? color_brand_tertiary : theme.colors.mainAttibuteItemColor};
      `;
    }
  }};
`;

const TrashIconContainer = styled.div<{ deleting: boolean }>`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  fill: ${({ deleting }) => deleting && color_accent_primary};
`;

const SliderItemText = styled.div<{ selected: boolean }>`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.fontColor};
  ${({ selected }) =>
    selected &&
    css`
      color: ${color_canvas_primary_inverted};
    `}
`;

type SliderListItemProps = {
  id: string;
  children?: React.ReactNode;
  selected: boolean;
  url: string;
  editingMode?: boolean;
  editingSelected?: boolean;
  sliderType: SliderType;
  sliderItemText?: string;
  onSelect: () => void;
  onDelete: () => void;
};

const confirmText = "Are you sure you  want to delete the bookmark?";

export const SliderListItem = forwardRef(
  (
    props: SliderListItemProps,
    ref: React.ForwardedRef<null | HTMLDivElement>
  ) => {
    const {
      id,
      selected,
      url,
      sliderType,
      editingMode,
      editingSelected,
      sliderItemText,
      onSelect,
      onDelete,
    } = props;
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [deleteBookmark, setDeleteBookmark] = useState<boolean>(false);
    const [isDeletePanelOpen, setIsDeletePanelOpen] = useState<boolean>(false);

    const layout = useAppLayout();

    const isMobileLayout = layout !== Layout.Desktop;

    const onMouseEnter = () => {
      setIsHovering(true);
    };

    const onMouseLeave = () => {
      setIsHovering(false);
    };

    const onDeleteBookmarkClickHandler = () => {
      setDeleteBookmark(true);
    };

    const onUndoDeleting = () => {
      setDeleteBookmark(false);
    };

    const renderListItemContentDesktop = () => {
      return (
        <>
          {deleteBookmark && (
            <>
              <SliderInnerButton width={32} height={32} onInnerClick={onDelete}>
                <ConfirmIcon />
              </SliderInnerButton>
              <SliderInnerButton
                width={32}
                height={32}
                onInnerClick={onUndoDeleting}
              >
                <CloseIcon />
              </SliderInnerButton>
            </>
          )}
          {!deleteBookmark && (
            <SliderInnerButton
              width={32}
              height={32}
              onInnerClick={onDeleteBookmarkClickHandler}
            >
              <TrashIcon />
            </SliderInnerButton>
          )}
        </>
      );
    };

    const renderListItemContentMobile = () => {
      return (
        <TrashIconContainer
          deleting={isDeletePanelOpen}
          onClick={() => setIsDeletePanelOpen((prev) => !prev)}
        >
          <TrashIcon />
        </TrashIconContainer>
      );
    };

    return (
      <>
        <ListItem
          id={id}
          ref={ref}
          $layout={layout}
          url={url}
          sliderType={sliderType}
          editingMode={editingMode}
          isMobile={isMobileLayout}
          selected={selected}
          deleting={isDeletePanelOpen}
          editing={editingSelected}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={onSelect}
        >
          {isHovering &&
            !isMobileLayout &&
            editingMode &&
            renderListItemContentDesktop()}
          {isMobileLayout && editingMode && renderListItemContentMobile()}
          {sliderItemText && (
            <SliderItemText selected={selected}>
              {sliderItemText}
            </SliderItemText>
          )}
        </ListItem>
        {isDeletePanelOpen && (
          <ConfirmDeletingPanel
            title={confirmText}
            onCancel={() => setIsDeletePanelOpen(false)}
            onConfirm={onDelete}
          />
        )}
      </>
    );
  }
);
