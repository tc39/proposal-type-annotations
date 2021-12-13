# Annotation type delimiters and allowed types

### How to define where the type annotation begins and ends

```ts
function foo(a : (this<is><x, y>TYPE!), b: thisIsAlso) {
  //..
}
```

*How does the JavaScript parser know where a type annotation begins?*

In the above example, as we defined, the `:` is used to indicate that a type begins. But how does it know that it
ends? In the above case, `(this<is><x, y>TYPE!)`, we can't just search for the comma, because
the type itself incorporates a `,`.

It's a bit unclear how to define this. Intuitively, it could be reasonable to parse tokens within matching parentheses and brackets (including `(...)`, `[...]`, `{...}`, or `<...>`), with the type ending when brackets are closed, but also permitting certain tokens to continue until a newline (if outside of a parenthesized region).

Some more complexity comes in in cases such as:
- How incompatible would this scheme be, given that it may prohibit newlines or require parentheses in certain cases?
- How do we avoid ambiguity with JSX, which uses `<...>` in a decidedly different way?


### Allowed types

Example of types that are allowed:

- Simple "identifier" style: `number`, `Foo`, `string`
- Adding `?`: `number?`, `?number`, `Foo?`
- Adding parentheses after an identifier: `string[]`, `Foo<T>`, `Foo<T extends ReturnType<Bar>>`
- Starting with parentheses: `{x: number, y: number}`, `{|x: number, y: number|}`, `(() => number)`


### Types under consideration

We're still considering how/whether the syntax could accommodate these cases without enclosing parentheses:

- Illegal characters in identifier: `number!`, `string | number`, `string & number`,
  `(x: number) => string`
- Multiple parentheses in sequence: `<T>(arg: T) => T`
- Unmatched parentheses: `Foo<T condition T < 5>`
- type operators: `typeof s`
- [Template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html):
  `` `${EmailLocaleIDs | FooterLocaleIDs}_id` ``

#### Potential solution -  Proposal 

The above could be made legal by wrapping with `(...)`. Note that TypeScript, Flow, and Hegel all permit
parentheses in these contexts today:

- `(number!)`, `(string | number)`, `(string & number)`, `((x: number) => string)`
- `(<T>(arg: T) => T)`
- `(Foo<T condition T < 5>)`
- `(typeof s)`
- ``(`${EmailLocaleIDs | FooterLocaleIDs}_id`)``

> Note that this is a place where compatibility with _existing_ TypeScript code
  might not be provided. But that code can be easily fixed, probably even via a codemod, to conform to
  the restricted way of declaring a type, by wrapping the difficult-to-parse types with a `(...)`.
