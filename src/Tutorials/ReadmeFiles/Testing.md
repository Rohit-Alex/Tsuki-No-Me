If we don't want to mock a package globally and use it's mocked behavior in all test case then 

Related video: https://www.youtube.com/watch?v=PrLnicZ3shI&list=PLxnSeqQVewBNZnDbkokG8QIyEAtMCzoq-&index=5
describe('Some text', () => {
    let consoleLog
    beforeAll(()=>{
        consoleLog = jest.spyOn(console, 'log')
    })

    beforeEach(() => {
        consoleLog.mockClear() // or jest.clearAllMocks()
    })

    it('use console as console.error', () => {
        consoleLog.mockImplementation((a) =>  {
            console.error(a)
        })
    })

    it('use console as console.warn', () => {
        consoleLog.mockImplementation((a) =>  {
            console.warn(a)
        })
    })

    it('use console as it default behavior', () => {
        consoleLog.mockRestore() // or jest.restoreAllMocks()
    })
})

// 1. Custom Render with wrapper and user event
const AllTheProviders = ({ children }) => {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <FormProvider>
                    <QueryClientProvider client={queryClient}>
                        {children}
                        <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
                    </QueryClientProvider>
                </FormProvider>
            </Provider>
        </BrowserRouter>
    )
}

const customRender = (ui, options) => {
    const user = userEvent.setup();
    return {
        user,
        ...render(ui, { wrapper: AllProviders, ...options })
    }
}

export { customRender as rtlRender }

// 2. screen.debug(undefined, 500000) or prettyDOM(container, 500000)

// 3. screen.getByRole('button', { name: /submit/i, exact: false, hidden: true })

// 4. logRoles(container)

// 5. 
    it('render with act', async () => {
        let container
        act(() => {
            ({ container} = render(<MyComponent />))
        })
    })

// 6. check for attributes of an element
    expect(inputTag).toHaveAttribute('value','123')