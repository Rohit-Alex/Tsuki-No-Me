import { act, renderHook } from "@testing-library/react-hooks";
import axios from "axios";
import { createWrapper } from "../../test-utils";
import { useAddColorHook, useFetchColorHook } from "./usePaginationReactQuery";
jest.mock("axios");

describe("Testing custom hooks of react query", () => {
  it("Should get colors from api", async () => {
    (axios.get as jest.Mock).mockReturnValue({
      data: [
        { id: 1, label: "Black" },
        { id: 2, label: "Red" },
      ],
    });
    const { result, waitFor } = renderHook(() => useFetchColorHook(1), {
      wrapper: createWrapper(),
    });
    await waitFor(() => result.current.isSuccess);
    expect(result.current.data).toStrictEqual({
      data: [
        { id: 1, label: "Black" },
        { id: 2, label: "Red" },
      ],
    });
  });

  it("Should add a new color and make use of cached data", async () => {
    (axios.post as jest.Mock).mockReturnValue({
      data: [{ label: "Grey", id: 23 }],
    });
    const { result, waitFor } = renderHook(() => useAddColorHook(1), {
      wrapper: createWrapper(["colors", 1], {
        data: [
          { label: "Grey", id: 1 },
          { label: "Black", id: 2 },
        ],
      }),
    });
    await act(() => {
      result.current.mutate({ label: "Grey" });
    });
    await waitFor(() => result.current.isSuccess);
  });

  it("Should add a new color with no cached data", async () => {
    (axios.post as jest.Mock).mockReturnValue({
      data: [{ label: "Grey", id: 23 }],
    });
    const { result, waitFor } = renderHook(() => useAddColorHook(1), {
      wrapper: createWrapper(),
    });
    await act(() => {
      result.current.mutate({ label: "Grey" });
    });
    await waitFor(() => result.current.isSuccess);
  });

  it("Should handle errors while adding color", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error("Server Error"));
    const { result, waitFor } = renderHook(() => useAddColorHook(1), {
      wrapper: createWrapper(),
    });
    await act(() => {
      result.current.mutate({ label: "Grey" });
    });
    await waitFor(() => result.current.isError);
  });
});
