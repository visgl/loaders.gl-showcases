import styled from "styled-components";
import JsonSchema, {
  Result,
  SchemaDocument,
  Validator,
} from "@hyperjump/json-schema";
import { UploadPanelItem } from "./upload-panel-item";
import UploadIcon from "../../../public/icons/upload.svg";
import { Layout } from "../../utils/enums";
import { useRef, useState } from "react";
import {
  bookmarksSchemaId,
  bookmarksSchemaJson,
} from "../../constants/json-schemas/bookmarks";
import { Bookmark } from "../../types";
import { useAppLayout } from "../../utils/hooks/layout";

const UPLOAD_INPUT_ID = "upload-bookmarks-input";

const FileInteractionContainer = styled.label`
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
  cursor: pointer;
`;

const DragAndDropOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 178px;
  opacity: 0;
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

const UploadInput = styled.input`
  display: none;
`;

type ExistedLayerWarningProps = {
  onCancel: () => void;
  onConfirmWarning: () => void;
  onBookmarksUploaded: (bookmarks: Bookmark[]) => void;
};

export const dragAndDropText = "Drag and drop you json file here";

export const UploadPanel = ({
  onCancel,
  onConfirmWarning,
  onBookmarksUploaded,
}: ExistedLayerWarningProps) => {
  const layout = useAppLayout();
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const parseFile = async (file) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (typeof event?.target?.result !== "string") {
        return;
      }
      JsonSchema.add(bookmarksSchemaJson);
      const schema: SchemaDocument = await JsonSchema.get(bookmarksSchemaId);
      let result;
      try {
        const validator: Validator = await JsonSchema.validate(schema);
        result = JSON.parse(event.target.result);
        const validationResult: Result = validator(result);
        if (validationResult.valid) {
          onBookmarksUploaded(result);
        }
      } catch {
        // do nothing
      }
    };
    reader.readAsText(file);
  };

  const onDragHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const onDropHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      parseFile(e.dataTransfer.files[0]);
    }
  };

  const onUploadChangeHandler = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      parseFile(e.target.files[0]);
    }
  };

  return (
    <UploadPanelItem
      title={"Upload Bookmarks"}
      cancelButtonText={"Cancel"}
      onCancel={onCancel}
      onConfirm={onConfirmWarning}
    >
      <UploadInput
        ref={inputRef}
        id={UPLOAD_INPUT_ID}
        type="file"
        onChange={onUploadChangeHandler}
      />
      <FileInteractionContainer
        data-testid="upload-file-label"
        htmlFor={UPLOAD_INPUT_ID}
        onDragEnter={onDragHandler}
      >
        <UploadIcon style={{ marginBottom: "10" }} />
        {layout === Layout.Desktop && (
          <>
            <DragAndDropFileText>{dragAndDropText}</DragAndDropFileText>
            <BrosweFileText>or</BrosweFileText>
          </>
        )}
        <BrosweFileLink>browse file</BrosweFileLink>
        {dragActive && (
          <DragAndDropOverlay
            data-testid="dnd-overlay"
            onDragEnter={onDragHandler}
            onDragLeave={onDragHandler}
            onDragOver={onDragHandler}
            onDrop={onDropHandler}
          ></DragAndDropOverlay>
        )}
      </FileInteractionContainer>
    </UploadPanelItem>
  );
};
