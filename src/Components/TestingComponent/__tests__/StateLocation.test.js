import {
  render,
  screen,
  act,
  fireEvent,
  prettyDOM,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import StateLocation from "../StateLocation";
import { BrowserRouter, useLocation } from "react-router-dom";

window.matchMedia =
  window.matchMedia ||
  (() => {
    return {
      matches: false,
      addListener() {},
      removeListener() {},
    };
  });

jest.mock("react-router-dom", () => ({
  __esModule: true,
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

describe("Testing react router with location and pathname being changed at each test", () => {
  it("When location is passed", () => {
    useLocation.mockReturnValue({ state: { isEditable: true } });
    render(
      <BrowserRouter>
        <StateLocation />
      </BrowserRouter>
    );
  });

  it("When location is not passed", () => {
    // useLocation.mockReturnValue({})
    jest.resetAllMocks();
    render(
      <BrowserRouter>
        <StateLocation />
      </BrowserRouter>
    );
  });
});

describe("using chatgpt", () => {
  jest.mock("react-router-dom", () => {
    return {
      useLocation: jest.fn(),
    };
  });

  describe("StateLocation", () => {
    test('renders "Edit" when isEditable is true', () => {
      useLocation.mockReturnValue({ state: { isEditable: true } });

      const { getByText } = render(<StateLocation />);
      const editText = getByText(/edit/i);

      expect(editText).toBeInTheDocument();
    });

    test('renders "Add" when isEditable is false', () => {
      useLocation.mockReturnValue({ state: { isEditable: false } });

    const { getByText } = render(<StateLocation />);
    const addText = getByText(/add/i);

      expect(addText).toBeInTheDocument();
    });

    test('renders "Add" when isEditable is not passed in', () => {
      useLocation.mockReturnValue({ state: {} });

      const { getByText } = render(<StateLocation />);
      const addText = getByText(/edit/i);

      expect(addText).toBeInTheDocument();
    });
  });
});
