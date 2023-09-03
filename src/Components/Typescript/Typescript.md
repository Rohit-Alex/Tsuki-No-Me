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