import styled, { css, useTheme } from "styled-components";
import { RadioButton } from "../../radio-button/radio-button";
import { Fragment, useEffect, useState } from "react";
import { PanelHorizontalLine } from "../../common";
import SortDownIcon from "../../../../public/icons/arrow-down.svg";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { ModalDialog } from "../../modal-dialog/modal-dialog";
import {
  selectArcGisContent,
  selectArcGisContentSelected,
  selectSortAscending,
  selectSortColumn,
  selectStatus,
  setSortAscending,
  setSortColumn,
  setArcGisContentSelected,
  resetArcGisContentSelected,
} from "../../../redux/slices/arcgis-content-slice";
import { LoadingSpinner } from "../../loading-spinner/loading-spinner";

type InsertLayerProps = {
  onImport: (object: { name: string; url: string; token?: string }) => void;
  onCancel: () => void;
};

const SpinnerContainer = styled.div<{ visible: boolean }>`
  position: absolute;
  left: calc(50% - 22px);
  top: calc(50% - 22px);
  opacity: ${({ visible }) => (visible ? 1 : 0)};
`;

const Table = styled.div`
  width: 584px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  row-gap: 16px;
`;

const TableHeader = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: start;
  column-gap: 24px;
`;

const TableHeaderItem2 = styled.div`
  margin-left: 68px;
  width: 343px;
`;
const TableHeaderItem3 = styled.div`
  width: 149px;
`;

const TableRowItem1 = styled.div`
  width: 44px;
`;
const TableRowItem2 = styled.div`
  font-weight: 700;
  width: 343px;
`;
const TableRowItem3 = styled.div`
  width: 149px;
`;

const TableContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  row-gap: 8px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  overflow: auto;
  max-height: 300px;
`;

type ContainerProps = {
  checked: boolean;
};

const TableRow = styled.div<ContainerProps>`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  column-gap: 24px;

  background: transparent;
  cursor: pointer;
  ${({ checked }) =>
    checked &&
    css`
      background: ${({ theme }) => theme.colors.mainHiglightColor};
      box-shadow: 0px 17px 80px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    `}
  &:hover {
    background: ${({ theme }) => theme.colors.mainDimColor};
    box-shadow: 0px 17px 80px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
`;

const Radio = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 44px;
`;

const DateContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`;

const IconContainer = styled.div<{ enabled: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 2px;
  width: 16px;
  height: 16px;
  fill: ${({ theme }) => theme.colors.buttonDimIconColor};
  visibility: ${({ enabled }) => (enabled ? "visible" : "hidden")};
`;

export const ArcGisImportPanel = ({ onImport, onCancel }: InsertLayerProps) => {
  const dispatch = useAppDispatch();
  const arcGisContentArray = useAppSelector(selectArcGisContent);
  const arcGisContentSelected = useAppSelector(selectArcGisContentSelected);
  const sortAscending = useAppSelector(selectSortAscending);
  const sortColumn = useAppSelector(selectSortColumn);
  const loadingStatus = useAppSelector(selectStatus);

  const isLoading = loadingStatus === "loading";

  useEffect(() => {
    dispatch(resetArcGisContentSelected());
  }, []);

  const handleImport = () => {
    const arcGisItem = arcGisContentArray.find(
      (item) => item.id === arcGisContentSelected
    );
    if (arcGisItem) {
      onImport(arcGisItem);
    }
  };

  const onSort = (dataColumnName: string) => {
    if (sortColumn === dataColumnName) {
      dispatch(setSortAscending(!sortAscending));
    } else {
      dispatch(setSortColumn(dataColumnName));
    }
  };

  const formatDate = (date: number) => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
    return formatter.format(date);
  };

  const theme = useTheme();
  return (
    <ModalDialog
      title={"Select map to import"}
      okButtonText={"Import Selected"}
      onConfirm={handleImport}
      onCancel={onCancel}
    >
      <Table>
        <TableHeader>
          <TableHeaderItem2>
            <DateContainer onClick={() => onSort("title")}>
              Title
              <IconContainer enabled={sortColumn === "title"}>
                <SortDownIcon
                  fill={theme.colors.buttonDimIconColor}
                  transform={sortAscending ? "" : "rotate(180)"}
                />
              </IconContainer>
            </DateContainer>
          </TableHeaderItem2>

          <TableHeaderItem3>
            <DateContainer onClick={() => onSort("created")}>
              Date
              <IconContainer enabled={sortColumn === "created"}>
                <SortDownIcon
                  fill={theme.colors.buttonDimIconColor}
                  transform={sortAscending ? "" : "rotate(180)"}
                />
              </IconContainer>
            </DateContainer>
          </TableHeaderItem3>
        </TableHeader>
        <TableContent key={`${sortColumn}-${sortAscending}`}>
          <SpinnerContainer visible={isLoading}>
            <LoadingSpinner />
          </SpinnerContainer>

          {arcGisContentArray.map((contentItem) => {
            const isMapSelected = arcGisContentSelected === contentItem.id;

            return (
              <Fragment key={contentItem.id}>
                <TableRow
                  checked={isMapSelected}
                  onClick={() => {
                    dispatch(setArcGisContentSelected(contentItem.id));
                  }}
                >
                  <TableRowItem1>
                    <Radio>
                      <RadioButton
                        id={contentItem.id}
                        checked={isMapSelected}
                        onChange={() => {
                          dispatch(setArcGisContentSelected(contentItem.id));
                        }}
                      />
                    </Radio>
                  </TableRowItem1>
                  <TableRowItem2>{contentItem.title}</TableRowItem2>
                  <TableRowItem3>
                    {formatDate(contentItem.created)}
                  </TableRowItem3>
                </TableRow>
                <PanelHorizontalLine top={0} bottom={0} left={0} right={0} />
              </Fragment>
            );
          })}
        </TableContent>
      </Table>
    </ModalDialog>
  );
};
