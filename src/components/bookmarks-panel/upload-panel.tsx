import styled from "styled-components";
import { UploadPanelItem } from "./upload-panel-item";
import UploadIcon from "../../../public/icons/upload.svg";
import { useAppLayout } from "../../utils/layout";
import { Layout } from "../../utils/enums";

const FileInteractionContiner = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 178px;
  background: ${({ theme }) => theme.colors.mainHiglightColor};
  border: 1px dashed ${({ theme }) => theme.colors.bookmarkFileInteracrions};
  border-radius: 4px;
`;

const FileTextItem = styled.div`
  width: 223px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: ${({ theme }) => theme.colors.mainHistogramColor};
`;

const DragAndDropFileText = styled(FileTextItem)`
  color: ${({ theme }) => theme.colors.fontColor};
`;

const BrosweFileText = styled(FileTextItem)`
  color: ${({ theme }) => theme.colors.mainDimColorInverted};
`;

const BrosweFileLink = FileTextItem.withComponent("a");

type ExistedLayerWarningProps = {
  onCancel: () => void;
  onConfirmWarning: () => void;
};

export const dragAndDropText = "Drag and drop you json file here";

export const UploadPanel = ({
  onCancel,
  onConfirmWarning,
}: ExistedLayerWarningProps) => {
  const layout = useAppLayout();

  return (
    <UploadPanelItem
      title={"Upload Bookmarks"}
      onCancel={onCancel}
      onConfirm={onConfirmWarning}
    >
      <FileInteractionContiner>
        <UploadIcon style={{ marginBottom: "10" }} />
        {layout === Layout.Desktop && (
          <>
            <DragAndDropFileText>{dragAndDropText}</DragAndDropFileText>
            <BrosweFileText>or</BrosweFileText>
          </>
        )}
        <BrosweFileLink href="">browse file</BrosweFileLink>
      </FileInteractionContiner>
    </UploadPanelItem>
  );
};
