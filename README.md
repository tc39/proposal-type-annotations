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

This proposal recognizes that trying to add a full type system to JavaScript is a multi-year
effort that has a high probabiltiy of failure due to the enormity of the task, and also
recognizes that the community has evolved a type system that it is happy with, TypeScript,
and is today a de-facto standard. Thus, this proposal aims to be as compatible as possible
to TypeScript, but recognizes that being fully compatible is an impossible goal for the
following reasons.

* Standardizing TypeScript is problematic: Typescript is controlled by a commercial company
  (Microsoft), that may want to continue
  evolving the language and not be constrained by the TC39 standards process. Incorporating
  TypeScript as it is into the JavaScript language makes it difficult for Microsoft to
  continue doing so.

  Moreover, TC39 may wish in the future to define such a type system itself,
  and may not want to be costrained by TypeScript's syntax and semantics.

  Finally, adding TypeScript as it is now to JavaScript is probably also be a huge task,
  which we wish to avoid.

* Compatibility with other type systems: other type checkers, such as Flow and Hegel,
  may wish to use this proposal to add their type annotation syntax to JavaScript code. Making this
  proposal be about TypeScript can hamper the effort.

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
It is only when the _TypeScript_ type checker checks the source code that errors are
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

### How to define where the type annotation begins and ends

How does the JavaScript parser know where a type declaration begins? In the above example,
as we defined, the `:` is used to indicate that a type begins. But how does it know that it
ends? In the above case (`(this<is><x, y>TYPE!)`) we can't just search for a comma, because
the type system itself incorporates a `,`.

This proposal suggests, that if it is a "simple" type that has the same characters as an identifier,
then it can be just added there, but if it is more complicated, then it must start and end
with parentheses (that can be `()`, `[]`, `{}`, or `<>`). Given that in TypeScript you can
enclose any type with regular parentheses `(...)` that should not be a problem. The JavaScript
parser should also balance those specific parentheses as more of those may occur inside
the type.

> Note that this is already a place where compatibility with _existing_ TypeScript code
  is broken. But that code can be easily fixed, probably even via a codemode, to conform to
  the new way of declaring a type.

For the simple case, where the type is just an identifier, and thus does not need parentheses,
we can also allow the `?` character, as it is usually used to indicate nullness of a type.
This proposal alsos add the ability to have identifier letters and _then_ an opening parenthesis,
e.g. this is allowed: `number?[]`

### Examples

These types are allowed:

* Simple "identifier" style: `number`, `Foo`, `string`
* Adding `?`: `number?`, `?number`, `Foo?`
* Adding parenthesis after identifier: `string[]`, `Foo<T>`, `Foo<T extends ReturnType<Bar>>`
* Starting with parenthesis: `{x: number, y: number}`, `{|x: number, y: number|}`

These types are not allowed as is:

* Illegal characters in identifier: `number!`, `string | number`, `string & number`,
  `(x: number) => string`
* Multiple parenthsis in sequence: `<T>(arg: T) => T`
* Unmatched parentheses: `Foo<T condition T < 5>`
* type operators: `typeof s`
* [Template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html):
  `` `${EmailLocaleIDs | FooterLocaleIDs}_id` ``

The above could be made legal by wrapping with `(...)`. Note that this also makes them
legal in TypeScript, Flow, or Hegel:

* `(number!)`, `(string | number)`, `(string & number)`, `((x: number) => string)`
* `(<T>(arg: T) => T)`
* `(Foo<T condition T < 5>)`
* `(typeof s)`
* ``(`${EmailLocaleIDs | FooterLocaleIDs}_id`)``

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

JavaScript ignore this export.

Importing is more difficult, as the runtime must understand that what is being imported
needs to be ignored. We propose the following to help the runtime ignore the import:

```ts
import {someFunction, type someType} from 'some-package-with-type'
```

A `type` before the identifier defines it as a type that can and should be ignored by
the JavaScript runtime and not be imported.

> Note that this is not TypeScript compatible, but is compatible with Flow and Hegel.

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

We can also add an `implements <type>` to it, which is ignored by JavaScript:

```ts
interface PointInterface {x: number, y: number}

class Point implements PointInterface
{
  x: number
  y: number

  move(dx: number, dy: number) {x += dx; y += dy}
}
```

A class can also have the `abstract` trait added to it:

```ts
abstract class Point {}
```

TypeScript allows traits like `private`, `protected`, `public` on methods and instance variables,
`readonly` on instance variables, and `abstract` on methods.

This is a _big_ addition to the syntax, and in the future languages may want to add additional
keywords, so we have two options:

1. Allow the above traits to be added, just like in TypeScript, as is.
1. Define a sigil (`%`) that allows us to add any trait we like, e.g. `%protected foo() {}`.

