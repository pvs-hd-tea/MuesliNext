import React from "react";
import { createRoot, Root } from "react-dom/client";
import { render, act, screen, fireEvent } from "@testing-library/react";

import {
  DynamicValueWidget,
  DynamicValueComponent,
  DynamicValueWidgetData,
} from "./DynamicValueWidget";

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

it("fetches data", () => {
  act(() => {
    const widget = new DynamicValueWidget({
      data: { tableName: "a", columnName: "b", entryKey: "c" },
      readOnly: true,
    });
    container.appendChild(widget.render());
  });
  expect(container.textContent).toBe("a b c");
});

it("saves data", async () => {
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
  const tableNameInput = await screen.findByLabelText("table-name-input");
  console.log(tableNameInput);
  fireEvent.change(tableNameInput, { target: { value: "d" } });

  expect(data).toStrictEqual({
    tableName: "d",
    columnName: "b",
    entryKey: "c",
  });
});
