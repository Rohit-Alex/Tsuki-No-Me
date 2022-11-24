import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { FormProvider } from "../Context/FormContext"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import store from "../Redux/store"

const queryClient = new QueryClient()
/* For some default settings
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})
*/

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

export default AllTheProviders