/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-unnecessary-act */
import React from 'react'
import { render, screen, act, fireEvent, prettyDOM } from '@testing-library/react'
import '@testing-library/jest-dom'
import Miscellaneous from '../Miscellaneous'
import { callAfterTimeout } from '../../../Constant'
import { encrpytData } from '../../../Utilies/utils'


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

describe('Input', () => {
    it('Test input component', () => {
        render(<Miscellaneous />)
        const inputField = screen.getByPlaceholderText('SEARCH_RULE_NAME')
        act(() => {
            fireEvent.change(inputField, { target: { value: 'Debit' } })
        })
    })
})

describe('Testing constant functions', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    // jest.setTimeout(30000)
    it('Should test setTimeout fn', async () => {
        callAfterTimeout()
        // jest.runAllTimers()
        // jest.advanceTimersByTime(500);
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500);
    })
})

describe.only('EncryptData', () => {
    const sessionStorageMock = {
        getItem: jest.fn((key) => 'sessionVal'),
        setItem: jest.fn(),
        clear: jest.fn()
    };
    global.sessionStorage = sessionStorageMock;

    it('Should get data', () => {
        process.env.REACT_APP_DEVELOPER = "Random value2";
        const res = encrpytData('key', { payload: '' })
        console.log(res)
    })

})