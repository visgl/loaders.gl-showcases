import { useCallback, useState } from "react";
import styled, { css, useTheme } from "styled-components";
import { Layout } from "../../../utils/enums";
import { getCurrentLayoutProperty, useAppLayout } from "../../../utils/layout";
import {
  PanelHeader,
  HorizontalLine,
  Panels,
  Title,
  InnerButton,
  OptionsIcon,
} from "../common";
import { CloseButton } from "../../close-button/close-button";
import { Slider } from "./slider";
import PlusIcon from "../../../../public/icons/plus.svg";
import ConfirmationIcon from "../../../../public/icons/confirmation.svg";
import CloseIcon from "../../../../public/icons/close.svg";
import ConfirmIcon from "../../../../public/icons/confirmation.svg";
import DUMMY_BOOKMARK from "../../../../public/icons/dummy-bookmark.png";
import { BookmarkOptionsMenu } from "./bookmark-option-menu";
import { UploadPanel } from "./upload-panel";
import { UnsavedBookmarkWarning } from "./unsaved-bookmark-warning";
import { Popover } from "react-tiny-popover";

export enum ActivePanel {
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
  border-radius: 12px;
  width: 144px;
  height: 81px;
  cursor: pointer;
  background-color: rgba(96, 93, 236, 0.4);
  gap: 10px;
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
  const [activePanel, setActivePanel] = useState<number>(ActivePanel.none);

  const layout = useAppLayout();
  const theme = useTheme();

  console.log(layout);

  const showOverlayCondition =
    activePanel === ActivePanel.upload ||
    activePanel === ActivePanel.uploadWarning;
  const disableAddButton = editingMode || clearBookmarks;

  const onEditBookmark = useCallback(() => {
    setEditingMode((prev) => !prev);
    setActivePanel(ActivePanel.none);
  }, []);

  const onClearBookmarks = useCallback(() => {
    setClearBookmarksMode((prev) => !prev);
    setActivePanel(ActivePanel.none);
  }, []);

  const renderPoppverContent = () => {
    if (activePanel === ActivePanel.uploadWarning) {
      return (
        <UnsavedBookmarkWarning
          onCancel={() => setActivePanel(ActivePanel.none)}
          onConfirmWarning={() => setActivePanel(ActivePanel.upload)}
        />
      );
    }

    if (activePanel === ActivePanel.upload) {
      return (
        <UploadPanel
          onCancel={() => setActivePanel(ActivePanel.none)}
          onConfirmWarning={() => console.log("not implemented yet")}
        />
      );
    }

    if (activePanel === ActivePanel.options) {
      return (
        <BookmarkOptionsMenu
          onEditBookmark={onEditBookmark}
          onClearBookmarks={onClearBookmarks}
          onUploadBookmarks={() => setActivePanel(ActivePanel.uploadWarning)}
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
        onClick={() => console.log("not implemented yet")}
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

          {DUMMY_BOOKMARKS.length > 0 ? (
            <Slider bookmarks={DUMMY_BOOKMARKS} editingMode={editingMode} />
          ) : (
            <Title>Bookmarks list is empty</Title>
          )}
          <ButtonWrapper layout={layout}>
            <Popover
              isOpen={activePanel !== ActivePanel.none}
              reposition={false}
              positions={["top", "bottom", "left", "right"]}
              content={renderPoppverContent() as JSX.Element}
              containerStyle={{ zIndex: "4", top: "80px", left: "100px" }}
              onClickOutside={() => setActivePanel(ActivePanel.none)}
            >
              <ButtonsWrapper>
                {editingMode ? (
                  <InnerButton
                    width={44}
                    height={44}
                    onClick={() => setEditingMode(false)}
                  >
                    <ConfirmationIcon />
                  </InnerButton>
                ) : (
                  <InnerButton
                    width={44}
                    height={44}
                    hide={clearBookmarks}
                    onClick={() => setActivePanel(ActivePanel.options)}
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
