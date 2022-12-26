import type { Tile3D } from "@loaders.gl/tiles";
import styled from "styled-components";
import { Checkbox, ToggleSwitch } from "..";
import {
  color_canvas_primary_inverted,
  color_accent_primary,
} from "../../constants/colors";
import { SelectionState } from "../../types";
import { Title, PanelHorizontalLine } from "../common";

const NoNormalsInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  margin: 16px;
  padding: 0 16px;
  background: ${({ theme }) => theme.colors.mainAttibuteItemColor};
  border-radius: 8px;
`;

const NormalsValidator = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  flex-flow: column nowrap;
`;

const NoNormalsTitle = styled(Title)`
  color: ${color_accent_primary};
`;

const NormalsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px;
`;

const GapInput = styled.input`
  max-width: 50px;
  margin: 0 10px;
  background: #1d2335;
  color: ${color_canvas_primary_inverted};
  font-weight: bold;
  text-align: center;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "auto" : "pointer")};
  border: none;
  padding: 5px;
`;

const NormalsControl = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin: 10px 0 10px 0;
  white-space: nowrap;
`;

const CheckboxTitle = styled.span`
  margin-left: 5px;
  cursor: pointer;
`;

type TileValidatorProps = {
  tile: Tile3D;
  handleShowNormals: (tile: Tile3D) => void;
  showNormals: boolean;
  trianglesPercentage: number;
  normalsLength: number;
  handleChangeTrianglesPercentage: (tile: Tile3D, percentage: number) => void;
  handleChangeNormalsLength: (tile: Tile3D, length: number) => void;
};

const NORMALS_ABSENCE_MESSAGE = "The tile has no normals";

/**
 * TODO: Add types to component
 */
export const Normals = ({
  tile,
  showNormals,
  trianglesPercentage,
  normalsLength,
  handleShowNormals,
  handleChangeTrianglesPercentage,
  handleChangeNormalsLength,
}: TileValidatorProps) => {
  const isTileHasNormals =
    tile &&
    tile.content &&
    tile.content.attributes &&
    tile.content.attributes.normals;

  // This logic will be needed for further tasks
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderNormalsValidationControl = () => {
    return (
      <NormalsValidator>
        {!isTileHasNormals && (
          <NoNormalsInfo>{"Tile has no normals"}</NoNormalsInfo>
        )}
        <NormalsControl>
          <label
            style={getCheckboxStyle(isTileHasNormals)}
            htmlFor="normals-checkbox"
          >
            <Checkbox
              id="normals-checkbox"
              checked={
                showNormals
                  ? SelectionState.selected
                  : SelectionState.unselected
              }
              onChange={() => handleShowNormals(tile)}
            ></Checkbox>
            <CheckboxTitle>Show Normals</CheckboxTitle>
          </label>
        </NormalsControl>
        <NormalsControl>
          <span>Percent</span>
          <GapInput
            type="number"
            min="1"
            max="100"
            value={trianglesPercentage}
            disabled={!isTileHasNormals}
            onChange={(event) =>
              handleChangeTrianglesPercentage(tile, Number(event.target.value))
            }
          />
          <span>% triangles with normals</span>
        </NormalsControl>
        <NormalsControl>
          <span>Normals length</span>
          <GapInput
            type="number"
            min="1"
            value={normalsLength}
            disabled={!isTileHasNormals}
            onChange={(event) =>
              handleChangeNormalsLength(tile, Number(event.target.value))
            }
          />
          <span>m</span>
        </NormalsControl>
      </NormalsValidator>
    );
  };

  const getCheckboxStyle = (isTileHasNormals) => {
    return {
      cursor: isTileHasNormals ? "pointer" : "auto",
    };
  };

  return (
    <>
      {!isTileHasNormals && (
        <NoNormalsInfo>
          <NoNormalsTitle>{NORMALS_ABSENCE_MESSAGE}</NoNormalsTitle>
        </NoNormalsInfo>
      )}
      {isTileHasNormals && (
        <>
          <PanelHorizontalLine />
          <NormalsContainer>
            <Title id={"toggle-show-normals-title"}>Show normals</Title>
            <ToggleSwitch
              id={"toggle-show-normals"}
              checked={false}
              onChange={() => console.log("not implemented yet")}
            />
          </NormalsContainer>
        </>
      )}
    </>
  );
};
