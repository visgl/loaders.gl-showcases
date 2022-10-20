import React, { useState } from "react";
import styled from "styled-components";
import ChevronIcon from "../../../public/icons/chevron.svg";
import { LayoutProps } from "../comparison/common";
import { BookmarksListItem } from "./bookmark-list-item";
import { getCurrentLayoutProperty, useAppLayout } from "../../utils/layout";
import { Bookmark } from "../../types";

const BookmarksList = styled.div<LayoutProps>`
  display: flex;
  align-items: center;
  transition: 0.2s;
  flex: 2;

  overflow: ${getCurrentLayoutProperty({
    desktop: "hidden",
    tablet: "scroll",
    mobile: "scroll",
  })};

  gap: ${getCurrentLayoutProperty({
    desktop: "16px",
    tablet: "8px",
    mobile: "4px",
  })};
`;

const ArrowIconLeft = styled.div<LayoutProps>`
  cursor: pointer;
  fill: ${({ theme }) => theme.colors.fontColor};

  display: ${getCurrentLayoutProperty({
    desktop: "block",
    tablet: "none",
    mobile: "none",
  })};
`;

const ArrowIconRight = styled(ArrowIconLeft)<LayoutProps>`
  transform: rotate(-180deg);
`;

const ITEM_WIDTH = 144;
const ITEM_GAP = 16;

type SliderProps = {
  bookmarks: Bookmark[];
  editingMode: boolean;
  editingBookmarkId: string;
  onSelectBookmark: (id: string) => void;
  onDeleteBookmark: (id: string) => void;
  onEditingBookmark: (id: string) => void;
};

export const Slider = ({
  bookmarks,
  editingMode,
  editingBookmarkId,
  onSelectBookmark,
  onDeleteBookmark,
  onEditingBookmark
}: SliderProps) => {
  const [position, setPosition] = useState<number>(0);
  const [selectedBookmark, setSelectedBookmark] = useState<null | Bookmark>(
    null
  );

  const layout = useAppLayout();

  const handleLeftArrowClick = () => {
    setPosition((prev) => {
      const newPosition = prev + ITEM_WIDTH;

      return Math.min(newPosition, 0);
    });
  };

  const handleRightArrowClick = () => {
    setPosition((prev) => {
      const newPosition = prev - ITEM_WIDTH;

      const maxWidth = -(
        (bookmarks.length - 1) * ITEM_WIDTH -
        (bookmarks.length - 1) * ITEM_GAP
      );

      return Math.max(newPosition, maxWidth);
    });
  };

  const onSelectBookmarkHandler = (bookmarkId: string) => {
    const bookmark = bookmarks.find((bookmark) => bookmark.id === bookmarkId);

    if (bookmark) {
      setSelectedBookmark(bookmark);
    }

    if (bookmark && editingMode) {
      onEditingBookmark(bookmark.id);
    }

    onSelectBookmark(bookmarkId);
  };

  return (
    <>
      <ArrowIconLeft layout={layout} onClick={handleLeftArrowClick}>
        <ChevronIcon />
      </ArrowIconLeft>
      <BookmarksList layout={layout}>
        {bookmarks.map((bookmark) => {
          const bookmarkSelected =
            bookmark.id === selectedBookmark?.id && !editingMode;
          const editingSelected =
            bookmark.id === editingBookmarkId && editingMode;
          return (
            <BookmarksListItem
              key={bookmark.id}
              selected={bookmarkSelected}
              editingSelected={editingSelected}
              url={bookmark.imageUrl}
              editingMode={editingMode}
              moveWidth={position}
              onSelectBookmark={() => onSelectBookmarkHandler(bookmark.id)}
              onDeleteBookmark={() => onDeleteBookmark(bookmark.id)}
            />
          );
        })}
      </BookmarksList>
      <ArrowIconRight layout={layout} onClick={handleRightArrowClick}>
        <ChevronIcon />
      </ArrowIconRight>
    </>
  );
};
