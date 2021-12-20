# ECMAScript proposal: Types as Comments

This proposal aims to enable developers to add type annotations to their JavaScript code, allowing those annotations to be checked by a type checker that is _external to JavaScript_.
At runtime, a JavaScript engine ignores them, treating the types as comments.

The aim of this proposal is to enable developers to run programs written in [TypeScript](https://www.typescriptlang.org/), [Flow](https://flow.org/), and other static typing supersets of JavaScript without any need for transpilation, if they stick within a certain reasonably large subset of the language.

## Status

**Stage:** 0 (Not yet presented to TC39)

**Authors:**

- Gil Tayar
- Daniel Rosenwasser (Microsoft)
- Romulo Cintra (Igalia)
- Rob Palmer (Bloomberg)
- ...and a number of contributors, see [history](https://github.com/giltayar/proposal-types-as-comments/commits/master).

**Champions:**

- Daniel Rosenwasser (Microsoft)
- Romulo Cintra (Igalia)
- Rob Palmer (Bloomberg)

## Motivation

Over the past decade, the case for static type-checking has been proven out fairly successfully.
Microsoft, Google, and Facebook released [TypeScript](https://www.typescriptlang.org/), [Closure Compiler](https://developers.google.com/closure/compiler/), and [Flow](https://flow.org/), respectively.
These efforts have been large investments in JavaScript to reap the productivity gains they saw in other statically-typed languages - including finding errors earlier on, and leveraging powerful editor tooling.

In the case of TypeScript, Flow, and others, these variants of JavaScript brought convenient syntax for declaring and using types in JavaScript.
This syntax mostly does not affect runtime semantics, and in practice, most of the work of converting these variants to plain JavaScript amounts to erasing types.

### Community Usage and Demand

_Static Typing_ was the most requested language feature in [the _State of JS_ survey](https://2020.stateofjs.com/en-US/opinions/missing_from_js/) published in January 2021.

![missing-features-js](https://user-images.githubusercontent.com/6939381/143012138-96b93204-c456-4ab5-bb63-2648187ab8a7.png)

Additionally, TypeScript was currently listed as the 4th most-used language in [GitHub's *State of the Octoverse*](https://octoverse.github.com/), and on [Stack Overflow's Annual Developer Survey](https://insights.stackoverflow.com/survey/), it has been listed in the top 4 most-loved languages since 2017 and is one of the top 10 most-used languages.

### Trends in JavaScript Compilation

The rise of type syntax in JavaScript coincided with the rise of *downlevel compilation* (sometimes called "transpilation").
As ES2015 was standardized, JavaScript developers saw wonderful new features they could not immediately use because of constraints around supporting older browsers.
For example, an arrow function could provide developer ergonomics, but wouldn't run on every end-user's machine.
As a result, projects like Traceur, TypeScript, and Babel filled the gap by rewriting ES2015 code into equivalent code that would work on older runtimes.

Because type syntax is not natively supported in JavaScript, some tool had to exist to remove those types before running any code.
For type systems like TypeScript and Flow, it made sense to integrate a type erasure step with a syntax-downleveling step, so that users wouldn't need to run separate tools.
More recently, some bundlers have even started doing both.

But over time, we anticipate there will be less need for developers to downlevel-compile.
Evergreen browsers have become more of the norm, and on the back-end, Node.js and Deno use very recent versions of V8.
Over time, for many TypeScript users, the only necessary step between writing code and running it will be to erase away type annotations.

Build steps add another layer of concerns to writing code.
For example, ensuring freshness of the build output, optimizing the speed of the build, and managing sourcemaps for debugging, are all concerns that JavaScript initially side-stepped.
This simplicity made JavaScript much more approachable.

This proposal will reduce the need to have a build step which can make some development set-ups much simpler.
Users can simply run the code they wrote.
### Limits of JSDoc Type Annotations

While build tools are not terribly difficult to use, they are yet another barrier to entry for many developers.
This is in part why the TypeScript team invested in support for expressing types in JSDoc comments.
JSDoc comments had some existing precedence in the JavaScript community for documenting types, and these types were leveraged by the Closure compiler.

This comment convention is often found in build scripts, small web apps, server-side apps, and elsewhere where
the cost/benefit tradeoff of adding a build-tool is too high. Even when TypeScript doesn't provide type-checking
diagnostics, the comment convention is still leveraged in editor functionality because TypeScript powers
the underlying JavaScript editing experience.

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

JSDoc comments are typically more verbose.
On top of this, JSDoc comments only provide a subset of the feature set supported in TypeScript,
in part because it's difficult to provide expressive syntax within JSDoc comments.

Nevertheless, the JSDoc-based syntax remains useful, and the need for some form of type annotations in JavaScript was significant enough for the TypeScript team to invest in it.

For these reasons, the goal of this proposal is to allow a very large subset of TypeScript
syntax to appear as-is in JavaScript source files, interpreted as comments.

## Proposal

> The following is a _strawperson_ proposal. Please treat it as such.

### Type Annotations

Type annotations allow a developer to explicitly state what type a variable or expression is intended to be.
Annotations follow the name or binding pattern of a declaration, and are followed by the actual type.

```ts
let x: string;

x = "hello";

x = 100;
```

The above example places an annotation on `x`.
The type specified for `x` is `string`, and tools such as TypeScript can utilize that type;
however, a JavaScript engine that followed this proposal would execute every line here without error.
This is because annotations do not change the semantics of a program, and are equivalent to comments.

Annotations can also be placed on parameters to specify the types that they accept, and following the end of parameter lists to specify the return type of a function.

```ts
function equals(x: number, y: number): boolean {
    return x === y;
}
```

Here we have specified `number` for each parameter type, and `boolean` for the return type of `equals`.

### Type Declarations

Much of the time, developers need to create new names for types so that they can be easily referenced without repetition and so that they can be declared recursively.

One way to declare a type - specifically an object type - is with an interface.

```ts
interface Person {
    name: string;
    age: number;
}
```

Anything declared between the `{` and `}` of an `interface` is entirely ignored.

While `interface`s can extend other types in TypeScript, rules here are to be discussed.

A type alias is another kind of declaration.
It can declare a name for a broader set of types.

```ts
type CoolBool = boolean;
```

### Classes as Type Declarations

This proposal would allow class members like property and private field declarations to specify type annotations.

```ts
class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }

    getGreeting(): string {
        return `Hello, my name is ${this.name}`;
    }
}
```

Annotated class members would contribute to the type produced by constructing a given class.
In the above example, a type-checker could assume a new type named `Person`, with a property `name` of type `string` and a method `getGreeting` that returns a `string`;
but like any other syntax in this proposal, these annotations do not weigh into the runtime behavior of the program.

### Kinds of Types

The above examples use type names like `string`, `number`, and `boolean`, but TypeScript and others support types with more involved syntax than just a single identifier.
Some examples are given in the following table.

Name                                 | Example
-------------------------------------|--------
Types References with Type Arguments | `Set<string>`
Object Types                         | `{ name: string, age: number }`
Array Type Shorthand                 | `number[]`
Callable Type Shorthand              | `(x: string) => string`
Constructable Type Shorthand         | `new (b: Bread) => Duck`
Tuple Types                          | `[number, number]`
Union Types                          | `string \| number`
Intersection Types                   | `Named & Dog`
`this` Types                         | `this`
Indexed Access Types                 | `T[K]`

This table is not comprehensive.

The goal this proposal is to find a reasonable set of syntactic rules to accommodate these constructs (and more) without prohibiting existing type systems from innovating in this space.

The challenge with this is denoting the *end* of a type - this involves stating explicitly what tokens may and may not be part of a comment.
An easy first step is to ensure that anything within matching parentheses and brackets (`(...)`, `[...]`, `{...}`, or `<...>`) can be immediately skipped.
Going further is where things get harder.

These rules have not yet been established, but will be explored in more detail upon advancement of this proposal.

See also

* [Allowed types](/syntax/grammar.md#allowed-types)
* [Types under consideration](/syntax/grammar.md#types-under-consideration)
* [Annotation type delimiters](/syntax/grammar.md#annotation-type-delimiters-and-allowed-types)

### Parameter Optionality

In JavaScript, parameters are technically "optional" - when arguments are omitted, and the parameters of a function will be assigned the value `undefined` upon invocation.
This can be a source of errors, and it is useful signal whether or not a parameter is actually optional.

To specify that a parameter is optional, the name of that parameter can be followed with a `?`.

```ts
function split(str: string, separator?: string) {
    // ...
}
```

### Importing and Exporting Types

As projects get bigger, code is split into modules, and sometimes a developer will need to refer to a type declared in another file.

Types declarations can be exported by prefixing them with the `export` keyword.

```ts
export type SpecialBool = boolean;

export interface Person {
    name: string;
    age: number;
}
```

Types can also be exported using an `export type` statement.

```ts
export type { SomeLocalType };

export type { SomeType as AnotherType } from "some-module";
```

Correspondingly, another module can use an `import type` statement to reference these types.

```ts
import type { Person } from "schema";

let person: Person;

// or...

import type * as schema from "schema";

let person: schema.Person;
```

These `type`-specified declarations act as comments as well.
They would not trigger any resolution or inclusion of modules.
Similarly, their named bindings are not validated, and thus there is no runtime error if a named binding references an entity that was never declared.
Instead, design-time tools would be free to statically analyze these declarations and issue an error under such conditions.

#### Type-Only Named Bindings

Maintaining separate import statements for values and types can be cumbersome - especially when many modules export both types and values.

```ts
import { parseSourceFile } from "./parser";
import type { SourceFile } from "./parser";

// ...

let file: SourceFile;
try {
    file = parseSourceFile(filePath);
}
catch {
  // ...
}
```

To support `import` or `export` statements containing both type and value bindings, a user can express which bindings are type-only by prefixing them with the `type` keyword.

```ts
import { parseSourceFile, type SourceFile } from "./parser";
```

A major difference with the above is that such imports are retained even if all bindings are declared type-only.

```ts
// This still imports "./parser" at runtime.
import { type SourceFile } from "./parser";
```
 
### Type Assertions

Type systems do not have perfect information about the runtime type of an expression.
In some cases, they will need be informed of a more-appropriate type at a given position.
Type assertions - sometimes called casts - are a means of asserting an expression's static type.

```ts
const point = JSON.parse(serializedPoint) as ({ x: number, y: number });
```

The term "type assertion" was chosen in TypeScript to distance from the idea of a "cast" which often has runtime implications.
In contrast, type assertions have no runtime behavior.

#### Non-Nullable Assertions

One of the most common type-assertions is one to convince a type-system that a value is neither `null` nor `undefined`.
One can write `x!.foo` to specify that `x` cannot be null or `undefined`.

```ts
document.getElementById("entry")!.innerText = "...";
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

> Generics are ignored by the JavaScript runtime.

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

One can explicitly specify the type arguments of a generic function invocation or generic class instantiation [in TypeScript.](https://www.typescriptlang.org/docs/handbook/2/functions.html#specifying-type-arguments)

```ts
// TypeScript
add<number>(4, 5)
new Point<bigint>(4, 5)
```

The above syntax is already valid JavaScript that users may rely on, so we cannot use this syntax as-is.
We expect some form of new syntax could be used to resolve this ambiguity.
No specific solution is proposed at this point of time, but one example option is to use a syntactic prefix such as `::`

```ts
// Types as Comments - example syntax solution
add::<number>(4, 5)
new Point::<bigint>(4, 5)
```

The type argument (`::<type>`) would be ignored by the JavaScript runtime.
It would be natural for the non-ambiguous syntax to become first-class syntax in TypeScript as well.

### `this` parameter

A function can have a parameter `this` as the first parameter, and this parameter (and its type)
is ignored by the runtime and is not considered as part of the runtime parameters.

> Note that this does not break JavaScript backward compatibility,
  since `this` is not allowed as a parameter name today.

### Declarations

`.d.ts` and `libdef` files have no use in JavaScript, and while the type checkers can test them, they are ignored by JavaScript. However, this proposal allows inline declarations.

The `declare` keyword can be followed by a function or class declaration,
similar to [declarations in TypeScript](https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html). Additionally, Functions do not need the `declare` keyword to be considered a declaration--any function, any function without a body is
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

##### Function overloads

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

> Note that this means that no variable binding or destructuring will happen as a result of the first line.

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


## Up for debate

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

## FAQ

#### Does JavaScript need a type system?

It's a bit late to ask that question. In practice, JavaScript already does have an optional type system: TypeScript. It's opt-in, but it's a major presence in the ecosystem, and seems to be present somewhere in just about any big-enough JS codebase (if you consider dependencies). The question is not whether JS should have types, but rather "how should JS work with types?" One valid answer is that the current ecosystem provides sufficient support, but this proposal claims certain advantages.

#### Why not define a type system for JS in TC39 instead?

TC39 has a tradition of programming language design which favors local, sound checks. By contrast, TypeScript's model--which has been highly successful for JS developers--is around non-local, unsound checks. TypeScript-style systems are expensive and unnecessary to check at application startup, whereas TC39 defines the semantics that are run by JS engines.

This proposal recognizes that trying to add a full type system to JavaScript is a multi-year
effort that has a high probability of failure due to the enormity of the task, and also
recognizes that the community has evolved type systems that it is already happy with. Specifically,
the emerging de-facto standard for a JavaScript type system is TypeScript.

#### How does this proposal relate to TypeScript?

This proposal is a balancing act: trying to be as TypeScript compatible as possible while still allowing other type systems, and also not impeding the evolution of JavaScript's syntax too much. Standardizing all TS details or 100% compatibility with TS are non-goals.

While this proposal leans forward to be close to TypeScript, TypeScript may need to also lean forward to accomodate this proposal, by being open to the existence of style of code that stays within the expanded JS syntax. This style is more flexible and terse than the current JSDoc mode, but less complete than the full TypeScript language.

TypeScript would continue to exist alongside JS's slightly more restricted syntax: no existing TS codebases would need to change, but not all TypeScript code would run directly in JS engines, if it lives outside the subset.

#### Should TypeScript be standardized in TC39?

TypeScript has been continuing to advance quickly. Both its grammar and typing rules continue to evolve, to the benefit of users. Tying this evolution to TC39 risks holding that benefit back. For example, TypeScript upgrades frequently require users to fix typing issues because the rules change, and this is often considered "worth it" because real bugs are found. However, standards aren't typically done with this version upgrade path; a move to standardization would require more conservatism. The goal here is to enable wider deployment of systems like TypeScript in diverse environments, not obstruct TS's evolution.

#### Should TypeScript be sanctioned as JS's official type system?

Other type checkers, such as Flow and Hegel may wish to use this proposal to enable developers to use their type checkers to check their code.
Making this proposal be only about TypeScript can hamper this effort. "Competition" in this space
would be beneficial to JavaScript as it can enable experimentation that will lead to a better
type system than the ones we have today, so that when JavaScript is ready to standardize one,
a better one, and not necessarily just a popular one, will exist. This will even allow
experimentation with future type systems.

#### Why not unofficially build TS checking and transpilation into various systems?

A number of systems, such as [ts-node](https://github.com/TypeStrong/ts-node) and [deno](https://deno.land/manual/getting_started/typescript), have tried this. Apart from startup performance issues, a common problem is compatibility across versions and modes, in type checking semantics, grammar, and transpilation output. This proposal would not subsume the needs for all of those features, but it would provide one compatible syntax and semantics to unify around for many needs.

#### Why not stick to existing JS comment syntax?

Although it is possible to define types in existing JavaScript comments, as Closure and TypeScript's JSDoc mode do, this syntax is much more verbose and unergonomic. One might speculate that the syntactic overhead of JSDoc could be one of the forces that has led towards a migration from Closure Compiler to TypeScript, despite Closure Compiler's significant head-start.

#### Doesn't all JS development do transpilation anyway? Will it really help to remove the type-desugaring step?

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

#### Can types be available via runtime reflection like [TypeScript's emitDecoratorMetadata](https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata)?

The proposal here differs significantly from Python's types, as the types in this proposal are entirely ignored, not evaluated as expressions or accessible at runtime as metadata. This difference is largely motivated by the existing community precedent, where JS type systems do not tend to use JS expression grammar for their types, so it is not possible to evaluate them as such.

At most, we could expose the types as strings, but it's not clear what anyone could do with those or how they should be exposed. This proposal does not try and expose the types as metadata, and only specifies that they are ignored by
the JS runtime.

#### Does this proposal make all TypeScript programs valid JavaScript?

Most constructs in TypeScript are compatible, but not all,
and most of those that do not pass can be converted via simple codemod changes
that can make them both TypeScript compatible _and_ compatible with this proposal.

See the ["up for debate"](#up-for-debate) and ["Intentional Omissions"](#intentional-omissions) sections for more information.

#### Does this proposal make all Flow programs valid JavaScript?

Flow is very similar to TypeScript, and so most type constructs are OK, with
a similar caveat whereby some types might need to be wrapped in parentheses to be compatible with
this proposal.

Two constructs that do not conform to this proposal are typecasting (e.g. `(x: number)`) and `opaque`
types `opaque type Meters = number`. Flow could consider modifying these in the language
so that they conform to this proposal, e.g. adopt the `as` operator as an alternative to
`(x: number)`, and `type Meters = (new number)`

#### Does this proposal make all Hegel programs valid JavaScript?

Almost. Some types may need to be wrapped with parentheses to conform to this proposal's syntax limitations,
but otherwise they're the same.

#### What about `.d.ts` files and "libdef" files?

`.d.ts` and "libdef" files are used by TypeScript and Flow respectively, as a kind of "header" file
that describes the signature of a package. This proposal can safely ignore them as it
does not need to interpret the semantics of the type information inside them. Of course,
TypeScript and Flow can continue reading and interpreting these files as they have done in the past.

#### Does this proposal mean that TypeScript developers would have to modify their codebases?

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

#### How should tools work with JavaScript type syntax?

Given the fact that some TypeScript features are [out of scope](#intentional-omissions), and that standard JavaScript will not evolve as fast as TypeScript or support its variety of configurations, there will continue to be an advantage for many tools to support TypeScript in its fuller form, beyond what is potentially standardized as JavaScript.

One pattern we see today, for the integration of TypeScript support into JavaScript tools, is a separation of TS syntax into an optional plugin or mode. This pattern can create friction for adoption. This proposal may reduce the cost of adopting types in JavaScript by forming a standard, versionless, always-on common base for type syntax. Full TypeScript support can be remain an opt-in mode on top of that.

#### What about compatibililty with ReasonML, PureScript, and other statically typed languages that compile to JavaScript?

While these languages _compile_ to JavaScript, and have static typing, they are not supersets of
JavaScript, and thus are not relevant to this proposal.

#### Will the ability to deploy typed source code directly result in bloated applications?

Returning to a world where code does not strictly need to be compiled prior to being used in production means that developers may end up deploying more code than is necessary.
Hence larger payloads over-the-wire for remotely served apps, and more text to parse at load time.

However this situation already exists.
Today, many users omit a build step and ship large amounts of comments and other extraneous information, e.g. unminified code.
It remains a best practice to perform an ahead-of-time optimization step on code destined for production if the use-case is performance-sensitive.

## Prior Art

#### Other languages that implemented the "types as comments" idea

When Python decided to add a gradual type system to the language, it did it in two steps.
First, a proposal for type annotations was added to the language, that enabled
any "types" to be added to the code, where the Python interpreter ignored them (similar to this
proposal).
After a few years, on top of that proposal, a standard type system ("type hints")
was added to Python. See the [References section](#References) for links to the two proposals.

The proposal here differs significantly from Python's types, as the types in this proposal are entirely ignored, not evaluated as expressions or accessible at runtime as metadata. This difference is largely motivated by the existing community precedent, where JS type systems do not tend to use JS expression grammar for their types, so it is not possible to evaluate them as such.

Ruby, in v3,  has now also implemented RBS: type definitions that sit _beside_ the code
and are not part of it. See the [References section](#References) for more information.

#### Languages that add type systems onto JavaScript

TypeScript, Flow, and Hegel are languages that implement type systems above standard JavaScript.
See the [references section](#References) for links to the documentation of these languages.

#### Ability to add type systems to JavaScript via comments

Both TypeScript and Flow enable developers to write JavaScript code and incorporate
types as comments that the JavaScript runtime ignores.

For Flow, these are [Flow comment types](https://flow.org/en/docs/types/comments/), and
for TypeScript these are [JSDoc comments](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html).

See the author's blog post on their positive experience with TypeScript's JSDoc comments [here](https://gils-blog.tayar.org/posts/jsdoc-typings-all-the-benefits-none-of-the-drawbacks/).

Closure Compiler's type checking works entirely via JSDoc comments ([docs](https://developers.google.com/closure/compiler/docs/js-for-compiler)). The Closure Compiler team has received many requests for an in-line type syntax, but was hesitant to do this without a standard.

#### Previous attempts in TC39

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
