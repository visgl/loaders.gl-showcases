import styled from "styled-components";

import { color_accent_primary } from "../../../constants/colors";
import DeleteIcon from "../../../../public/icons/delete.svg";

//import { DeleteConfirmation } from "../delete-confirmation";
import { useState } from "react";

const MapSettingsItem = styled.div<{
  customColor?: string;
  opacity?: number;
}>`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  padding: 10px 0px;
  color: ${({ theme, customColor }) =>
    customColor ? customColor : theme.colors.fontColor};
  opacity: ${({ opacity = 1 }) => opacity};
  display: flex;
  gap: 10px;
  cursor: pointer;
`;

const MapSettingsIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
`;

const SettingsMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  width: 202px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.mainColor};
  color: ${({ theme }) => theme.colors.fontColor};
`;

type BaseMapOptionsMenuProps = {
  onDeleteBasemap: () => void;
  onCancel: () => void;
};

export const BaseMapOptionsMenu = ({
  onDeleteBasemap,
  onCancel,
}: BaseMapOptionsMenuProps) => {

  return (
        <SettingsMenuContainer>
          <MapSettingsItem
            customColor={color_accent_primary}
            opacity={0.8}
            onClick={onDeleteBasemap}
            // onClickOutside={() => {
            // }}
          >
            <MapSettingsIcon>
              <DeleteIcon fill={color_accent_primary} />
            </MapSettingsIcon>
            Delete map
          </MapSettingsItem>
        </SettingsMenuContainer>
  );
};

/*
      {showConfirmation && (
        <DeleteConfirmation
          onKeepHandler={onCancel}
          onDeleteHandler={onDeleteConfirmationHandler}
        >
          Delete map?
        </DeleteConfirmation>
      )}
*/
