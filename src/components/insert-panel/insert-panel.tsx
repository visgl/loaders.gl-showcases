import { useState } from "react";
import styled from "styled-components";

import { ActionButtonVariant } from "../../types";
import { getCurrentLayoutProperty, useAppLayout } from "../../utils/layout";
import { ActionButton } from "../action-button/action-button";
import { InputText } from "../input-text/input-text";

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

  const handleInsert = () => {
    onInsert({ name, url, token });
  };

  const layout = useAppLayout();

  return (
    <Container layout={layout}>
      <Title>{title}</Title>
      <InputsWrapper>
        <InputText
          label="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <InputText
          label="URL"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <InputText
          label="Token"
          value={token}
          onChange={(event) => setToken(event.target.value)}
        />
      </InputsWrapper>
      <ButtonsWrapper>
        <ActionButton variant={ActionButtonVariant.cancel} onClick={onCancel}>
          Cancel
        </ActionButton>
        <ActionButton onClick={handleInsert}>Insert</ActionButton>
      </ButtonsWrapper>
      {children}
    </Container>
  );
};
