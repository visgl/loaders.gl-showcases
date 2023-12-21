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
  setArcGisContentSelected,
  resetArcGisContentSelected,
  setSortOrder,
} from "../../../redux/slices/arcgis-content-slice";

type InsertLayerProps = {
  onImport: (object: { name: string; url: string; token?: string }) => void;
  onCancel: () => void;
};

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
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 2px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  fill: ${({ theme }) => theme.colors.buttonDimIconColor};
`;

export const ArcGisImportPanel = ({ onImport, onCancel }: InsertLayerProps) => {
  const dispatch = useAppDispatch();
  const arcGisContentArray = useAppSelector(selectArcGisContent);
  const arcGisContentSelected = useAppSelector(selectArcGisContentSelected);
  const [sortDateOrder, setSortDateOrder] = useState(false);

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

  const onSort = () => {
    setSortDateOrder((prevValue) => !prevValue);
    dispatch(setSortOrder(sortDateOrder));
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
          <TableHeaderItem2>Title</TableHeaderItem2>
          <TableHeaderItem3>
            <DateContainer>
              Date
              <IconContainer onClick={onSort}>
                <SortDownIcon
                  fill={theme.colors.buttonDimIconColor}
                  transform={sortDateOrder ? "" : "rotate(180)"}
                />
              </IconContainer>
            </DateContainer>
          </TableHeaderItem3>
        </TableHeader>
        <TableContent key={`${sortDateOrder}`}>
          {arcGisContentArray.map((contentItem) => {
            const isMapSelected = arcGisContentSelected === contentItem.id;

            return (
              <Fragment key={contentItem.name}>
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
                  <TableRowItem2>{contentItem.name}</TableRowItem2>
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
