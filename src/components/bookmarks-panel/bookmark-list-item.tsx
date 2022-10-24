import React, { useState } from "react";
import styled, { css } from "styled-components";
import {
  color_canvas_secondary,
  color_brand_tertiary,
  color_accent_primary,
} from "../../constants/colors";
import { LayoutProps } from "../comparison/common";
import TrashIcon from "../../../public/icons/trash.svg";
import CloseIcon from "../../../public/icons/close.svg";
import ConfirmIcon from "../../../public/icons/confirmation.svg";
import { useAppLayout, getCurrentLayoutProperty } from "../../utils/layout";
import { BookmarkInnerButton } from "./bookmark-inner-button";
import { Layout } from "../../utils/enums";
import { ConfirmDeletingPanel } from "./confirm-deleting-panel";

type TranslateProps = {
  moveWidth: number;
};

type BookmarkListProps = {
  url: string;
  editingMode: boolean;
  deleteBookmark?: boolean;
  deleting: boolean;
  selected: boolean;
  isMobile: boolean;
  editing: boolean;
};

const BookmarkListItem = styled.div.attrs<TranslateProps>(({ moveWidth }) => ({
  style: {
    transform: `translateX(${moveWidth}px)`,
  },
}))<TranslateProps & LayoutProps & BookmarkListProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background: url(${(props) => props.url}) no-repeat;
  opacity: 1;
  min-width: 144px;
  cursor: pointer;
  fill: ${({ theme }) => theme.colors.fontColor};
  gap: 10px;
  transition: 0.2s;

  min-width: ${getCurrentLayoutProperty({
    desktop: "144px",
    tablet: "106px",
    mobile: "68px",
  })};

  height: ${getCurrentLayoutProperty({
    desktop: "81px",
    tablet: "62px",
    mobile: "44px",
  })};

  border-radius: ${getCurrentLayoutProperty({
    desktop: "12px",
    tablet: "10px",
    mobile: "8px",
  })};

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
    css<BookmarkListProps>`
      &:hover {
        opacity: 0.6;
        border: 2px solid
          ${({ editingMode = false }) =>
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

const TrashIconContainer = styled.div<{ deleting: boolean }>`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  fill: ${({ deleting }) => deleting && color_accent_primary};
`;

type BookmarksListItemProps = {
  selected: boolean;
  url: string;
  editingMode: boolean;
  editingSelected: boolean;
  moveWidth: number;
  onSelectBookmark: () => void;
  onDeleteBookmark: () => void;
};

const confirmText = "Are you sure you  want to delete the bookmark?";

export const BookmarksListItem = ({
  selected,
  url,
  editingMode,
  moveWidth,
  editingSelected,
  onSelectBookmark,
  onDeleteBookmark,
}: BookmarksListItemProps) => {
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
            <BookmarkInnerButton
              width={32}
              height={32}
              onInnerClick={onDeleteBookmark}
            >
              <ConfirmIcon />
            </BookmarkInnerButton>
            <BookmarkInnerButton
              width={32}
              height={32}
              onInnerClick={onUndoDeleting}
            >
              <CloseIcon />
            </BookmarkInnerButton>
          </>
        )}
        {!deleteBookmark && (
          <BookmarkInnerButton
            width={32}
            height={32}
            onInnerClick={onDeleteBookmarkClickHandler}
          >
            <TrashIcon />
          </BookmarkInnerButton>
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
      <BookmarkListItem
        layout={layout}
        url={url}
        editingMode={editingMode}
        isMobile={isMobileLayout}
        selected={selected}
        moveWidth={moveWidth}
        deleting={isDeletePanelOpen}
        editing={editingSelected}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onSelectBookmark}
      >
        {isHovering &&
          !isMobileLayout &&
          editingMode &&
          renderListItemContentDesktop()}
        {isMobileLayout && editingMode && renderListItemContentMobile()}
      </BookmarkListItem>
      {isDeletePanelOpen && (
        <ConfirmDeletingPanel
          title={confirmText}
          onCancel={() => setIsDeletePanelOpen(false)}
          onConfirm={onDeleteBookmark}
        />
      )}
    </>
  );
};
