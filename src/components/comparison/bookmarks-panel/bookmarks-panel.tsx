import styled from "styled-components";
import { Theme } from "../../../utils/enums";
import { getCurrentLayoutProperty, useAppLayout } from "../../../utils/layout";
import {
  // Container,
  PanelHeader,
  HorizontalLine,
  Panels,
  Title,
  ItemContainer,
} from "../common";
import { CloseButton } from "../../close-button/close-button";
import { Slider } from "./slider";
import PlusIcon from "../../../../public/icons/plus.svg";
import ChevronIcon from "../../../../public/icons/chevron.svg";
import DUMMY_BOOKMARK from "../../../../public/icons/dummy-bookmark.png";
import {
  color_brand_quaternary,
  color_brand_tertiary,
  color_canvas_primary_inverted,
} from "../../../constants/colors";

type LayoutProps = {
  layout: string;
};

const Container = styled.div<LayoutProps>`
  width: 1112px;
  height: 177px;
  background: ${({ theme }) => theme.colors.mainCanvasColor};
  border-radius: 8px;
  position: relative;

  /* max-height: ${getCurrentLayoutProperty({
    desktop: "calc(100vh - 82px)",
    tablet: "382px",
    mobile: "calc(50vh - 110px)",
  })}; */
`;

const ItemsList = styled.div`
  display: flex;
  align-items: center;
  margin: 0 16px 0 16px;
`;

const ButtonContainer = styled.button<LayoutProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 144px;
  height: 81px;
  /* background: rgba(96, 93, 236, 0.4); */
  border-radius: 12px;
  cursor: pointer;
  margin: 0 16px 0 16px;

  &:hover {
    > * {
      &:first-child {
        // Keep rgba format to avoid issue with opacity inheritance and pseudo elements.
        background: rgba(96, 93, 236, 0.4);
      }
    }
  }
  /* padding-bottom: 26px;
  position: relative; */

  /* max-height: ${getCurrentLayoutProperty({
    desktop: "calc(100vh - 82px)",
    tablet: "382px",
    mobile: "calc(50vh - 110px)",
  })}; */
`;

const Button = styled.button<{ active?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  width: 144px;
  height: 81px;
  cursor: pointer;
  background-color: ${({ theme }) => color_brand_tertiary};
  /* background-position: center; */
  border: none;
  fill: ${({ theme, active }) =>
    active ? color_canvas_primary_inverted : theme.colors.buttonIconColor};

  &:hover {
    fill: ${({ theme, active }) =>
      active ? color_canvas_primary_inverted : theme.colors.buttonDimIconColor};
    background-color: rgba(96, 93, 236, 0.4);
  }
`;

const OptionsIcon = styled.div`
  position: relative;
  width: 4px;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.buttonIconColor};
  border-radius: 50%;
  margin-bottom: 12px;
  &:before,
  &:after {
    content: "";
    position: absolute;
    width: 4px;
    height: 4px;
    left: 0px;
    background-color: ${({ theme }) => theme.colors.buttonIconColor};
    border-radius: inherit;
  }
  &:before {
    top: 6px;
  }
  &:after {
    top: 12px;
  }
`;

type BookmarksPanelProps = {
  id: string;
  hasBookmarks: boolean;
  onClose: () => void;
};

const DUMMY_BOOKMARKS = [
  { id: 1, url: DUMMY_BOOKMARK },
  { id: 2, url: DUMMY_BOOKMARK },
  { id: 3, url: DUMMY_BOOKMARK },
  { id: 4, url: DUMMY_BOOKMARK },
  { id: 5, url: DUMMY_BOOKMARK },
  { id: 6, url: DUMMY_BOOKMARK },
  { id: 7, url: DUMMY_BOOKMARK },
];

export const BookmarksPanel = ({
  id,
  hasBookmarks,
  onClose,
}: BookmarksPanelProps) => {
  const layout = useAppLayout();

  return (
    <Container id={id} layout={layout}>
      <PanelHeader panel={Panels.ComparisonParams}>
        <Title left={16}>Bookmarks Panel</Title>
        <CloseButton
          id="comparison-parms-panel-close-button"
          onClick={onClose}
        />
      </PanelHeader>
      <HorizontalLine top={10} />
      <ItemsList>
        <Button>
          <PlusIcon />
        </Button>
        {hasBookmarks ? (
          <Slider bookmarks={DUMMY_BOOKMARKS}/>
        ) : (
          <Title>Bookmarks list is empty</Title>
        )}
        <Button>
          <OptionsIcon />
        </Button>
      </ItemsList>
    </Container>
  );
};
