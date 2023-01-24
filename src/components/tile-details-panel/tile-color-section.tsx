import styled, { css } from "styled-components";
import { Title, TileInfoSectionWrapper } from "../common";
import { ExpandIcon } from "../expand-icon/expand-icon";
import { useExpand } from "../../utils/hooks/use-expand";
import { CollapseDirection, ExpandState, TileSelectedColor } from "../../types";
import { HuePicker, MaterialPicker, ColorResult } from "react-color";

const SelectedColorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  width: 88px;
  height: 44px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.mainAttibuteItemColor};
  margin-right: 16px;
`;

type SelectedColorProp = {
  tileSelectedColor: TileSelectedColor;
};

const SelectedColor = styled.div.attrs<SelectedColorProp>(
  ({ tileSelectedColor }) => ({
    style: {
      background: `rgb(${tileSelectedColor.r}, ${tileSelectedColor.g}, ${tileSelectedColor.b})`,
    },
  })
)<SelectedColorProp>`
  width: 24px;
  height: 24px;
  border-radius: 2px;
`;

const TileColorSelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 16px;
  cursor: pointer;
`;

const ResetColorButton = styled.button<{ disabled: boolean }>`
  border: none;
  display: flex;
  border-radius: 8px;
  align-self: center;
  justify-self: center;
  justify-content: center;
  align-items: center;
  height: 27px;
  margin-top: 10px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  background: ${({ theme }) => theme.colors.mainAttibuteItemColor};
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.4;
    `}
`;

const ResetColorTitle = styled(Title)`
  font-weight: 400;
`;

type TileColorSectionProps = {
  tileId: string;
  tileSelectedColor: TileSelectedColor;
  isResetButtonDisabled: boolean;
  handleResetColor: (tileId: string) => void;
  handleSelectTileColor: (tileId: string, color: ColorResult) => void;
};

const MATERIAL_PICKER_STYLE = {
  default: {
    material: {
      height: "auto",
      width: "auto",
    },
  },
};

export const TileColorSection = ({
  tileId,
  tileSelectedColor,
  isResetButtonDisabled,
  handleResetColor,
  handleSelectTileColor,
}: TileColorSectionProps) => {
  const [expandState, expand] = useExpand(ExpandState.expanded);

  return (
    <>
      <TileInfoSectionWrapper>
        <Title left={16}>Tile color:</Title>
        <SelectedColorContainer>
          <SelectedColor tileSelectedColor={tileSelectedColor} />
          <ExpandIcon
            expandState={expandState}
            collapseDirection={CollapseDirection.bottom}
            onClick={expand}
          />
        </SelectedColorContainer>
      </TileInfoSectionWrapper>
      {expandState === ExpandState.collapsed && (
        <TileColorSelectorWrapper>
          <HuePicker
            width={"auto"}
            color={tileSelectedColor}
            onChange={(color) => handleSelectTileColor(tileId, color)}
          />
          <MaterialPicker
            styles={MATERIAL_PICKER_STYLE}
            color={tileSelectedColor}
            onChange={(color) => handleSelectTileColor(tileId, color)}
          />
          <ResetColorButton
            disabled={isResetButtonDisabled}
            onClick={() => handleResetColor(tileId)}
          >
            <ResetColorTitle>Reset</ResetColorTitle>
          </ResetColorButton>
        </TileColorSelectorWrapper>
      )}
    </>
  );
};
