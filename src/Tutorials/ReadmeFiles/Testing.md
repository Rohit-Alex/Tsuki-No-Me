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