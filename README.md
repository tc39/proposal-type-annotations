# ECMAScript proposal: Types as Comments

TypeScript has been growing in popularity. It is now the 4th popular language on Github. The
continuing and growing popularity of TypeScript shows that the JavaScript community wants
static typing and believes that some level of static typing improves code. Moreover,
JavaScript is now the _only_ major dynamic language with no typing support. Clojur, Python, and Ruby
all now have some level of typing support.

This proposal aims to enable developers to add type annotations to their JavaScript code,
enabling them to be checked by an _external to JavaScript_ type checker
(such as TypeScript or Flow), yet having them be ignored by the JavaScript runtime,
so that transpilation to JavaScript is not necessary.

In other words, the aim of this proposal is to enable developers to
run TypeScript, Flow (and other "static typing supersets of JavaScript") languages without
any need for transpilation.

## Status

Stage: _None_. This proposal is seeking an official status from TC39.

## Synopsis

This proposal aims to add typing annotation to JavaScript, not by defining a type
system and type syntax, but rather by allowing type annotations to be included in the code
yet  ignored by the JavaScript runtime. These annotations can be type checked by tools such
as TypeScript, ESlint, Flow, or Hegel, yet have the code run without any transpilation necessary.

What those type annotations are is emphatically _not_ defined by this proposal, but rather
defines in what places type annotations _can_ be added to, and defines how the JavaScript parser
can know where the type annotations start and where they end in the code so that it can ignore them.

This proposal recognizes that trying to add a full type system to JavaScript is a multi-year
effort that has a high probabiltiy of failure due to the enormity of the task, and also
recognizes that the community has evolved type systems that it is happy with. Specifically,
the current de-facto standard for this is TypeScript, so this proposal aims to
be as compatible as possible to TypeScript, yet recognizes that being fully compatible
is an impossible goal for the following reasons:

* Standardizing TypeScript is problematic: Typescript is controlled by a commercial company
  (Microsoft), that may want to continue evolving the language and not be constrained by the
  TC39 standards process. Incorporating TypeScript as it is into the JavaScript language makes
  it difficult for Microsoft to continue doing so.

  Moreover, TC39 may wish in the future to define such a type system itself,
  and may not want to be costrained by TypeScript's syntax and semantics.

  Finally, adding TypeScript as it is now to JavaScript is probably be a huge task,
  which we wish to avoid.

* Compatibility with other type systems: other type checkers, such as Flow and Hegel,
  may wish to use this proposal to enable developers to use their type checkers to check their code.
  Making this proposal be only about TypeScript can hamper the effort.

* Some TypeScript constructs are not about types at all. An example would be TypeScript's
  `namespace`, that define namespaces for identifiers to reside in.

* Some Typescript constructs generate JavaScript code, and thus are not just about types. An
  example would be `enum` that generates an object with the enum values as properties, and thus
  is out of scope of this proposal. A future proposal could theoretically add these constructs
  to JavaScript.

This proposal recognizes that it is a balancing act: trying to be as TypeScript compatible as
possible while still allowing other type systems, and also not impeding too much on JavaScript's
syntax. It recognizes that while it leaning forward to be close to TypeScript,
TypeScript may need to also lean forward to accomodate this proposal.

## Proposal

The following proposal is a _strawman_ proposal. Please treat it as such. It is more about the
spirit of ignoring type constructs in the code, than it is about the specific syntax. Having
said that, care was taken to be both TypeScript/Flow/Hegel compatible, yet also be true
to the spirit of JavaScript.

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

For arrow functions, a similar syntax:

```ts
const foo = (a: number): string => 'x' + a
```

The same syntax works for variable declarations:

```ts
const a: number = 4
```

### How to define where the type annotation begins and ends

How does the JavaScript parser know where a type declaration begins? In the above example,
as we defined, the `:` is used to indicate that a type begins. But how does it know that it
ends? In the above case (`(this<is><x, y>TYPE!)`) we can't just search for a comma, because
the type itself incorporates a `,`.

