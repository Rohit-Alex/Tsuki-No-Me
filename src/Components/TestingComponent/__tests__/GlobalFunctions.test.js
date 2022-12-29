/* eslint-disable testing-library/no-unnecessary-act */

import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { encrpytData } from "Utilies/utils";
import GlobalFunctions from "../GlobalFunctions";

window.matchMedia =
    window.matchMedia ||
    (() => {
        return {
            matches: false,
            addListener() { },
            removeListener() { },
        };
    });

    describe('Global Functions', () => {
        let consoleSpied
        beforeAll(() => {
            consoleSpied = jest.spyOn(console, 'log')
        })
        
        beforeEach(()=> {
            consoleSpied.mockClear()
        })

        it('Should set values in local storage', () => {
            render(<GlobalFunctions />)
            const setItemBtn = screen.getByRole("button", { name: /Set_Item/i });
            fireEvent.click(setItemBtn)
        })

        it('Should get values from local storage', () => {
            render(<GlobalFunctions />)
            const getItemBtn = screen.getByRole("button", { name: /Get_Item/i });
            fireEvent.click(getItemBtn)
            expect(screen.getByRole('heading', {name: 'lose_yourself'})).toBeInTheDocument()
        })

        it('Should spy console log', () => {
            render(<GlobalFunctions />)
            const consoleBtn = screen.getByRole("button", { name: /console/i });
            fireEvent.click(consoleBtn)
            expect(consoleSpied).toBeCalled()
        })

        it('Should change console log to console warn', () => {
            consoleSpied.mockImplementation((a) => console.warn(a))
            render(<GlobalFunctions />)
            const consoleBtn = screen.getByRole("button", { name: /console/i });
            fireEvent.click(consoleBtn)
            expect(consoleSpied).toBeCalled()
        })

        it('Should not spy console log', () => {
            consoleSpied.mockRestore()
            render(<GlobalFunctions />)
            const consoleBtn = screen.getByRole("button", { name: /console/i });
            fireEvent.click(consoleBtn)
        })
        

        it('Should encrypt data using session storage', () => {
            sessionStorage.setItem('some_key', 'some_value')
            const res = encrpytData('some_key')
            expect(res).toStrictEqual({ res: 'some_value', status: 'success' })
        })
    })