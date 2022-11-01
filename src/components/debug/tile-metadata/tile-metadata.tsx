import styled from "styled-components";
import { Tile3D } from "@loaders.gl/tiles";
import { getChildrenInfo } from "../../../utils/debug/tile-debug";
import { formatFloatNumber, formatIntValue, formatStringValue } from "../../../utils/format/format-utils";
import { getBoundingType } from "../../../utils/debug/bounding-volume";

const REFINEMENT_TYPES = {
  1: "Add",
  2: "Replace",
};

const Table = styled.table`
  width: 100%;
`;

const ColumnHeader = styled.th`
  width: 40%;
  text-align: left;
  font-weight: 500;
  font-size: 14px;
  border-right: 3px solid rgba(0, 0, 0, 0.05);
  padding: 5px 0;
`;

const DataCell = styled.td`
  width: 60%;
  font-weight: 400;
  font-size: 14px;
  padding: 5px 0;
`;

const NO_DATA = "No Data";

export const TileMetadata = ({ tile }: { tile: Tile3D }) => {
  const {
    id,
    type,
    header: { children: tileChildren },
    // @ts-expect-error - Property '_distanceToCamera' is private and only accessible within class 'TileHeader'.
    _distanceToCamera,
    content: { vertexCount, texture, material },
    refine,
    lodMetricType,
    lodMetricValue,
    // @ts-expect-error - Property '_screenSpaceError' is private and only accessible within class 'TileHeader'.
    _screenSpaceError,
  } = tile;
  const childrenInfo = getChildrenInfo(tileChildren);

  return (
    <Table>
      <tbody>
        <tr>
          <ColumnHeader>Tile Id</ColumnHeader>
          <DataCell>{formatStringValue(id) || NO_DATA}</DataCell>
        </tr>
        <tr>
          <ColumnHeader>Type</ColumnHeader>
          <DataCell>{formatStringValue(type) || NO_DATA}</DataCell>
        </tr>
        <tr>
          <ColumnHeader>Children Count</ColumnHeader>
          <DataCell>{formatIntValue(childrenInfo.count) || NO_DATA}</DataCell>
        </tr>
        <tr>
          <ColumnHeader>Children Ids</ColumnHeader>
          <DataCell>{formatStringValue(childrenInfo.ids) || NO_DATA}</DataCell>
        </tr>
        <tr>
          <ColumnHeader>Vertex count</ColumnHeader>
          <DataCell>{formatIntValue(vertexCount) || NO_DATA}</DataCell>
        </tr>
        <tr>
          <ColumnHeader>Distance to camera</ColumnHeader>
          <DataCell>{formatFloatNumber(_distanceToCamera) || NO_DATA}</DataCell>
        </tr>
        <tr>
          <ColumnHeader>Refinement Type</ColumnHeader>
          <DataCell>{REFINEMENT_TYPES[refine] || NO_DATA}</DataCell>
        </tr>
        <tr>
          <ColumnHeader>Has Texture</ColumnHeader>
          <DataCell>{Boolean(texture).toString()}</DataCell>
        </tr>
        <tr>
          <ColumnHeader>Has Material</ColumnHeader>
          <DataCell>{Boolean(material).toString()}</DataCell>
        </tr>
        <tr>
          <ColumnHeader>Bounding Type</ColumnHeader>
          <DataCell>
            {formatStringValue(getBoundingType(tile)) || NO_DATA}
          </DataCell>
        </tr>
        <tr>
          <ColumnHeader>LOD Metric Type</ColumnHeader>
          <DataCell>{formatStringValue(lodMetricType)}</DataCell>
        </tr>
        <tr>
          <ColumnHeader>LOD Metric Value</ColumnHeader>
          <DataCell>{formatFloatNumber(lodMetricValue)}</DataCell>
        </tr>
        <tr>
          <ColumnHeader>Screen Space Error</ColumnHeader>
          <DataCell>{formatFloatNumber(_screenSpaceError) || NO_DATA}</DataCell>
        </tr>
      </tbody>
    </Table>
  );
};
