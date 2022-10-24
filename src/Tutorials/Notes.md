Freeze vs Seal

Seal => Naruto sealing corpses
     => can't add or remove any properties.
     => However, can change the existing properties.

Freeze => Max privacy in object
       => Can't add, modify or delete any properties.
       => Only applicable at top level. i.e. Shallow freezing

HOC => making reuse of the component logic and functionality that is commonly required at different level of hierarchy
    => It's a pure function that takes a component as a parameter and returns a new component without changing the original component.
    => We can pass all the common functionality in props to the newly created component and acces these props in   the  actual component.
    => The props passed into these wrappedComponent can't be accessed there and needs to spread in the hoc to be able to use it.

DOMContentLoaded => The DOMContentLoaded event fires when the HTML document has been completely parsed, and all deferred scripts (<script defer src="…"> and <script type="module">) have downloaded and executed. It doesn't wait for other things like images, subframes, and async scripts to finish loading.
componentDidMount is triggered as soon as the instance of the componenet is created. Wheras, DOMContentLoaded is fired once only in entire webPage life.

Call, apply & bind
async & defer
throttling & debouncing


the unique exponentiation operator has right-associativity, whereas other arithmetic operators have left-associativity.

const a = 4 ** 3 ** 2;  // Same as 4 ** (3 ** 2); evaluates to 262144

Precedence operators:
1> ()
2> ?.
3> postfix ...++
           ...--
4> unary operator & prefix:  ! ~ + - ++... --...
5> ** (right to left)
6> * / %
7> + -
8> << >>
9> < > <= >=
10> == != === !==
11> | 
12> &
13> ^
14> &&
15> ||
16> ??
17> = 