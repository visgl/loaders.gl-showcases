import { useState, Fragment } from "react";
import styled from "styled-components";

import { ActionButtonVariant, ArcgisContent } from "../../../types";
import {
  getCurrentLayoutProperty,
  useAppLayout,
} from "../../../utils/hooks/layout";
import { ActionButton } from "../../action-button/action-button";
//import {ArcGISIdentityManager} from '@esri/arcgis-rest-request';
import { getUserContent, getItem } from "@esri/arcgis-rest-portal";
import {getArcGisSession} from "../../../utils/arcgis-auth";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { ArcgisListItem } from "../arcgis-list-item/arcgis-list-item";
import { SelectionState } from "../../../types";

import {
  selectArcgisContent,
  deleteArcgisContent,
  selectSelectedArcgisContentId,
  setSelectedArcgisContent,
  addArcgisContent,

  arcgisContent
} from "../../../redux/slices/arcgis-content-slice";

const NO_NAME_ERROR = "Please enter name";

type InsertLayerProps = {
  title: string;
  onImport: (object: { name: string; url: string; token?: string }) => void;
  onCancel: () => void;
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

const AcrgisList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px;
`;

const handleImport = (event) => {
  // ...
  event.preventDefault();
};

export const ArcGisImportPanel = ({
  title,
  onImport,
  onCancel
}: InsertLayerProps) => {
  const dispatch = useAppDispatch();

  //let arcgisContentArray = useAppSelector(selectArcgisContent);
  // if (!arcgisContentArray.length) {
  //   dispatch(arcgisContent());
  // }

  const layout = useAppLayout();

  const arcgisContentArray = useAppSelector(selectArcgisContent);
  const selectedArcgisContentId = useAppSelector(selectSelectedArcgisContentId);

  return (
    <Container layout={layout}>
      <Title>{title}</Title>
      <form className="insert-form" onSubmit={handleImport}>
        <InputsWrapper>
        </InputsWrapper>

        <AcrgisList>
        {arcgisContentArray.map((baseMap) => {
          const isMapSelected = selectedArcgisContentId === baseMap.id;

          return (
            <Fragment key={baseMap.name}>
              <ArcgisListItem
                id={baseMap.id}
                title={baseMap.name}
                selected={
                  isMapSelected
                    ? SelectionState.selected
                    : SelectionState.unselected
                }
                onMapsSelect={() => {
                  dispatch(setSelectedArcgisContent(baseMap.id));
                }}
                onClickOutside={() => {
                  // setShowMapSettings(false);
                  // setSettingsMapId("");
                }}
              />
            </Fragment>
          );
        })}
      </AcrgisList>

        <ButtonsWrapper>
          <ActionButton variant={ActionButtonVariant.cancel} onClick={onCancel}>
            Cancel
          </ActionButton>
          <ActionButton type="submit">Import</ActionButton>
        </ButtonsWrapper>
      </form>
    </Container>
  );
};
