import styled from "styled-components";

import { FileType, type FileUploaded } from "../../types";
import { UploadPanelItem } from "./upload-panel-item";

import UploadIcon from "../../../public/icons/upload.svg";
import { Layout } from "../../utils/enums";
import { useMemo, useRef, useState } from "react";
import { useAppLayout } from "../../utils/hooks/layout";

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

const UploadedFileText = styled(FileTextItem)`
  color: ${({ theme }) => theme.colors.fontColor};
  word-break: break-all;
`;

const BrosweFileText = styled(FileTextItem)`
  color: ${({ theme }) => theme.colors.mainDimColorInverted};
`;

const BrosweFileLink = styled(FileTextItem).attrs({ as: "a" })``;

const UploadInput = styled.input`
  display: none;
`;

interface UploadProps {
  title?: string;
  dragAndDropText: string;
  fileType: FileType;
  multipleFiles?: boolean;
  noPadding?: boolean;
  accept?: string;
  onCancel?: () => void;
  onFileUploaded?: (fileUploaded: FileUploaded) => Promise<void> | void;
  onFileEvent?: (files: FileList) => void;
}

export const UploadPanel = ({
  title,
  dragAndDropText,
  fileType,
  multipleFiles,
  noPadding,
  accept,
  onCancel,
  onFileUploaded,
  onFileEvent,
}: UploadProps) => {
  const UPLOAD_INPUT_ID = useMemo(() => `upload-file-input${crypto.randomUUID()}`, []);

  const layout = useAppLayout();
  const [dragActive, setDragActive] = useState(false);
  const [fileUploaded, setFileUploaded] = useState("");
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
        await onFileUploaded?.({ fileContent: event?.target?.result, info });
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
    if (e.dataTransfer.files?.[0]) {
      if (accept && !e.dataTransfer.files?.[0].name.endsWith(accept)) {
        return;
      }
      setFileUploaded(e.dataTransfer.files[0].name);
      onFileEvent?.(e.dataTransfer.files);
      readFile(e.dataTransfer.files).catch(() => {
        console.error("Read uploaded file operation error");
      });
    }
  };

  const onUploadChangeHandler = function (
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    e.preventDefault();
    if (e.target.files?.[0]) {
      setFileUploaded(e.target.files[0].name);
      onFileEvent?.(e.target.files);
      readFile(e.target.files).catch(() => {
        console.error("Read uploaded file operation error");
      });
    }
  };

  return (
    <UploadPanelItem title={title} onCancel={onCancel} noPadding={noPadding}>
      <UploadInput
        ref={inputRef}
        id={UPLOAD_INPUT_ID}
        type="file"
        multiple={multipleFiles ?? undefined}
        onChange={onUploadChangeHandler}
        accept={accept}
      />
      <FileInteractionContainer
        data-testid="upload-file-label"
        htmlFor={UPLOAD_INPUT_ID}
        onDragEnter={onDragHandler}
      >
        {!fileUploaded && (
          <>
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
          </>
        )}
        {fileUploaded && (
          <>
            <UploadIcon style={{ marginBottom: "10" }} />
            <UploadedFileText>{fileUploaded}</UploadedFileText>
          </>
        )}
      </FileInteractionContainer>
    </UploadPanelItem>
  );
};
