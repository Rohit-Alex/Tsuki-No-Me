import { fireEvent, render, screen } from "@testing-library/react"
import { act } from "react-dom/test-utils"
import { getOptions } from "Utilies/utils"
import AllInOne from "../AllInOne"

jest.mock('Utilies/utils')

describe('All In One', () => {
    beforeEach(() => {
        // setupIntersectionObserverMock()
        getOptions.mockResolvedValue([{ label: 'option1', value: 'option2' }])
    })
    afterEach(() => {

    })

    it('Should select entity1', async () => {
        render(<AllInOne />)
        const entity1Ctn = screen.getByRole('button', {
            name: /select entity 1/i
        })
        await act(async () => {
            await fireEvent.click(entity1Ctn)
        })
        const sellerOpt = screen.getByRole('button', { name: /seller/i })
        await act(async () => {
            await fireEvent.click(sellerOpt)
        })
        expect(sellerOpt).toBeInTheDocument()
    })

    it('Should not be able to select entity2 till entity1 is selected', () => {
        render(<AllInOne />)
        const entity2Ctn = screen.getByRole('button', {
            name: /select entity 2/i
        })
        expect(entity2Ctn).toBeDisabled()
    })

    it('Should be able to select to entity2 by loading more options', async () => {
        render(<AllInOne />)
        getOptions.mockImplementation((page) => Promise.resolve(new Array(20).fill(0).map((_, index) => ({
            label: `Option${(page - 1) * 20 + index + 1}`,
            value: `opt${page * 20 + index + 1}`
        }))))

        const entity1Ctn = screen.getByRole('button', {
            name: /select entity 1/i
        })
        await act(async () => {
            await fireEvent.click(entity1Ctn)
        })
        const testOpt = screen.getByRole('button', { name: /test/i })

        await act(async () => {
            await fireEvent.click(testOpt)
        })
        const entity2Ctn = screen.getByRole('button', {
            name: /select entity 2/i
        })
        await act(async () => {
            await fireEvent.click(entity2Ctn)
        })
        const optionCtn = screen.getByTestId('option-ctn-data-testid-Entity 2')
        await act(async () => {
            await fireEvent.scroll(optionCtn, { target: { scrollY: 300 } })
        })
        await act(async () => {
            await fireEvent.click(screen.getByRole('button', { name: /Option23/i }))
        })
    })

    it('Should close the dropdown when clicked outside of it', async () => {
        render(<AllInOne />)
        const entity1Ctn = screen.getByRole('button', {
            name: /select entity 1/i
        })
        await act(async () => {
            await fireEvent.click(entity1Ctn)
        })
        fireEvent.mouseDown(document)
    })
})