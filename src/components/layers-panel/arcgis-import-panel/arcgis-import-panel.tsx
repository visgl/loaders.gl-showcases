import styled, { css, useTheme } from "styled-components";
import { RadioButton } from "../../radio-button/radio-button";
import { useEffect } from "react";
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
  ArcGisContent,
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

const TableHeaderRow = styled.tr``;

const TableHeaderItem = styled.th<{ width: number }>`
  width: ${({ width }) => `${width}px`};
  padding: 0;
`;

const TableRowItem = styled.td<{
  width: number;
  fontWeight: number | undefined;
}>`
  width: ${({ width }) => `${width}px`};
  padding: 0;
  ${({ fontWeight }) =>
    fontWeight !== undefined &&
    css`
      font-weight: ${fontWeight};
    `}
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

  type Column = {
    width: number;
    fontWeight?: number;
    dataColumnName?: ArcGisContentColumnName;
    sortDataColumnName?: ArcGisContentColumnName;
    columnName?: string;
  };

  const columns: Column[] = [
    {
      width: 44,
    },
    {
      width: 343,
      fontWeight: 700,
      dataColumnName: "title",
      columnName: "Title",
    },
    {
      width: 149,
      dataColumnName: "createdFormatted",
      sortDataColumnName: "created",
      columnName: "Date",
    },
  ];

  const renderHeaderCell = (column: Column): JSX.Element => {
    const sortDataColumnName =
      column.sortDataColumnName || column.dataColumnName;
    return (
      <TableHeaderItem
        width={column.width}
        key={sortDataColumnName ? sortDataColumnName : ""}
      >
        {typeof sortDataColumnName !== "undefined" && (
          <TitleCellContainer onClick={() => onSort(sortDataColumnName)}>
            {column.columnName || ""}
            <IconContainer enabled={sortColumn === sortDataColumnName}>
              <ExpandIcon
                expandState={ExpandState.expanded}
                collapseDirection={
                  sortAscending
                    ? CollapseDirection.top
                    : CollapseDirection.bottom
                }
                onClick={() => onSort(sortDataColumnName)}
                fillExpanded={theme.colors.buttonDimIconColor}
                width={6}
              />
            </IconContainer>
          </TitleCellContainer>
        )}
      </TableHeaderItem>
    );
  };

  const renderRowCell = (
    column: Column,
    contentItem: ArcGisContent,
    isRowSelected: boolean
  ): JSX.Element => {
    const dataColumnName = column.dataColumnName;
    return (
      <TableRowItem
        width={column.width}
        fontWeight={column.fontWeight}
        key={`${dataColumnName ? dataColumnName : ""}${contentItem.id}`}
      >
        <CellDiv>
          {dataColumnName ? (
            contentItem[dataColumnName]
          ) : (
            <Radio>
              <RadioButton
                id={contentItem.id}
                checked={isRowSelected}
                onChange={() => {
                  dispatch(setArcGisContentSelected(contentItem.id));
                }}
              />
            </Radio>
          )}
        </CellDiv>
      </TableRowItem>
    );
  };

  const theme = useTheme();
  return (
    <ModalDialog
      title={"Select map to import"}
      okButtonText={"Import Selected"}
      onConfirm={handleImport}
      onCancel={onCancel}
    >
      <SpinnerContainer visible={isLoading}>
        <LoadingSpinner />
      </SpinnerContainer>

      <Table>
        <TableHeader>
          <TableHeaderRow>
            {columns.map((column: Column) => renderHeaderCell(column))}
          </TableHeaderRow>
        </TableHeader>
        <TableContent>
          {arcGisContentArray.map((contentItem) => {
            const isRowSelected = arcGisContentSelected === contentItem.id;

            return (
              <TableRow
                key={contentItem.id}
                checked={isRowSelected}
                onClick={() => {
                  dispatch(setArcGisContentSelected(contentItem.id));
                }}
              >
                {columns.map((column: Column) =>
                  renderRowCell(column, contentItem, isRowSelected)
                )}
              </TableRow>
            );
          })}
        </TableContent>
      </Table>
    </ModalDialog>
  );
};
