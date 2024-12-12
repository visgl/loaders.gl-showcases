import { useEffect, useState } from "react";
import styled from "styled-components";

import {
  ActionButtonVariant,
  FetchingStatus,
  type LayoutProps,
  TilesetType,
  BaseMapGroup,
  FileType,
} from "../../../types";
import {
  getCurrentLayoutProperty,
  useAppLayout,
} from "../../../utils/hooks/layout";
import { ActionButton } from "../../action-button/action-button";
import { InputText } from "./input-text/input-text";
import { InputDropdown } from "../../input-dropdown/input-dropdown";

import { getTilesetType } from "../../../utils/url-utils";
import { LoadingSpinner } from "../../loading-spinner/loading-spinner";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  getLayerNameInfo,
  selectLayerNames,
} from "../../../redux/slices/layer-names-slice";
import { UploadPanel } from "../../upload-panel/upload-panel";
import { getLayerUrl } from "../../../utils/layer-utils";

const NO_NAME_ERROR = "Please enter name";
const INVALID_URL_ERROR = "Invalid URL";

export interface CustomLayerData {
  name: string;
  url: string | File;
  token?: string;
  group?: BaseMapGroup;
}

interface InsertLayerProps {
  title: string;
  groups?: string[];
  onInsert: (object: CustomLayerData) => Promise<void> | void;
  onCancel: () => void;
  children?: React.ReactNode;
}

interface VisibilityProps {
  visible: boolean;
}

const Container = styled.div<LayoutProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 303px;
  padding: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.mainColor};
  box-shadow: 0px 17px 80px rgba(0, 0, 0, 0.1);
  max-height: ${getCurrentLayoutProperty({
    desktop: "auto",
    tablet: "auto",
    mobile: "calc(50vh - 140px)",
  })};
  overflow-y: auto;
`;

const Title = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.fontColor};
  margin-bottom: 16px;
`;

const InputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;

  > * {
    margin: 8px 0;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 6px;
`;

const SpinnerContainer = styled.div<VisibilityProps>`
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
  left: calc(50% - 44px);
  top: calc(50% - 44px);
  padding: 22px;
  border-radius: 8px;
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
`;

export const InsertPanel = ({
  title,
  groups,
  onInsert,
  onCancel,
  children = null,
}: InsertLayerProps) => {
  const [group, setGroup] = useState<BaseMapGroup>(BaseMapGroup.Maplibre);
  const [name, setName] = useState("");
  const [url, setUrl] = useState<string | File>("");
  const [token, setToken] = useState("");

  const [nameError, setNameError] = useState("");
  const [urlError, setUrlError] = useState("");
  const [isValidateInProgress, setValidateInProgress] = useState(false);
  const layerNames = useAppSelector(selectLayerNames);
  const dispatch = useAppDispatch();

  const getNewLayerUrl = () => getLayerUrl(url);

  const validateFields = (): void => {
    let isFormValid = true;
    const type = getTilesetType(typeof url === "string" ? url : url.name);

    if (typeof url === "string") {
      try {
        // eslint-disable-next-line no-new
        new URL(url);
      } catch (_) {
        setUrlError(INVALID_URL_ERROR);
        isFormValid = false;
      }
    }

    if (
      (type !== TilesetType.I3S && !name) ||
      (type === TilesetType.I3S && !name && !layerNames[getNewLayerUrl()]?.name)
    ) {
      setNameError(NO_NAME_ERROR);
      isFormValid = false;
    }

    if (isFormValid) {
      void onInsert({
        name: name || layerNames[getNewLayerUrl()]?.name,
        url,
        token,
        group: groups ? group : undefined,
      });
    }
  };

  useEffect(() => {
    const type = getTilesetType(getNewLayerUrl());
    if (isValidateInProgress && type === TilesetType.I3S) {
      if (
        (layerNames[getNewLayerUrl()] !== undefined &&
          layerNames[getNewLayerUrl()].status === FetchingStatus.ready) ||
        name.length > 0
      ) {
        setValidateInProgress(false);
        validateFields();
      } else if (!layerNames[getNewLayerUrl()]) {
        void dispatch(getLayerNameInfo({ layerUrl: url, token, type }));
      }
    }
  }, [isValidateInProgress, layerNames]);

  const handleInsert = (event) => {
    event.preventDefault();

    if (getTilesetType(getNewLayerUrl()) !== TilesetType.I3S) {
      validateFields();
    } else {
      setValidateInProgress(true);
    }
  };

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;

    switch (name) {
      case "BasemapProvider":
        setGroup(value as BaseMapGroup);
        setNameError("");
        break;
      case "Name":
        setName(value);
        setNameError("");
        break;
      case "URL":
        if (files) {
          setUrl(files[0]);
        } else {
          setUrl(value);
        }
        setUrlError("");
        break;
      case "Token":
        setToken(value);
    }
  };

  const onCancelHandler = () => {
    setValidateInProgress(false);
    onCancel();
  };

  const layout = useAppLayout();

  return (
    <Container $layout={layout}>
      <Title>{title}</Title>
      <SpinnerContainer visible={isValidateInProgress}>
        <LoadingSpinner />
      </SpinnerContainer>
      <form className="insert-form" onSubmit={handleInsert}>
        <InputsWrapper>
          {groups && (
            <InputDropdown
              label="Basemap Provider"
              options={groups}
              onChange={handleInputChange}
            ></InputDropdown>
          )}
          <InputText
            name="Name"
            label="Name"
            value={name}
            error={nameError}
            onChange={handleInputChange}
          />
          <InputText
            name="URL"
            label="URL"
            value={typeof url === "string" ? url : ""}
            error={urlError}
            onChange={handleInputChange}
          />
          <InputText
            name="Token"
            label="Token"
            value={token}
            onChange={handleInputChange}
          />
          <UploadPanel
            dragAndDropText={"Drag and drop your .slpk file here"}
            noPadding={true}
            accept=".slpk"
            onFileEvent={(files) => { handleInputChange({ target: { files, name: "URL" } }); }}
            fileType={FileType.binary}
          />
        </InputsWrapper>
        <ButtonsWrapper>
          <ActionButton
            variant={ActionButtonVariant.cancel}
            onClick={onCancelHandler}
          >
            Cancel
          </ActionButton>
          <ActionButton type="submit">Insert</ActionButton>
        </ButtonsWrapper>
      </form>
      {children}
    </Container>
  );
};
