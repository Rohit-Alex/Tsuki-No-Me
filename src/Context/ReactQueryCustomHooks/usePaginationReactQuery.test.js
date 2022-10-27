import { act, renderHook } from "@testing-library/react-hooks";
import axios from "axios";
import { createWrapper } from "../../test-utils";
import { useAddColorHook, useFetchColorHook } from "./usePaginationReactQuery";
jest.mock("axios");

describe('Testing custom hooks of react query', () => {
    it('Should get colors from api', async () => {
        axios.get.mockReturnValue({
            data: [
                {
                    "id": 1,
                    "label": "Black"
                },
                {
                    "id": 2,
                    "label": "Red"
                }
            ]
        })
        const { result, waitFor } = renderHook(() => useFetchColorHook(1), { wrapper: createWrapper() });
        await waitFor(() => result.current.isSuccess);
        expect(result.current.data).toStrictEqual({ "data": [{ "id": 1, "label": "Black" }, { "id": 2, "label": "Red" }] });
    })

    it('Should add a new color', async () => {
        axios.post.mockReturnValue({data: [{label: 'Grey', id: 23}]})
        const { result, waitFor } = renderHook(() => useAddColorHook(1), { wrapper: createWrapper() });
        await act(() => {
            result.current.mutate({ label: 'Grey' })
        })
        await waitFor(() => result.current.isSuccess);
    })

    it('Should handle errors while adding color', async () => {
        axios.post.mockRejectedValueOnce()
        const { result, waitFor } = renderHook(() => useAddColorHook(1), { wrapper: createWrapper() });
        await act(() => {
            result.current.mutate({ label: 'Grey' })
        })
        await waitFor(() => result.current.isError);
    })
})
