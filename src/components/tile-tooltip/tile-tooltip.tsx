import styled from "styled-components";
import { Tile3D } from "@loaders.gl/tiles";
import { getChildrenInfo } from "../../utils/debug/tile-debug";
import { formatFloatNumber, formatIntValue, formatStringValue } from "../../utils/format/format-utils";

const NO_DATA = "No Data";

const Tooltip = styled.div`
  background: "#0E111A";
  margin: "-10px";
  color: "rgba(255,255,255,.6)";
  font-size: "14px";
  padding: "10px";
`;

const TableHeader = styled.th`
  text-align: left;
  font-size: 14px;
  color: white;
  font-weight: 400;
`;

export const TileTooltip = ({ tile }: { tile: Tile3D }) => {
  const {
    id,
    type,
    header: { children },
    _distanceToCamera,
    content: { vertexCount } = {},
    depth
  } = tile;
  const childrenInfo = getChildrenInfo(children);
  const distanceToCameraFormatted = formatFloatNumber(_distanceToCamera);
  return (
    <Tooltip>
      <table>
        <tbody>
          <tr>
            <TableHeader>Tile Id</TableHeader>
            <td>{formatStringValue(id) || NO_DATA}</td>
          </tr>
          <tr>
            <TableHeader>Type</TableHeader>
            <td>{formatStringValue(type) || NO_DATA}</td>
          </tr>
          <tr>
            <TableHeader>Children Count</TableHeader>
            <td>{formatIntValue(childrenInfo.count) || NO_DATA}</td>
          </tr>
          <tr>
            <TableHeader>Children Ids</TableHeader>
            <td>{formatStringValue(childrenInfo.ids) || NO_DATA}</td>
          </tr>
          <tr>
            <TableHeader>Vertex count</TableHeader>
            <td>{formatIntValue(vertexCount) || NO_DATA}</td>
          </tr>
          <tr>
            <TableHeader>Distance to camera</TableHeader>
            <td>
              {distanceToCameraFormatted.length
                ? `${distanceToCameraFormatted} m`
                : NO_DATA}
            </td>
          </tr>
          <tr>
            <TableHeader>Depth</TableHeader>
            <td>{depth || NO_DATA}</td>
          </tr>
        </tbody>
      </table>
    </Tooltip>
  );
};
