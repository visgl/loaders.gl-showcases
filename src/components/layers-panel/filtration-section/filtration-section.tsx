import { useState } from "react";
import styled, { css, useTheme } from "styled-components";
import { Slider } from "../../slider/slider";
import Floor from "../../../../public/images/floor-image-inactive.svg";
import FloorActive from "../../../../public/images/floor-image-active.svg";
import { type ComparisonSideMode, SliderType } from "../../../types";
import { useAppDispatch } from "../../../redux/hooks";
import { setFiltersByAttrubute } from "../../../redux/slices/symbolization-slice";
import { selectFieldValues } from "../../../redux/slices/i3s-stats-slice";
import { useSelector } from "react-redux";
import { type RootState } from "../../../redux/store";

const FiltrationContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SectionTitle = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.fontColor};
`;

const FiltrationSectionItem = styled.section<{ sliderType: number }>`
  display: flex;
  width: 219px;
  gap: 45px;
  ${({ sliderType }) =>
    sliderType === SliderType.Phase
      ? css`
          height: 44px;
          margin-top: 16px;
        `
      : css`
          height: 252px;
        `}
`;

const FloorsContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: center;
`;

const FloorsItem = styled.div<{ active?: boolean; zIndex?: number }>`
  width: 102px;
  height: 10px;
  z-index: ${({ zIndex }) => zIndex};
  ${({ active }) =>
    active &&
    css`
      margin: 5px 0;
    `};
`;

const FloorsImage = styled(FloorsItem)`
  &:after {
    content: "";
    display: block;
    width: 100px;
    height: 40px;
  }
`;

const SliderContainer = styled.div<{ sliderType: number }>`
  display: flex;
  flex-direction: ${({ sliderType }) =>
    sliderType === SliderType.Phase ? "row" : "column-reverse"};
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const phases = [
  { id: "phase1", phaseNumber: "1" },
  { id: "phase2", phaseNumber: "2" },
  { id: "phase3", phaseNumber: "3" },
  { id: "phase4", phaseNumber: "4" },
  { id: "phase5", phaseNumber: "5" },
];

export const FiltrationSection = ({ side }: { side?: ComparisonSideMode }) => {
  const [selectedFloorId, setSelectedFloorId] = useState<string>("");
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>("");
  const bldgLevels = useSelector((state: RootState) =>
    selectFieldValues(state, "BldgLevel", side)
  );
  const dispatch = useAppDispatch();

  const floors = bldgLevels
    ? bldgLevels.mostFrequentValues
      .slice()
      .sort((a, b) => a - b)
      .map((level, index) => ({
        id: `level${index}`,
        floorNumber: level,
      }))
    : [];

  const theme = useTheme();

  const onSelectFloorHandler = (floorId: string) => {
    if (floorId === selectedFloorId) {
      setSelectedFloorId("");
      dispatch(setFiltersByAttrubute({ filter: null, side }));
      return;
    }
    const floor = floors.find(({ id }) => id === floorId);
    if (!floor) {
      return;
    }
    dispatch(
      setFiltersByAttrubute({
        filter: {
          attributeName: "BldgLevel",
          value: floor.floorNumber,
        },
        side,
      })
    );
    setSelectedFloorId(floor.id);
  };

  const onSelectPhaseHandler = (phaseId: string) => {
    const phase = phases.find(({ id }) => id === phaseId);
    if (!phase) {
      return;
    }
    setSelectedPhaseId(phase.id);
  };

  return (
    <FiltrationContainer>
      <SectionTitle>NUM_FLOORS</SectionTitle>
      <FiltrationSectionItem sliderType={SliderType.Floors}>
        <SliderContainer sliderType={SliderType.Floors}>
          <Slider
            data={floors}
            selectedItemId={selectedFloorId}
            sliderType={SliderType.Floors}
            onSelect={onSelectFloorHandler}
          />
        </SliderContainer>

        <FloorsContainer>
          {floors.map((floor, index) => {
            const isFloorActive = floor.id === selectedFloorId;
            return (
              <FloorsItem
                key={`${floor.id}-image`}
                active={isFloorActive}
                zIndex={index}
              >
                <FloorsImage>
                  {isFloorActive
                    ? (
                    <FloorActive />
                      )
                    : (
                    <Floor
                      fill={theme.colors.mainAttributeHighlightColor}
                      stroke={theme.colors.filtrationImage}
                    />
                      )}
                </FloorsImage>
              </FloorsItem>
            );
          })}
        </FloorsContainer>
      </FiltrationSectionItem>
      <SectionTitle>CONSTR_PHASE</SectionTitle>
      <FiltrationSectionItem sliderType={SliderType.Phase}>
        <SliderContainer sliderType={SliderType.Phase}>
          <Slider
            data={phases}
            selectedItemId={selectedPhaseId}
            sliderType={SliderType.Phase}
            onSelect={onSelectPhaseHandler}
          />
        </SliderContainer>
      </FiltrationSectionItem>
    </FiltrationContainer>
  );
};
