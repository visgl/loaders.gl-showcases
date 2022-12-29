import React from "react";
import styled from "styled-components";
import { Tile3D } from "@loaders.gl/tiles";
import { getChildrenInfo } from "../../utils/debug/tile-debug";
import {
  formatFloatNumber,
  formatIntValue,
  formatStringValue,
} from "../../utils/format/format-utils";
import { getBoundingType } from "../../utils/debug/bounding-volume";
import { PanelHorizontalLine, Title } from "../common";

const REFINEMENT_TYPES = {
  1: "Add",
  2: "Replace",
};

const TileInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin: 0 18px;
`;

const TileInfoTitle = styled(Title)`
  flex: 1;
`;

const TileInfoValue = styled(Title)`
  flex: 1;
  color: ${({ theme }) => theme.colors.mainDimColorInverted};
  font-weight: 400;
  word-break: break-all;
  white-space: pre-wrap;
`;

const TileInfoDevider = styled(PanelHorizontalLine)`
  margin: 11px 16px;
`;

const NO_DATA = "No Data";

export const TileMetadata = ({ tile }: { tile: Tile3D }) => {
  const {
    id,
    type,
    header: { children: tileChildren },
    distanceToCamera,
    content: { vertexCount, texture, material },
    refine,
    lodMetricType,
    lodMetricValue,
    screenSpaceError,
  } = tile;
  const childrenInfo = getChildrenInfo(tileChildren);

  const TILE_INFO = [
    { title: "Tile Id", value: formatStringValue(id) || NO_DATA },
    { title: "Type", value: formatStringValue(type) || NO_DATA },
    {
      title: "Children Count",
      value: formatIntValue(childrenInfo.count) || NO_DATA,
    },
    {
      title: "Children Ids",
      value: formatStringValue(childrenInfo.ids) || NO_DATA,
    },
    { title: "Vertex count", value: formatIntValue(vertexCount) || NO_DATA },
    {
      title: "Distance to camera",
      value: formatFloatNumber(distanceToCamera) || NO_DATA,
    },
    { title: "Refinement Type", value: REFINEMENT_TYPES[refine] || NO_DATA },
    { title: "Has Texture", value: Boolean(texture).toString() },
    { title: "Has Material", value: Boolean(material).toString() },
    {
      title: "Bounding Type",
      value: formatStringValue(getBoundingType(tile)) || NO_DATA,
    },
    { title: "LOD Metric Type", value: formatStringValue(lodMetricType) },
    { title: "LOD Metric Value", value: formatFloatNumber(lodMetricValue) },
    {
      title: "Screen Space Error",
      value: formatFloatNumber(screenSpaceError) || NO_DATA,
    },
  ];

  return (
    <>
      {TILE_INFO.map((info, _, infoArray) => {
        const lastInfoElemtent =
          info.title === infoArray[infoArray.length - 1].title;
        return (
          <React.Fragment key={info.title}>
            <TileInfoContainer>
              <TileInfoTitle>{info.title}</TileInfoTitle>
              <TileInfoValue>{info.value}</TileInfoValue>
            </TileInfoContainer>
            {!lastInfoElemtent && <TileInfoDevider />}
          </React.Fragment>
        );
      })}
    </>
  );
};
