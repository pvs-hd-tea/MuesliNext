import React from "react";
import { createRoot, Root } from "react-dom/client";
import { act } from "@testing-library/react";

import Text from "./TextWidget";

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
  act(() => {
    root.render(<Text text="Hello" />);
  });
  expect(container.textContent).toBe("Hello");

  act(() => {
    root.render(<Text text="%%&&§§!!??" />);
  });
  expect(container.textContent).toBe("%%&&§§!!??");
});
