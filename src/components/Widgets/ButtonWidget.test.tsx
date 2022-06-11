import React from "react";
import { unmountComponentAtNode } from "react-dom";
import { createRoot, Root } from "react-dom/client";
import { act, fireEvent, getByText } from "@testing-library/react";

import Button from "./ButtonWidget";

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

it("renders with text", () => {
  const voidFunction = () => {
    return;
  };
  act(() => {
    root.render(<Button text="Hello" onClick={voidFunction} />);
  });
  expect(container.textContent).toBe("Hello");

  act(() => {
    root.render(<Button text="%%&&§§!!??" onClick={voidFunction} />);
  });
  expect(container.textContent).toBe("%%&&§§!!??");
});

it("runs onClick", () => {
  const mockCallBack = jest.fn();
  act(() => {
    root.render(<Button text="uniqueButton" onClick={mockCallBack} />);
  });
  fireEvent(
    getByText(container, "uniqueButton"),
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    })
  );
  expect(mockCallBack).toBeCalledTimes(1);
});
