import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { FormProvider } from "../Context/FormContext"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import store from "../Redux/store"
import { App } from 'antd';
import NotificationContextProvider from "Context/notificationContext"
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
                <QueryClientProvider client={queryClient}>
                    <FormProvider>
                        <NotificationContextProvider>
                            <App>
                                {children}
                                <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
                            </App>
                        </NotificationContextProvider>
                    </FormProvider>
                </QueryClientProvider>

            </Provider>
        </BrowserRouter>
    )
}

export default AllTheProviders