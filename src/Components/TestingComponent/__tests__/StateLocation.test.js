
import { render, screen, act, fireEvent, prettyDOM } from '@testing-library/react'
import '@testing-library/jest-dom'
import StateLocation from '../StateLocation'
import { BrowserRouter, useLocation } from 'react-router-dom'


window.matchMedia = window.matchMedia || (() => {
    return {
        matches: false,
        addListener() { },
        removeListener() { },
    }
})

jest.mock('react-router-dom', () => ({
    __esModule: true,
    ...jest.requireActual('react-router-dom'),
    // useLocation: () => ({state: {isEditable: true}})
    useLocation: jest.fn()
}))

describe('Testing react router with location and pathname being changed at each test', () => {
    it('When location is passed', () => {
        useLocation.mockReturnValue({ state: { isEditable: true } })
        render(<BrowserRouter><StateLocation /></BrowserRouter>)
    })

    it('When location is not passed', () => {
        // useLocation.mockReturnValue({})
        jest.resetAllMocks()
        render(<BrowserRouter><StateLocation /></BrowserRouter>)
    })

})
