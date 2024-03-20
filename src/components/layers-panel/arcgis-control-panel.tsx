import { useState } from "react";
import styled from "styled-components";
import ImportIcon from "../../../public/icons/import.svg";
import { AcrGisUser } from "../arcgis-user/arcgis-user";
import {
  arcGisLogin,
  arcGisLogout,
  selectUser,
} from "../../redux/slices/arcgis-auth-slice";
import { getArcGisContent } from "../../redux/slices/arcgis-content-slice";
import { ModalDialog } from "../modal-dialog/modal-dialog";
import EsriImage from "../../../public/images/esri.svg";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { ActionIconButton } from "../action-icon-button/action-icon-button";
import { ButtonSize } from "../../types";
import { ArcGisImportPanel } from "./arcgis-import-panel/arcgis-import-panel";

interface ArcGisControlPanelProps {
  onArcGisImportClick: (layer: {
    name: string;
    url: string;
    token?: string;
  }) => void;
}

const ActionButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  row-gap: 8px;
  margin-top: 8px;
`;

const ActionIconButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
`;

const EsriStyledImage = styled(EsriImage)`
  margin-left: 16px;
  fill: ${({ theme }) => theme.colors.esriImageColor};
`;

const TextInfo = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
`;

const TextUser = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
`;

export const ArcGisControlPanel = ({
  onArcGisImportClick,
}: ArcGisControlPanelProps) => {
  const dispatch = useAppDispatch();

  const username = useAppSelector(selectUser);
  const isLoggedIn = !!username;

  const [showLogoutWarning, setShowLogoutWarning] = useState(false);
  const [showArcGisImportPanel, setShowArcGisImportPanel] = useState(false);

  const onArcGisActionClick = (): void => {
    if (isLoggedIn) {
      void dispatch(getArcGisContent());
      setShowArcGisImportPanel(true);
    } else {
      void dispatch(arcGisLogin());
    }
  };
  const onArcGisLogoutClick = (): void => {
    setShowLogoutWarning(true);
  };

  return (
    <>
      <ActionButtonsContainer>
        <ActionIconButtonContainer>
          <ActionIconButton
            Icon={ImportIcon}
            style={isLoggedIn ? "active" : "disabled"}
            size={ButtonSize.Small}
            onClick={onArcGisActionClick}
          >
            {isLoggedIn ? "Import from ArcGIS" : "Login to ArcGIS"}
          </ActionIconButton>
          <EsriStyledImage />
        </ActionIconButtonContainer>

        {isLoggedIn && (
          <AcrGisUser onClick={onArcGisLogoutClick}>{username}</AcrGisUser>
        )}
      </ActionButtonsContainer>

      {showArcGisImportPanel && (
        <ArcGisImportPanel
          onImport={(item) => {
            onArcGisImportClick(item);
            setShowArcGisImportPanel(false);
          }}
          onCancel={() => {
            setShowArcGisImportPanel(false);
          }}
        />
      )}

      {showLogoutWarning && (
        <ModalDialog
          title={"Logout from ArcGIS"}
          okButtonText={"Log out"}
          cancelButtonText={"Cancel"}
          onConfirm={() => {
            void dispatch(arcGisLogout());
            setShowLogoutWarning(false);
          }}
          onCancel={() => {
            setShowLogoutWarning(false);
          }}
        >
          <TextInfo>Are you sure you want to log out?</TextInfo>
          <TextInfo>You are logged in as</TextInfo>
          <TextUser>{username}</TextUser>
        </ModalDialog>
      )}
    </>
  );
};
