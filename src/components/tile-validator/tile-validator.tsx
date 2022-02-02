import PropTypes from "prop-types";
import styled from "styled-components";
import {
  isTileGeometryInsideBoundingVolume,
  getGeometryVsTextureMetrics,
  isGeometryBoundingVolumeMoreSuitable,
} from "../../utils";
import { Checkbox } from "../";
import { useEffect, useState } from "react";

const TileValidatorContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0;
`;

const ValidateButton = styled.button`
  display: flex;
  padding: 4px 16px;
  background: #4f52cc;
  color: white;
  align-items: center;
  height: 20px;
  justify-content: center;
  width: 120px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 5px;
  border-radius: 4px;
`;

const NormalsValidator = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  flex-flow: column nowrap;
`;

const ValidatorInfoList = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const GapInput = styled.input`
  max-width: 50px;
  margin: 0 10px;
  background: #1d2335;
  color: white;
  font-weight: bold;
  text-align: center;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "auto" : "pointer")};
  border: none;
  padding: 5px;
`;

const NormalsControl = styled.div`
  width: 100%;
  display flex;
  align-items: center;
  margin: 10px 0 10px 0;
`;

const NoNormalsInfo = styled.span`
  display: flex;
  align-self: flex-start;
  margin: 5px;
  color: #ff0047;
`;

const VALIDATE_TILE = "Validate Tile";
const WARNING_TYPE = "warning";
const OK_TYPE = "ok";

const propTypes = {
  tile: PropTypes.object,
  trianglesPercentage: PropTypes.number,
  normalsLength: PropTypes.number,
  showNormals: PropTypes.bool,
  handleShowNormals: PropTypes.func,
  handleChangeTrianglesPercentage: PropTypes.func,
  handleChangeNormalsLength: PropTypes.func,
};

const defaultProps = {
  tile: null,
  showNormals: false,
  handleShowNormals: () => {},
  handleChangeTrianglesPercentage: () => {},
  handleChangeNormalsLength: () => {},
};

interface IGeometryInfo {
  type: string;
  title: string;
}

interface ITriangleMessage {
  key: string;
  type?: string;
  text: string;
}

export const TileValidator = ({
  tile,
  handleShowNormals,
  showNormals,
  trianglesPercentage,
  normalsLength,
  handleChangeTrianglesPercentage,
  handleChangeNormalsLength,
}) => {
  useEffect(() => {
    setGeometryInfo(null);
    setTriangleMessages(null);
    setBoundingVolumeInfo(null);
  }, [tile.id]);

  const [geometryInfo, setGeometryInfo] = useState<IGeometryInfo | null>(null);
  const [triangleMessages, setTriangleMessages] = useState<
    ITriangleMessage[] | null
  >(null);
  const [boundingVolumeInfo, setBoundingVolumeInfo] =
    useState<IGeometryInfo | null>(null);

  const onValidateTile = (tile) => {
    validateGeometryInsideBoundingVolume(tile);
    validateGeometryVsTexture(tile);
    compareGeometryBoundingVolumeVsTileBoundingVolume(tile);
  };

  const validateGeometryInsideBoundingVolume = (tile) => {
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

  const validateGeometryVsTexture = (tile) => {
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

  const compareGeometryBoundingVolumeVsTileBoundingVolume = (tile) => {
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

  const getCheckboxStyle = (isTileHasNormals) => {
    return {
      cursor: isTileHasNormals ? "pointer" : "auto",
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

  const renderNormalsValidationControl = () => {
    const isTileHasNormals =
      tile &&
      tile.content &&
      tile.content.attributes &&
      tile.content.attributes.normals;
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
              type="checkbox"
              disabled={!isTileHasNormals}
              checked={showNormals}
              onChange={() => handleShowNormals(tile)}
            ></Checkbox>
            Show Normals
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

  return (
    <TileValidatorContainer>
      {renderNormalsValidationControl()}
      <ValidateButton onClick={() => onValidateTile(tile)}>
        {VALIDATE_TILE}
      </ValidateButton>
      <ValidatorInfoList>
        {renderGeometryMetrics()}
        {renderBoundingVolumesMetrics()}
        {renderTriangleMetrics()}
      </ValidatorInfoList>
    </TileValidatorContainer>
  );
};

TileValidator.propTypes = propTypes;
TileValidator.defaultProps = defaultProps;
