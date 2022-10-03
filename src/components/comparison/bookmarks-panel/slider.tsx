import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ChevronIcon from "../../../../public/icons/chevron.svg";

type CompassProps = {
  url: string;
  minWidth: number;
  //   maxWidth: number;
  moveWidth: number;
};

const BookmarksList = styled.div`
 overflow: hidden;
  flex: 2;
`;

const Polosa = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  width: content;
  /* cursor: pointer;
  margin: 0 16px 0 16px;
  fill: ${({ theme }) => theme.colors.fontColor}; */
`;

// const BookmarksList = styled.div.attrs<CompassProps>(({ moveWidth }) => ({
//   style: {
//     transform: `translateX(${moveWidth}px)`,
//   },
// }))<CompassProps>`
//   overflow: hidden;
//   flex: 2;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   transition: 0.2s;
// `;

const BookmarkListItem = styled.div.attrs<CompassProps>(
  ({ url, minWidth, moveWidth }) => ({
    style: {
      transform: `translateX(${moveWidth}px)`,
      background: `url(${url}) no-repeat #232430`,
      minWidth: `${minWidth}px`,
      //   maxWidth: `${maxWidth}px`,
    },
  })
)<CompassProps>`
  background: url(${(url) => `${url}`}) no-repeat #232430;
  height: 81px;
  width: 144px;
  border-radius: 12px;
  transition: 0.2s;

  /* &:not(:last-child) {
    margin-right: 16px; */
  //}
`;

// const BookmarkListItem = styled.div<{ url: string; minWidth: number }>`
//   background: url(${(props) => props.url}) no-repeat #232430;
//   height: 81px;
//   /* min-width: 144px; */
//   min-width: ${(props) => `${props.minWidth}px`};
//   border-radius: 12px;
//   margin-right: 16px;
// `;

const ArrowIconLeft = styled.div`
  cursor: pointer;
  margin: 0 16px 0 16px;
  fill: ${({ theme }) => theme.colors.fontColor};
`;

const ArrowIconRight = styled(ArrowIconLeft)`
  transform: rotate(-180deg);
`;

type SliderProps = {
  bookmarks: any;
};

export const Slider = ({ bookmarks }: SliderProps) => {
  const containerRef = useRef<any>(null);
  const polosaRef = useRef<any>(null);
  const slidesToShow = 5;
  const [itemWidth, setItemWidth] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [position, setPosition] = useState<number>(0);

  useEffect(() => {
    // console.log(Math.floor(containerRef.current.offsetWidth / slidesToShow));

    console.log(containerRef.current.offsetWidth);
    console.log(polosaRef.current.offsetWidth);
    setContainerWidth(
      containerRef.current.offsetWidth - (16 * bookmarks.length - 1)
    );
    setItemWidth(containerRef.current.offsetWidth / slidesToShow);
  }, []);

  const handleLeftArrowClick = () => {
    setPosition((prev) => {
      const newPosition = prev + itemWidth;

      return Math.min(newPosition, 0);
    });
  };

  const handleRightArrowClick = () => {
    setPosition((prev) => {
      const newPosition = prev - itemWidth;

      //   const maxWidth = -(containerWidth * (bookmarks.length - 1));
      const maxWidth = -(itemWidth * (bookmarks.length - 1));

      console.log("new ", newPosition, "max width ", containerWidth);

      return Math.max(newPosition, -containerWidth);
    });
  };

  return (
    <>
      <ArrowIconLeft onClick={handleLeftArrowClick}>
        <ChevronIcon />
      </ArrowIconLeft>
      <BookmarksList ref={containerRef}>
        <Polosa ref={polosaRef}>
          {bookmarks.map((bookmark) => (
            <BookmarkListItem
              key={bookmark.id}
              url={bookmark.url}
              minWidth={itemWidth}
              // maxWidth={containerWidth}
              moveWidth={position}
            />
          ))}
        </Polosa>
      </BookmarksList>
      <ArrowIconRight onClick={handleRightArrowClick}>
        <ChevronIcon />
      </ArrowIconRight>
    </>
  );
};
