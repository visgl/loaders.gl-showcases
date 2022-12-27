import type { StatisticsInfo } from "@loaders.gl/i3s";
import type { ColorsByAttribute, FeatureAttributes } from "../../types";

import { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";

import { CloseButton } from "../close-button/close-button";

import { color_brand_tertiary } from "../../constants/colors";

import StatisticsIcon from "../../../public/icons/statistics.svg";
import ArrowLeft from "../../../public/icons/arrow-left.svg";
import { isGeometryBoundingVolumeMoreSuitable } from "../../utils/debug/validation-utils/tile-validation/bounding-volume-validation";
import { Tile3D } from "@loaders.gl/tiles";
import { isTileGeometryInsideBoundingVolume } from "../../utils/debug/tile-debug";
import { getGeometryVsTextureMetrics } from "../../utils/debug/validation-utils/attributes-validation/geometry-vs-texture-metrics";

type RowProps = {
  selectable: boolean;
};

const Title = styled.div`
  color: ${({ theme }) => theme.colors.fontColor};
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  margin: 20px 0px 21px 16px;
`;

const ContentWrapper = styled.div`
  overflow-y: auto;
  padding: 0 16px;
  margin-bottom: 20px;
  width: calc(100% - 32px);
`;

const Row = styled.div<RowProps>`
  display: grid;
  grid-template-columns: 1fr 1fr 24px;
  align-items: center;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.mainAttibuteItemColor};
  padding: 10px 13px;
  margin-bottom: 4px;
  cursor: ${({ selectable }) => (selectable ? "pointer" : "auto")};

  svg {
    fill: ${({ theme }) => theme.colors.mainToolsPanelIconColor};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.mainAttributeHighlightColor};
  }

  &:hover svg {
    fill: ${color_brand_tertiary};
    opacity: 1;
  }
`;

const RowItem = styled.div`
  display: flex;
  max-width: 80%;
  align-items: center;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.fontColor};

  :nth-child(1) {
    font-weight: 500;
  }

  :nth-child(2n) {
    opacity: 0.8;
  }
`;

const SplitLine = styled.div`
  margin: 0px 15px 16px 15px;
  width: calc(100% - 30px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.mainHiglightColor};
`;

const BackButton = styled(ArrowLeft)`
  margin-left: 16px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
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

type AttributesPanelProps = {
  tile: Tile3D;
};

export const ValidateTilePanel = ({ tile }: AttributesPanelProps) => {
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
    onValidateTile(tile);
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
      <ContentWrapper>
        {renderGeometryMetrics()}
        {renderBoundingVolumesMetrics()}
        {renderTriangleMetrics()}
      </ContentWrapper>
    </>
  );
};
