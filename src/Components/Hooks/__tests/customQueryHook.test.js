import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react-hooks";
import { fetchMethod } from "../../../Utilies/utils";
import { createWrapper } from "../../ReactQuery/__tests/utils";
import { useQueryCustomHook } from "../useQueryCustomHook";
const queryClient = new QueryClient();

jest.mock('../../../Utilies/utils')

describe('Testing custom hooks of react query', () => {

    it('Should get data of todos from api',async () => {
        fetchMethod.mockReturnValue({
            data: ['1', '2', '3']
        })
        const { result, waitFor } = renderHook(() => useQueryCustomHook(), { wrapper: createWrapper() });

        await waitFor(() => result.current.isSuccess);

        expect(result.current.data).toEqual(['1','2','3']);
        
    })
})
