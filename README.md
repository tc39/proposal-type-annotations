> ⚠️ *This document has not been updated since the March 2022 Plenary Discussion of TC39. Details will change in the coming days.*

# ECMAScript proposal: Type Annotations

This proposal aims to enable developers to add type annotations to their JavaScript code, allowing those annotations to be checked by a type checker that is _external to JavaScript_.
At runtime, a JavaScript engine ignores them, treating the types as comments.

The aim of this proposal is to enable developers to run programs written in [TypeScript](https://www.typescriptlang.org/), [Flow](https://flow.org/), and other static typing supersets of JavaScript without any need for transpilation, if they stick within a certain reasonably large subset of the language.

[A *tentative* grammar for this proposal is available here.](https://tc39.es/proposal-type-annotations/grammar.html)

## Status

**Stage:** 1

**Authors:**

- Gil Tayar
- Daniel Rosenwasser (Microsoft)
- Romulo Cintra (Igalia)
- Rob Palmer (Bloomberg)
- ...and a number of contributors, see [history](https://github.com/tc39/proposal-type-annotations/commits/master).

**Champions:**

- Daniel Rosenwasser (Microsoft)
- Romulo Cintra (Igalia)
- Rob Palmer (Bloomberg)

## Motivation

Over the past decade, the case for static type-checking has been proven out fairly successfully.
Microsoft, Google, and Facebook released [TypeScript](https://www.typescriptlang.org/), [Closure Compiler](https://developers.google.com/closure/compiler/), and [Flow](https://flow.org/), respectively.
These efforts have been large investments in JavaScript to reap the productivity gains they saw in other statically-typed languages including finding errors earlier on, and leveraging powerful editor tooling.

In the case of TypeScript, Flow, and others, these variants of JavaScript brought convenient syntax for declaring and using types in JavaScript.
This syntax mostly does not affect runtime semantics, and in practice, most of the work of converting these variants to plain JavaScript amounts to erasing types.

### Community Usage and Demand

_Static Typing_ was the most requested language feature in the [_State of JS_ survey](https://stateofjs.com) in both [2020](https://2020.stateofjs.com/en-US/opinions/missing_from_js/) and [2021](https://2021.stateofjs.com/en-US/opinions/#currently_missing_from_js_wins).

![missing-features-js](https://user-images.githubusercontent.com/6939381/143012138-96b93204-c456-4ab5-bb63-2648187ab8a7.png)

Additionally, TypeScript was currently listed as the 4th most-used language in [GitHub's *State of the Octoverse*](https://octoverse.github.com/), and on [Stack Overflow's Annual Developer Survey](https://insights.stackoverflow.com/survey/) it has been listed in both the top 4 most-loved languages since 2017 and the 10 most-used languages.

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
the cost/benefit tradeoff of adding a build-tool is too high.
Even when TypeScript doesn't provide type-checking diagnostics, the comment convention is still leveraged in editor functionality because TypeScript powers the underlying JavaScript editing experience.

Here's an example of the JSDoc-based type syntax from [TypeScript's JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#param-and-returns).

```js
/**
 * @param {string}  p1 - A string param.
 * @param {string=} p2 - An optional param (Closure syntax)
 * @param {string} [p3] - Another optional param (JSDoc syntax).
 * @param {string} [p4="test"] - An optional param with a default value
 * @return {string} This is the result
 */
function stringsStringStrings(p1, p2, p3, p4="test") {
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
Annotations follow the name or binding pattern of a declaration.
They start with a `:` and are followed by the actual type.

```ts
let x: string;

x = "hello";

x = 100;
```

In the example above, `x` is annotated with the type `string`.
Tools such as TypeScript can utilize that type, and might choose to error on the statement `x = 100`;
however, a JavaScript engine that follows this proposal would execute every line here without error.
This is because annotations do not change the semantics of a program, and are equivalent to comments.

Annotations can also be placed on parameters to specify the types that they accept, and following the end of a parameter list to specify the return type of a function.

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

This proposal would allow class members, like property declarations and private field declarations, to specify type annotations.

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

For most type-checkers, annotated class members would contribute to the type produced by constructing a given class.
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

The goal of this proposal is to find a reasonable set of syntactic rules to accommodate these constructs (and more) without prohibiting existing type systems from innovating in this space.

The challenge with this is denoting the *end* of a type - this involves stating explicitly what tokens may and may not be part of a comment.
An easy first step is to ensure that anything within matching parentheses and brackets (`(...)`, `[...]`, `{...}`, or `<...>`) can be immediately skipped.
Going further is where things get harder.

These rules have not yet been established, but will be explored in more detail upon advancement of this proposal.

See also

* [Allowed types](/syntax/grammar-ideas.md#allowed-types)
* [Types under consideration](/syntax/grammar-ideas.md#types-under-consideration)
* [Annotation type delimiters](/syntax/grammar-ideas.md#annotation-type-delimiters-and-allowed-types)

### Parameter Optionality

In JavaScript, parameters are technically "optional" - when arguments are omitted, the parameters of a function will be assigned the value `undefined` upon invocation.
This can be a source of errors, and it is a useful signal whether or not a parameter is actually optional.

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
In some cases, they will need to be informed of a more-appropriate type at a given position.
Type assertions - sometimes called casts - are a means of asserting an expression's static type.

```ts
const point = JSON.parse(serializedPoint) as ({ x: number, y: number });
```

The term "type assertion" was chosen in TypeScript to distance from the idea of a "cast" which often has runtime implications.
In contrast, type assertions have no runtime behavior.

#### Non-Nullable Assertions

One of the most common type-assertions in TypeScript is the non-null assertion operator.
It convinces the type-checker that a value is neither `null` nor `undefined`.
For example, one can write `x!.foo` to specify that `x` cannot be `null` nor `undefined`.

```ts
// assert that we have a valid 'HTMLElement', not 'HTMLElement | null'
document.getElementById("entry")!.innerText = "...";
```

In TypeScript, the non-null assertion operator has no runtime semantics, and this proposal would specify it similarly;
however, there is a case for adding non-nullable assertions as a runtime operator instead.
If a runtime operator is preferred, that would likely become an independent proposal.

### Generics

In modern type systems, it's not enough to just talk about having an `Array` - often, we're interested in what's *in* the `Array` (e.g. whether we have an `Array` of `strings`).
*Generics* give us a way to talk about things like containers over types, and the way we talk about an `Array` of `strings` is by writing `Array<string>`.

Like everything else in this proposal, generics have no runtime behavior and would be ignored by a JavaScript runtime.

#### Generic Declarations

Generic type parameters can appear on `type` and `interface` declarations.
They must start with a `<` after the identifier and end with a `>`:

```ts
type Foo<T> = T[]

interface Bar<T> {
    x: T;
}
```

Functions and classes can also have type parameters, though variables and parameters cannot.

```ts
function foo<T>(x: T) {
    return x;
}

class Box<T> {
    value: T;
    constructor(value: T) {
        this.value = value;
    }
}
```

### Generic Invocations

One can explicitly specify the type arguments of a generic function invocation or generic class instantiation [in TypeScript](https://www.typescriptlang.org/docs/handbook/2/functions.html#specifying-type-arguments).

```ts
// TypeScript
add<number>(4, 5)
new Point<bigint>(4n, 5n)
```

The above syntax is already valid JavaScript that users may rely on, so we cannot use this syntax as-is.
We expect some form of new syntax that could be used to resolve this ambiguity.
No specific solution is proposed at this point of time, but one example option is to use a syntactic prefix such as `::`

```ts
// Types Annotations - example syntax solution
add::<number>(4, 5)
new Point::<bigint>(4n, 5n)
```

These type arguments (`::<type>`) would be ignored by the JavaScript runtime.
It would be reasonable for this non-ambiguous syntax to be adopted in TypeScript as well.

### `this` Parameters

A function can have a parameter named `this` as the first parameter, and this parameter (and its type) is ignored by the runtime.
It has no effect on the `length` property of the function, and does not impact values like `arguments`.

```ts
function sum(this: SomeType, x: number, y: number) {
    // ...
}
```

It would be expected that using a `this` parameter in an arrow function would either be disallowed by the grammar, or trigger an early error.

```ts
// Error!
const oops = (this: SomeType) => {
    // ...
};
```

## Intentional Omissions

We consider the following items explicitly excluded from the scope of this proposal.

### Omitted: TypeScript-specific features that generate code

Some constructs in TypeScript are not supported by this proposal because they have runtime semantics, generating JavaScript code rather than simply being stripped out and ignored.
These constructs are not in the scope of this proposal, but could be added by separate TC39 proposals.

- [Enums](https://www.typescriptlang.org/docs/handbook/enums.html)
- [Namespaces](https://www.typescriptlang.org/docs/handbook/namespaces.html)
- [Parameter properties](https://www.typescriptlang.org/docs/handbook/classes.html#parameter-properties)

### Omitted: JSX

[JSX](https://facebook.github.io/jsx/) is an XML-like syntax extension to JavaScript that is designed to be transformed by a pre-processor into valid JavaScript.
It is widely used in [the React ecosystem](https://reactjs.org/docs/introducing-jsx.html), but it has been used for different libraries and frameworks.
Because JSX directly interleaves with JavaScript code, compilers and type-checkers for JavaScript typically also support checking and transforming JSX as well.
Some users may hope that the JSX transform could also be directly supported by ECMAScript, to expand the set of use-cases that can be handled without a build step.

We do **not** consider JSX to be in scope of this proposal because:

- JSX is an orthogonal feature that is independent of optional static types. This proposal does not affect the viability of introducing JSX into ECMAScript via an independent proposal.
- JSX syntax expands into meaningful JavaScript code when transformed. This proposal is only concerned with syntax erasure.

## Up For Debate

A couple pieces of syntax would fit cleanly in with the "types as comments" model, but may feel like a bit of overreach.
We think that this proposal could work with or without these pieces of syntax, and in some cases present various alternative options below.

### Ambient Declarations

Occasionally it is necessary to inform type-checkers that certain values exist, or even that modules exist.
Type systems have what are called *ambient declarations*, where a declaration will omit its implementation.
While type systems typically have their own "declaration file" formats just for declarations like these (e.g. `.d.ts` files in TypeScript, `.flow.js` in Flow, etc.), it can be convenient to declare these values in an implementation file (i.e. a `.js` file) as well.

In type systems today, a `declare` keyword can precede bindings such as variable, function, and class declarations.

```ts
declare let x: string;

declare class Foo {
    bar(x: number): void;
}

declare function foo(): boolean;
```

At the moment, this proposal does not reserve space for ambient declarations, but it is an option.

### Function Overloads

In existing type systems, function/method declarations may omit their body.
This is used for [function overloading](https://www.typescriptlang.org/docs/handbook/functions.html#overloads), which communicates that the return type of a function varies with its inputs.

```ts
function foo(x: number): number
function foo(x: string): string;
function foo(x: string | number): string | number {
    if (typeof x === number) {
          return x + 1
    }
    else {
        return x + "!"
    }
}
```

At the moment, this proposal does not reserve space for overload declarations, but it is an option.

### Class and Field Modifiers

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

If these are permitted as part of this proposal, the semantics would be to ignore them all, treating the above class the same as the following.

```ts
class Point {
    x;
}
```

As with types, these are "soft guarantees" that are not enforced at runtime, but are checked by the type checker.
There would likely need to be slightly different syntax to prohibit newlines after these new contextual keywords.

It might feel strange to include this set of keywords and permit them to be used "incorrectly".
Additionally, there may be more keywords added over time (e.g. `override` most recently).

As one way to achieve the same functionality, existing type systems could find a compromise between type annotation syntax and existing comment syntax.
For example, TypeScript already supports some of these modifiers in JSDoc.

```ts
class Point {
  /**
   * @public
   * @readonly
   */
  x: number
}
```

There might be another direction in which this proposal expands comment syntax just to support modifiers like these, which lead with a specific sigil.

```ts
class Point {
  %public %readonly x: number

  @@public @@readonly x: number
}
```

The above ideas try to strike a balance between not overreaching in syntax, while also achieving maximal compatibility with existing type systems.
We're open to any of the four solutions presented here, or other ideas people may have.

## FAQ

### Does JavaScript need static type-checking?

Given how much effort organizations and teams have put into building type-checkers and adopting them, the answer is **yes**.
Perhaps not every developer will reach for static type-checking, **and that's okay** - that's why this proposal makes type annotations entirely optional;
however, the ecosystem demand for using types is undeniable.

TypeScript has done a great job of demonstrating this - it's gained very widespread use with broad signals that people want to keep using it.
It's opt-in, but it has a major presence in the ecosystem, and these days TypeScript support is seen as a huge advantage for libraries.

The question is not whether JS should have types, but rather "how should JS work with types?"
One valid answer is that the current ecosystem provides sufficient support where types are stripped out separately ahead-of-time, but this proposal may provide advantages over that approach.

### Why not define a type system for JS in TC39 instead?

TC39 has a tradition of programming language design which favors local, sound checks.
By contrast, TypeScript's model -- which has been highly successful for JS developers -- is around non-local, best-effort checks.
TypeScript-style systems are expensive to check at application startup, and would be redundant every time you run your JavaScript applications.

Additionally, defining a type system to run directly in the browser means that improved type analyses would become breaking changes **for the users of JavaScript applications**, rather than for developers.
This would [violate goals around web compatibility (i.e. "don't break the web")](https://github.com/tc39/how-we-work/blob/cc47a79340a773876cb03371dc2d46b9d9ce9695/terminology.md#web-compatibilitydont-break-the-web), so type system innovation would become near-impossible.
Allowing other type systems to analyze code separately provides developers with choice, innovation, and freedom for developers to opt-out of checking at any time.

In contrast, trying to add a full type system to JavaScript would be an enormous multi-year effort that would likely never reach consensus.
This proposal recognizes that fact, and also recognizes that the community has evolved type systems that it is already happy with.

### How does this proposal relate to TypeScript?

This proposal is a balancing act: trying to be as TypeScript compatible as possible while still allowing other type systems, and also not impeding the evolution of JavaScript's syntax too much.
We acknowledge that full compatibility is not within scope, but we will strive to maximize compatibility and minimize differences.

This proposal will require work from both ECMAScript and TypeScript itself, where ECMAScript expands its current syntax, but TypeScript makes certain concessions so that types can fit into that space.
As mentioned elsewhere, some constructs (like `enum`s and `namespace`s) have been set aside with the option to propose them separately in TC39.
Others are still up for discussion (like `class` modifiers and ambient declarations).
And for others, there will need to be work to disambiguate current code (like arrow functions).

TypeScript would continue to exist alongside JavaScript's slightly more restricted type syntax.
In other words, **all existing TypeScript projects would continue to compile, and no existing TypeScript codebase would need to change**.
But taking any existing TypeScript code that lives outside of JavaScript's type syntax would not run - it would still need to be compiled away.

### Should TypeScript be standardized in TC39?

TypeScript has continued to evolve very quickly in both syntax and type analyses, to the benefit of users.
Tying this evolution to TC39 risks holding that benefit back.
For example, TypeScript upgrades often require users to fix type issues because the rules change, and this is often considered "worth it" because real bugs are found;
however, this version upgrade path wouldn't be viable for the ECMAScript standard.
A move to standardization would require more conservatism.
The goal here is to enable wider deployment of systems like TypeScript in diverse environments, not obstruct TypeScript's evolution.

### Should TypeScript be sanctioned as JS's official type system?

It's unclear what it would mean for there to be an "official" type system for JavaScript.
For example, there is no "official" linter or "official" formatter for JavaScript.
Instead there are tools that grow in popularity and evolve over time.

Additionally, type checkers, such as Flow, Closure, and Hegel may wish to use this proposal to enable developers to use their type checkers to check their code.
Making this proposal be only about TypeScript can hamper this effort.
Amicable competition in this space would be beneficial to JavaScript as it can enable experimentation and new ideas.

### Why not unofficially build TS checking and compilation into various systems?

A number of systems, such as [ts-node](https://github.com/TypeStrong/ts-node) and [deno](https://deno.land/manual/getting_started/typescript), have tried this.
Apart from startup performance issues, a common problem is compatibility across versions and modes, in type checking semantics, grammar, and transpilation output. 
This proposal would not subsume the needs for all of those features, but it would provide one compatible syntax and semantics to unify around for many needs.

### Why not stick to existing JS comment syntax?

Although it is possible to define types in existing JavaScript comments, as Closure and TypeScript's JSDoc mode do, this syntax is much more verbose and unergonomic.

Consider the fact that JSDoc type annotations were present in Closure Compiler prior to TypeScript, and that TypeScript's JSDoc support has been present for years now.
While types in JSDoc has grown over the years, most type-checked JavaScript is still written in TypeScript files with TypeScript syntax.
This is similarly the case with Flow, where Flow's type-checker can analyze Flow-like syntax in existing JavaScript comments, but most Flow users continue to just use direct annotation/declaration syntax.

### Don't all JS developers transpile anyway? Will it really help to remove the type-desugaring step?

The JavaScript ecosystem has been slowly moving back to a transpilation-less future. The sunsetting of IE11 and the rise of evergreen browsers that implement the latest JavaScript standard means that developers can once again run standard JavaScript code without transpilation.
The advent of native ES modules in the browser and in Node.js also means that, at least in development, the ecosystem is working its way to a future where even bundling is not necessary.
Node.js developers in particular, have historically avoided transpilation, and are today torn between the ease of development that is brought by no transpilation, and the ease of development that languages like TypeScript bring.

Implementing this proposal means that we can add type systems to this list of "things that don't need transpilation anymore" and bring us closer to a world where transpilation is optional and not a necessity.

### Can types be available via runtime reflection like [TypeScript's emitDecoratorMetadata](https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata)?

The proposal here differs significantly from Python's types, as the types in this proposal are entirely ignored, not evaluated as expressions or accessible at runtime as metadata.

This proposal explicitly does not take a stance on runtime reflection leaving further work for future proposals. The main reason is that this proposal does not block further work in this space but rather enables it. This is also the route Python took when adding their types to the language.

Users who rely on decorator metadata could continue to leverage a build step as desired.

### Does this proposal make all TypeScript programs valid JavaScript?

Most constructs in TypeScript are compatible, but not all,
and most of those that do not pass can be converted via simple codemod changes
that can make them both TypeScript-compatible _and_ compatible with this proposal.

See the ["up for debate"](#up-for-debate) and ["Intentional Omissions"](#intentional-omissions) sections for more information.

### Does this proposal make all Flow programs valid JavaScript?

Flow is very similar to TypeScript, and so most type constructs would work, with
a similar caveat in which some types might need to be wrapped in parentheses to be compatible with this proposal.

Two constructs that do not conform to this proposal are [type casting](https://flow.org/en/docs/types/casting/#toc-type-cast-expression-syntax) (e.g. `(x: number)`) and [`opaque` type aliases](https://flow.org/en/docs/types/opaque-types/) (e.g. `opaque type Meters = number`).
Flow could consider modifying these in the language so that they conform to this proposal, e.g. adopt the `as` operator as an alternative to `(x: number)`, and `type Meters = (new number)`.
This proposal could also reserve room for `opaque` type aliases.

### What about `.d.ts` files and "libdef" files?

*Declaration files* and *library definition* files are used by TypeScript and Flow respectively as a kind of "header" file that describes values, their types, and where they exist.
This proposal can safely ignore them as it does not need to interpret the semantics of the type information inside them.
TypeScript and Flow will continue reading and analyzing these files as they do today.

### Does this proposal mean that TypeScript developers would have to modify their codebases?

No. TypeScript can continue to be TypeScript, with no compatibility impact or changes to codebases.
This proposal would give developers the _option_ to restrict themselves to a particular subset of TypeScript which would run as JavaScript without transpilation.

Developers may still want to use TypeScript syntax for other reasons:

- Use of certain syntax features which are not supported in JavaScript (e.g., `enum`s and parameter properties)
- Compatibility with existing codebases which may run into certain syntax edge cases that are handled differently
- Non-standard extensions/reinterpretations of JavaScript (e.g. experimental legacy decorators, decorator metadata, or \[\[Set]] semantics for fields)

If developers decide to migrate an existing TypeScript codebase to use the JavaScript syntax specified in this proposal, the goal of this proposal is that the modifications would be minimal.
We believe that many developers would be motivated by removing a build step, but others could decide to stick with TypeScript compilation and enjoy the full power of the language.

### How should tools work with JavaScript type syntax?

Given the fact that some TypeScript features are [out of scope](#intentional-omissions), and that standard JavaScript will not evolve as fast as TypeScript or support its variety of configurations, there will continue to be an advantage for many tools to support TypeScript in its fuller form, beyond what is potentially standardized as JavaScript.

Some tools currently need a "plugin" or option to get TypeScript support working.
This proposal would mean that these tools could support type syntax by default, forming a standard, versionless, always-on common base for type syntax.
Full and prescriptive support for TypeScript, Flow, etc. could remain an opt-in mode on top of that.

### What about compatibility with ReasonML, PureScript, and other statically typed languages that compile to JavaScript?

While these languages _compile_ to JavaScript, and have static typing, they are not supersets of JavaScript, and thus are not relevant to this proposal.

### Will the ability to deploy typed source code directly result in bloated applications?

Returning to a world where code does not strictly need to be compiled prior to being used in production means that developers may end up deploying more code than is necessary.
Hence larger payloads over-the-wire for remotely served apps, and more text to parse at load time.

However this situation already exists.
Today, many users omit a build step and ship large amounts of comments and other extraneous information, e.g. unminified code.
It remains a best practice to perform an ahead-of-time optimization step on code destined for production if the use-case is performance-sensitive.

### Are unchecked types a footgun?

This proposal introduces type annotations that are explicitly **not** checked at runtime.
This is intentional to minimize the runtime cost of the annotations and to provide a consistent mental model in which the types do not affect program behavior.
A potential risk is that users might not realize the need to run an external tool to find type errors, and consequently are surprised when type-related bugs arise in their type-annotated code.

For today's users of external type-checkers, this risk already exists.
Users mitigate this risk today via a combination of:

- IDEs that perform type checking and proactively surface type errors
- Integration of type checking into project development workflows, e.g. npm scripts, CI systems, `tsc`

In some ways it would be more of a surprise to users if the types *were* runtime-checked.
It is common in other languages for there to be minimal runtime type-checking.
For example, in C++ there is almost no checking at runtime except for some known cases such as when the programmer requests it, e.g. `dynamic_cast`.

As seen with TypeScript, developers quickly learn that the types play no role at runtime.
Therefore similar to the first question of "Does JavaScript need a static type system?", this question has been answered, in part, by the widespread success of external type-checkers.

### How could runtime-checked types be added in future?

It seems unlikely that JavaScript would adopt a pervasive runtime-checked type system due to the runtime performance overhead that it would bring.
While it's possible that there may have been room for improvement, past efforts such as [TS* (Swamy et al)](https://goto.ucsd.edu/~pvekris/docs/safets.pdf) have shown that runtime type-checking based on annotations adds a non-negligible slowdown.
That is one reason why this proposal endorses purely static types.

If there is a desire to keep language open to later adding runtime-checked types, in addition to the static types proposed here, we could make an explicit syntax reservation in the grammar to support both.

### Could this proposal enable runtimes to optimize performance based on type hints?

Whilst it is possible to theorize runtime optimizations driven by statically declared types, the proposal authors are not aware of successful experiments in JavaScript that meaningfully beat dynamic type-driven JIT optimization.

The proposed type syntax has no defined semantics and so is opaque to the runtimes.
It is equivalent to asking _"Could a runtime use `/** comments **/` to optimize performance?"_
To which the answer is:  almost certainly not - at least not in a standard way.
Therefore this proposal alone does not directly offer new opportunities for performance improvements.

It is explicitly a **non-goal** of this proposal to improve the performance of JavaScript.

## Prior Art

### Other languages that have optional erasable type syntax

When Python decided to add a gradual type system to the language, it did it in two steps.
First, a proposal for type annotations was created in [PEP-3107 - Function Annotations](https://www.python.org/dev/peps/pep-3107/) that specified parameter types and function return types in Python
Several years later, the places in which types could occur was expanded in [Python PEP-484 - Type Hints](https://www.python.org/dev/peps/pep-0484/).


The proposal here differs significantly from Python's types, as the types in this proposal are entirely ignored, not evaluated as expressions or accessible at runtime as metadata. This difference is largely motivated by the existing community precedent, where JS type systems do not tend to use JS expression grammar for their types, so it is not possible to evaluate them as such.

[Ruby 3 has now also implemented RBS](https://www.ruby-lang.org/en/news/2020/12/25/ruby-3-0-0-released/): type definitions that sit _beside_ the code
and are not part of it.

#### Languages that add type systems onto JavaScript

[TypeScript](https://www.typescriptlang.org/docs/handbook/intro.html), [Flow](https://flow.org/en/docs/), and [Hegel](https://hegel.js.org/docs) are languages that implement type systems above standard JavaScript.

#### Ability to add type systems to JavaScript via comments

Both TypeScript and Flow enable developers to write JavaScript code and incorporate
types annotations that the JavaScript runtime ignores.

For Flow, these are [Flow comment types](https://flow.org/en/docs/types/comments/), and
for TypeScript these are [JSDoc comments](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html).

See the author's blog post on their positive experience with TypeScript's JSDoc comments [here](https://gils-blog.tayar.org/posts/jsdoc-typings-all-the-benefits-none-of-the-drawbacks/).

Closure Compiler's type checking works entirely via JSDoc comments ([docs](https://developers.google.com/closure/compiler/docs/js-for-compiler)). The Closure Compiler team has received many requests for an in-line type syntax, but was hesitant to do this without a standard.

#### Relevant proposals and discussions in TC39

TC39 has previously discussed [guards](https://web.archive.org/web/20141214075910/http://wiki.ecmascript.org/doku.php?id=strawman:guards), which form a new, stronger type system.

Previously, Sam Goto led discussions around an [optional types proposal](https://github.com/samuelgoto/proposal-optional-types) which aimed to unify syntax and semantics across the type-checkers.
Trying to find agreement across type-checkers, along with defining a sufficient subset in both syntax and semantics meant that there were difficulties with this approach.
An evolution of this plan was [pluggable types](https://github.com/samuelgoto/proposal-pluggable-types) which was [inspired by Gilad Bracha's ideas on pluggable type systems](https://bracha.org/pluggableTypesPosition.pdf).
This proposal is extremely similar to the pluggable types proposal, but leans a bit more heavily on the idea of viewing types as comments, and comes at a time with broader adoption of type-checking and a more mature type-checking ecosystem.

The [optional types proposal repository contains links to other prior discussions around types in JavaScript](https://github.com/samuelgoto/proposal-optional-types/blob/master/FAQ.md#tc39-discussions).

### Relevant discussions elsewhere

[Gilad Bracha](https://en.wikipedia.org/wiki/Gilad_Bracha) has [advocated for pluggable type systems](https://bracha.org/pluggableTypesPosition.pdf).
