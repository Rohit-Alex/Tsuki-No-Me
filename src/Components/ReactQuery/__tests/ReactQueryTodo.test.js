import { BrowserRouter } from "react-router-dom"
import { renderWithClient } from "../../../test-utils"
import { useQueryCustomHook } from "../../Hooks/useQueryCustomHook"
import ReactQueryTodo from "../ReactQueryTodo"

window.matchMedia =
    window.matchMedia ||
    (() => {
        return {
            matches: false,
            addListener() { },
            removeListener() { },
        }
    })
jest.mock('../../Hooks/useQueryCustomHook')


describe('React Query -> queries', () => {
    beforeEach(() => {
        useQueryCustomHook.mockImplementation(() => ({ isLoading: true }));
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it('Should return the loading state', async () => {
        const mockedProductData = [{
            title: "Test Title",
            description: "Test Description",
            id: 123.45,
            category: "Test Category",
            image: "https://example.com/image.jpg",
        }];
        useQueryCustomHook.mockImplementationOnce(() => ({ isLoading: false, data: mockedProductData }));
        const result = renderWithClient(<BrowserRouter><ReactQueryTodo /></BrowserRouter>)
        console.log(result.debug())
    })
})