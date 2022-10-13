import { useCallback, useState } from "react";
import styled, { css, useTheme } from "styled-components";
import { Layout } from "../../utils/enums";
import { getCurrentLayoutProperty, useAppLayout } from "../../utils/layout";
import {
  PanelHeader,
  HorizontalLine,
  Panels,
  Title,
  OptionsIcon,
} from "../comparison/common";
import { CloseButton } from "../close-button/close-button";
import { Slider } from "./slider";
import PlusIcon from "../../../public/icons/plus.svg";
import ConfirmationIcon from "../../../public/icons/confirmation.svg";
import CloseIcon from "../../../public/icons/close.svg";
import ConfirmIcon from "../../../public/icons/confirmation.svg";
import DUMMY_BOOKMARK from "../../../public/icons/dummy-bookmark.png";
import { BookmarkOptionsMenu } from "./bookmark-option-menu";
import { UploadPanel } from "./upload-panel";
import { UnsavedBookmarkWarning } from "./unsaved-bookmark-warning";
import { Popover } from "react-tiny-popover";
import { color_brand_tertiary } from "../../constants/colors";
import { BookmarkInnerButton } from "./bookmark-inner-button";

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
    desktop: "8px",
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

  gap: ${getCurrentLayoutProperty({
    desktop: "16px",
    tablet: "8px",
    mobile: "4px",
  })};

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
  onClose: () => void;
};

const DUMMY_BOOKMARKS = [
  { id: "1", url: DUMMY_BOOKMARK },
  { id: "2", url: DUMMY_BOOKMARK },
  { id: "3", url: DUMMY_BOOKMARK },
  { id: "4", url: DUMMY_BOOKMARK },
  { id: "5", url: DUMMY_BOOKMARK },
  { id: "6", url: DUMMY_BOOKMARK },
  { id: "7", url: DUMMY_BOOKMARK },
];

export const BookmarksPanel = ({ id, onClose }: BookmarksPanelProps) => {
  const [editingMode, setEditingMode] = useState<boolean>(false);
  const [clearBookmarks, setClearBookmarksMode] = useState<boolean>(false);
  const [popoverType, setPopoverType] = useState<number>(PopoverType.none);

  const layout = useAppLayout();
  const theme = useTheme();

  const showOverlayCondition =
    popoverType === PopoverType.upload ||
    popoverType === PopoverType.uploadWarning;
  const disableAddButton = editingMode || clearBookmarks;

  const getOptionMenuPosition = () => {
    return {
      zIndex: "4",
      top: layout === Layout.Desktop ? "80px" : "30px",
      left: layout === Layout.Desktop ? "100px" : "-110px",
    };
  };

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
          <ButtonWrapper layout={layout}>
            <BookmarkInnerButton
              disabled={disableAddButton}
              blurButton={disableAddButton}
              onInnerClick={() => console.log("not implemented yet")}
            >
              <PlusIcon fill={theme.colors.buttonIconColor} />
            </BookmarkInnerButton>
          </ButtonWrapper>

          {DUMMY_BOOKMARKS.length > 0 ? (
            <Slider bookmarks={DUMMY_BOOKMARKS} editingMode={editingMode} />
          ) : (
            <Title>Bookmarks list is empty</Title>
          )}
          <ButtonWrapper layout={layout}>
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
                  <BookmarkInnerButton
                    onInnerClick={() => setEditingMode(false)}
                  >
                    <ConfirmationIcon />
                  </BookmarkInnerButton>
                )}
                {!editingMode && (
                  <BookmarkInnerButton
                    hide={clearBookmarks}
                    onInnerClick={() => setPopoverType(PopoverType.options)}
                  >
                    <OptionsIcon panel={Panels.Bookmarks} />
                  </BookmarkInnerButton>
                )}
                {clearBookmarks && (
                  <>
                    <BookmarkInnerButton
                      width={32}
                      height={32}
                      onInnerClick={() => console.log("not implemented yet")}
                    >
                      <ConfirmIcon />
                    </BookmarkInnerButton>
                    <BookmarkInnerButton
                      width={32}
                      height={32}
                      onInnerClick={() => setClearBookmarksMode(false)}
                    >
                      <CloseIcon />
                    </BookmarkInnerButton>
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
