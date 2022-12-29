import styled from "styled-components";
import { Title } from "../common";
import { ValidatedDataType, ValidatedTile } from "../../types";
import WarningIcon from "../../../public/icons/validate-data-warning.svg";
import OkIcon from "../../../public/icons/validate-data-ok.svg";

const DataSection = styled.section<{
  dataType: string;
}>`
  display: flex;
  gap: 18px;
  margin: 24px 16px;
  color: ${({ theme, dataType }) =>
    dataType === ValidatedDataType.Warning
      ? theme.colors.validateTileWarning
      : theme.colors.validateTileOk};
`;

const ValidateDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ValidateDataTitle = styled(Title)`
  width: 287px;
  font-weight: 400;
  color: inherit;
`;

type ValidateTileSectionProps = {
  dataType: ValidatedDataType;
  validatedData: ValidatedTile[];
};

export const ValidateTileSection = ({
  dataType,
  validatedData,
}: ValidateTileSectionProps) => {
  return (
    <DataSection dataType={dataType}>
      {dataType === ValidatedDataType.Warning ? <WarningIcon /> : <OkIcon />}
      <ValidateDataContainer>
        {validatedData.map((data) => (
          <ValidateDataTitle key={data.key}>{data.title}</ValidateDataTitle>
        ))}
      </ValidateDataContainer>
    </DataSection>
  );
};
