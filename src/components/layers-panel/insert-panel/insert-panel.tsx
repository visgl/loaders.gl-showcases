import { useState } from "react";
import styled from "styled-components";

import { ActionButtonVariant } from "../../../types";
import {
  getCurrentLayoutProperty,
  useAppLayout,
} from "../../../utils/hooks/layout";
import { ActionButton } from "../../action-button/action-button";
import { InputText } from "./input-text/input-text";

const NO_NAME_ERROR = "Please enter name";
const INVALID_URL_ERROR = "Invalid URL";

type InsertLayerProps = {
  title: string;
  onInsert: (object: { name: string; url: string; token?: string }) => void;
  onCancel: () => void;
  children?: React.ReactNode;
};

type LayoutProps = {
  layout: string;
};

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

export const InsertPanel = ({
  title,
  onInsert,
  onCancel,
  children = null,
}: InsertLayerProps) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");

  const [nameError, setNameError] = useState("");
  const [urlError, setUrlError] = useState("");

  const validateFields = () => {
    let isFormValid = true;

    if (!name) {
      setNameError(NO_NAME_ERROR);
      isFormValid = false;
    }

    try {
      new URL(url);
    } catch (_) {
      setUrlError(INVALID_URL_ERROR);
      isFormValid = false;
    }

    return isFormValid;
  };

  const handleInsert = (event) => {
    const isFormValid = validateFields();

    if (isFormValid) {
      onInsert({ name, url, token });
    }
    event.preventDefault();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "Name":
        setName(value);
        setNameError("");
        break;
      case "URL":
        setUrl(value);
        setUrlError("");
        break;
      case "Token":
        setToken(value);
    }
  };

  const layout = useAppLayout();

  return (
    <Container layout={layout}>
      <Title>{title}</Title>
      <form className="insert-form" onSubmit={handleInsert}>
        <InputsWrapper>
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
            value={url}
            error={urlError}
            onChange={handleInputChange}
          />
          <InputText
            name="Token"
            label="Token"
            value={token}
            onChange={handleInputChange}
          />
        </InputsWrapper>
        <ButtonsWrapper>
          <ActionButton variant={ActionButtonVariant.cancel} onClick={onCancel}>
            Cancel
          </ActionButton>
          <ActionButton type="submit">Insert</ActionButton>
        </ButtonsWrapper>
      </form>
      {children}
    </Container>
  );
};
