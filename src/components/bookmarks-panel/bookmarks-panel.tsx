import { useCallback, useState } from "react";
import styled, { css, useTheme } from "styled-components";
import { Layout } from "../../utils/enums";
import { getCurrentLayoutProperty, useAppLayout } from "../../utils/layout";
import {
  PanelHeader,
  HorizontalLine,
  Panels,
  Title,
  InnerButton,
  OptionsIcon,
} from "../comparison/common";
import { CloseButton } from "../close-button/close-button";
import { Slider } from "./slider";
import PlusIcon from "../../../public/icons/plus.svg";
import ConfirmationIcon from "../../../public/icons/confirmation.svg";
import CloseIcon from "../../../public/icons/close.svg";
import ConfirmIcon from "../../../public/icons/confirmation.svg";
import { BookmarkOptionsMenu } from "./bookmark-option-menu";
import { UploadPanel } from "./upload-panel";
import { UnsavedBookmarkWarning } from "./unsaved-bookmark-warning";
import { Popover } from "react-tiny-popover";
import { color_brand_tertiary } from "../../constants/colors";
import { Bookmark } from "../../types";

enum PopoverType {
  options,
  upload,
  uploadWarning,
  none,
}

type LayoutProps = {
  layout: string;
};

const Container = styled.div<LayoutProps>`
  background: ${({ theme }) => theme.colors.mainCanvasColor};
  position: absolute;
  z-index: 2;
  height: 177px;

  border-radius: ${getCurrentLayoutProperty({
    desktop: "8px;",
    tablet: "0px",
    mobile: "0px",
  })};

  width: ${getCurrentLayoutProperty({
    desktop: "1112px",
    tablet: "100%",
    mobile: "100%",
  })};

  height: ${getCurrentLayoutProperty({
    desktop: "177px",
    tablet: "76px",
    mobile: "76px",
  })};

  left: ${getCurrentLayoutProperty({
    desktop: "calc(50% - 556px)",
    tablet: "0px",
    mobile: "0px",
  })};

  ${getCurrentLayoutProperty({
    desktop: "bottom: 100px;",
    tablet: "bottom: 0px;",
    mobile: "bottom: 0px;",
  })};
`;

const ItemsList = styled.div<LayoutProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 16px 0 16px;

  margin: ${getCurrentLayoutProperty({
    desktop: "0 16px 0 16px",
    tablet: "16px",
    mobile: "16px",
  })};
`;

const ButtonWrapper = styled.div<LayoutProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 144px;
  height: 81px;
  cursor: pointer;
  gap: 10px;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: ${color_brand_tertiary};
    border-radius: 12px;
    opacity: 0.4;
    z-index: -1;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const BookmarkPanelHeader = styled(PanelHeader)`
  margin-top: 0px;
`;

const Overlay = styled.div<{ showOverlayCondition: boolean }>`
  ${({ showOverlayCondition = false }) =>
    showOverlayCondition &&
    css`
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 3;
      background: rgba(0, 0, 0, 0.6);
    `}
