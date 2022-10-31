import React, { useRef } from "react";
import styled, { css } from "styled-components";
import ChevronIcon from "../../../public/icons/chevron.svg";
import { LayoutProps } from "../comparison/common";
import { BookmarksListItem } from "./bookmark-list-item";
import { getCurrentLayoutProperty, useAppLayout } from "../../utils/layout";
import { Bookmark } from "../../types";

const BookmarksList = styled.div<LayoutProps>`
  display: flex;
  align-items: center;
  flex: 2;
  width: 100%;

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

const ArrowIconLeft = styled.button<LayoutProps & { blur: boolean }>`
  cursor: pointer;
  fill: ${({ theme }) => theme.colors.fontColor};
  border: none;
  padding: 0;
  background: transparent;

  display: ${getCurrentLayoutProperty({
    desktop: "block",
    tablet: "none",
    mobile: "none",
  })};

  ${({ blur }) =>
    blur &&
    css`
      opacity: 0.4;
    `}
`;

const ArrowIconRight = styled(ArrowIconLeft)<LayoutProps>`
  transform: rotate(-180deg);
`;

type SliderProps = {
  bookmarks: Bookmark[];
  editingMode: boolean;
  selectedBookmarkId: string;
  onSelectBookmark: (id: string) => void;
  onDeleteBookmark: (id: string) => void;
};

const SCROLLING_BY_X = 150;

export const Slider = ({
  bookmarks,
  editingMode,
  selectedBookmarkId,
  onSelectBookmark,
  onDeleteBookmark,
}: SliderProps) => {
  const bookmarkListRef = useRef<HTMLDivElement | null>(null);
  const listItems = useRef<HTMLDivElement[]>([]);

  const createRefsArray = (listItem: HTMLDivElement): void => {
    if (listItem && !listItems.current.includes(listItem)) {
      listItems.current.push(listItem);
    }
  };

  const disableLeftArrow =
    selectedBookmarkId === bookmarks?.at(0)?.id || !selectedBookmarkId;
  const disableRightArrow =
    selectedBookmarkId === bookmarks.at(-1)?.id || !selectedBookmarkId;

  const layout = useAppLayout();

  const handleLeftArrowClick = () => {
    const currentSelectedIndex = bookmarks.findIndex(
      (bookmark) => bookmark.id === selectedBookmarkId
    );
    const prevItemId = bookmarks[currentSelectedIndex - 1].id;
    onSelectBookmark(prevItemId);

    bookmarkListRef?.current?.scrollBy({
      top: 0,
      left: -SCROLLING_BY_X,
      behavior: "smooth",
    });
  };

  const handleRightArrowClick = () => {
    const currentSelectedIndex = bookmarks.findIndex(
      (bookmark) => bookmark.id === selectedBookmarkId
    );
    const nextItemId = bookmarks[currentSelectedIndex + 1].id;
    onSelectBookmark(nextItemId);

    bookmarkListRef?.current?.scrollBy({
      top: 0,
      left: SCROLLING_BY_X,
      behavior: "smooth",
    });
  };

  const onSelectBookmarHandler = (id: string): void => {
    onSelectBookmark(id);
    const listItem = listItems.current?.find(
      (item: HTMLDivElement) => item.id === id
    );

    listItem?.scrollIntoView({ behavior: "smooth", inline: "center" });
  };

  return (
    <>
      <ArrowIconLeft
        layout={layout}
        blur={disableLeftArrow}
        disabled={disableLeftArrow}
        onClick={handleLeftArrowClick}
      >
        <ChevronIcon />
      </ArrowIconLeft>
      <BookmarksList ref={bookmarkListRef} id="bookmarks-list" layout={layout}>
        {bookmarks.map((bookmark) => {
          const bookmarkSelected =
            bookmark.id === selectedBookmarkId && !editingMode;
          const editingSelected =
            bookmark.id === selectedBookmarkId && editingMode;
          return (
            <BookmarksListItem
              id={bookmark.id}
              key={bookmark.id}
              ref={createRefsArray}
              selected={bookmarkSelected}
              editingSelected={editingSelected}
              url={bookmark.imageUrl}
              editingMode={editingMode}
              onSelectBookmark={() => onSelectBookmarHandler(bookmark.id)}
              onDeleteBookmark={() => onDeleteBookmark(bookmark.id)}
            />
          );
        })}
      </BookmarksList>
      <ArrowIconRight
        blur={disableRightArrow}
        disabled={disableRightArrow}
        layout={layout}
        onClick={handleRightArrowClick}
      >
        <ChevronIcon />
      </ArrowIconRight>
    </>
  );
};
