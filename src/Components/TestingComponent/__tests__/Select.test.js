import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import SelectWrapper from '../Select'


window.matchMedia = window.matchMedia || (() => {
    return {
        matches: false,
        addListener() { },
        removeListener() { },
    }
})

describe('Select test case', () => {
    it('Should render select box and filter the option based on input content', async () => {
        render(<SelectWrapper />)
        const selectInputContainer = screen.getAllByRole('combobox')[0]
        fireEvent.change(selectInputContainer, { target: { value: 'Tra' } }); 
        const selectContainer = document.querySelector('.ant-select-selector')
        await fireEvent.mouseDown(selectContainer);
        const selectedOption = screen.getAllByText('Trace Id')[0]
        fireEvent.click(selectedOption)
    })
})