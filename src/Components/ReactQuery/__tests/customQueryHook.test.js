import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react-hooks";
import axios from "axios";
import { createWrapper } from "../../../test-utils";
import { fetchMethod } from "../../../Utilies/utils";
import { useQueryCustomHook } from "../../Hooks/useQueryCustomHook";
import { useAddColor } from "../../Hooks/useTodoDetailsQuery";
const queryClient = new QueryClient();
jest.mock("axios");
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

    it('Should add a new color', async () => {
        fetchMethod.mockReturnValue({
            "data": {
                "label": "nirali",
                "id": 17
            },
            "status": 201,
            "statusText": "Created",
            "headers": {
                "cache-control": "no-cache",
                "content-length": "35",
                "content-type": "application/json; charset=utf-8",
                "expires": "-1",
                "location": "http://localhost:4000/colors/17",
                "pragma": "no-cache"
            },
            "config": {
                "transitional": {
                    "silentJSONParsing": true,
                    "forcedJSONParsing": true,
                    "clarifyTimeoutError": false
                },
                "transformRequest": [
                    null
                ],
                "transformResponse": [
                    null
                ],
                "timeout": 0,
                "xsrfCookieName": "XSRF-TOKEN",
                "xsrfHeaderName": "X-XSRF-TOKEN",
                "maxContentLength": -1,
                "maxBodyLength": -1,
                "env": {
                    "FormData": null
                },
                "headers": {
                    "Accept": "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                },
                "method": "post",
                "url": "http://localhost:4000/colors",
                "data": "{\"label\":\"nirali\"}"
            },
            "request": {}
        })

        const { result, waitFor } = renderHook(() => useAddColor(1, ()=>{}), { wrapper: createWrapper() });
        act(() => {
            result.current.mutate({ label: 'gulabi' })
        })
        await waitFor(() => result.current.isSuccess, { timeout: 4000 });
        console.log(result.current.data)
    })
})
