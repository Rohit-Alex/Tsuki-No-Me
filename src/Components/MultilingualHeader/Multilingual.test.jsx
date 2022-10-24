/* eslint-disable testing-library/no-debugging-utils */
/* eslint-disable testing-library/no-unnecessary-act */
import '@testing-library/jest-dom'
import { renderWithClient } from '../../test-utils'

import MultilingualHeader from './MultilingualHeader'

window.matchMedia =
    window.matchMedia ||
    (() => {
        return {
            matches: false,
            addListener() { },
            removeListener() { },
        }
    })

describe("Multilingual test", () => {
    jest.mock('react-i18next', () => ({
        // this mock makes sure any components using the translate hook can use it without a warning being shown
        useTranslation: () => {
            return {
                t: (str) => str,
                i18n: {
                    changeLanguage: () => new Promise(() => { }),
                },
            };
        },
    }));
    it('Should render with translations', () => {
        const result = renderWithClient(<MultilingualHeader />)
    })
})