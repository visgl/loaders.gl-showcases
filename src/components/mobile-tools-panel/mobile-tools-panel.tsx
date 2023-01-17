import { ActiveButton, Layout } from "../../types";

import styled, { useTheme } from "styled-components";
import {
  color_brand_tertiary,
  color_canvas_primary_inverted,
  dim_brand_tertinary,
} from "../../constants/colors";
import MapIcon from "../../../public/icons/select-map.svg";
import MemoryIcon from "../../../public/icons/memory.svg";
import DebugIcon from "../../../public/icons/debug.svg";
import ValidatorIcon from "../../../public/icons/validator.svg";
import BookmarksIcon from "../../../public/icons/bookmarks.svg";
import { useAppLayout } from "../../utils/hooks/layout";

type ContainerProps = {
  id: string;
};

const Container = styled.div<ContainerProps>`
  width: 100%;
  display: flex;
  justify-content: center;
  background: transparent;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  max-width: 95%;
  overflow-x: auto;
  background: ${(props) => props.theme.colors.mainCanvasColor};
  border-radius: 12px;
  padding: 2px;
  z-index: 1;
`;

type ButtonProps = {
  active: boolean;
  layout: Layout;
};

const Button = styled.button<ButtonProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  height: 56px;
  cursor: pointer;
  fill: ${({ theme, active }) =>
    active
      ? color_canvas_primary_inverted
      : theme.colors.mainToolsPanelIconColor};
  background-color: ${({ active }) =>
    active ? color_brand_tertiary : "transparent"};
  outline: 0;
  border: none;

  &:hover {
    fill: ${({ theme, active }) =>
    active
      ? color_canvas_primary_inverted
      : theme.colors.mainToolsPanelDimIconColor};
    background-color: ${({ active }) =>
    active ? dim_brand_tertinary : "transparent"};
  }
`;

const Text = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.fontColor}
`;

type MainToolsPanelProps = {
  id: string;
  activeButton: ActiveButton;
  showDebug?: boolean;
  showBookmarks?: boolean;
  bookmarksActive?: boolean;
  showValidator?: boolean;
  onChange?: (active: ActiveButton) => void;
  onShowBookmarksChange?: () => void;
};

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 24px;
`;

export const MobileToolsPanel = ({
  id,
  activeButton,
  showDebug = false,
  showValidator = false,
  showBookmarks = false,
  bookmarksActive = false,
  onChange = () => ({}),
  onShowBookmarksChange
}: MainToolsPanelProps) => {
  const layout = useAppLayout();
  const theme = useTheme();

  return (
    <Container id={id}>
      <ContentWrapper>
        <Button
          id={'layers-options-tab'}
          layout={layout}
          active={activeButton === ActiveButton.options}
          onClick={() => onChange(ActiveButton.options)}
        >
          <IconWrapper>
            <MapIcon fill={theme.colors.fontColor} />
          </IconWrapper>
          <Text>Map</Text>
        </Button>
        <Button
          id={'mobile-memory-usage-tab'}
          layout={layout}
          active={activeButton === ActiveButton.memory}
          onClick={() => onChange(ActiveButton.memory)}
        >
          <IconWrapper>
            <MemoryIcon fill={theme.colors.fontColor} />
          </IconWrapper>
          <Text>Memory</Text>
        </Button>
        {showValidator && (
          <Button
            id={'mobile-validator-tab'}
            layout={layout}
            active={activeButton === ActiveButton.validator}
            onClick={() => onChange(ActiveButton.validator)}
          >
            <IconWrapper>
              <ValidatorIcon fill={theme.colors.fontColor} />
            </IconWrapper>
            <Text>Validator</Text>
          </Button>
        )}
        {showDebug && (
          <Button
            id={'mobile-debug-panel-tab'}
            layout={layout}
            active={activeButton === ActiveButton.debug}
            onClick={() => onChange(ActiveButton.debug)}
          >
            <IconWrapper>
              <DebugIcon fill={theme.colors.fontColor} />
            </IconWrapper>
            <Text>Debug</Text>
          </Button>
        )}
        {showBookmarks && (
          <Button
            id={'mobile-bookmarks-tab'}
            layout={layout}
            active={bookmarksActive}
            onClick={onShowBookmarksChange}
          >
            <IconWrapper>
              <BookmarksIcon fill={theme.colors.fontColor} />
            </IconWrapper>
            <Text>Bookmarks</Text>
          </Button>
        )}
      </ContentWrapper>
    </Container>
  );
};
