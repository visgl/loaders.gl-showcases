import styled, { useTheme } from "styled-components";
import { CloseButton } from "../close-button/close-button";
import { Title } from "../common";
import ArrowLeft from "../../../public/icons/arrow-left.svg";
import { color_brand_tertiary } from "../../constants/colors";
import ChevronIcon from "../../../public/icons/chevron.svg";
import { Tile3D } from "@loaders.gl/tiles";
import { TileMetadata } from "./tile-metadata";
import { Normals } from "./normals";
import { useEffect, useState } from "react";
import { ValidateTilePanel } from "./validate-tile-panel";
import { isTileGeometryInsideBoundingVolume } from "../../utils/debug/tile-debug";
import { getGeometryVsTextureMetrics } from "../../utils/debug/validation-utils/attributes-validation/geometry-vs-texture-metrics";
import { isGeometryBoundingVolumeMoreSuitable } from "../../utils/debug/validation-utils/tile-validation/bounding-volume-validation";
import { LayoutProps, ValidatedTile } from "../../types";
import {
  useAppLayout,
  getCurrentLayoutProperty,
} from "../../utils/hooks/layout";

enum ActiveTileInfoPanel {
  TileDetailsPanel,
  ValidateTilePanel,
}

const Container = styled.div<LayoutProps>`
  position: absolute;
  top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.colors.fontColor};
  background: ${({ theme }) => theme.colors.mainCanvasColor};
  width: 359px;
  z-index: 15;
  border-radius: 8px;

  max-height: ${getCurrentLayoutProperty({
    desktop: "75%",
    tablet: "50%",
    mobile: "50%",
  })};

  ${getCurrentLayoutProperty({
    desktop: "left: 10px",
    tablet: "right: 10px",
    mobile: "left: calc(50% - 180px)",
  })}
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: ${(props) => (props.title ? "space-between" : "flex-end")};
  align-items: center;
  width: 100%;
`;

const BackButton = styled(ArrowLeft)`
  margin-left: 16px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const ContentWrapper = styled.div`
  overflow-y: auto;
  width: 100%;
`;

const ValidateButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  cursor: pointer;
  margin: 16px;
  padding: 0 16px;
  background: ${({ theme }) => theme.colors.mainAttibuteItemColor};
  border-radius: 8px;
`;

const ValidatorTitle = styled(Title)`
  color: ${color_brand_tertiary};
`;

const ArrowContainer = styled.div`
  transform: rotate(-180deg);
  fill: ${color_brand_tertiary};
`;

type TileDetailsPanelProps = {
  tile: Tile3D;
  showNormals: boolean;
  trianglesPercentage: number;
  normalsLength: number;
  handleClosePanel: () => void;
  handleShowNormals: (tile: Tile3D) => void;
  handleChangeTrianglesPercentage: (tile: Tile3D, percentage: number) => void;
  handleChangeNormalsLength: (tile: Tile3D, length: number) => void;
  children?: React.ReactNode;
};

const VALIDATE_TILE = "Validate Tile";