`;

type BookmarksPanelProps = {
  id: string;
  bookmarks: Bookmark[];
  onClose: () => void;
  onAddBookmark: () => void;
  onSelectBookmark: (id: string) => void;
};

export const BookmarksPanel = ({ id, bookmarks, onClose, onAddBookmark, onSelectBookmark }: BookmarksPanelProps) => {
  const [editingMode, setEditingMode] = useState<boolean>(false);
  const [clearBookmarks, setClearBookmarksMode] = useState<boolean>(false);
  const [popoverType, setPopoverType] = useState<number>(PopoverType.none);

  const layout = useAppLayout();
  const theme = useTheme();

  const showOverlayCondition =
    popoverType === PopoverType.upload ||
    popoverType === PopoverType.uploadWarning;
  const disableAddButton = editingMode || clearBookmarks;

  const onEditBookmark = useCallback(() => {
    setEditingMode((prev) => !prev);
    setPopoverType(PopoverType.none);
  }, []);

  const onClearBookmarks = useCallback(() => {
    setClearBookmarksMode((prev) => !prev);
    setPopoverType(PopoverType.none);
  }, []);

  const renderPopoverContent = () => {
    if (popoverType === PopoverType.uploadWarning) {
      return (
        <UnsavedBookmarkWarning
          onCancel={() => setPopoverType(PopoverType.none)}
          onConfirmWarning={() => setPopoverType(PopoverType.upload)}
        />
      );
    }

    if (popoverType === PopoverType.upload) {
      return (
        <UploadPanel
          onCancel={() => setPopoverType(PopoverType.none)}
          onConfirmWarning={() => console.log("not implemented yet")}
        />
      );
    }

    if (popoverType === PopoverType.options) {
      return (
        <BookmarkOptionsMenu
          onEditBookmark={onEditBookmark}
          onClearBookmarks={onClearBookmarks}
          onUploadBookmarks={() => setPopoverType(PopoverType.uploadWarning)}
        />
      );
    }

    return null;
  };

  const renderAddBookmarkButton = (
    width: number,
    height: number
  ): JSX.Element => {
    return (
      <InnerButton
        width={width}
        height={height}
        disabled={disableAddButton}
        blurButton={disableAddButton}
        onClick={onAddBookmark}
      >
        <PlusIcon fill={theme.colors.buttonIconColor} />
      </InnerButton>
    );
  };

  return (
    <>
      <Container id={id} layout={layout}>
        {layout === Layout.Desktop && (
          <>
            <BookmarkPanelHeader panel={Panels.Bookmarks}>
              <Title left={16}>Bookmarks Panel</Title>
              <CloseButton
                id="bookmarks-panel-close-button"
                onClick={onClose}
              />
            </BookmarkPanelHeader>
            <HorizontalLine top={10} />
          </>
        )}

        <ItemsList layout={layout}>
          {layout === Layout.Desktop ? (
            <ButtonWrapper layout={layout}>
              {renderAddBookmarkButton(44, 44)}
            </ButtonWrapper>
          ) : (
            renderAddBookmarkButton(66, 44)
          )}

          {bookmarks.length > 0 ? (
            <Slider bookmarks={bookmarks} editingMode={editingMode} onSelectBookmark={onSelectBookmark}/>
          ) : (
            <Title>Bookmarks list is empty</Title>
          )}
          <ButtonWrapper layout={layout}>
            <Popover
              isOpen={popoverType !== PopoverType.none}
              reposition={false}
              positions={["top", "bottom", "left", "right"]}
              content={renderPopoverContent() as JSX.Element}
              containerStyle={{ zIndex: "4", top: "80px", left: "100px" }}
              onClickOutside={() => setPopoverType(PopoverType.none)}
            >
              <ButtonsWrapper>
                {editingMode && (
                  <InnerButton
                    width={44}
                    height={44}
                    onClick={() => setEditingMode(false)}
                  >
                    <ConfirmationIcon />
                  </InnerButton>
                )}
                {!editingMode && (
                  <InnerButton
                    width={44}
                    height={44}
                    hide={clearBookmarks}
                    onClick={() => setPopoverType(PopoverType.options)}
                  >
                    <OptionsIcon panel={Panels.Bookmarks} />
                  </InnerButton>
                )}
                {clearBookmarks && (
                  <>
                    <InnerButton width={32} height={32}>
                      <ConfirmIcon />
                    </InnerButton>
                    <InnerButton width={32} height={32}>
                      <CloseIcon onClick={() => setClearBookmarksMode(false)} />
                    </InnerButton>
                  </>
                )}
              </ButtonsWrapper>
            </Popover>
          </ButtonWrapper>
        </ItemsList>
      </Container>
      <Overlay showOverlayCondition={showOverlayCondition} />
    </>
  );
};
