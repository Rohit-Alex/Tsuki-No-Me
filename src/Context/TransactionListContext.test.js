/* eslint-disable testing-library/no-unnecessary-act */
import React from 'react'

import '@testing-library/jest-dom'
import { renderHook, act } from '@testing-library/react-hooks'
import { TransactionSearchProvider, useTransactionSearchContext } from './TransactionListContext'
import { ApiLocations, notificationHandler, POST } from '../Utilies/utils'

jest.mock('../Utilies/utils')

window.matchMedia =
    window.matchMedia ||
    (() => {
        return {
            matches: false,
            addListener() { },
            removeListener() { },
        }
    })

describe('Transaction context test cases', () => {
    let wrapper
    const GET_URL_SAMPLE =
        'https://seller-platforms-dev.osmos.services/seller_settlements/audit/v1/events'

    beforeEach(() => {
        notificationHandler.mockReturnValue('')
        wrapper = ({ children }) => <TransactionSearchProvider>{children}</TransactionSearchProvider>
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('Should load the default values', async () => {
        const { result } = renderHook(() => useTransactionSearchContext(), {
            wrapper
        })
        expect(result.current.isLoading).toBe(false)
        expect(result.current.transactionData).toStrictEqual([])
        expect(result.current.pagination).toStrictEqual({})
    })

    it('Should call post method on calling getTransactionSearch', async () => {
        ApiLocations.GET_TRANSACTION_SEARCH = jest
            .fn()
            .mockImplementationOnce(() => [null, GET_URL_SAMPLE])

        POST.mockReturnValue({
            data: {
                transactions: ['some random value1', 'some random value 2'],
                pagination: { totalPages: 2 }
            }
        })

        const { result } = await renderHook(() => useTransactionSearchContext(), {
            wrapper
        })

        await act(async () => {
            await result.current.getTransactionSearch()
        })
        expect(POST).toHaveBeenCalledTimes(1)
        expect(result.current.pagination).toStrictEqual({ totalPages: 2 })
    })

    it('Should return error if constructing URl is failed', async () => {
        const error = {
            code: 'INVALID',
            message: 'Invalid Name',
        }

        ApiLocations.GET_TRANSACTION_SEARCH = jest.fn().mockImplementationOnce(() => [error, null])

        const { result } = await renderHook(() => useTransactionSearchContext(), {
            wrapper,
        })

        await act(async () => {
            await result.current.getTransactionSearch()
        })

        expect(notificationHandler).toHaveBeenCalledTimes(1)
    })

    it('Should reset data on calling of reset function', async () => {
        const { result } = await renderHook(() => useTransactionSearchContext({ initialData: { transactionData: ['some random value'], pagination: { totalPages: 20 } } }), {
            wrapper
        })
        await act(async () => {
            await result.current.resetDataOnSearch()
        })

        expect(result.current.transactionData).toStrictEqual([])
        expect(result.current.pagination).toStrictEqual({})
    })
})

