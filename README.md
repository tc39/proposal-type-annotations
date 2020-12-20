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

The following proposal is a _strawman_ proposal. Please treat it as such.

### Incorporating types into functions and variable declarations

### How to define where the type annotation begins and ends

### Other constructs that define other things

### Importing and exporting types

### `.d.ts` and `libdef` Files

### How TypeScript can evolve to be compatible with this proposal

### Where TypeScript is not compatible and cannot be compatible with this proposal

## Use cases

* Deno
* Node using TS
* "no transpilation for frontend"
* A future type system for JS


## FAQ

## Prior Art

## References
