import styled, { css, useTheme } from "styled-components";
import { RadioButton } from "../../radio-button/radio-button";
import { Fragment, useEffect } from "react";
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
import {
  ArcGisContentColumnName,
  ExpandState,
  CollapseDirection,
} from "../../../types";
import { LoadingSpinner } from "../../loading-spinner/loading-spinner";
import { ExpandIcon } from "../../expand-icon/expand-icon";

const SpinnerContainer = styled.div<{ visible: boolean }>`
  position: absolute;
  left: calc(50% - 22px);
  top: calc(50% - 22px);
  opacity: ${({ visible }) => (visible ? 1 : 0)};
`;

const Table = styled.table`
  width: 584px;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.secondaryFontColor};
  overflow: hidden;
`;

const TableHeaderItem1 = styled.th`
  width: 44px;
  padding: 0;
`;
const TableHeaderItem2 = styled.th`
  width: 343px;
  padding: 0;
`;
const TableHeaderItem3 = styled.th`
  width: 149px;
  padding: 0;
`;

const TableRowItem1 = styled.td`
  width: 44px;
  padding: 0;
`;
const TableRowItem2 = styled.td`
  width: 343px;
  padding: 0;
  font-weight: 700;
`;
const TableRowItem3 = styled.td`
  width: 149px;
  padding: 0;
`;

const CellDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  margin: 8px 0 8px 0;
  height: 44px;
`;

const TableContent = styled.tbody`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  overflow: auto;
  max-height: 300px;
`;

const TableRow = styled.tr<{ checked: boolean }>`
  background: transparent;
  cursor: pointer;
  border: 0;
  border-style: solid;
  border-bottom: 1px solid
    ${({ theme }) => `${theme.colors.mainHiglightColorInverted}1f`};
  border-radius: 1px;

  ${({ checked }) =>
    checked &&
    css`
      > * > :first-child {
        background: ${({ theme }) => theme.colors.mainHiglightColor};
      }
      > :first-child > :first-child {
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
      }
      > :last-child > :first-child {
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
      }

      box-shadow: 0px 17px 80px rgba(0, 0, 0, 0.1);
    `}
  &:hover {
    > * > :first-child {
      background: ${({ theme }) => theme.colors.mainDimColor};
    }
    > :first-child > :first-child {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }
    > :last-child > :first-child {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }

    box-shadow: 0px 17px 80px rgba(0, 0, 0, 0.1);
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

const TitleCellContainer = styled.div`
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
  margin-top: 2px;
  width: 16px;
  height: 16px;
  fill: ${({ theme }) => theme.colors.buttonDimIconColor};
  visibility: ${({ enabled }) => (enabled ? "visible" : "hidden")};
`;

type InsertLayerProps = {
  onImport: (object: { name: string; url: string; token?: string }) => void;
  onCancel: () => void;
};

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

  const onSort = (dataColumnName: ArcGisContentColumnName) => {
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
          <TableHeaderItem1></TableHeaderItem1>
          <TableHeaderItem2>
            <TitleCellContainer onClick={() => onSort("title")}>
              Title
              <IconContainer enabled={sortColumn === "title"}>
                <ExpandIcon
                  expandState={ExpandState.expanded}
                  collapseDirection={
                    sortAscending
                      ? CollapseDirection.top
                      : CollapseDirection.bottom
                  }
                  onClick={() => onSort("title")}
                  fillExpanded={theme.colors.buttonDimIconColor}
                  width={6}
                />
              </IconContainer>
            </TitleCellContainer>
          </TableHeaderItem2>

          <TableHeaderItem3>
            <TitleCellContainer onClick={() => onSort("created")}>
              Date
              <IconContainer enabled={sortColumn === "created"}>
                <ExpandIcon
                  expandState={ExpandState.expanded}
                  collapseDirection={
                    sortAscending
                      ? CollapseDirection.top
                      : CollapseDirection.bottom
                  }
                  onClick={() => onSort("created")}
                  fillExpanded={theme.colors.buttonDimIconColor}
                  width={6}
                />
              </IconContainer>
            </TitleCellContainer>
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
                    <CellDiv>
                      <Radio>
                        <RadioButton
                          id={contentItem.id}
                          checked={isMapSelected}
                          onChange={() => {
                            dispatch(setArcGisContentSelected(contentItem.id));
                          }}
                        />
                      </Radio>
                    </CellDiv>
                  </TableRowItem1>

                  <TableRowItem2>
                    <CellDiv>{contentItem.title}</CellDiv>
                  </TableRowItem2>
                  <TableRowItem3>
                    <CellDiv>{formatDate(contentItem.created)}</CellDiv>
                  </TableRowItem3>
                </TableRow>
              </Fragment>
            );
          })}
        </TableContent>
      </Table>
    </ModalDialog>
  );
};