This proposal believes the way to go is the sigil way, but in the interest of
TypeScript compatibility this proposal just adds the above traits
(and maybe add `virtual` and `override` for future's sake, as those are the only OOP
constructs that _aren't_ yet in TypeScript).

### Typecasting

A new operator `as` is defined which takes as a left operand an expression,
and a type as the right operand. It returns the left operand, e.g.

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

In the interest of completeness, and future extendability, this proposal would like
to enable not only `<...>`, but also `[...]` and `{...}`. For obvious reasons, `(...)`
is not allowed.

### `this` parameter

A function can have a parameter `this` as the first parameter, and this parameter (and its type)
is ignored by the runtime and is not considered as part of the runtime parameters.

> Note that this does not break compatibility, since `this` is not allowed as a parameter name.

### `.d.ts` and `libdef` Files

These files have no use in JavaScript, and while the typecheckers can test them, they
are ignored by JavaScript.

### Where TypeScript is not compatible and cannot be compatible with this proposal

* enum
* namespace
* overloads
* null typegaurd
* declarations

## Other ideas

### Types for destructured variables

Instead of a single colon, one can also use a double color (`::`), which is useful
for destructuring, where `:` already has a meaning:

```ts
const {x:: number, y:: number} = point
```

This solves the problem that is currently in TypeScript and Flow where you cannot
type individual destructor variables, but must type the whole object, which makes for a very
unwieldy look.

### Adding traits via `%`

Addinng `%trait` to anything.

### Types for imported variables

```js
import {foo: number} from 'abc'
```

## FAQ

### Do all TypeScript programs pass?

Most pass, but not all, and most of those that do not pass can be converted via simple changes
that can make them both TypeScript compatible _and_ compatible with this proposal. Specifically,
wrapping some types with parentheses to make them compatible with this propsal.

Some constructs in TypeScript have nothing to do with types,
and generate JavaScript and are not just erased from the code. Those constructs are not supporte
and probably is not supported by this proposal, as this proposal does not concern itself
with constructs that cannot be erased from the code. Those TypeScript constructs are: namespaces
and enums.

Also, "null typeguards" (e.g. `x!.something`) constructs are type erased,
but don't fit into this proposal in a way that makes sense,
so are currently not supported by this proposal, but may be supported in the final spec.

The final construct that is not supported is declarations. Since those are usually found in
`.d.ts` files, which can be read by TypeScript and are ignored by JavaScript, this should not
be a real problem.

* Do all Flow programs pass?

Flow is very similar to TypeScript, and so all type constructs are OK, with
a similar caveat whereby some types need to be wrapped in parentheses to be compatible with
this proposal.

Two constructs that do not conform to this proposal are typecasting (e.g. `(x: number`) and opaque
types `opaque type Meters = number`. Flow could consider modifying these in the language
so that they conform to this proposal, e.g. adopt the `as` operator as an alternative to
`(x: number)`.

### Do all Hegel programs pass?

Yes. Some types may need to be wrapped with parenthesis to conform to this proposal's limitations,
but otherwise they're the same.

### Why do you not incorporate TypeScript as is into the language?

1. To allow other type systems (e.g. Flow and Hegel) to "compete" on more equal grounds
2. To allow experimentation with type systems
3. This proposal does not negate a future type system in the JS standard, but recognizes
   that this is as an undertaking that takes _years_ to accomplish, and wants an interim
   proposal that allows TypeScript (and other) programs to run without transpilation
4. Microsoft may want to "keep" TypeScript for future implementation and not be hampered by
   the more slow going TC39 standards process.

### This proposal means that existing TypeScript programs would need to be modified. Why would existing TypeScript developers do the work that is needed for this?

The modifications would be slight, and one could probably write a codemode that does
them automatically, so in terms of effort this is not a big effort.

And the promise of having TypeScript code that does not need transpilation is a big motivation.

### What about copatibililty with ReasonML, PureScript, and other statically typed languages that compile to JavaScript?

While these languages _compile_ to JavaScript, and have static typing, they are not supersets of
JavaScript, and thus are not relevant to this proposal.

But these languages could theoretically use this proposal to tack _their type system_ on JavaScript.

## Prior Art

### Other languages that implemented the "types as comments" idea

When Python decided to add a gradual type system to the language, it did it in two steps.
First, a proposal for type annotations was added to the language, that enabled
any "types" to be added to the code, where the Python interpreter ignored them.

After a few years, on top of this proposal, a standard type system ("type hints")
was added to Python.

See the [reference section](#References) for links to the two proposals.

### Languages that add type systems onto JavaScript

TypeScript, Flow, and Hegel are languages that implement type systems above standard JavaScript.
See the [references section](#References) for links to the documenation of these languages.

### Ability to add type systems to JavaScript via comments

Both TypeScript and flow enable developers to write JavaScript code and incorporate
types as comments.

For Flow, these are [Flow comment types](https://flow.org/en/docs/types/comments/), and
for TypeScript these are [JSDoc comments](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html).

See the author's blog post on their experience with JSDoc comments [here](https://gils-blog.tayar.org/posts/jsdoc-typings-all-the-benefits-none-of-the-drawbacks/).

## References

* [TypeScript Reference](https://www.typescriptlang.org/docs/handbook/intro.html)
* [Hegel Documentation](https://hegel.js.org/docs)
* [Flow documentation](https://flow.org/en/docs/)
* [Python spec for "types as comments"](https://www.python.org/dev/peps/pep-3107/)
* [Python followup spec that defined a standard type system](https://www.python.org/dev/peps/pep-0484/#abstractart)
