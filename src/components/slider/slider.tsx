import { useRef, useEffect } from "react";
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

  const handleLeftArrowClick = () => {
    const currentSelectedIndex = data.findIndex(
      (item) => item.id === selectedItemId
    );
    const prevItemId = data[currentSelectedIndex - 1]?.id;
    onSelectHandler(prevItemId);
  };

  const handleRightArrowClick = () => {
    const currentSelectedIndex = data.findIndex(
      (item) => item.id === selectedItemId
    );
    const nextItemId = data[currentSelectedIndex + 1]?.id;
    onSelectHandler(nextItemId);
  };

  const onSelectHandler = (id: string): void => {
    if (id) {
      scrollItemIntoView(id);
      onSelect(id);
    }
  };

  const isItemVisible = (item: HTMLDivElement | undefined): boolean => {
    const listElement = sliderItemsListRef?.current;
    if (!item || !listElement) {
      return false;
    }
    const listLeft = listElement.offsetLeft;
    const listTop = listElement.offsetTop;
    const listRight = listLeft + listElement.offsetWidth;
    const listBottom = listTop + listElement.offsetHeight;

    const itemLeft = item.offsetLeft - listElement.scrollLeft;
    const itemTop = item.offsetTop - listElement.scrollTop;
    const itemRight = itemLeft + item.offsetWidth;
    const itemBottom = itemTop + item.offsetHeight;

    const isVisible =
      itemLeft >= listLeft &&
      itemRight <= listRight &&
      itemTop >= listTop &&
      itemBottom <= listBottom;
    return isVisible;
  };

  const scrollItemIntoView = (id: string): void => {
    if (!id) {
      return;
    }
    const listItem = listItems.current?.find(
      (item: HTMLDivElement) => item.id === id
    );

    const isVisible = isItemVisible(listItem);
    if (!isVisible) {
      if (isBookmarkSlider || isPhaseSlider) {
        listItem?.scrollIntoView({ behavior: "smooth", inline: "nearest" });
      } else {
        listItem?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  };

  useEffect(() => {
    scrollItemIntoView(selectedItemId);
  }, [selectedItemId]);

  const disableLeftArrow = selectedItemId === data[0]?.id || !selectedItemId;
  const disableRightArrow =
    selectedItemId === data[data.length - 1]?.id || !selectedItemId;

  const isBookmarkSlider = sliderType === SliderType.Bookmarks;
  const isPhaseSlider = sliderType === SliderType.Phase;
  const isFloorsSlider = sliderType === SliderType.Floors;

  const layout = useAppLayout();

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
              sliderItemText={item.phaseNumber || item.floorNumber?.toString()}
              sliderType={sliderType}
              url={item.imageUrl}
              editingMode={editingMode}
              onSelect={() => onSelectHandler(item.id)}
              onDelete={() => onDelete && onDelete(item.id)}
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
