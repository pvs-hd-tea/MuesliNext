import React from "react";
import { createRoot, Root } from "react-dom/client";
import { render, act, screen, fireEvent } from "@testing-library/react";

import {
  DynamicValueWidget,
  DynamicValueComponent,
  DynamicValueWidgetData,
} from "./DynamicValueWidget";
import LocalDataService from "../../data/services/localDataService";

let container: HTMLDivElement;
let root: Root;
beforeEach(() => {
  // setup
  container = document.createElement("div");
  root = createRoot(container);
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  act(() => {
    root.unmount();
    container.remove();
  });
});

it("fetches data", async () => {
  jest
    .spyOn(LocalDataService.prototype, "fetchTableTableItemByName")
    .mockImplementation((name, column, key) =>
      Promise.resolve(`${name} ${column} ${key}`)
    );
  act(() => {
    const widget = new DynamicValueWidget({
      data: { tableName: "a", columnName: "b", entryKey: "c" },
      readOnly: true,
    });
    container.appendChild(widget.render());
  });
  await new Promise((resolve) => setTimeout(resolve, 100));
  expect(container.textContent).toBe("a b c");
});

it("saves data", async () => {
  jest
    .spyOn(LocalDataService.prototype, "fetchTableTableItemByName")
    .mockImplementation(() => Promise.resolve("fetchedValue"));
  let data = { tableName: "a", columnName: "b", entryKey: "c" };
  const onDataChange = (newData: DynamicValueWidgetData) => {
    data = {
      ...newData,
    };
  };
  render(
    <DynamicValueComponent
      onDataChange={onDataChange}
      initData={data}
      readOnly={false}
    />
  );

  await new Promise((resolve) => setTimeout(resolve, 100));
  const tableNameInput = await screen.findByLabelText("table-name-input");
  fireEvent.change(tableNameInput, { target: { value: "d" } });

  await new Promise((resolve) => setTimeout(resolve, 100));

  expect(data).toStrictEqual({
    tableName: "d",
    columnName: "b",
    entryKey: "c",
    value: "fetchedValue",
  });
});
