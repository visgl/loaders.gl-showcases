import { ValidatedTile, ValidatedDataType } from "../../types";
import { PanelHorizontalLine } from "../common";
import { ValidateTileSection } from "./validate-tile-section";

type ValidatePanelProps = {
  validatedTileWarnings: ValidatedTile[];
  validatedTileOk: ValidatedTile[];
};

export const ValidateTilePanel = ({
  validatedTileWarnings,
  validatedTileOk,
}: ValidatePanelProps) => {
  return (
    <>
      {validatedTileOk.length > 0 && (
        <ValidateTileSection
          validatedData={validatedTileOk}
          dataType={ValidatedDataType.Ok}
        />
      )}
      {validatedTileWarnings.length > 0 && validatedTileOk.length > 0 && (
        <PanelHorizontalLine top={0} bottom={0} />
      )}
      {validatedTileWarnings.length > 0 && (
        <ValidateTileSection
          validatedData={validatedTileWarnings}
          dataType={ValidatedDataType.Warning}
        />
      )}
    </>
  );
};
