import type { Tile3D } from "@loaders.gl/tiles";
import styled from "styled-components";
import { ToggleSwitch } from "..";
import { color_accent_primary } from "../../constants/colors";
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

const NoNormalsTitle = styled(Title)`
  color: ${color_accent_primary};
`;

const NormalsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px;
`;

type NormalsProps = {
  tile: Tile3D;
};

const NORMALS_ABSENCE_MESSAGE = "The tile has no normals";

export const Normals = ({ tile }: NormalsProps) => {
  const isTileHasNormals = Boolean(tile?.content?.attributes?.normals);

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
