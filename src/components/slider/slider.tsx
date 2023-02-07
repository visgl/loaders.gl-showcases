import { useRef } from "react";
import styled, { css } from "styled-components";
import ChevronIcon from "../../../public/icons/chevron.svg";
import { SliderListItem } from "./slider-list-item";
import { Bookmark, LayoutProps, SliderType } from "../../types";
import {
  getCurrentLayoutProperty,
  useAppLayout,
} from "../../utils/hooks/layout";

const SliderItemsList = styled.div<
  LayoutProps & {
    sliderType: SliderType;
  }
>`
  display: flex;
  ${({ sliderType }) => {
    switch (sliderType) {
      case SliderType.Bookmarks:
        return css`
          align-items: center;
          flex: 2;
        `;
      case SliderType.Phase:
        return css`
          flex-direction: row;
          width: 152px;
        `;
      case SliderType.Floors:
        return css`
          flex-direction: column-reverse;
          height: 152px;
        `;
    }
  }};

  gap: ${({ sliderType }) =>
    sliderType === SliderType.Bookmarks
      ? getCurrentLayoutProperty({
          desktop: "16px",
          tablet: "8px",
          mobile: "4px",
        })
      : "10px"};

  overflow: ${getCurrentLayoutProperty({
    desktop: "hidden",
    tablet: "scroll",
    mobile: "scroll",
  })};
`;

const ArrowIconLeft = styled.button<
  LayoutProps & { disabled: boolean; isFloorSlider: boolean }
>`
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

  ${({ isFloorSlider }) =>
    isFloorSlider &&
    css`
      transform: rotate(-90deg);
    `}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.4;
    `}
`;

const ArrowIconRight = styled(ArrowIconLeft)<
  LayoutProps & { isFloorSlider: boolean }
>`
  transform: ${({ isFloorSlider }) =>
    isFloorSlider ? "rotate(90deg)" : "rotate(-180deg)"};
`;

type SliderProps = {
  data: Bookmark[] | any;
  sliderType: SliderType;
  editingMode?: boolean;
  selectedItemId: string;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
};

const BOOKMARKS_OFFSET = 150;
const OFFSET = 54;

export const Slider = ({
  data,
  editingMode,
  sliderType,
  selectedItemId,
  onSelect,
  onDelete,
}: SliderProps) => {
  const sliderItemsListRef = useRef<HTMLDivElement | null>(null);
  const listItems = useRef<HTMLDivElement[]>([]);

  const createRefsArray = (listItem: HTMLDivElement): void => {
    if (listItem && !listItems.current.includes(listItem)) {
      listItems.current.push(listItem);
    }
  };

  const disableLeftArrow = selectedItemId === data[0]?.id || !selectedItemId;
  const disableRightArrow =
    selectedItemId === data[data.length - 1]?.id || !selectedItemId;

  const isBookmarkSlider = sliderType === SliderType.Bookmarks;
  const isPhaseSlider = sliderType === SliderType.Phase;
  const isFloorsSlider = sliderType === SliderType.Floors;

  const layout = useAppLayout();

  const handleLeftArrowClick = () => {
    const currentSelectedIndex = data.findIndex(
      (item) => item.id === selectedItemId
    );
    const prevItemId = data[currentSelectedIndex - 1].id;
    onSelect(prevItemId);

    sliderItemsListRef?.current?.scrollBy({
      top: isFloorsSlider ? OFFSET : 0,
      left: isBookmarkSlider ? -BOOKMARKS_OFFSET : isPhaseSlider ? -OFFSET : 0,
      behavior: "smooth",
    });
  };

  const handleRightArrowClick = () => {
    const currentSelectedIndex = data.findIndex(
      (item) => item.id === selectedItemId
    );
    const nextItemId = data[currentSelectedIndex + 1].id;
    onSelect(nextItemId);

    sliderItemsListRef?.current?.scrollBy({
      top: isFloorsSlider ? -OFFSET : 0,
      left: isBookmarkSlider ? BOOKMARKS_OFFSET : isPhaseSlider ? OFFSET : 0,
      behavior: "smooth",
    });
  };

  const onSelectHandler = (id: string): void => {
    onSelect(id);
    const listItem = listItems.current?.find(
      (item: HTMLDivElement) => item.id === id
    );

    if (isBookmarkSlider || isPhaseSlider) {
      listItem?.scrollIntoView({ behavior: "smooth", inline: "center" });
    } else {
      listItem?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <>
      <ArrowIconLeft
        layout={layout}
        isFloorSlider={isFloorsSlider}
        disabled={disableLeftArrow}
        onClick={handleLeftArrowClick}
      >
        <ChevronIcon />
      </ArrowIconLeft>
      <SliderItemsList
        id={`slider-${sliderType}`}
        ref={sliderItemsListRef}
        sliderType={sliderType}
        layout={layout}
      >
        {data.map((item) => {
          const sliderItemSelected = item.id === selectedItemId;
          const editingSelected = editingMode && item.id === selectedItemId;
          return (
            <SliderListItem
              id={item.id}
              key={item.id}
              ref={createRefsArray}
              selected={sliderItemSelected}
              editingSelected={editingSelected}
              sliderItemText={item.phaseNumber || item.floorNumber}
              sliderType={sliderType}
              url={item.imageUrl}
              editingMode={editingMode}
              onSelect={() => onSelectHandler(item.id)}
              onDelete={() =>
                onDelete && onDelete(item.id)
              }
            />
          );
        })}
      </SliderItemsList>
      <ArrowIconRight
        isFloorSlider={isFloorsSlider}
        disabled={disableRightArrow}
        layout={layout}
        onClick={handleRightArrowClick}
      >
        <ChevronIcon />
      </ArrowIconRight>
    </>
  );
};
