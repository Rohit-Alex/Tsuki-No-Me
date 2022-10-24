
import { render, screen, act, fireEvent, prettyDOM } from '@testing-library/react'
import '@testing-library/jest-dom'
import StateLocation from './StateLocation'
import { BrowserRouter } from 'react-router-dom'


window.matchMedia = window.matchMedia || (() => {
    return {
        matches: false,
        addListener() { },
        removeListener() { },
    }
})

// jest.mock('react-router-dom', () => ({
//     __esModule: true,
//     ...jest.requireActual('react-router-dom'),
//     useLocation: () => ({state: {isEditable: true}})
// }))

describe.skip('Testing react router with state and location all set to one thing', () => {
    it('When location is passed', () => {
        render(<BrowserRouter><StateLocation /></BrowserRouter>)
    })

    it('When location is not passed', () => {
        render(<BrowserRouter><StateLocation /></BrowserRouter>)
    })

})

// describe.skip('Testing react router with location and pathname being changed at each test', () => {
//     it('When location is passed', () => {
//         renderWithRouter(<StateLocation />, { route: '/loC?a=23' }, {isEditable: true})
//         console.log(screen.debug())
//     })

//     it('When location is not passed', () => {
//         renderWithRouter(<StateLocation />, { route: '/loC1/23' }, { isEditable: false })
//         console.log(screen.debug())

//     })

// })