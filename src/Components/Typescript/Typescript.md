React.PropsWithChildren<{
  className?: string;
  style?: React.CSSProperties;
}>;

dict2: Record<string, MyTypeHere>;

onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
onClick(event: React.MouseEvent<HTMLButtonElement>): void;

React.InputHTMLAttributes<HTMLInputElement>
React.ReactEventHandler<HTMLInputElement>
React.MouseEvent<HTMLDivElement>

setState: React.Dispatch<React.SetStateAction<number>>;

children?: React.ReactNode; // best, accepts everything React can render
childrenElement: JSX.Element; // A single React element
style?: React.CSSProperties; // to pass through style props
onChange?: React.FormEventHandler<HTMLInputElement>; // form events! the generic parameter is the type of event.target
props: Props & React.ComponentPropsWithoutRef<"button">; // to impersonate all the props of a button element and explicitly not forwarding its ref
props2: Props & React.ComponentPropsWithRef<MyButtonWithForwardRef>; // to impersonate all the props of MyButtonForwardedRef and explicitly forwarding its ref

JSX.Element -> Return value of React.createElement
React.ReactNode -> Return value of a component

interface Props {
  children?: ReactNode;
  type: "submit" | "button";
}
export type Ref = HTMLButtonElement;
export const FancyButton = forwardRef<Ref, Props>((props, ref) => ())

type Theme = 'light' | 'dark';
const ThemeContext = createContext<Theme>('dark');

interface State {
  value: number;
}
type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'incrementAmount'; amount: number };
const counterReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'increment':
      return { value: state.value + 1 };
    case 'decrement':
      return { value: state.value - 1 };
    case 'incrementAmount':
      return { value: state.value + action.amount };
    default:
      throw new Error();
  }
};
const [state, dispatch] = useReducer(counterReducer, { value: 0 });
React.ComponentPropsWithoutRef<'button'>

#### Generics examples

```
  function convertToArray<T>(input: T): T[] {
    return [input]
  }

  const convertToArray = <T>(input: T): T[] => [input]

  convertToArray(5)
```

###### Now if we want to restrict it to only except number and string then,

```
  function convertToArray<T extends number | string>(input: T): T[] {
    return [input]
  }

  convertToArray(5)
  convertToArray('AOT')
```


```
    function convertToArray<T, K>(input: T, input2: K): [T, K] {
        return [input, input2]
    }

    convertToArray<number, string>(5, 'AOT') // not required to pass the type here, it automatically infers from arguments
    convertToArray(5, 'AOT')
```

#### Get Error Message util function

```
    const getErrorMessage = (error: unknown): string => {
      let message: string
      if (error instanceof Error) {
        message = error.message
      } else if (error && typeof error === 'object' && 'message' in error) {
        message = error.message.toString();
      } else if (typeof error === 'string') {
        message = error
      } else {
        message = 'Something went wrong!'
      }
      return message
    }
```

#### Generics in Components props 

interface IProps<T> {
  themeOptions: T[];
  theme: T;
}

function ThemeOptions<T>({themeOptions, theme}: IProps<T>) {
  
} 

#### Tricks

i> typeof
  ```
  const val = 5
  typeof val
  ```

ii> ReturnType

const func = () => {
  const val = 'rohit'
  return val
}

type funcType = ReturnType<typeof func> => 'string'


const func2 = async() => {
  const val = 'rohit'
  return val
}

type funcType2 = ReturnType<typeof func2> => 'Promise<string>'
type funcType2Res = Awaited<ReturnType<typeof func2>> => 'string'


iii> Prettify

type Prettify<T> = {
  [k in typeof T]: T[k]
} & {}

interface person {
  name: string
  age: number
}

type NestedType = person & {
  gender: 'male' | 'female'
}

type prettified = Prettify<NestedType>


iv> keyof 

const obj = {
  name: 'rohit',
  age: 24
}

type objKeysType = keyof typeof obj

v> Omit(for simple) and Exclude(for complex)