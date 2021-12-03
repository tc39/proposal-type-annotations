# Generics

#### Generic arrow functions

In TypeScript, a generic arrow function is written thus:

```ts
const bar = <T>(t: T) => t
```

This construct, similarly to [null typeguards](#null-typeguards), occurs in the middle of
an expression (anywhere an arrow function can appear). Because of this, it
may be difficult to define how to parse "out" the types without understanding the
type system's semantics. We are deferring discussion on this construct until we better understand
how the JavaScript parser will parse and ignore the types.

Interestingly, TypeScript with JSX (TSX) does not parse the above as a generic arrow function, but
rather as a JSX element, and the recommended
workaround to force the parser to understand that the angle brackets are generics and not JSX is:

```ts
const bar = <T,>(t: T) => t
```

It will be important to think more deeply about how this proposal should resolve this sort of ambiguity and not be in conflict with JSX.

#### Generic invocations

In TypeScript, one can define what the type parameter of a function or a class is, explicitly:

```ts
add<number>(4, 5)
new Point<bigint>(4, 5)
```

The generic parameter here would be ignored by the JavaScript runtime.

### `this` parameter

A function can have a parameter `this` as the first parameter, and this parameter (and its type)
is ignored by the runtime and is not considered as part of the runtime parameters.

> Note that this does not break JavaScript backward compatibility,
  since `this` is not allowed as a parameter name today.