import styled from "styled-components";

import { FileType } from "../../types";
import { UploadPanelItem } from "./upload-panel-item";

import UploadIcon from "../../../public/icons/upload.svg";
import { Layout } from "../../utils/enums";
import { useRef, useState } from "react";
import { useAppLayout } from "../../utils/hooks/layout";

const UPLOAD_INPUT_ID = "upload-file-input";

const FileInteractionContainer = styled.label`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 178px;
  background: ${({ theme }) => theme.colors.mainHiglightColor};
  border: 1px dashed ${({ theme }) => theme.colors.bookmarkFileInteractions};
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

type UploadProps = {
  title: string;
  dragAndDropText: string;
  fileType: FileType;
  multipleFiles?: boolean;
  onCancel: () => void;
  onFileUploaded: (fileUploaded: {
    fileContent: string | ArrayBuffer;
    info: Record<string, unknown>;
  }) => void;
};

export const UploadPanel = ({
  title,
  dragAndDropText,
  fileType,
  multipleFiles,
  onCancel,
  onFileUploaded,
}: UploadProps) => {
  const layout = useAppLayout();
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const readFile = async (files: FileList) => {
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (!event?.target?.result) {
          return;
        }
        const info: Record<string, unknown> = {
          url: file.name,
        };
        onFileUploaded({ fileContent: event?.target?.result, info: info });
      };
      if (fileType === FileType.binary) {
        reader.readAsArrayBuffer(file);
      } else if (fileType === FileType.text) {
        reader.readAsText(file);
      }
    }
  };

  const onDragHandler = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const onDropHandler = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      readFile(e.dataTransfer.files);
    }
  };

  const onUploadChangeHandler = function (
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      readFile(e.target.files);
    }
  };

  return (
    <UploadPanelItem title={title} onCancel={onCancel}>
      <UploadInput
        ref={inputRef}
        id={UPLOAD_INPUT_ID}
        type="file"
        multiple={multipleFiles || undefined}
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
