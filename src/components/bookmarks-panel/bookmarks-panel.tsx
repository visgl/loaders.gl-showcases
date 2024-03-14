import { useCallback, useState } from "react";
import styled, { css, useTheme } from "styled-components";
import { Layout } from "../../utils/enums";
import {
  PanelHeader,
  PanelHorizontalLine,
  Panels,
  Title,
  OptionsIcon,
} from "../common";
import { CloseButton } from "../close-button/close-button";
import { Slider } from "../slider/slider";
import PlusIcon from "../../../public/icons/plus.svg";
import ConfirmationIcon from "../../../public/icons/confirmation.svg";
import CloseIcon from "../../../public/icons/close.svg";
import ConfirmIcon from "../../../public/icons/confirmation.svg";
import { BookmarkOptionsMenu } from "./bookmark-option-menu";
import { UploadPanel } from "../upload-panel/upload-panel";
import { UnsavedBookmarkWarning } from "./unsaved-bookmark-warning";
import { Popover } from "react-tiny-popover";
import { color_brand_tertiary } from "../../constants/colors";
import { Bookmark, LayoutProps, SliderType } from "../../types";
import { SliderInnerButton } from "../slider/slider-inner-button";
import { ConfirmDeletingPanel } from "../slider/confirm-deleting-panel";
import {
  getCurrentLayoutProperty,
  useAppLayout,
} from "../../utils/hooks/layout";

import { FileType, FileUploaded } from "../../types";
import { parseBookmarks } from "../../utils/bookmarks-utils";

enum PopoverType {
  options,
  upload,
  uploadWarning,
  clearBookmarks,
  none,
}

const Container = styled.div<LayoutProps>`
  position: absolute;
  background: ${({ theme }) => theme.colors.mainCanvasColor};
  z-index: 4;

  border-radius: ${getCurrentLayoutProperty({
    desktop: "8px",
    tablet: "0px",
    mobile: "0px",
  })};

  left: ${getCurrentLayoutProperty({
    desktop: "20%",
    tablet: "0",
    mobile: "0",
  })};

  bottom: ${getCurrentLayoutProperty({
    desktop: "24px;",
    tablet: "0",
    mobile: "0",
  })};

  width: ${getCurrentLayoutProperty({
    desktop: "60%",
    tablet: "100%",
    mobile: "100%",
  })};
`;

const ItemsList = styled.div<LayoutProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: ${getCurrentLayoutProperty({
    desktop: "16px",
    tablet: "8px",
    mobile: "4px",
  })};

  margin: ${getCurrentLayoutProperty({
    desktop: "0 16px 16px 16px",
    tablet: "16px",
    mobile: "16px",
  })};
