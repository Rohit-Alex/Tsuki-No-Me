/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-unnecessary-act */
import React from 'react'
import { render, screen, act, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Miscellaneous from '../Miscellaneous'
import * as Constant from "../../../Constant"
import { ApiLocations, getTokenFromMemCache, sayHello, TokenExtractor } from '../../../Utilies/utils'
// import jwt from 'jsonwebtoken'
import debounce from 'lodash/debounce'
jest.mock('node-cache')
jest.useFakeTimers()
// jest.mock("../../../Utilies/utils", () => ({
//     __esModule: true,
//     ...jest.requireActual("../../../Utilies/utils"),
// }));

jest.mock('node-cache', () => function NodeCache() {
    const cachedObj = { testingKey: 'testingValue' }
    this.get = function (key) {
        return cachedObj[key]
    }
})
describe('Mg Backend tricky test', () => {

    // it('Should extract token', () => {
    //     const nextFn = jest.fn()
    //     const token = jwt.sign({ aud: 'randomvalue', data: { seller_code: 343 } }, 'secret', { expiresIn: '1min' });
    //     process.env.GSC_AUDIENCE = "randomvalue";
    //     TokenExtractor({ headers: { authorization: `Bearer ${token}` } }, undefined, nextFn)
    //     expect(nextFn).toHaveBeenCalledTimes(1)
    // })

    it('Should return null if no key is found', () => {
        const response = getTokenFromMemCache('myKey')
        expect(response).toBe(null)
    })

    it('Should get value from memCache', () => {
        const response = getTokenFromMemCache('testingKey')
        expect(response).toBe('testingValue')
    })

})


window.matchMedia = window.matchMedia || (() => {
    return {
        matches: false,
        addListener() { },
        removeListener() { },
    }
})
describe('Date Picker', () => {
    it('Test Date Picker component', async () => {
        render(<Miscellaneous />)
        //select start date from calender(start date)
        const startDate = screen.getByPlaceholderText('SEARCH_START_DATE_PLACEHOLDER')
        fireEvent.mouseDown(startDate)
        fireEvent.change(startDate, { target: { value: "2020-12-20" } });
        await act(async () => {
            fireEvent.click(document.querySelectorAll(".ant-picker-cell-selected")[0]);
        })

        const endDate = screen.getByPlaceholderText("SEARCH_END_DATE_PLACEHOLDER");
        await fireEvent.mouseDown(endDate);
        await fireEvent.change(endDate, { target: { value: "2023-02-20" } });
        await act(async () => {
            fireEvent.click(document.querySelectorAll(".ant-picker-cell-selected")[1]);
        })
    })

    it('Should clear Start date', async () => {
        render(<Miscellaneous />)
        const startDate = screen.getByPlaceholderText('SEARCH_START_DATE_PLACEHOLDER')
        fireEvent.mouseOver(startDate)
        const closeIcon = (screen.getAllByRole('img', { name: 'close-circle' })[0])?.parentElement
        await act(async () => {
            await fireEvent.mouseUp(closeIcon)
        })
    })
})

describe.only('Lodash', () => {
    afterEach(() => {
        jest.clearAllTimers(); // Clear all timers after each test
        jest.restoreAllMocks(); // Restore all mocks after each test
    });

    it('should debounce the search input', async () => {
        const consoleSpy = jest.spyOn(console, 'log');
        const debounceMock = jest.fn((fn, timeout) => {
            return function debounced(...args) {
                const context = this;
                clearTimeout(debounced.timeoutId);
                debounced.timeoutId = setTimeout(() => fn.apply(context, args), timeout);
            };
        });

        jest.doMock('lodash/debounce', () => debounceMock);

        const { getByPlaceholderText } = render(<Miscellaneous />);
        const input = getByPlaceholderText('SEARCH_RULE_NAME');

        fireEvent.change(input, { target: { value: 'search term' } });
        fireEvent.change(input, { target: { value: 'search term2' } });
        fireEvent.change(input, { target: { value: 'search term3' } });

        expect(debounceMock).toHaveBeenCalledTimes(3);
        expect(debounceMock).toHaveBeenLastCalledWith(expect.any(Function), 400);

        act(() => {
            jest.runAllTimers(); // Fast-forward all timers
        });

        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledWith('inside debounce after 400', 'search term3');
    });
});


describe('Testing constant functions', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    // jest.setTimeout(30000)
    it('Should test setTimeout fn', async () => {
        Constant.callAfterTimeout()
        // jest.runAllTimers()
        // jest.advanceTimersByTime(500);
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500);
    })

    it('Testing url formation', () => {
        ApiLocations.GET_ONE = jest.fn().mockReturnValue('someRandomUrl.com')
        console.log(ApiLocations.GET_TRACE_DETAILS())
    })

    it('Should capitalize first character', () => {
        const res = sayHello('rohit')
        expect(res).toBe('Hi, Rohit')
    })

    it('Should not capitalize first character', () => {
        Constant.IS_CAPITALIZE = false
        const res = sayHello('rohit')
        expect(res).toBe('Hi, rohit')
    })
})

