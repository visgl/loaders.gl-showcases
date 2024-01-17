import styled from "styled-components";
import { UploadPanelItem } from "./upload-panel-item";

const Continer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const TextItem = styled.p`
  width: 100%;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.fontColor};
`;

const BoldTextItem = styled(TextItem)`
  font-weight: 700;
`;

type ExistedLayerWarningProps = {
  onCancel: () => void;
  onConfirmWarning: () => void;
};

export const UnsavedBookmarkWarning = ({
  onCancel,
  onConfirmWarning,
}: ExistedLayerWarningProps) => {
  return (
    <UploadPanelItem onCancel={onCancel} onConfirm={onConfirmWarning}>
      <Continer>
        <BoldTextItem>
          You have unsaved bookmarks. After uploading the file, they will be
          cleared.
        </BoldTextItem>
        <TextItem>
          You can switch to the layer with unsaved bookmarks and download the
          file to save them.
        </TextItem>
      </Continer>
    </UploadPanelItem>
  );
};
