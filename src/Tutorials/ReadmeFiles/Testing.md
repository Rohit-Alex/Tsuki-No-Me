### React Testing Library: Roles and Queries Guide

#### **1. Generic Queries**

| Query Method            | Target Element Type                      | Example Usage                                                                                  |
|--------------------------|------------------------------------------|------------------------------------------------------------------------------------------------|
| `getByRole`             | Any element with a role (e.g., button, link) | `screen.getByRole('button')`                                                                  |
| `getByText`             | Elements with visible text content       | `screen.getByText('Submit')`                                                                  |
| `getByLabelText`        | Labels associated with form controls     | `screen.getByLabelText('Email Address')`                                                      |
| `getByPlaceholderText`  | Input fields with `placeholder` attribute | `screen.getByPlaceholderText('Enter your name')`                                              |
| `getByAltText`          | Images with `alt` attribute              | `screen.getByAltText('Profile picture')`                                                      |
| `getByTitle`            | Elements with `title` attribute          | `screen.getByTitle('Close')`                                                                  |
| `getByTestId`           | Elements with `data-testid` attribute    | `screen.getByTestId('custom-element')`                                                        |

---

#### **2. Common Roles**

| **Role**         | **Element(s)**                                                                                 | **Example Usage**                       |
|-------------------|-----------------------------------------------------------------------------------------------|-----------------------------------------|
| `button`         | `<button>`, `<input type="button">`, `<input type="submit">`                                   | `screen.getByRole('button', { name: 'Submit' })` |
| `link`           | `<a href="...">`, `<area>`, `<link>`                                                           | `screen.getByRole('link', { name: 'Home' })` |
| `heading`        | Any heading (`<h1>` to `<h6>`)                                                                 | `screen.getByRole('heading', { name: 'Welcome' })` |
| `list`           | `<ul>`, `<ol>`, `<menu>`                                                                       | `screen.getByRole('list')`              |
| `listitem`       | `<li>`                                                                                         | `screen.getByRole('listitem')`          |
| `textbox`        | `<input>`, `<textarea>` (excluding `type="password"`)                                          | `screen.getByRole('textbox', { name: 'Username' })` |
| `combobox`       | `<select>`, `<input type="search">`, `<input list="...">`                                      | `screen.getByRole('combobox')`          |
| `checkbox`       | `<input type="checkbox">`                                                                      | `screen.getByRole('checkbox')`          |
| `radio`          | `<input type="radio">`                                                                         | `screen.getByRole('radio')`             |
| `progressbar`    | `<progress>`, `<div role="progressbar">`                                                       | `screen.getByRole('progressbar')`       |
| `img`            | `<img>`, `<svg>` with `role="img"`                                                             | `screen.getByRole('img', { name: 'Logo' })` |
| `dialog`         | `<dialog>`, `<div role="dialog">`                                                              | `screen.getByRole('dialog')`            |
| `navigation`     | `<nav>`                                                                                        | `screen.getByRole('navigation')`        |

---

#### **3. Accessible Name Examples**

For many roles, you can query using the **accessible name** of the element. Here are a few examples:

| Element Type          | Role             | Accessible Name Source       | Example Query                                                             |
|------------------------|------------------|------------------------------|---------------------------------------------------------------------------|
| Button                | `button`         | `aria-label`, inner text     | `screen.getByRole('button', { name: 'Submit' })`                         |
| Image                 | `img`            | `alt` attribute              | `screen.getByRole('img', { name: 'Profile' })`                           |
| Link                  | `link`           | Inner text or `aria-label`   | `screen.getByRole('link', { name: 'Learn More' })`                       |
| Input with Label       | `textbox`        | Associated `<label>`         | `screen.getByLabelText('Email Address')`                                 |
| Heading               | `heading`        | Inner text                   | `screen.getByRole('heading', { name: 'Page Title' })`                    |

---

#### **4. Specific Roles and Attributes**

You can also target roles that come from ARIA roles or attributes:

| ARIA Role Example | HTML Example                              | Query Example                                                   |
|--------------------|-------------------------------------------|-----------------------------------------------------------------|
| `tooltip`         | `<div role="tooltip">`                   | `screen.getByRole('tooltip', { name: 'Help info' })`           |
| `alert`           | `<div role="alert">`                     | `screen.getByRole('alert')`                                    |
| `banner`          | `<header role="banner">`                 | `screen.getByRole('banner')`                                   |
| `status`          | `<div role="status">`                    | `screen.getByRole('status', { name: 'Processing...' })`        |
| `tabpanel`        | `<div role="tabpanel">`                  | `screen.getByRole('tabpanel', { name: 'Tab 1 Content' })`      |

---

#### **5. Debugging Tips**

- Use **`screen.debug()`** to inspect the rendered DOM and confirm the roles or accessible names.
- Use **`logRoles`** from `@testing-library/dom` to list all roles available in a component:
  ```tsx
  import { render } from '@testing-library/react';
  import { logRoles } from '@testing-library/dom';

  const { container } = render(<MyComponent />);
  logRoles(container);
  ```

This prints all available roles in the console for better debugging.

---


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

// 7. Reject and throw Error

test('rejects to octopus', () => {
  // make sure to add a return statement
  return expect(Promise.reject(new Error('octopus'))).rejects.toThrow(
    'octopus',
  );
});


// 8. toHaveReturned: mock function successfully returned (i.e., did not throw an error) at least one time

test('drinks returns', () => {
  const drink = jest.fn(() => true);

  drink();

  expect(drink).toHaveReturned();
});


// 9. toHaveReturnedWith(value) : mock function returned a specific value.


test('drink returns La Croix', () => {
  const beverage = {name: 'La Croix'};
  const drink = jest.fn(beverage => beverage.name);

  drink(beverage);

  expect(drink).toHaveReturnedWith('La Croix');
});


// 10. .toHaveProperty(keyPath, value?)

// 11.  as jest.Mock