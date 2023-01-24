import styled from "styled-components";
import { ToggleSwitch } from "../toogle-switch/toggle-switch";
import { color_accent_primary } from "../../constants/colors";
import { Title, PanelHorizontalLine } from "../common";
import { useState } from "react";
import { Tile3D } from "@loaders.gl/tiles";
import { NormalsInputItem } from "./normals-input-item";

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

const NoNormalsTitle = styled(Title)`
  color: ${color_accent_primary};
`;

const NormalsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px;
`;

const NORMALS_ABSENCE_MESSAGE = "The tile has no normals";
const NORMALS_PERCENTAGE_TITLE = "Percent of triangles with normals, %";
const NORMALS_LENGTH_TITLE = "Normals length, m";

type NormalsProps = {
  tile: Tile3D;
  trianglesPercentage: number;
  normalsLength: number;
  onShowNormals: (tile: Tile3D) => void;
  onChangeTrianglesPercentage: (tile: Tile3D, percentage: number) => void;
  onChangeNormalsLength: (tile: Tile3D, length: number) => void;
};

export const Normals = ({
  tile,
  normalsLength,
  trianglesPercentage,
  onShowNormals,
  onChangeTrianglesPercentage,
  onChangeNormalsLength,
}: NormalsProps) => {
  const [showNormalsInput, setShowNormalsInput] = useState<boolean>(false);

  const isTileHasNormals = Boolean(tile?.content?.attributes?.normals);

  const handleNormalPercentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChangeTrianglesPercentage(tile, Number(event.target.value));
  };

  const handleNormalsLengthChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChangeNormalsLength(tile, Number(event.target.value));
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
              checked={showNormalsInput}
              onChange={() => {
                onShowNormals(tile);
                setShowNormalsInput((prev) => !prev);
              }}
            />
          </NormalsContainer>
          {showNormalsInput && (
            <>
              <NormalsInputItem
                id={"normals-percent"}
                title={NORMALS_PERCENTAGE_TITLE}
                value={trianglesPercentage}
                maxValue={"100"}
                onChange={handleNormalPercentChange}
              />
              <NormalsInputItem
                id={"normals-length"}
                title={NORMALS_LENGTH_TITLE}
                value={normalsLength}
                onChange={handleNormalsLengthChange}
              />
            </>
          )}
        </>
      )}
    </>
  );
};
