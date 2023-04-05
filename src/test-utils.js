import {render, waitForElementToBeRemoved} from '@testing-library/react'
import AllTheProviders from './Providers/AllProviders'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
export * from '@testing-library/react'

const customRender = (ui, options) =>
    render(ui, {wrapper: AllTheProviders, ...options})


// override render method
export {customRender as render}

export const createTestQueryClient = (key, value) => {
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

export function createWrapper(key, value) {
  const testQueryClient = createTestQueryClient(key, value);
  // eslint-disable-next-line react/display-name
  return ({ children }) => (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
}


export function renderWithClient(ui) {
  const testQueryClient = createTestQueryClient();
  const { rerender, ...result } = render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
  );
  return {
    ...result,
    rerender: (rerenderUi) =>
      rerender(
        <QueryClientProvider client={testQueryClient}>
          {rerenderUi}
        </QueryClientProvider>
      ),
  };
}

export const renderWithRouter = (ui, { route = '/' } = {}, state = {}) => {
  window.history.pushState({data: 'mg'}, '', route)
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: BrowserRouter }),
  }
}

export const testTooltip = async (testId, content, options) => {
  userEvent.hover(screen.getByTestId(testId));
  screen.getByText(content, options);
  userEvent.unhover(screen.getByTestId(testId));
  await waitForElementToBeRemoved(screen.getByText(content, options));
};

export const testInput = (testId, inputValue, expectedValue) => {
  const input = screen.getByTestId(testId);
  userEvent.type(input, `{selectall}${inputValue}`);
  userEvent.click(input.ownerDocument.body);
  expect(input).toHaveValue(expectedValue);
};