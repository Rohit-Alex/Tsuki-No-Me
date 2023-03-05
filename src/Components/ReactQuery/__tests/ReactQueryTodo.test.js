import { BrowserRouter } from "react-router-dom";
import { renderWithClient } from "../../../test-utils";
import { useQueryCustomHook } from "../../../Hooks/useQueryCustomHook";
import ReactQueryTodo from "../ReactQueryTodo";
import { screen } from "@testing-library/react";

window.matchMedia =
  window.matchMedia ||
  (() => {
    return {
      matches: false,
      addListener() {},
      removeListener() {},
    };
  });
jest.mock("../../../Hooks/useQueryCustomHook");

describe("React Query -> queries", () => {
  beforeEach(() => {
    useQueryCustomHook.mockImplementation(() => ({ isLoading: true }));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should return the loading state", async () => {
    const mockedProductData = [
      {
        title: "Test Title",
        description: "Test Description",
        id: 123.45,
        category: "Test Category",
        image: "https://example.com/image.jpg",
      },
    ];
    const refetchMocked = jest.fn();
    useQueryCustomHook.mockImplementationOnce(() => ({
      isLoading: false,
      data: mockedProductData,
      isError: false,
      error: undefined,
      refetch: refetchMocked,
    }));
    renderWithClient(
      <BrowserRouter>
        <ReactQueryTodo />
      </BrowserRouter>
    );
    console.log(screen.debug());
  });
});