`;

const ButtonWrapper = styled.div<LayoutProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  gap: 10px;
  position: relative;

  width: ${getCurrentLayoutProperty({
    desktop: "144px",
    tablet: "106px",
    mobile: "68px",
  })};

  height: ${getCurrentLayoutProperty({
    desktop: "81px",
    tablet: "62px",
    mobile: "44px",
  })};

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: ${color_brand_tertiary};

    border-radius: ${getCurrentLayoutProperty({
      desktop: "12px",
      tablet: "8px",
      mobile: "6px",
    })};

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
  selectedBookmarkId?: string;
  disableBookmarksAdding: boolean;
  onClose: () => void;
  onAddBookmark: () => void;
  onSelectBookmark: (id: string) => void;
  onCollapsed: () => void;
  onDownloadBookmarks: () => void;
  onClearBookmarks: () => void;
  onDeleteBookmark: (id: string) => void;
  onEditBookmark: (id: string) => void;
  onBookmarksUploaded: (bookmarks: Bookmark[]) => void;
};

const confirmText = "Are you sure you  want to clear all  bookmarks?";

export const BookmarksPanel = ({
  id,
  bookmarks,
  selectedBookmarkId = "",
  disableBookmarksAdding,
  onClose,
  onAddBookmark,
  onSelectBookmark,
  onCollapsed,
  onDownloadBookmarks,
  onClearBookmarks,
  onBookmarksUploaded,
  onDeleteBookmark,
  onEditBookmark,
}: BookmarksPanelProps) => {
  const [editingMode, setEditingMode] = useState<boolean>(false);
  const [clearBookmarks, setClearBookmarksMode] = useState<boolean>(false);
  const [popoverType, setPopoverType] = useState<number>(PopoverType.none);

  const layout = useAppLayout();
  const theme = useTheme();

  const showOverlayCondition =
    popoverType === PopoverType.upload ||
    popoverType === PopoverType.uploadWarning;
  const disableAddButton = editingMode || clearBookmarks;
  const isDesktop = layout === Layout.Desktop;

  const getOptionMenuPosition = () => {
    if (popoverType === PopoverType.options) {
      return {
        zIndex: "4",
        top: isDesktop ? "80px" : "30px",
        left: isDesktop ? "100px" : "-110px",
      };
    }

    if (popoverType !== PopoverType.options) {
      return {
        zIndex: "4",
        top: isDesktop ? "80px" : "30px",
        left: isDesktop ? "100px" : "-145px",
      };
    }
  };

  const onEditBookmarksClickHandler = useCallback(() => {
    setEditingMode((prev) => !prev);
    setPopoverType(PopoverType.none);
  }, []);

  const onClearBookmarksClickHandler = () => {
    if (!isDesktop) {
      setPopoverType(PopoverType.clearBookmarks);
    }

    if (isDesktop) {
      setPopoverType(PopoverType.none);
    }
    setClearBookmarksMode((prev) => !prev);
  };

  const onClearBookmarksHandler = () => {
    onClearBookmarks();
    setClearBookmarksMode(false);
    setPopoverType(PopoverType.none);
  };

  const onBookmarksUploadedHandler = async ({ fileContent }: FileUploaded) => {
    setPopoverType(PopoverType.none);
    if (typeof fileContent === "string") {
      const bookmarksParsed = await parseBookmarks(fileContent);
      bookmarksParsed && onBookmarksUploaded(bookmarksParsed);
    }
  };

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
          title={"Upload Bookmarks"}
          dragAndDropText={"Drag and drop your json file here"}
          fileType={FileType.text}
          onCancel={() => setPopoverType(PopoverType.none)}
          onFileUploaded={onBookmarksUploadedHandler}
        />
      );
    }

    if (popoverType === PopoverType.options) {
      return (
        <BookmarkOptionsMenu
          showDeleteBookmarksOption={bookmarks.length > 0}
          onEditBookmarks={onEditBookmarksClickHandler}
          onClearBookmarks={onClearBookmarksClickHandler}
          onUploadBookmarks={() =>
            setPopoverType(
              bookmarks.length ? PopoverType.uploadWarning : PopoverType.upload
            )
          }
          onDownloadBookmarks={onDownloadBookmarks}
          onCollapsed={onCollapsed}
        />
      );
    }

    if (popoverType === PopoverType.clearBookmarks && !isDesktop) {
      return (
        <ConfirmDeletingPanel
          title={confirmText}
          onCancel={() => {
            setClearBookmarksMode(false);
            setPopoverType(PopoverType.none);
          }}
          onConfirm={() => onClearBookmarksHandler()}
        />
      );
    }

    return null;
  };

  const renderClearBookmarksContent = () => {
    if (isDesktop) {
      return (
        <>
          <SliderInnerButton
            width={32}
            height={32}
            onInnerClick={() => onClearBookmarksHandler()}
          >
            <ConfirmIcon />
          </SliderInnerButton>
          <SliderInnerButton
            width={32}
            height={32}
            onInnerClick={() => setClearBookmarksMode(false)}
          >
            <CloseIcon />
          </SliderInnerButton>
        </>
      );
    }

    return (
      <SliderInnerButton onInnerClick={() => setClearBookmarksMode(false)}>
        <OptionsIcon $panel={Panels.Bookmarks} />
      </SliderInnerButton>
    );
  };

  console.log(layout);
  return (
    <>
      <Container id={id} $layout={layout}>
        {layout === Layout.Desktop && (
          <>
            <BookmarkPanelHeader $panel={Panels.Bookmarks}>
              <Title $left={16}>Bookmarks Panel</Title>
              <CloseButton
                id="bookmarks-panel-close-button"
                onClick={onClose}
              />
            </BookmarkPanelHeader>
            <PanelHorizontalLine $top={10} />
          </>
        )}

        <ItemsList $layout={layout}>
          <ButtonWrapper $layout={layout}>
            <SliderInnerButton
              disabled={disableAddButton || disableBookmarksAdding}
              blurButton={disableAddButton || disableBookmarksAdding}
              onInnerClick={onAddBookmark}
            >
              <PlusIcon fill={theme.colors.buttonIconColor} />
            </SliderInnerButton>
          </ButtonWrapper>

          {bookmarks.length > 0 ? (
            <Slider
              data={bookmarks}
              selectedItemId={selectedBookmarkId}
              sliderType={SliderType.Bookmarks}
              editingMode={editingMode}
              onDelete={onDeleteBookmark}
              onSelect={onSelectBookmark}
            />
          ) : (
            <Title>Bookmarks list is empty</Title>
          )}
          <ButtonWrapper $layout={layout}>
            <Popover
              isOpen={popoverType !== PopoverType.none}
              reposition={false}
              positions={["top", "bottom", "left", "right"]}
              content={renderPopoverContent() as JSX.Element}
              containerStyle={getOptionMenuPosition()}
              onClickOutside={() => setPopoverType(PopoverType.none)}
            >
              <ButtonsWrapper>
                {editingMode && (
                  <SliderInnerButton
                    onInnerClick={() => {
                      onEditBookmark(selectedBookmarkId);
                      setEditingMode(false);
                    }}
                  >
                    <ConfirmationIcon />
                  </SliderInnerButton>
                )}
                {!editingMode && (
                  <SliderInnerButton
                    hide={clearBookmarks}
                    onInnerClick={() => setPopoverType(PopoverType.options)}
                  >
                    <OptionsIcon $panel={Panels.Bookmarks} />
                  </SliderInnerButton>
                )}
                {clearBookmarks && renderClearBookmarksContent()}
              </ButtonsWrapper>
            </Popover>
          </ButtonWrapper>
        </ItemsList>
      </Container>
      <Overlay showOverlayCondition={showOverlayCondition} />
    </>
  );
};
