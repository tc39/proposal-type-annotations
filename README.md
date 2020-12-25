# ECMAScript proposal: Types as Comments

TypeScript has been growing in popularity. It is now the 4th popular language on Github. The
continuing and growing popularity of TypeScript shows that the JavaScript community wants
static typing and believes that some level of static typing improves code.

This proposal aims to enable developers to add type annotations to their JavaScript code,
enabling them to be checked by an _external to JavaScript_ typechecker
(such as TypeScript or Flowtype), yet having them be ignored by the JavaScript runtime,
so that transpilation to JavaScript is not necessary.

## Status

Stage: _None_. This proposal is seeking an official status from TC39.

## Synopsis

This proposal aims to add typing annotation to JavaScript, but not by defining a type
system and type syntax, but rather by allowing type annotations to be included in the code.
These type annotations are ignored by the JavaScript runtime, so transpilation is not necessary,
but type checkers such as TypeScript or Flow can read them and typecheck the code.

What those type annotations are is emphatically _not_ defined by this proposal, but rather
defines in what places type annotations _can_ be added to, and defines how the JavaScript parser
can know where the type annotations start and where they end in the code so that it can ignore them.

This proposal recognizes that trying to add a full type system to JavaScript will be a multi-year
effort that has a high probabiltiy of failure due to the enormity of the task, and also
recognizes that the community has evolved a type system that it is happy with, TypeScript,
and is today a de-facto standard. Thus, this proposal aims to be as compatible as possible
to TypeScript, but recognizes that being fully compatible is an impossible goal for the
following reasons.

* Standardizing TypeScript is problematic: Typescript is controlled by a commercial company
  (Microsoft), that may want to continue
  evolving the language and not be constrained by the TC39 standards process. Incorporating
  TypeScript as it is into the JavaScript language will make it difficult for Microsoft to
  continue doing so.

  Moreover, TC39 may wish in the future to define such a type system itself,
  and may not want to be costrained by TypeScript's syntax and semantics.

  Finally, adding TypeScript as it is now to JavaScript will probably also be a huge task,
  which we wish to avoid.

* Compatibility with other type systems: other type checkers, such as Flow,
  may wish to use this proposal to add their type annotation syntax to JavaScript code. Making this
  proposal be about TypeScript will hamper the effort.

* Some TypeScript constructs are not about types at all. An example would be TypeScript's
  `namespace`, that define namespaces for identifiers to reside in.
* Some Typescript constructs generate JavaScript code, and thus are not just about types. An
  example would be `enum` that generates an object with the enum values as properties, and thus
  is out of scope of this proposal. A future proposal could theoretically add these constructs
  to JavaScript.

This proposal recognizes that it is a balancing act: trying to be as TypeScript compatible as
possible while still allowing other type systems. It recognizes that while it leaning forward
to be close to TypeScript, TypeScript may want to lean forward to accomodate this proposal.

## Proposal

The following proposal is a _strawman_ proposal. Please treat it as such. It is more about the
spirit of ignoring type constructs in the code, than it is about the specific syntax.

### Incorporating types into functions and variable declarations

In a function, anything after `:` and before the `,` or `)` of a parameter declaration
is regarded as a type. Example:

```ts
function foo(a : (this<is><x, y>TYPE!), b: thisIsAlso) {
  //..
}
```

Please note that the types do not have to conform to the TypeScript (or any other) type system.
It is only when the _TypeScript_ type checker checks the source code that errors will be
emitted if the types are incorrect or have bad syntax.

A function can also declare a return type using `:` after the parentheses:

```ts
function foo(): number {

}
```

For arrow functions, same work:

```ts
const foo = (a: number): string => 'x' + a
```

The same is true for variable declarations:

```ts
const a: number
```

Instead of a single colon, one can also use a double color (`::`), which is useful
for destructuring, where `:` already has a meaning:

```ts
const {x:: number, y:: number} = point
```

### How to define where the type annotation begins and ends

How does the JavaScript parser know where a type declaration begins? In the above example,
as we defined, the `:` is used to indicate that a type begins. But how does it know that it
ends? In the above case (`(this<is><x, y>TYPE!)`) we can't just search for a comma, because
the type system itself incorporates a `,`.

My suggestion (and I am not sure it makes sense in terms of JavaScript parsing and tokenizing),
is that if it is a "simple" type that has the same characters as an identifier, then
it can be just added there, but if it is more complicated, then it must start and end
with parentheses (that can be `()`, `[]`, `{}`, or `<>`). Given that in TypeScript you can
enclose any type with regular parentheses `(...)` that should not be a problem. The JavaScript
parser should also balance those specific parentheses as more of those may occur inside
the type.

> Note that this is already a place where compatibility with _existing_ TypeScript code
  is broken. But that code can be easily fixed, probably even via a codemode, to conform to
  the new way of declaring a type.

### Types and interfaces

Besides type annotations on variables and functions, new types can be added using the following
constructs:

```ts
type <typeIdentifier> = <type>
interface <typeIdentifier> <type>
```

Example:

```ts
type Foo = number
interface Point {x: number, y: Number}
```

> Note that in TypeScript, interface can define only "object" types. This is a constraint in
  TypeScript and not a constraint for JavaScript.

### Importing and exporting types

One can export types and interfaces, using `export`:

```ts
export type Foo = number
```

JavaScript will ignore this export.

Importing is more difficult, as the runtime must understand that what is being imported
needs to be ignored. We propose the following to help the runtime ignore the import:

```ts
import {someFunction, :someType} from 'some-package-with-type'
```

A `:` before the identifier will define it as a type that can and should be ignored by
the JavaScript runtime and not be imported.

### Classes

Class methods and instance variables can be annotated just like functions and variables:

```ts
class Point
{
  x: number
  y: number

  move(dx: number, dy: number) {x += dx; y += dy}
}
```

We can also add an `implements <type>` to it, which will be ignored by JavaScript

```ts
interface PointInterface {x: number, y: number}

class Point implements PointInterface
{
  x: number
  y: number

  move(dx: number, dy: number) {x += dx; y += dy}
}
```

### Typecasting

A new operator `as` will be defined which takes as a left operand an expression,
and a type as the right operand. It will return the left operand, e.g.

```ts
const point = JSON.parse(serializedPoint) as ({x: number, y: number})
```

### Generics

Generics can appear in types and interfaces. They MUST start with a `<` after the identifier
and end with a `>`:

```ts
type Foo<T> = (T[])
```

Same goes for functions and classes

```ts
function foo<T>() {}
class FooClass<T> {}
```

### `this` parameter

A function can have a parameter `this` as the first parameter, and this parameter (and its type)
will be ignored by the runtime and will not be considered as part of the runtime
parameters.

> Note that this does not break compatibility, since `this` is not allowed as a parameter name.

### `.d.ts` and `libdef` Files

These files have no use in JavaScript, and while the typecheckers can test them, they
are ignored by JavaScript.

### Where TypeScript is not compatible and cannot be compatible with this proposal

* enum
* namespace
* overloads
* null typegaurd

## FAQ

## Prior Art

## References