export const TileDetailsPanel = ({
  tile,
  showNormals,
  trianglesPercentage,
  normalsLength,
  handleClosePanel,
  handleShowNormals,
  handleChangeTrianglesPercentage,
  handleChangeNormalsLength,
  children,
}: TileDetailsPanelProps) => {
  const [activeTileInfoPanel, setActiveTileInfoPanel] =
    useState<ActiveTileInfoPanel>(ActiveTileInfoPanel.TileDetailsPanel);
  const [validateTileWarnings, setValidateTileWarnings] = useState<
    ValidatedTile[]
  >([]);
  const [validateTileOk, setValidateTileOk] = useState<ValidatedTile[]>([]);

  const theme = useTheme();
  const layout = useAppLayout();

  const isDetailsPanel =
    activeTileInfoPanel === ActiveTileInfoPanel.TileDetailsPanel;
  const title = `Tile Info: ${tile.id}`;

  const onValidateTile = (tile: Tile3D) => {
    validateGeometryInsideBoundingVolume(tile);
    validateGeometryVsTexture(tile);
    compareGeometryBoundingVolumeVsTileBoundingVolume(tile);
  };

  useEffect(() => {
    setValidateTileOk([]);
    setValidateTileWarnings([]);
    setActiveTileInfoPanel(ActiveTileInfoPanel.TileDetailsPanel);
  }, [tile.id]);

  const validateGeometryInsideBoundingVolume = (tile: Tile3D) => {
    try {
      const result = isTileGeometryInsideBoundingVolume(tile);
      const titleWarning = "Geometry doesn't fit into BoundingVolume";
      const titleOk = "Geometry fits into BoundingVolume";
      if (result) {
        const geometryDataOk = {
          key: "geometryInsideBounding",
          title: titleOk,
        };
        setValidateTileOk((prev) => [...prev, geometryDataOk]);
      } else {
        const geometryDataWarning = {
          key: "geometryInsideBounding",
          title: titleWarning,
        };
        setValidateTileWarnings((prev) => [...prev, geometryDataWarning]);
      }
    } catch (error) {
      if (typeof error === "string") {
        const geometryError = {
          key: "geometryErrorInsideBounding",
          title: error,
        };
        setValidateTileWarnings((prev) => [...prev, geometryError]);
        return;
      }
      console.error(error);
    }
  };

  const validateGeometryVsTexture = (tile: Tile3D) => {
    const triangleMetrics = getGeometryVsTextureMetrics(tile);

    if (!triangleMetrics) {
      return;
    }

    const newTriangleWarnings: ValidatedTile[] = [];
    const newTriangleOk: ValidatedTile[] = [];

    newTriangleOk.push({
      key: "trianglesTotal",
      title: `Triangles total: ${triangleMetrics.triangles}`,
    });

    if (triangleMetrics.geometryNullTriangleCount) {
      newTriangleWarnings.push({
        key: "geometryNullTriangleCount",
        title: `Geometry degenerate triangles: ${triangleMetrics.geometryNullTriangleCount}`,
      });
    } else {
      newTriangleOk.push({
        key: "geometryNullTriangleCount",
        title: `Geometry degenerate triangles: ${triangleMetrics.geometryNullTriangleCount}`,
      });
    }

    if (triangleMetrics.geometrySmallTriangleCount) {
      newTriangleWarnings.push({
        key: "geometrySmallTriangleCount",
        title: `Geometry small triangles (less than 1 squared mm): ${triangleMetrics.geometrySmallTriangleCount}`,
      });
      newTriangleWarnings.push({
        key: "minGeometryArea",
        title: `Geometry smallest triangle: ${triangleMetrics.minGeometryArea} m^2`,
      });
    } else {
      newTriangleOk.push({
        key: "geometrySmallTriangleCount",
        title: `Geometry small triangles (less than 1 squared mm): ${triangleMetrics.geometrySmallTriangleCount}`,
      });
    }

    if (triangleMetrics.texCoordNullTriangleCount) {
      newTriangleWarnings.push({
        key: "texCoordNullTriangleCount",
        title: `UV0 degenerate triangles: ${triangleMetrics.texCoordNullTriangleCount}`,
      });
    } else {
      newTriangleOk.push({
        key: "texCoordNullTriangleCount",
        title: `UV0 degenerate triangles: ${triangleMetrics.texCoordNullTriangleCount}`,
      });
    }

    if (triangleMetrics.texCoordSmallTriangleCount) {
      newTriangleWarnings.push({
        key: "texCoordSmallTriangleCount",
        title: `UV0 small triangles (occupies less than 1 pixel): ${triangleMetrics.texCoordSmallTriangleCount}`,
      });
      newTriangleWarnings.push({
        key: "minTexCoordArea",
        title: `UV0 smallest triangle: ${triangleMetrics.minTexCoordArea}`,
      });
      newTriangleWarnings.push({
        key: "pixelArea",
        title: `UV0 pixel area: ${triangleMetrics.pixelArea}`,
      });
    } else {
      newTriangleOk.push({
        key: "texCoordSmallTriangleCount",
        title: `UV0 small triangles (less than 1 squared mm): ${triangleMetrics.texCoordSmallTriangleCount}`,
      });
    }

    if (newTriangleOk.length) {
      setValidateTileOk((prev) => [...prev, ...newTriangleOk]);
    }

    if (newTriangleWarnings.length) {
      setValidateTileWarnings((prev) => [...prev, ...newTriangleWarnings]);
    }
  };

  const compareGeometryBoundingVolumeVsTileBoundingVolume = (tile: Tile3D) => {
    try {
      const result = isGeometryBoundingVolumeMoreSuitable(tile);
      const titleOk = "Tile bounding volume is suitable for geometry";
      const titleWarning =
        "Geometry bounding volume is more suitable than tile bounding volume";

      if (result) {
        const geometryDataWarning = {
          key: "geometry",
          title: titleWarning,
        };
        setValidateTileWarnings((prev) => [...prev, geometryDataWarning]);
      } else {
        const geometryDataOk = {
          key: "geometry",
          title: titleOk,
        };
        setValidateTileOk((prev) => [...prev, geometryDataOk]);
      }
    } catch (error) {
      if (typeof error === "string") {
        const geometryError = {
          key: "geometryError",
          title: error,
        };
        setValidateTileWarnings((prev) => [...prev, geometryError]);
        return;
      }
      console.error(error);
    }
  };

  return (
    <Container layout={layout}>
      <HeaderWrapper title={title}>
        {!isDetailsPanel && (
          <BackButton
            data-testid="attributes-panel-back-button"
            fill={theme.colors.fontColor}
            onClick={() => {
              setValidateTileOk([]);
              setValidateTileWarnings([]);
              setActiveTileInfoPanel(ActiveTileInfoPanel.TileDetailsPanel);
            }}
          />
        )}
        {title && (
          <Title left={16} top={12} bottom={12}>
            {title}
          </Title>
        )}
        <CloseButton onClick={handleClosePanel} />
      </HeaderWrapper>
      <ContentWrapper>
        {isDetailsPanel && (
          <>
            <ValidateButton
              onClick={() => {
                onValidateTile(tile);
                setActiveTileInfoPanel(ActiveTileInfoPanel.ValidateTilePanel);
              }}
            >
              <ValidatorTitle>{VALIDATE_TILE}</ValidatorTitle>
              <ArrowContainer>
                <ChevronIcon />
              </ArrowContainer>
            </ValidateButton>
            <TileMetadata tile={tile} />
            {children}
            <Normals
              tile={tile}
              showNormals={Boolean(showNormals)}
              trianglesPercentage={trianglesPercentage}
              normalsLength={normalsLength}
              handleShowNormals={handleShowNormals}
              handleChangeTrianglesPercentage={handleChangeTrianglesPercentage}
              handleChangeNormalsLength={handleChangeNormalsLength}
            />
          </>
        )}
        {!isDetailsPanel && (
          <ValidateTilePanel
            validatedTileWarnings={validateTileWarnings}
            validatedTileOk={validateTileOk}
          />
        )}
      </ContentWrapper>
    </Container>
  );
};
