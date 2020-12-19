# Thoughts on Flow

## Places where TypeScript appears in the code

### variable and function parameter declarations

* Like TS

* Types in Flow can be "maybe types" and start with `?`: `foo: ?string`.

### Optional parameters

* Like TS

### Generic Functions

* Like TS

### Predicate functions

```ts
function truthy(a, b): boolean %checks {
  return !!a && !!b;
}

function isString(y): %checks {
  return typeof y === "string";
}
```

### Type aliases

* Like TS

### Opaque Type aliass

```ts
opaque type ID = string | number;
opaque type Foo: ID = string;
```

### Exporting types and interface

```ts
export type Foo = number
export default interface Bar = {x: number}
export type {Foo}
export const x = 4

import type Bar, {Foo} from '...'
import typeof {x} from '...'
```

### Declarations

```ts
declare type Foo = number
```

I believe these can only appear in "libdefs", so are not relevant.

### Interfaces

* Same as TS

### Casting

```ts
  (foo +  2: number)
```
