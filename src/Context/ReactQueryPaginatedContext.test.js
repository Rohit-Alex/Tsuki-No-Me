/* eslint-disable testing-library/no-unnecessary-act */
import React from 'react'

import '@testing-library/jest-dom'
import { ReactPaginatedQueryProvider, useReactPaginatedQueryContext } from './ReactQueryPaginatedContext'
import { renderHook } from "@testing-library/react-hooks";
import { useFetchColorHook } from './ReactQueryCustomHooks/usePaginationReactQuery';


window.matchMedia =
    window.matchMedia ||
    (() => {
        return {
            matches: false,
            addListener() { },
            removeListener() { },
        }
    })

jest.mock("./ReactQueryCustomHooks/usePaginationReactQuery");

describe('Transaction context test cases', () => {
    let wrapper

    beforeEach(() => {
        wrapper = ({ children }) => <ReactPaginatedQueryProvider>{children}</ReactPaginatedQueryProvider>
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('Should load the default values', async () => {
        const mockedColorData = [{
            label: 'Red',
            id: 23
        }];
        useFetchColorHook.mockImplementationOnce(() => ({ isLoading: false, data: mockedColorData }));
        const { result, waitFor } = renderHook(() => useReactPaginatedQueryContext(), {
            wrapper
        })
        await waitFor(() => result.current.isSuccess);
        expect(result.current.data).toStrictEqual([{
            label: 'Red',
            id: 23
        }]);
        expect(result.current.pageSize).toBe(2)
        expect(result.current.page).toBe(1)
    })

})

