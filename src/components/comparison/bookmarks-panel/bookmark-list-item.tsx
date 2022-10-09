import React, { useState } from "react";
import styled, { css } from "styled-components";
import {
  color_canvas_secondary,
  color_brand_tertiary,
} from "../../../constants/colors";
import { InnerButton, LayoutProps } from "../common";
import TrashIcon from "../../../../public/icons/trash.svg";
import CloseIcon from "../../../../public/icons/close.svg";
import ConfirmIcon from "../../../../public/icons/confirmation.svg";
import { useAppLayout, getCurrentLayoutProperty } from "../../../utils/layout";

type TranslateProps = {
  moveWidth: number;
};

type BookmarkListProps = {
  url: string;
  editingMode: boolean;
  deleteBookmark?: boolean;
  selected: boolean;
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
  background: url(${(props) => props.url}) no-repeat #232430;
  opacity: 1;
  min-width: 144px;
  border-radius: 12px;
  cursor: pointer;
  fill: ${({ theme }) => theme.colors.fontColor};
  gap: 10px;
  transition: 0.2s;

  min-width: ${getCurrentLayoutProperty({
    desktop: "144px",
    tablet: "68px",
    mobile: "68px",
  })};

  height: ${getCurrentLayoutProperty({
    desktop: "81px",
    tablet: "44px",
    mobile: "44px",
  })};

  ${({ selected }) =>
    selected &&
    css`
      border: 2px solid ${color_brand_tertiary};
    `}

  &:hover {
    opacity: 0.6;
    border: 2px solid
      ${({ editingMode = false }) =>
        editingMode ? color_canvas_secondary : color_brand_tertiary};

    &:nth-child(n) {
      opacity: 1;
    }
  }
`;

type BookmarksListItemProps = {
  selected: boolean;
  url: string;
  editingMode: boolean;
  moveWidth: number;
  onSelectBookmark: () => void;
};

export const BookmarksListItem = ({
  selected,
  url,
  editingMode,
  moveWidth,
  onSelectBookmark,
}: BookmarksListItemProps) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [deleteBookmark, setDeleteBookmark] = useState<boolean>(false);

  const layout = useAppLayout();

  const onMouseEnter = () => {
    setIsHovering(true);
  };

  const onMouseLeave = () => {
    setIsHovering(false);
  };

  const onDeleteBookmark = () => {
    setDeleteBookmark(true);
  };

  const onUndoDeleting = () => {
    setDeleteBookmark(false);
  };

  return (
    <BookmarkListItem
      layout={layout}
      url={url}
      editingMode={editingMode}
      selected={selected}
      moveWidth={moveWidth}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onSelectBookmark}
    >
      {isHovering && editingMode && (
        <>
          {deleteBookmark ? (
            <>
              <InnerButton width={32} height={32}>
                <ConfirmIcon />
              </InnerButton>
              <InnerButton width={32} height={32} onClick={onUndoDeleting}>
                <CloseIcon />
              </InnerButton>
            </>
          ) : (
            <InnerButton width={32} height={32} onClick={onDeleteBookmark}>
              <TrashIcon />
            </InnerButton>
          )}
        </>
      )}
    </BookmarkListItem>
  );
};
