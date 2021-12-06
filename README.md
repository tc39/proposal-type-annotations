# ECMAScript proposal: Types as Comments

This proposal aims to enable developers to add type annotations to JavaScript code,
allowing those annotations to be checked by a type checker that is _external to JavaScript_.
At runtime, the JavaScript engine ignores them, treating the types as if they were like comments.

The aim of this proposal is to enable developers to write code that can be type-checked by a tool like
[TypeScript](https://www.typescriptlang.org/), [Flow](https://flow.org/), or other static type checkers,
without any compilation, that is largely compatible with these existing variants, but is largely guided by precedents established by TypeScript.

## Motivation

TypeScript is a gradually typed superset of JavaScript.
At the time of writing, it's the most popular of the static typing supersets of JavaScript currently in use.
TypeScript's type syntax is used by development tooling, and largely does not add runtime semantics<sup>1</sup>.
Other systems like Flow also share much of the same syntax.

In practice, this means that compiling statically typed JavaScript in the form of TypeScript, Flow, etc. to plain JavaScript amounts to only erasing the types.

### Community Demand

_Static Typing_ was the most requested language feature in [the _State of JS_ survey](https://2020.stateofjs.com/en-US/opinions/missing_from_js/) published in January 2021.

![missing-features-js](https://user-images.githubusercontent.com/6939381/143012138-96b93204-c456-4ab5-bb63-2648187ab8a7.png)

### JavaScript Compilation Over the Years <!-- Background -->

<!-- Maybe, 2013, 2014, ... -->
<!-- move this into the motivation section? Some top-level history of types. -->

As evergreen browsers grow in popularity, the need for downlevel-compilation (a.k.a. "transpilation")
is fading. Furthermore, developers on back-end runtimes such as Node.js have the opportunity to use
very recent versions of JavaScript engines like V8 which typically offers many of the newest ECMAScript features.
As a result, for many TypeScript users, the only necessary step between writing code and running it is to erase away type annotations.

Today, developers have many tools at their disposal to do this, such as the TypeScript compiler, Babel, esbuild, and more.
Language variants like TypeScript are blessed that developer tools have made it a first-class citizen for any build arrangement;
however, the tools cannot bring back all of the conveniences of of writing directly in JavaScript.
Being able to save a file and run it immediately is huge benefit using JavaScript, and existing tools require a watch process, or hooks, or a sufficiently fast compiler in between the runtime. 

- ts-node and babel-node use TypeScript and Babel respectively to compile and run JavaScript on Node.js
  without an explicit build step for developers. Since Node.js sticks close to the latest version of V8,
  much of the time, the only thing they need to do is erase types.
- Deno uses TypeScript as its primary source language. Since Deno works with an up-to-date <!-- TODO -->
version of the V8 JavaScript engine, 
- Modern bundler front-ends like Vite and Snowpack process TypeScript directly and remove type annotations as necessary.

In short, while build tools have been nearly mandatory for web app development since the ES2015 era,
developers are increasingly able to write and execute standards-compliant JavaScript as-is, with no
build step. This is because of the stability of modern, standards-compliant JavaScript combined with
the availability of JavaScript modules in web browsers and Node.js.

### Limits of JSDoc Type Annotations

While build tools are not terribly difficult to use, they are yet another barrier to entry for many developers.
This is in part why the TypeScript team invested in support for types in JSDoc comments.
JSDoc comments had some existing precedence in the JavaScript community, and was leveraged by the Closure compiler.

This comment convention is often in build scripts, small web apps, server-side apps, and elsewhere where
the cost/benefit tradeoff of adding a build-tool is too high. Even when TypeScript doesn't provide type-checking
diagnostics, the comment convention is still leveraged in editor functionality because TypeScript powers
the JavaScript editing experience.

Here's an example of the JSDoc-based type syntax from [TypeScript's JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#param-and-returns).

```js
/**
 * @param {string}  p1 - A string param.
 * @param {string=} p2 - An optional param (Closure syntax)
 * @param {string} [p3] - Another optional param (JSDoc syntax).
 * @param {string} [p4="test"] - An optional param with a default value
 * @return {string} This is the result
 */
function stringsStringStrings(p1, p2, p3, p4) {
  // TODO
}
```

And here's the equivalent TypeScript syntax enabled by this proposal.

```ts
function stringsStringStrings(p1: string, p2?: string, p3?: string, p4 = "test"): string {
  // TODO
}
```

It is clear that JSDoc comments are typically more verbose.
On top of this, JSDoc comments only provide a subset of the feature set supported in TypeScript,
in part because it's difficult to provide syntactic room onto a comment-based representation.

Nevertheless, the JSDoc-based syntax remains useful, and the need for some form of type annotations in
JavaScript was significant enough for the TypeScript team to invest in it.

For the above reasons, the goal of this proposal is to allow a very large subset of the TypeScript
syntax to appear as-is in JavaScript source files, interpreted as comments.

**To summarize**:

- TypeScript's syntax has no runtime semantics<sup>1</sup>, so from the perspective of evaluation,
  TypeScript types are semantically equivalent to comments.
  The same goes for other static typing tools.
- As modern JavaScript has stabilized, and JavaScript modules have become more widely available,
  JavaScript developers are beginning to be able to write and evaluate code without a build step.
  This trend is just beginning, but it will continue over the next few years.
- The need to write and evaluate JavaScript code without a build step is already so important that
  TypeScript invested in an alternative syntax that uses JavaScript comments. This syntax is
  popular, even though it's substantially less pleasant to author, and even though it only supports
  a subset of TypeScript's semantics.
- This proposal aims to allow a very large subset of the TypeScript syntax,
  as well as that of other static typing tools, to be interpreted as JavaScript comments.
  This would improve the lives of users who are currently using the
  comment-based dialect of TypeScript. It would also allow many future developers of statically typed code to
  avoid the need for a build step, as their JavaScript peers are increasingly able to do.

<sup>1</sup> With a small number of exceptions, see the ["out of scope"](#intentional-omissions) section for more information.

## Status

by Gil Tayar and a number of contributors, see [history](https://github.com/giltayar/types-as-comments-proposal/commits/master).

Stage 0

Not yet presented to TC39. TS team are currently working on a grammar spec that may affect this proposal, so we are waiting for that before developing this proposal much further.

## Synopsis

This proposal aims to add typing annotation to JavaScript, not by defining a type
system, but rather by allowing type annotations to be included in the code
while being ignored by the JavaScript runtime. These annotations can be type checked by tools such
as TypeScript, ESlint, Flow, or Hegel, yet have the code run without any transpilation necessary.

What those type annotations mean is emphatically _not_ defined by this proposal. This proposal just
defines in what places type annotations _can_ be added to, and defines how the JavaScript parser
can know where the type annotations start and where they end in the code so that it can ignore them.

## Developer experience benefits

The primary goal of this proposal is to allow developers to gain the benefits of using an ergonomic static type system without
the costs that are incurred when authoring code in a language dialect that is not valid JavaScript syntax.

Unifying the authoring language and the execution language has many benefits - particularly during development.

- Simplicity:  No build step is required
  - Selecting and learning a toolchain becomes optional
  - Learning and managing build configuration becomes optional
  - Operating a toolchain becomes optional - no need to remember to press "build" before execution
- Singular Asset Management: No need to generate, store and manage generated code
  - One concept ("the code") rather than two (source + generated)
  - No risk of inconsistency (generated code not reflecting current source code)
  - Single mental model for referencing files in import specifiers
    - Side-steps the design decision of whether source files should import source files vs importing generated files
- Source code locations (line/column numbers) are preserved
- Sourcemaps are not required
  - No need to generate, store and deploy sourcemaps
  - No need to configure consumption of sourcemaps in the debugger
- Improved interactive debug experience
  - You can freely use original source code snippets in the REPL/console and the debugger
- Potential for improved debug information
  - The debugger now has access to more information, e.g. showing the type strings
- Faster time-to-execution
  - It is likely that native engine-based on-the-fly parsing will be faster than running a separate build tool transforming the code prior to execution.

If the developer chooses, they have the option to carry these benefits into productions as well, at the cost of increased code size and increased load times.  It can be thought of as shipping code to production that retains code comments.

The simplicity of tool-free language-level support for this widely-used syntax reduces the barrier-to-entry for new developers learning today's JavaScript.
It helps make using statically typed code more accessible.

See more about the motivation in [the FAQ](#faq).

## Proposal

The following proposal is a _strawperson_ proposal. Please treat it as such. It is more about the
spirit of ignoring type constructs in the code, than it is about the specific syntax. Having
said that, care was taken to be both TypeScript/Flow/Hegel compatible, yet also be true
to the spirit of JavaScript.

### Incorporating types into functions and variable declarations

In a function, certain tokens (discussed in the next section) after `:` and before the `,` or `)` of a parameter declaration are regarded as a type. Example:

```ts
function foo(a : (this<is><x, y>TYPE!), b: thisIsAlso) {
  //..
}
```

> In the example above, the types do not conform to any particular type system. This is to demonstrate that the JavaScript engine is not strictly constraining the type syntax.  Both the syntactic and semantic correctness of the types are determined by an _external type checker_ (such as TypeScript) analyzing the source code.

A function can also declare a return type using `:` after the parentheses:

```ts
function foo(): number {
  //..
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

## Optionality of parameters

A parameter name may be embellished with a postfix `?`. This signifies optionality in TypeScript and Flow. Example:

```ts
function split(str: string, separator?: string) {

}
```

### How to define where the type annotation begins and ends

How does the JavaScript parser know where a type annotation begins? In the above example,
as we defined, the `:` is used to indicate that a type begins. But how does it know that it
ends? In the above case, `(this<is><x, y>TYPE!)`, we can't just search for the comma, because
the type itself incorporates a `,`.

It's a bit unclear how to define this. Intuitively, it could be reasonable to parse tokens within matching parentheses and brackets (including `(...)`, `[...]`, `{...}`, or `<...>`), with the type ending when brackets are closed, but also permitting certain tokens to continue until a newline (if outside of a parenthized region).

Some more complexity comes in in cases such as:
- How incompatible would this scheme be, given that it may prohibit newlines or require parentheses in certain cases?
- How do we avoid ambiguity with JSX, which uses `<...>` in a decidedly different way?

Example of types that are allowed:

- Simple "identifier" style: `number`, `Foo`, `string`
- Adding `?`: `number?`, `?number`, `Foo?`
- Adding parentheses after an identifier: `string[]`, `Foo<T>`, `Foo<T extends ReturnType<Bar>>`
- Starting with parentheses: `{x: number, y: number}`, `{|x: number, y: number|}`, `(() => number)`

We're still considering how/whether the syntax could accommodate these cases without enclosing parentheses:

- Illegal characters in identifier: `number!`, `string | number`, `string & number`,
  `(x: number) => string`
- Multiple parentheses in sequence: `<T>(arg: T) => T`
- Unmatched parentheses: `Foo<T condition T < 5>`
- type operators: `typeof s`
- [Template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html):
  `` `${EmailLocaleIDs | FooterLocaleIDs}_id` ``

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

> Note that in TypeScript, interfaces can define only "object literal" types. This is a constraint in
  TypeScript and not a constraint for JavaScript in this proposal.
  Therefore the following syntax would be valid JavaScript syntax: `interface Point number`. We could also
  decide to make interfaces more limited and similar to TypeScript.

### Modules:  Importing and Exporting Types

#### Import Statements

##### Type-only Import Statements

The `type` keyword immediately after `import` means this is a ***type-only import*** that is entirely
ignored by JavaScript.

```ts
import type { someType } from 'module'
```

Aliasing type bindings using `as` is possible.
This is similar to aliasing imported value bindings.

```ts
import type { someType as alias } from 'module'
```

##### Type-only bindings for Import Statements

For mixed imports containing both type and value bindings, the user can express which bindings are type-only and must be erased by prefixing them with `type`.

```ts
import { someValue, type someType, someOtherValue } from 'module'
```

...is treated as the following JavaScript...

```ts
import { someValue               , someOtherValue } from 'module'
```

The erasure is restricted to the binding clause.
Meaning such imports are retained even if all bindings are declared type-only.

```ts
import { type someType as aliasType } from 'module'
```

...is treated as the following JavaScript...

```ts
import {                            } from 'module'
```

#### Export Statements

##### Exporting Type Declarations

One can export `type` and `interface` declarations, using `export` and the JavaScript runtime will fully erase them.

```ts
export type myType = number  
export interface myInterface {}
```

##### Type-only Export Statements

Just like values, the export site of a type can be independent of the type declaration.
This is a ***type-only export*** that is entirely erased.

```ts
type myType = number  
interface myInterface {}

export type { myType, myInterface }
```

Just like type imports, type exports supporting aliasing too.

```ts
type myType = number

export type { myType as aliasType }
```

##### Type-only bindings for Export Statements

Just like imports, type-only bindings can be used to erase individual export bindings.

```ts
type myType = number
var myValue;

export { myValue, type myType, myValue, type myType as aliasType } // EOF
```

...is treated as the following JavaScript...

```ts

var myValue;

export { myValue,              myValue                           } // EOF
```

### Classes

Class fields and methods can be annotated just like functions and variables:

```ts
class Point {
  x: number
  y: number

  move(dx: number, dy: number): void {x += dx; y += dy}
}
```

We can also add an `implements <type>` to it, which is ignored by JavaScript:

```ts
interface PointInterface {x: number, y: number}

class Point implements PointInterface {
  x: number
  y: number

  move(dx: number, dy: number) {this.x += dx; this.y += dy}
}
```

The semantics would be equivalent to the following, omitting the ignored elements:

```js
class Point {
  x
  y
  move(dx, dy) {this.x += dx; this.y += dy}
```

Static and type-only class element declarations (see [Declarations](#declarations)) can equally be supported.

```ts
class Point {
  static count: number;
  declare field: string;
}
```

### Typecasting

A new operator, `as`, is defined, which takes as a left operand an expression,
and a type as the right operand. It returns the left operand. Example

```ts
const point = JSON.parse(serializedPoint) as ({x: number, y: number})
```

### Generics

Generics can appear in types and interfaces. They MUST start with a `<` after the identifier
and end with a `>`:

```ts
type Foo<T> = T[]
interface Bar<T> { x: T }
```

Same goes for functions and classes (but not for variables and parameters):

```ts
function foo<T>() {}
class FooClass<T> {}
```

Generics are ignored by the JavaScript runtime.

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

### Declarations

`.d.ts` and `libdef` files have no use in JavaScript, and while the type checkers can test them, they
are ignored by JavaScript. However, it is valid to use these declarations inline in a JavaScript file,
as is sometimes useful: `declare` can be followed by a function or class declaration,
similar to [declarations in TypeScript](https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html).
Functions do not need the `declare` keyword to be considered a declaration--any function without a body is
treated as such.

```ts
declare class Foo { bar(x: number): void; }
declare function foo();
function baz();
```

Declarations are ignored by the JS engine.

> Note that we may drop the need for the `declare` keyword, given that most uses of `declare`
  are in `.d.ts` files that are ignored anyway by the JavaScript runtime.
  However, `declare` is needed within class declarations too so it currently remains in this proposal.

#### Example: Function overloads

If a function has some kind of type signature, but no body, this proposal would treat it as a declaration, leading the engine to ignore the declaration.
This form may be used for [TypeScript function overloading](https://www.typescriptlang.org/docs/handbook/functions.html#overloads). Example:

```ts
function foo(x: number): number
function foo(x: string): string {
  if (typeof x === number) {
    return x + 1
  } else {
    return x + "!"
  }
}
```

Note that this means that no variable binding or destructuring will happen as a result of the first line.

### Up for debate

A couple pieces of syntax would fit cleanly in with the "types as comments" model, but may feel like a bit of overreach. We think that this proposal could work with or without these pieces of syntax, and present various alternative options below.

#### Keywords in and around classes

Several keywords in TypeScript and other type systems are used outside of a type context:

- `abstract` classes and methods
- `private`, `protected` and `public` placement of fields and methods
- `readonly` fields
- `override` fields and methods

As an example, this proposal could support the following syntax:

```ts
class Point {
  public readonly x: number
}
```

If these are permitted as part of this proposal, the natural semantics would be to ignore them all, treating the above class as `class Point { x }`. As with types, the soft "guarantees" that these keywords provide are checked by the type checker. There would likely need to be slightly different syntax, e.g., to prohibit newlines after the new contextual keywords.

However, intuitively, it might feel strange to include this arbitrary set of keywords and permit them to be used "incorrectly". Also, more keywords are added over time (e.g., recently, `override`)--it may be "easier" to add these keywords than other parts of type syntax.

Another possibility, rather than parsing and ignoring these keywords, would be to to permit them in classes with some other comment-like syntax, such as:

- [In the type checker] Applying a special terse comment syntax of a format interpreted by the type checker

```ts
class Point {
  ///public readonly
  x: number
}
```

- [In the type checker] Putting the placement in the type location

```ts
class Point {
  x: public readonly number
}
```

- [In this proposal] Creating a new comment syntax which exists just for this sort of keyword, e.g., set off by a particular sigil, so that a magic comment syntax is not required

```ts
class Point {
  %public %readonly x: number
}
```

The above ideas try to strike a balance between not impeding too much on JavaScript
syntax, enabling TypeScript and other type checkers to define any traits they want in the future,
while breaking as little compatibility as possible with TypeScript. We're open to any of the four solutions presented here, or other ideas people may have.

#### Null typeguards

In TypeScript, one can write `x!.foo` to specify that `x` cannot be null,
even if its type specifies that it can be. This is known as a [null typeguard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#nullable-types).
This construct is syntactic sugar for `(x as NonNullable<typeof x>)`. It's debatable whether this syntax
should be included (as it feels somehow "deep" in the expression), but it would be straightforward to ignore a `!` and treat the expression as `x.foo`.

## Intentional Omissions

We consider the following items explicitly excluded from the scope of this proposal.

### Omitted: TypeScript features that generate code

Some constructs in TypeScript are not supported by this proposal because they have runtime semantics, generating JavaScript code rather than simply being stripped out and ignored. These constructs are not supported by this proposal, but could be added by a separate TC39 proposal.

- [Enums](https://www.typescriptlang.org/docs/handbook/enums.html)
- [Namespaces](https://www.typescriptlang.org/docs/handbook/namespaces.html)
- [Parameter properties](https://www.typescriptlang.org/docs/handbook/classes.html#parameter-properties)

All three of these features have workable equivalents in JavaScript, which could be transitioned to with the appropriate codemod.

### Omitted: JSX

[JSX](https://facebook.github.io/jsx/) is an XML-like syntax extension to JavaScript that is designed to be transformed by a pre-processor into valid JavaScript. It was originally popularized by [the React ecosystem](https://reactjs.org/docs/introducing-jsx.html) and now various compilers that support type-checking of JavaScript also support transforming JSX. Some users may hope that the JSX transform could also be directly supported by ECMAScript, to expand the set of use-cases that can be handled without a build step.

We do **not** consider JSX to be in scope of this proposal because:

- JSX is an orthogonal feature unrelated to optional static types. This proposal does not affect the viability of introducing JSX into ECMAScript via an independent proposal.
- JSX syntax expands into meaningful JavaScript code when transformed. This proposal is only concerned with syntax erasure.

## FAQ

### Does JavaScript need a type system?

It's a bit late to ask that question. In practice, JavaScript already does have an optional type system: TypeScript. It's opt-in, but it's a major presence in the ecosystem, and seems to be present somewhere in just about any big-enough JS codebase (if you consider dependencies). The question is not whether JS should have types, but rather "how should JS work with types?" One valid answer is that the current ecosystem provides sufficient support, but this proposal claims certain advantages.

### Why not define a type system for JS in TC39 instead?

TC39 has a tradition of programming language design which favors local, sound checks. By contrast, TypeScript's model--which has been highly successful for JS developers--is around non-local, unsound checks. TypeScript-style systems are expensive and unnecessary to check at application startup, whereas TC39 defines the semantics that are run by JS engines.

This proposal recognizes that trying to add a full type system to JavaScript is a multi-year
effort that has a high probability of failure due to the enormity of the task, and also
recognizes that the community has evolved type systems that it is already happy with. Specifically,
the emerging de-facto standard for a JavaScript type system is TypeScript.

### How does this proposal relate to TypeScript?

This proposal is a balancing act: trying to be as TypeScript compatible as possible while still allowing other type systems, and also not impeding the evolution of JavaScript's syntax too much. Standardizing all TS details or 100% compatibility with TS are non-goals.

While this proposal leans forward to be close to TypeScript, TypeScript may need to also lean forward to accomodate this proposal, by being open to the existence of style of code that stays within the expanded JS syntax. This style is more flexible and terse than the current JSDoc mode, but less complete than the full TypeScript language.

TypeScript would continue to exist alongside JS's slightly more restricted syntax: no existing TS codebases would need to change, but not all TypeScript code would run directly in JS engines, if it lives outside the subset.

### Should TypeScript be standardized in TC39?

TypeScript has been continuing to advance quickly. Both its grammar and typing rules continue to evolve, to the benefit of users. Tying this evolution to TC39 risks holding that benefit back. For example, TypeScript upgrades frequently require users to fix typing issues because the rules change, and this is often considered "worth it" because real bugs are found. However, standards aren't typically done with this version upgrade path; a move to standardization would require more conservatism. The goal here is to enable wider deployment of systems like TypeScript in diverse environments, not obstruct TS's evolution.

### Should TypeScript be sanctioned as JS's official type system?

Other type checkers, such as Flow and Hegel may wish to use this proposal to enable developers to use their type checkers to check their code.
Making this proposal be only about TypeScript can hamper this effort. "Competition" in this space
would be beneficial to JavaScript as it can enable experimentation that will lead to a better
type system than the ones we have today, so that when JavaScript is ready to standardize one,
a better one, and not necessarily just a popular one, will exist. This will even allow
experimentation with future type systems.

### Why not unofficially build TS checking and transpilation into various systems?

A number of systems, such as [ts-node](https://github.com/TypeStrong/ts-node) and [deno](https://deno.land/manual/getting_started/typescript), have tried this. Apart from startup performance issues, a common problem is compatibility across versions and modes, in type checking semantics, grammar, and transpilation output. This proposal would not subsume the needs for all of those features, but it would provide one compatible syntax and semantics to unify around for many needs.

### Why not stick to existing JS comment syntax?

Although it is possible to define types in existing JavaScript comments, as Closure and TypeScript's JSDoc mode do, this syntax is much more verbose and unergonomic. One might speculate that the syntactic overhead of JSDoc could be one of the forces that has led towards a migration from Closure Compiler to TypeScript, despite Closure Compiler's significant head-start.

### Doesn't all JS development do transpilation anyway? Will it really help to remove the type-desugaring step?

The JavaScript ecosystem has been slowly moving back to a transpilation-less future. The sunsetting
of IE11 and the rise of evergreen browsers that implement the latest JavaScript standard
means that developers can once again run standard JavaScript code without transpilation. The advent
of native ES modules in the browser and in Node.js also means that, at least in development, the ecosystem
is working its way to a future where even bundling is not necessary.
Node.js developers in particular, have historically avoided transpilation, and are today torn between
the ease of development that is brought by no transpilation, and the ease of development
that languages like TypeScript bring.

Implementing this proposal means that we can add type systems to this list of "things that don't need
transpilation anymore" and bring us closer to a world where transpilation is optional and not
a necessity.

### Can types be available via runtime reflection like [TypeScript's emitDecoratorMetadata](https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata)?

The proposal here differs significantly from Python's types, as the types in this proposal are entirely ignored, not evaluated as expressions or accessible at runtime as metadata. This difference is largely motivated by the existing community precedent, where JS type systems do not tend to use JS expression grammar for their types, so it is not possible to evaluate them as such.

At most, we could expose the types as strings, but it's not clear what anyone could do with those or how they should be exposed. This proposal does not try and expose the types as metadata, and only specifies that they are ignored by
the JS runtime.

### Does this proposal make all TypeScript programs valid JavaScript?

Most constructs in TypeScript are compatible, but not all,
and most of those that do not pass can be converted via simple codemod changes
that can make them both TypeScript compatible _and_ compatible with this proposal.

See the ["up for debate"](#up-for-debate) and ["Intentional Omissions"](#intentional-omissions) sections for more information.

### Does this proposal make all Flow programs valid JavaScript?

Flow is very similar to TypeScript, and so most type constructs are OK, with
a similar caveat whereby some types might need to be wrapped in parentheses to be compatible with
this proposal.

Two constructs that do not conform to this proposal are typecasting (e.g. `(x: number)`) and `opaque`
types `opaque type Meters = number`. Flow could consider modifying these in the language
so that they conform to this proposal, e.g. adopt the `as` operator as an alternative to
`(x: number)`, and `type Meters = (new number)`

### Does this proposal make all Hegel programs valid JavaScript?

Almost. Some types may need to be wrapped with parentheses to conform to this proposal's syntax limitations,
but otherwise they're the same.

### What about `.d.ts` files and "libdef" files?

`.d.ts` and "libdef" files are used by TypeScript and Flow respectively, as a kind of "header" file
that describes the signature of a package. This proposal can safely ignore them as it
does not need to interpret the semantics of the type information inside them. Of course,
TypeScript and Flow can continue reading and interpreting these files as they have done in the past.

### Does this proposal mean that TypeScript developers would have to modify their codebases?

No. TypeScript can continue to be TypeScript, with no compatibility impact or changes to codebases. This proposal would give developers the _option_ to restrict themselves to a particular subset of TypeScript which would run as JavaScript without transpilation.

Developers may still want to use TypeScript syntax for other reasons:

- Use of certain syntax features which are not supported in JavaScript (e.g., `enum`, parameter properties)
- Compatibility with existing code bases which may run into certain syntax edge cases that are handled differently
- Non-standard extensions/reinterpretations of JavaScript (e.g., legacy decorators, Set semantics for fields)

If developers decide to migrate an existing TypeScript codebase to JavaScript syntax under this proposal,
the goal of this proposal is that the modifications would be slight. Ideally, one could write a codemod that handles it
automatically. Hopefully, the effort would be small, and the promise of having TypeScript code that
does not need transpilation would be a big motivation. But the developers could decide
to stick with TypeScript transpilation and enjoy the full power of TypeScript.

### How should tools work with JavaScript type syntax?

Given the fact that some TypeScript features are [out of scope](#intentional-omissions), and that standard JavaScript will not evolve as fast as TypeScript or support its variety of configurations, there will continue to be an advantage for many tools to support TypeScript in its fuller form, beyond what is potentially standardized as JavaScript.

One pattern we see today, for the integration of TypeScript support into JavaScript tools, is a separation of TS syntax into an optional plugin or mode. This pattern can create friction for adoption. This proposal may reduce the cost of adopting types in JavaScript by forming a standard, versionless, always-on common base for type syntax. Full TypeScript support can be remain an opt-in mode on top of that.

### What about compatibililty with ReasonML, PureScript, and other statically typed languages that compile to JavaScript?

While these languages _compile_ to JavaScript, and have static typing, they are not supersets of
JavaScript, and thus are not relevant to this proposal.

### Will the ability to deploy typed source code directly result in bloated applications?

Returning to a world where code does not strictly need to be compiled prior to being used in production means that developers may end up deploying more code than is necessary.
Hence larger payloads over-the-wire for remotely served apps, and more text to parse at load time.

However this situation already exists.
Today, many users omit a build step and ship large amounts of comments and other extraneous information, e.g. unminified code.
It remains a best practice to perform an ahead-of-time optimization step on code destined for production if the use-case is performance-sensitive.

## Prior Art

### Other languages that implemented the "types as comments" idea

When Python decided to add a gradual type system to the language, it did it in two steps.
First, a proposal for type annotations was added to the language, that enabled
any "types" to be added to the code, where the Python interpreter ignored them (similar to this
proposal).
After a few years, on top of that proposal, a standard type system ("type hints")
was added to Python. See the [References section](#References) for links to the two proposals.

The proposal here differs significantly from Python's types, as the types in this proposal are entirely ignored, not evaluated as expressions or accessible at runtime as metadata. This difference is largely motivated by the existing community precedent, where JS type systems do not tend to use JS expression grammar for their types, so it is not possible to evaluate them as such.

Ruby, in v3,  has now also implemented RBS: type definitions that sit _beside_ the code
and are not part of it. See the [References section](#References) for more information.

### Languages that add type systems onto JavaScript

TypeScript, Flow, and Hegel are languages that implement type systems above standard JavaScript.
See the [references section](#References) for links to the documentation of these languages.

### Ability to add type systems to JavaScript via comments

Both TypeScript and Flow enable developers to write JavaScript code and incorporate
types as comments that the JavaScript runtime ignores.

For Flow, these are [Flow comment types](https://flow.org/en/docs/types/comments/), and
for TypeScript these are [JSDoc comments](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html).

See the author's blog post on their positive experience with TypeScript's JSDoc comments [here](https://gils-blog.tayar.org/posts/jsdoc-typings-all-the-benefits-none-of-the-drawbacks/).

Closure Compiler's type checking works entirely via JSDoc comments ([docs](https://developers.google.com/closure/compiler/docs/js-for-compiler)). The Closure Compiler team has received many requests for an in-line type syntax, but was hesitant to do this without a standard.

### Previous attempts in TC39

TC39 has previously discussed [guards](https://web.archive.org/web/20141214075910/http://wiki.ecmascript.org/doku.php?id=strawman:guards), which form a new, stronger type system. It has also discussed [optional types](https://github.com/samuelgoto/proposal-optional-types), a plan which is more similar to this proposal, but framed differently.

## References

- [TypeScript Reference](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Hegel Documentation](https://hegel.js.org/docs)
- [Flow documentation](https://flow.org/en/docs/)
- [Python spec for "types as comments"](https://www.python.org/dev/peps/pep-3107/)
- [Python followup spec that defined a standard type system](https://www.python.org/dev/peps/pep-0484/#abstractart)
- [Ruby 3 announcement, including a Ruby type system](https://www.ruby-lang.org/en/news/2020/12/25/ruby-3-0-0-released/)
- [Clojure Spec, the Clojure type system](https://clojure.org/guides/spec)
- [Github, State of the Octoverse, where TypeScript is the 4th most popular language](https://octoverse.github.com/)
- 
