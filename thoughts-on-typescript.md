# Thoughts on TypeScript

## Places where TypeScript appears in the code

### variable and function parameter declarations

```ts
const a: number;

function foo(a: number = 1, b: number): number {

}
```

### Optional parameters

```ts
function foo(a?: number) {

}
```

### Destructuring

```ts
const {a, b}: {a: number, b: number} = bar)_
foo({a, b}: {a: number, b: number}) {

}
```

Very similar to variable types

### `this` parameters

```ts
function foo(this: Foo) {

}
```

This `this` parameter is just to declare what the functions `this` is.

### Instance variables

```ts
class Foo {
  foo: number
}
```

This is similar to variable declarations

### Overloads

```ts
function foo(a: nunmber) {}
function foo(a: string) {}
```

Oh, god. Will this be even allowed?!

### Type aliases

```ts
type Foo = number
```

In the above, `type` is a statement. How do we know the statement ends? Or is the grammar be like
`type <Identifer> = <type>` and we get back the previous question of how do we know the type ends?

* Generic Type Aliases

```ts
type Foo<T> = number | T
```

### Interfaces

```ts
interface Foo {
  bar: number
}
```

Same question like for type aliases. Is `interface` a statement or structured more like
`interface <name> <type>`?

Also has this:

```ts
interface Foo extends Bar {
  foo: number
}
```

* Generic Interfaces

```ts
interface Foo<T> {
  foo: T
}
```

### Type casting (or "Type assertions")

```ts
foo as number
```

So... `<expression> as <type>`

Same question: how do I know the type ends?

Should we support the alternate syntax? `<number>foo`?

### Declarations

```ts
declare function foo(x: number): number
declare let $: jQuery;
declare module './foo' {
  interface Foo {}
}
declare module './bar';
```

Do we need this? Or can it be in `.d.ts` files only, which we can ignore?

### Enum

```ts
enum Color {
  Red, Green, Blue
}
```

Enums are not just type declarations, but are a syntax that without transpiling, does not work.

I believe we should ignore them.

### Class implementing interface

```ts
interface Foo {
  foo: number
}

class FooClass implements Foo {

}
```

Soo `class <name> implements <type>

### Class instance/method traits

```ts
class Foo{
  public foo: number;
  readonly gaz: number = 17;

  private bar() {

  }

  protected baz() {

  }

  abstract gam() {

  }
}
```

Do we need this, given the new private field way of doing things? We still have the
`protected`, `readonly`, and `abstract`.

> Note: in TS, `abstract` may only in an abstract class, but that's for the typechecker
  to figure out, not JS.

### Class traits

```ts
abstract class Foo {

}
```

### Generic Functions

```ts
function foo<T>(foo: T): T {}
```

### Generic Classes

```ts
class Foo<T> {

}
```

### Typeguards

```ts
function foo(x: number): x is number {
  return true
}
```

Or:

```txt
function <name>(<param>: <type>, ..): <param> is <type> {
  return true
}
```

### null Typegaurd

```ts
const x: string | undefined = foo()

x!.length
```

I believe it is syntactic sugar to

```ts
(x as NonNullable<typeof x>).length
```

### Exporting and importing types and interfaces

```ts
// foo.ts
export type Foo = number

// bar.ts
import {Foo} from './foo.js'
```

### Namespaces

* Officially: ["Do not use namespaces in modules"](https://www.typescriptlang.org/docs/handbook/modules.html#do-not-use-namespaces-in-modules)

```ts
namespace Foo {
  const zoo: number
  export interface Bar {}
}
```

* Important in `.d.ts`, but that's OK because JS doesn't see those.
