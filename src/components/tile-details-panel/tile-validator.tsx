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
  onValidateClick: () => void;
};

/**
 * TODO: Add types to component
 */
export const TileValidator = ({
  tile,
  onValidateClick,
}: TileValidatorProps) => {
  return (
    <>
      <ValidateButton onClick={onValidateClick}>
        <ValidatorTitle>{VALIDATE_TILE}</ValidatorTitle>
        <ArrowContainer>
          <ChevronIcon />
        </ArrowContainer>
      </ValidateButton>-
    </>
  );
};
