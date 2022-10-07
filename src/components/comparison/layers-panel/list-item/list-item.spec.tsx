import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import { ExpandState, ListItemType } from "../../../../types";
import { renderWithTheme } from "../../../../utils/testing-utils/render-with-theme";
import { ListItem } from "./list-item";

describe("List Item", () => {
  const onClick = jest.fn();
  const onOptionsClick = jest.fn();
  const onExpandClick = jest.fn();

  it("Should render list item wrapper with Title", () => {
    renderWithTheme(
      <ListItem
        id="test-id"
        title={"Main title"}
        selected={true}
        expandState={ExpandState.expanded}
        onOptionsClick={onOptionsClick}
        onExpandClick={onExpandClick}
        onClick={onClick}
        optionsContent={<div>{"Hello world"}</div>}
        listItemType={ListItemType.Radio}
      />
    );
    const title = screen.getByText("Main title");
    expect(title).toBeInTheDocument();
  });

  it("Should render list item wrapper with Radio Button", () => {
    renderWithTheme(
      <ListItem
        id="test-id"
        title={"Main title"}
        selected={true}
        expandState={ExpandState.expanded}
        onOptionsClick={onOptionsClick}
        onExpandClick={onExpandClick}
        onClick={onClick}
        optionsContent={<div>{"Hello world"}</div>}
        listItemType={ListItemType.Radio}
      />
    );
    const radioButton = document.querySelector("#radio-button-test-id");
    radioButton && userEvent.click(radioButton);
    expect(onClick).toHaveBeenCalled();
  });

  it("Should render list item wrapper with Checkbox", () => {
    renderWithTheme(
      <ListItem
        id="test-id"
        title={"Main title"}
        selected={true}
        expandState={ExpandState.expanded}
        onOptionsClick={onOptionsClick}
        onExpandClick={onExpandClick}
        onClick={onClick}
        optionsContent={<div>{"Hello world"}</div>}
        listItemType={ListItemType.Checkbox}
      />
    );

    const checkbox = document.querySelector("#checkbox-test-id");
    checkbox && userEvent.click(checkbox);
    expect(onClick).toHaveBeenCalled();
  });

  it("Should render list item wrapper with Icon", () => {
    renderWithTheme(
      <ListItem
        id="test-id"
        title={"Main title"}
        selected={true}
        expandState={ExpandState.expanded}
        onOptionsClick={onOptionsClick}
        onExpandClick={onExpandClick}
        onClick={onClick}
        optionsContent={<div>{"Icon"}</div>}
        listItemType={ListItemType.Icon}
        usePopoverForOptions={false}
      />
    );

    const icon = screen.getByText("Icon");
    expect(icon).toBeInTheDocument();
    icon && userEvent.click(icon);
    expect(onClick).toHaveBeenCalled();
  });

  it("Should be able to expand/collapse", () => {
    renderWithTheme(
      <ListItem
        id="test-id"
        title={"Main title"}
        selected={true}
        expandState={ExpandState.expanded}
        onOptionsClick={onOptionsClick}
        onExpandClick={onExpandClick}
        onClick={onClick}
        optionsContent={<div>{"Hello world"}</div>}
        listItemType={ListItemType.Radio}
      />
    );

    const optionsIcon = document.querySelector("#test-id");
    const expandIcon = document.querySelector("svg");
    expect(expandIcon).not.toBeNull();

    expandIcon && userEvent.click(expandIcon);
    expect(onExpandClick).toHaveBeenCalledTimes(1);
    expect(optionsIcon).not.toBeNull();
    optionsIcon && userEvent.click(optionsIcon);
    expect(onOptionsClick).toHaveBeenCalledTimes(1);
  });

  it("Should be able to render children", () => {
    renderWithTheme(
      <ListItem
        id="test-id"
        title={"Main title"}
        selected={true}
        expandState={ExpandState.expanded}
        onOptionsClick={onOptionsClick}
        onExpandClick={onExpandClick}
        onClick={onClick}
        optionsContent={<div>{"Hello world"}</div>}
        listItemType={ListItemType.Radio}
      >
        <ListItem
          id="child-test-id"
          title={"Child title"}
          parentId={"test-id"}
          selected={true}
          expandState={ExpandState.expanded}
          onOptionsClick={onOptionsClick}
          onExpandClick={onExpandClick}
          onClick={onClick}
          optionsContent={<div>{"Hello world"}</div>}
          listItemType={ListItemType.Radio}
        />
      </ListItem>
    );

    const children = screen.getByText("Child title");
    expect(children).toBeInTheDocument();
  });
});