This proposal suggests a few simple rules that define where the type ends:

1. Any JS identifier is accepted.
1. A prefix or postfix `?` is allowed.
1. If an open parenthess is encountered before the identifier or after it, then
   it is balance-matched until it's close is found, which defines the end of the type.

Example of types that are allowed:

* Simple "identifier" style: `number`, `Foo`, `string`
* Adding `?`: `number?`, `?number`, `Foo?`
* Adding parentheses after identifier: `string[]`, `Foo<T>`, `Foo<T extends ReturnType<Bar>>`
* Starting with parentheses: `{x: number, y: number}`, `{|x: number, y: number|}`

These types are not allowed as they are:

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

> Note that this is a place where compatibility with _existing_ TypeScript code
  is broken. But that code can be easily fixed, probably even via a codemod, to conform to
  the new way of declaring a type, by wrapping the "unbalanced" types with a `(...)`.

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

> Note that in TypeScript, interfaces can define only "object" types. This is a constraint in
  TypeScript and not a constraint for JavaScript.

### Importing and exporting types

One can export types and interfaces, using `export`:

```ts
export type Foo = number
```

JavaScript runtime should ignore this export.

Importing is more difficult, as the runtime must understand that what is being imported
needs to be ignored. We propose the following to help the runtime ignore the import:

```ts
import {someFunction, type someType} from 'some-package-with-type'
```

A `type` before the identifier defines it as a type that can and should be ignored by
the JavaScript runtime and not be imported.

> Note that this is not TypeScript compatible (but we believe it could be with a simple change!),
  but is compatible with Flow and Hegel.

### Classes

Class methods and instance variables can be annotated just like functions and variables:

```ts
class Point
{
  x: number
  y: number

  move(dx: number, dy: number): void {x += dx; y += dy}
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

This is a _big_ addition to the syntax. See the [Other ideas section](#other-ideas) for ideas
on how to deal with this.

### Typecasting

A new operator (`as`) is defined which takes as a left operand an expression,
and a type as the right operand. It returns the left operand, e.g.

```ts
const point = JSON.parse(serializedPoint) as ({x: number, y: number})
```

> This proposal deems it not necessary to add the other alternative type-casting syntax from
  TypeScript (`(<expression>: <type>)`) becase it is more complicated to define, and because it is
  very easy to modify existing TypeScript programs to use the `as` syntax. Moreover, the `as`
  syntax is the official way to typecast today in TypeScript.

### Generics

Generics can appear in types and interfaces. They MUST start with a `<` after the identifier
and end with a `>`:

```ts
type Foo<T> = (T[])
```

Same goes for functions and classes (but not for variables and parameters):

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

> Note that this does not break compatibility, since `this` is not allowed as a parameter name
  today.

### Function overloads

If a function has some kind of type signature, but no body,
JavaScript treats it as a declaration for function overloading purpose and ignores it. Example:

```ts
function foo(x: number): number
function foo(x: string): string {
  if (typeof x is number) {
    return x + 1
  } else {
    return x + "!"
  }
}
```

### `.d.ts` and `libdef` Files

These files have no use in JavaScript, and while the typecheckers can test them, they
are ignored by JavaScript.

## Other ideas

These ideas extend TypeScript and as such are considered not necessary, but are additions
that are in the spirit of JavaSript.

### Types for destructured variables

Instead of a single colon, one can also use a double color (`::`), which is useful
for destructuring, where `:` already has a meaning:

```ts
const {x:: number, y:: number} = point
```

This solves the problem that is currently in TypeScript and Flow where you cannot
type individual destructor variables, but must type the whole object, which makes for a very
unwieldy look.

### Removing the need for `implements` by just replacing it with `:`

If we define that a class can also have type annotations, this proposal would like to suggest
an alternative way to define `implements`

```ts
class PointClass implements Point {

}
```

One would write:

```ts
class PointClass: Point {

}
```

This would remove the need for another keyword from the language.

### Adding traits via `type(...)` or a sigil

There are various places in the proposal that add type _traits_ into the language.
Examples are `public`, `abstract`, `readonly`. Instead of defining these explicitly, we
could add a "type as comments" way to add them, without needing to define what those traits are.

One way could be via a `type(...)` construct, thus:

```ts
type(abstract) class Point {
  type(readonly) x: number
  type(readonly) y: number
}
```

A vigil would also make sense, assuming `type` is too verbose:

```ts
%abstract class Point {
  %readonly x: number
  %readonly y: number
}
```

The last option would be to add them as part of the type information, using a well-known sigil
(`#` in the examples here):

