import { renderHook, act } from '@testing-library/react-hooks'
import React from 'react'
import useOnClickOutside from '../useOnClickOutside'
describe('custom hooks', () => {
    it('useOutsideClick', () => {
        const handlerMock = jest.fn()
        const useRefSpy = jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: document.createElement('button') });
        renderHook(() => useOnClickOutside(useRefSpy, handlerMock))
    })
})