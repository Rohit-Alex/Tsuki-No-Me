import { render, screen, act, fireEvent, prettyDOM, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Widget from './widget2'


window.matchMedia = window.matchMedia || (() => {
    return {
        matches: false,
        addListener() { },
        removeListener() { },
    }
})

describe('Testing tooltip and card', () => {
    it ('Should cover tooltip', async () => {
        render(<Widget />)
        const tooltipDiv = screen.getAllByRole('img', {name: 'info-circle'})[0]
        fireEvent.mouseOver(tooltipDiv)
        expect(await screen.findByText("SALES_IN_PROGRESS_TOOLTIP")).toBeInTheDocument();
    })
})