```ts
class Point: #abstract {
  x: number#readonly
  y: number#readonly

  move(): Point#(override,abstract)
}
```

### Types for imported variables

There is one additional place where variables are declared and yet do not have a place for a
type annotation: in import statements. This proposal would like to add the ability to have
a type annotation there, even if this is not supported by the current typecheckers:

```js
import {foo: number} from 'abc'
```

## Where TypeScript is not compatible and cannot be compatible with this proposal

Some constructs in TypeScript have no parallel in this proposal.

* [Enums](https://www.typescriptlang.org/docs/handbook/enums.html). This
  construct actually _generates_ JavaScript code and thus is out of scope for a proposal
  that just tries to add type annotations that are ignored by the runtime.
* [Namespaces](https://www.typescriptlang.org/docs/handbook/namespaces.html). Namespaces
  are not a type construct and thus are deemed out of scope of this proposal.
* [Null typeguards](https://www.typescriptlang.org/docs/handbook/advanced-types.html#nullable-types).
  In TypeScript, one can write `x!.foo` to specify that `x` cannot be null,
  even if its type specifies that is can be. This construct
  is syntactic sugar for `(x as NonNullable<typeof x>`). This constuct is not part of a
  function or class definition, and is deep in the definition of expressions in JavaScript, and so
  is difficult to define. Given that it is syntactic sugar, and a TypeScript program
  can be rewritten to remove it without any change in sematics, this proposal decided not to tackle
  this construct.
* [Declarations](https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html).
  In TypeScript one can "declare" the existence of a function or class using
  `declare function foo();`. As this is used mainly in `.d.ts` files, which are ignored
  by JavaScript (see above), we can ignore this construct.

## FAQ

### Does JavaScript need a type system?

In 2020, **_all_ major dynamic languages except JavaScript** have introduced a static (and gradual)
type system. This includes Python with Type Hinting, Clojure with Clojure Spec,
and Ruby with RBS (see the [References section](#References) for links).
The world of dynamic languages is clearly moving towards gradual typing,
and the success of TypeScript
(it is now the 4th popular language in the 2020 Github "state of the octoverse" report) shows
us that the JavaScript community also wants it. It is crucial that JavaScript does not miss
this boat.

### Why not just officially sanction TypeScript as "JavaScript with types"?

* To allow other type systems (e.g. Flow and Hegel) to "compete" on more equal grounds
* To allow experimentation with other type systems
* This proposal does not negate a future type system in JavaScrit, yet recognizes
  that this is as an undertaking that takes _years_ to accomplish and wants an interim
  proposal that allows TypeScript (and other) programs to run without transpilation while
  a standard type system is defined based on TypeScript and others.
* Microsoft may want to "keep" TypeScript for future changes and would not want to be hampered by
  the more slow going TC39 standards process.

### Do all TypeScript programs pass?

Most constructs in TypeScript, but not all,
and most of those that do not pass can be converted via simple codemode changes
that can make them both TypeScript compatible _and_ compatible with this proposal.

Also, the "enum" construct in TypeScript has nothing to do with types,
and generates JavaScript and not just erased from the code. This constructs are not supported,
as this proposal does not concern itself with constructs that modify the runtime behavior of
JavaScript.

"Null typeguards" (e.g. `x!.something`) constructs are type erased,
but don't fit into this proposal in a way that makes sense,
so are currently not supported by this proposal, but may be supported in the final spec.

The final construct that is not supported are declarations. Since those are usually found in
`.d.ts` files, which can be read by TypeScript and are ignored by JavaScript, this should not
be a real problem.

### Do all Flow programs pass?

Flow is very similar to TypeScript, and so all type constructs are OK, with
a similar caveat whereby some types need to be wrapped in parentheses to be compatible with
this proposal.

Two constructs that do not conform to this proposal are typecasting (e.g. `(x: number`) and opaque
types `opaque type Meters = number`. Flow could consider modifying these in the language
so that they conform to this proposal, e.g. adopt the `as` operator as an alternative to
`(x: number)`, and `type Meters = (new number)`

### Do all Hegel programs pass?

Yes. Some types may need to be wrapped with parentheses to conform to this proposal's limitations,
but otherwise they're the same.

### What about `.d.ts` files and "libdef" files?

`.d.ts` and "libdef" files are used by TypeScript and Flow respectively, as a kind of "header" file
that describes the signature of a package. This proposal can safely ignore them as it
does not need to interpret the semantics of the type information inside them. Of couse,
TypeScript and Flow can continue reading and interpreting these files as they have done in the past.

### This proposal means that existing TypeScript programs would need to be modified. What would the motivation be for TypeScript developers?

The modifications would be slight, and one could probably write a codemode that does
them automatically, so in terms of effort this is not a big effort, while the promise of
having TypeScript code that does not need transpilation is a big motivation.

### What about copatibililty with ReasonML, PureScript, and other statically typed languages that compile to JavaScript?

While these languages _compile_ to JavaScript, and have static typing, they are not supersets of
JavaScript, and thus are not relevant to this proposal.

## Prior Art

### Other languages that implemented the "types as comments" idea

When Python decided to add a gradual type system to the language, it did it in two steps.
First, a proposal for type annotations was added to the language, that enabled
any "types" to be added to the code, where the Python interpreter ignored them.
After a few years, on top of this proposal, a standard type system ("type hints")
was added to Python. See the [References section](#References) for links to the two proposals.

Ruby, in v3,  has now also implemented RBS: type definitions that sit _beside_ the code
and are not part of it. See the [References section](#References) for more information.

### Languages that add type systems onto JavaScript

TypeScript, Flow, and Hegel are languages that implement type systems above standard JavaScript.
See the [references section](#References) for links to the documenation of these languages.

### Ability to add type systems to JavaScript via comments

Both TypeScript and Flow enable developers to write JavaScript code and incorporate
types as comments that the JavaScript runtime ignores.

For Flow, these are [Flow comment types](https://flow.org/en/docs/types/comments/), and
for TypeScript these are [JSDoc comments](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html).

See the author's blog post on their experience with JSDoc comments [here](https://gils-blog.tayar.org/posts/jsdoc-typings-all-the-benefits-none-of-the-drawbacks/).

## References

* [TypeScript Reference](https://www.typescriptlang.org/docs/handbook/intro.html)
* [Hegel Documentation](https://hegel.js.org/docs)
* [Flow documentation](https://flow.org/en/docs/)
* [Python spec for "types as comments"](https://www.python.org/dev/peps/pep-3107/)
* [Python followup spec that defined a standard type system](https://www.python.org/dev/peps/pep-0484/#abstractart)
* [Ruby 3 announcement, including a Ruby type system](https://www.ruby-lang.org/en/news/2020/12/25/ruby-3-0-0-released/)
* [Clojure Spec, the Clojure type system](https://clojure.org/guides/spec)
* [Github, State of the Octoverse, where TypeScript is the 4th most popular language](https://octoverse.github.com/)
