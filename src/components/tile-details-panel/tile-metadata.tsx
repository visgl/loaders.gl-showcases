import React from "react";
import styled from "styled-components";
import { PanelHorizontalLine, Title } from "../common";
import { type TileInfo } from "../../types";

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

export const TileMetadata = ({ tileInfo }: { tileInfo: TileInfo[] }) => {
  return (
    <>
      {tileInfo.map((info, _, infoArray) => {
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
