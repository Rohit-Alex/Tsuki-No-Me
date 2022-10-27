import {render} from '@testing-library/react'
import AllTheProviders from './Providers/AllProviders'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
export * from '@testing-library/react'

const customRender = (ui: any, options: any) =>
    render(ui, {wrapper: AllTheProviders, ...options})


// override render method
export {customRender as render}

export const createTestQueryClient = (key?: any, value?: any) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: Infinity,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {},
    }
  })
  if (key) queryClient.setQueryData(key, value)
  return queryClient
};

export function createWrapper(key?: any, value?: any) {
  const testQueryClient = createTestQueryClient(key, value);
  return ({ children }: any) => (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
}


export function renderWithClient(ui: any) {
  const testQueryClient = createTestQueryClient();
  const { rerender, ...result } = render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
  );
  return {
    ...result,
    rerender: (rerenderUi: any) =>
      rerender(
        <QueryClientProvider client={testQueryClient}>
          {rerenderUi}
        </QueryClientProvider>
      ),
  };
}

export const renderWithRouter = (ui: any, { route = '/' } = {}, state = {}) => {
  window.history.pushState({data: 'mg'}, '', route)
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: BrowserRouter }),
  }
}
