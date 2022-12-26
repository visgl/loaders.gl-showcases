import type { Tile3D } from "@loaders.gl/tiles";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { color_brand_tertiary } from "../../constants/colors";
import { isTileGeometryInsideBoundingVolume } from "../../utils/debug/tile-debug";
import { getGeometryVsTextureMetrics } from "../../utils/debug/validation-utils/attributes-validation/geometry-vs-texture-metrics";
import { isGeometryBoundingVolumeMoreSuitable } from "../../utils/debug/validation-utils/tile-validation/bounding-volume-validation";
import { Title } from "../common";
import ChevronIcon from "../../../public/icons/chevron.svg";

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

const ValidatorInfoList = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const VALIDATE_TILE = "Validate Tile";
const WARNING_TYPE = "warning";
const OK_TYPE = "ok";

type IGeometryInfo = {
  type: string;
  title: string;
};

type ITriangleMessage = {
  key: string;
  type?: string;
  text: string;
};

type TileValidatorProps = {
  tile: Tile3D;
};

/**
 * TODO: Add types to component
 */
export const TileValidator = ({ tile }: TileValidatorProps) => {
  const [geometryInfo, setGeometryInfo] = useState<IGeometryInfo | null>(null);
  const [triangleMessages, setTriangleMessages] = useState<
    ITriangleMessage[] | null
  >(null);
  const [boundingVolumeInfo, setBoundingVolumeInfo] =
    useState<IGeometryInfo | null>(null);

  const onValidateTile = (tile: Tile3D) => {
    validateGeometryInsideBoundingVolume(tile);
    validateGeometryVsTexture(tile);
    compareGeometryBoundingVolumeVsTileBoundingVolume(tile);
  };

  useEffect(() => {
    setGeometryInfo(null);
    setTriangleMessages(null);
    setBoundingVolumeInfo(null);
  }, [tile.id]);

  const validateGeometryInsideBoundingVolume = (tile: Tile3D) => {
    try {
      const result = isTileGeometryInsideBoundingVolume(tile);

      if (!result) {
        const geometryError = `Geometry doesn't fit into BoundingVolume`;
        setGeometryInfo({ type: WARNING_TYPE, title: geometryError });
      } else {
        const title = `Geometry fits into BoundingVolume`;
        setGeometryInfo({ type: OK_TYPE, title });
      }
    } catch (error) {
      if (typeof error === "string") {
        setGeometryInfo({ type: WARNING_TYPE, title: error });
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
    const newTriangleMessages: ITriangleMessage[] = [];

    newTriangleMessages.push({
      key: "trianglesTotal",
      text: `Triangles total: ${triangleMetrics.triangles}`,
    });

    if (triangleMetrics.geometryNullTriangleCount) {
      newTriangleMessages.push({
        key: "geometryNullTriangleCount",
        type: WARNING_TYPE,
        text: `Geometry degenerate triangles: ${triangleMetrics.geometryNullTriangleCount}`,
      });
    } else {
      newTriangleMessages.push({
        key: "geometryNullTriangleCount",
        type: OK_TYPE,
        text: `Geometry degenerate triangles: ${triangleMetrics.geometryNullTriangleCount}`,
      });
    }

    if (triangleMetrics.geometrySmallTriangleCount) {
      newTriangleMessages.push({
        key: "geometrySmallTriangleCount",
        type: WARNING_TYPE,
        text: `Geometry small triangles (less than 1 squared mm): ${triangleMetrics.geometrySmallTriangleCount}`,
      });
      newTriangleMessages.push({
        key: "minGeometryArea",
        type: WARNING_TYPE,
        text: `Geometry smallest triangle: ${triangleMetrics.minGeometryArea} m^2`,
      });
    } else {
      newTriangleMessages.push({
        key: "geometrySmallTriangleCount",
        type: OK_TYPE,
        text: `Geometry small triangles (less than 1 squared mm): ${triangleMetrics.geometrySmallTriangleCount}`,
      });
    }

    if (triangleMetrics.texCoordNullTriangleCount) {
      newTriangleMessages.push({
        key: "texCoordNullTriangleCount",
        type: WARNING_TYPE,
        text: `UV0 degenerate triangles: ${triangleMetrics.texCoordNullTriangleCount}`,
      });
    } else {
      newTriangleMessages.push({
        key: "texCoordNullTriangleCount",
        type: OK_TYPE,
        text: `UV0 degenerate triangles: ${triangleMetrics.texCoordNullTriangleCount}`,
      });
    }

    if (triangleMetrics.texCoordSmallTriangleCount) {
      newTriangleMessages.push({
        key: "texCoordSmallTriangleCount",
        type: WARNING_TYPE,
        text: `UV0 small triangles (occupies less than 1 pixel): ${triangleMetrics.texCoordSmallTriangleCount}`,
      });
      newTriangleMessages.push({
        key: "minTexCoordArea",
        type: WARNING_TYPE,
        text: `UV0 smallest triangle: ${triangleMetrics.minTexCoordArea}`,
      });
      newTriangleMessages.push({
        key: "pixelArea",
        type: WARNING_TYPE,
        text: `UV0 pixel area: ${triangleMetrics.pixelArea}`,
      });
    } else {
      newTriangleMessages.push({
        key: "texCoordSmallTriangleCount",
        type: OK_TYPE,
        text: `UV0 small triangles (less than 1 squared mm): ${triangleMetrics.texCoordSmallTriangleCount}`,
      });
    }

    setTriangleMessages(newTriangleMessages);
  };

  const compareGeometryBoundingVolumeVsTileBoundingVolume = (tile: Tile3D) => {
    try {
      const result = isGeometryBoundingVolumeMoreSuitable(tile);

      if (!result) {
        const title = "Tile bounding volume is suitable for geometry";
        setBoundingVolumeInfo({ type: OK_TYPE, title });
      } else {
        const geometryError =
          "Geometry bounding volume is more suitable than tile bounding volume";
        setBoundingVolumeInfo({ type: WARNING_TYPE, title: geometryError });
      }
    } catch (error) {
      if (typeof error === "string") {
        setBoundingVolumeInfo({ type: WARNING_TYPE, title: error });
        return;
      }
      console.error(error);
    }
  };

  const getInfoStyle = (type) => {
    return {
      color: type === WARNING_TYPE ? "#FF0047" : "#01DC69",
      marginTop: "5px",
    };
  };

  const renderTriangleMetrics = () => {
    if (!triangleMessages) {
      return null;
    }
    return triangleMessages.map((message) => (
      <span key={message.key} style={getInfoStyle(message.type)}>
        {message.text}
      </span>
    ));
  };

  const renderBoundingVolumesMetrics = () => {
    if (!boundingVolumeInfo) {
      return null;
    }
    return (
      <span style={getInfoStyle(boundingVolumeInfo.type)}>
        {boundingVolumeInfo.title}
      </span>
    );
  };

  const renderGeometryMetrics = () => {
    if (!geometryInfo) {
      return null;
    }
    return (
      <span style={getInfoStyle(geometryInfo.type)}>{geometryInfo.title}</span>
    );
  };

  return (
    <>
      <ValidateButton onClick={() => onValidateTile(tile)}>
        <ValidatorTitle>{VALIDATE_TILE}</ValidatorTitle>
        <ArrowContainer>
          <ChevronIcon />
        </ArrowContainer>
      </ValidateButton>
      <ValidatorInfoList>
        {renderGeometryMetrics()}
        {renderBoundingVolumesMetrics()}
        {renderTriangleMetrics()}
      </ValidatorInfoList>
    </>
  );
};
