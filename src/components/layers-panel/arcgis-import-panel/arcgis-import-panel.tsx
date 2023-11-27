import { Fragment, useEffect } from "react";
import styled from "styled-components";

import { ActionButtonVariant, ListItemType } from "../../../types";

import {
  getCurrentLayoutProperty,
  useAppLayout,
} from "../../../utils/hooks/layout";
import { ActionButton } from "../../action-button/action-button";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { ArcGisListItem } from "../arcgis-list-item/arcgis-list-item";
import { SelectionState } from "../../../types";

import {
  selectArcGisContent,
  selectArcGisContentSelected,
  setArcGisContentSelected,
  resetArcGisContentSelected,
} from "../../../redux/slices/arcgis-content-slice";

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

export const ArcGisImportPanel = ({
  title,
  onImport,
  onCancel
}: InsertLayerProps) => {
  const dispatch = useAppDispatch();

  const layout = useAppLayout();

  const arcGisContentArray = useAppSelector(selectArcGisContent);
  const arcGisContentSelected = useAppSelector(selectArcGisContentSelected);

  useEffect(() => {
    dispatch( resetArcGisContentSelected() );
  }, [arcGisContentArray]);

  const handleImport = (event) => {
    const arcGisItem = arcGisContentArray.find( (item) => item.id === arcGisContentSelected );
    if (arcGisItem) {
      onImport(arcGisItem);
    }
    event.preventDefault();
  };

  return (
    <Container layout={layout}>
      <Title>{title}</Title>
      <form className="insert-form" onSubmit={handleImport}>
        <AcrgisList>
        {arcGisContentArray.map((contentItem) => {
          const isMapSelected = arcGisContentSelected === contentItem.id;

          return (
            <Fragment key={contentItem.name}>
              <ArcGisListItem
                id={contentItem.id}
                type={ListItemType.Radio}
                title={contentItem.name}
                selected={
                  isMapSelected
                    ? SelectionState.selected
                    : SelectionState.unselected
                }
                onChangeSelection={
                  () => { dispatch( setArcGisContentSelected(contentItem.id) ); }
                }
              />
            </Fragment>
          );
        })}
      </AcrgisList>

        <ButtonsWrapper>
          <ActionButton variant={ActionButtonVariant.cancel} onClick={onCancel}>
            Cancel
          </ActionButton>
          <ActionButton type="submit">Import Selected</ActionButton>
        </ButtonsWrapper>
      </form>
    </Container>
  );
};
