# adt [![JSR](https://jsr.io/badges/@korkje/adt)](https://jsr.io/@korkje/adt)

This package attempts to bring Rust's fancy enums (and associated pattern matching) to TypeScript. These are sometimes referred to as algebraic data types, tagged unions, discriminated unions, disjoint unions, sum types, coproduct types or variant types. Read more about them [here](https://en.wikipedia.org/wiki/Algebraic_data_type).

In Rust, you can use enums like this:

```rust
enum Ip {
    V4(u8, u8, u8, u8),
    V6(String),
}

let my_ip = Ip::V4(127, 0, 0, 1);

match my_ip {
    Ip::V4(a, b, c, d) => println!("{}.{}.{}.{}", a, b, c, d),
    Ip::V6(s) => println!("{}", s),
}
```

While you can't do this using enums in TypeScript, you can still take advantage of algebraic data types like so:

```typescript
type Ip = {
    tag: "V4";
    value: [number, number, number, number];
} | {
    tag: "V6";
    value: string;
};

const myIp = {
    tag: "V4",
    value: [127, 0, 0, 1],
} as Ip;

const assertNever = (value: never): never => {
    throw new Error(`Unexpected object: ${value}`);
};

switch (myIp.tag) {
    case "V4":
        const [a, b, c, d] = myIp.value;
        console.log(`${a}.${b}.${c}.${d}`);
        break;
    case "V6":
        console.log(myIp.value);
        break;
    default:
        // Makes sure all cases are covered
        assertNever(myIp);
        break;
}
```

This is both more verbose, and a lot less ergonomic. That goes for typing the ADT, instantiating variants, matching them, and making sure you've covered all cases. This package aims to solve that.

With the exported `adt` and `match` functions, you'll be able to achieve (among other things) the above functionality in TypeScript, like this:

```typescript
import adt, { match, type Variants } from "@korkje/adt";

const ip = adt({
    v4: (a: number, b: number, c: number, d: number) => [a, b, c, d],
    v6: (s: string) => s,
});

type Ip = Variants<typeof ip>;

const myIp = ip.v4(127, 0, 0, 1) as Ip;

match(myIp, {
    v4: ([a, b, c, d]) => console.log(`${a}.${b}.${c}.${d}`),
    v6: s => console.log(s),
});
```

This is only scratching the surface of what you can do with algebraic data types. If this sounds interesting to you, read on!

## Table of contents
- [Installation](#installation)
- [Usage](#usage)
  - [Emulating enums](#emulating-enums)
  - [Useful typing](#useful-typing)
  - [Matching variants](#matching-variants)
  - [Default cases](#default-cases)
  - [Narrowing types](#narrowing-types)
  - [Beyond enums](#beyond-enums)
  - [Default with data](#default-with-data)
  - [Nested ADTs](#nested-adts)
  - [Matching nested ADTs](#matching-nested-adts)
  - [Going deeper](#going-deeper)
  - [Linked list](#linked-list)
- [Option and Result](#option-and-result)
  - [Option](#option)
  - [Result](#result)
- [Additional helpers](#additional-helpers)
  - [ifLet](#iflet)
  - [letElse](#letelse)
  - [unwrap](#unwrap)
  - [expect](#expect)

## Installation
```bash
# deno
deno add @korkje/adt

# npm (and friends)
npx jsr add @korkje/adt
yarn dlx jsr add @korkje/adt
pnpm dlx jsr add @korkje/adt
bunx jsr add @korkje/adt
```

## Usage

### Emulating enums

In the most simple case, `adt` can be used as a drop-in replacement for TypeScript's enums:

```typescript
import adt from "@korkje/adt";

const powerStatus = adt({
    on: null,
    off: null,
});
```

In this case, `powerStatus`' properties are the variants of the enum. The `null` primitive is used to indicate that the variant has no associated data. If you want to associate data with a variant, jump right to the fun part: [beyond enums](#beyond-enums).

### Useful typing

If you have a function that should return a variant, you can extract the union of the variants using the `Variants` type, which is useful if you want to set an explicit return type for the function:

```typescript
import type { Variants } from "@korkje/adt";

type PowerStatus = Variants<typeof powerStatus>;

const getPowerStatus = (): PowerStatus => 
    Math.random() > 0.5
        ? powerStatus.on
        : powerStatus.off;
```

The variants themseves are intentionally not typed as the union of all variants, which is useful in a lot of cases. For instance, you might want to implicitly narrow the return type of a function based on only the variant or variants it can return.

### Matching variants

When you've got your hands on a variant, you can use the `match` function to determine which one it is:

```typescript
import { match } from "@korkje/adt";

const currentPowerStatus = getPowerStatus();

match(currentPowerStatus, {
    on: () => console.log("The power is on"),
    off: () => console.log("The power is off"),
});
```

### Default cases

If you want, you can omit one or more cases and specify a default case `def` `Symbol`:

```typescript
const color = adt({
    red: null,
    green: null,
    blue: null,
});

const getColor = (): Variants<typeof color> =>
    // ...

match(getColor(), {
    red: () => console.log("red"),
    [def]: () => console.log("blue or green"),
});
```

As briefly mentioned above, if you don't explicitly type the return type of a function using `Variants`, it will be the narrowed to only the relevant variants. Say you have a function that returns a `red` or `green` variant:

```typescript
const getColor = () => 
    Math.random() > 0.5
        ? color.red
        : color.green;
```

In this case, the return type of the function is inferred as only the red or green variant, and the `match` function will not expect a `blue` case:

```typescript
match(getColor(), {
    red: () => console.log("red"),
    green: () => console.log("green"),
    // Not allowed:
    // blue: () => console.log("blue"),
});
```

So, if you want to use `Variants` or not will depend on your use case. You might want to ensure that all possible variants of the ADT are handled, in case your function changes in the future, or you might want to narrow the return type of the function to only the relevant variants.

Like in Rust, `match` also returns the result of the function that matched the variant:

```typescript
const isOn = match(currentPowerStatus, {
    on: () => true,
    off: () => false,
});
```

### Narrowing types

The return type of the `match` function is the union of the return types of the functions passed to it, so using `as const` can be useful for narrowing the type:

```typescript
// Returns: string
match(currentPowerStatus, {
    on: () => "on",
    off: () => "off",
});

// Returns: "on" | "off"
match(currentPowerStatus, {
    on: () => "on" as const,
    off: () => "off" as const,
});
```

### Beyond enums

Where TypeScript's enums are limited to encapsulating strings or numbers, `adt` allows you to associate arbitrary data with variants by providing "creator" functions:

```typescript
const powerStatus = adt({
    on: (voltage: number) => voltage,
    off: null,
});
```

The `match` function can then be used to extract the data:

```typescript
const U = match(currentPowerStatus, {
    on: voltage => voltage,
    off: () => null,
});
```

The type of `U` in this case is `number | null`.

The variant itself is passed to the matching function as a second argument, if you need it:

```typescript
const U = match(currentPowerStatus, {
    on: (_, variant) => variant,
    off: () => null,
});

console.log(U.value); // 230
```

In this case, the type of `U` is `["on", number] | null`, where `["on", number]` is the a variant with tag `"on"` and value `number`. More generically, the tuple `[T, V]` is the internal representation a variant with tag `T` and value `V`. A tuple is used instead of an object (e.g. on the form `{ tag: T, value: V }`) simply to reduce serialization size.

As it is only the return type of the creator function that determines the type of the variant's associated data, you can get creative with it:

```typescript
const powerStatus = adt({
    on: (current: number, resistance: number) => ({
        U: current * resistance,
        I: current,
        R: resistance,
    }),
    off: null,
});

const U = match(currentPowerStatus, {
    on: ({ U }) => U,
    off: () => null,
});
```

### Default with data

If you use the `def` symbol to specify a default case when one or more variants have associated data, the parameter passed to the default case will be correctly typed as the union of the associated data types that don't have explicit matchers:

```typescript
import adt, { match, def, type Variants } from "@korkje/adt";

const housing = adt({
    house: (floors: number, rooms: number) => ({ floors, rooms }),
    apartment: (rooms: number) => number,
    tent: null,
});

const getHousing = (): Variants<typeof housing> =>
    // ...

match(getHousing(), {
    house: ({ floors, rooms }) => console.log(`House: ${floors} floors, ${rooms} rooms`),
    [def]: value => console.log(value),
});
```

In the above example, the type of `value` (in the default matcher) will be correctly inferred as `number | null`. Notice that `null` is included in the inferred type, even though the `tent` variant has no associated data. This is because variants with no associated data have a value of `null`.

### Nested ADTs

You can also nest ADTs inside one another:

```typescript
const acStatus = adt({
    on: (voltage: number) => voltage,
    off: null,
});

type ACStatus = Variants<typeof acStatus>;

const powerSource = adt({
    battery: (voltage: number) => voltage,
    ac: (status: ACStatus) => status,
});

type PowerSource = Variants<typeof powerSource>;

const getPowerSource = (): PowerSource => 
    Math.random() > 0.5
        ? powerSource.battery(12)
        : powerSource.ac(acStatus.on(230));
```

For a simple case like this, there is support for a simpler syntax:

```typescript
const powerSource = adt({
    battery: (voltage: number) => voltage,
    ac: {
        on: (voltage: number) => voltage,
        off: null,
    },
});

type PowerSource = Variants<typeof powerSource>;

const getPowerSource = (): PowerSource => 
    Math.random() > 0.5
        ? powerSource.battery(12)
        : powerSource.ac.on(230);
```

However, in the following example, the simpler syntax would not work, because the `ac` variant's associated data isn't *only* a nested ADT:

```typescript
const acStatus = adt({
    on: null,
    off: null,
});

type ACStatus = Variants<typeof acStatus>;

const powerSource = adt({
    battery: (voltage: number) => voltage,
    ac: (status: ACStatus, voltage: number) => ({ status, voltage }),
});
```

### Matching nested ADTs

Using the `match` function, decoding nested ADTs is a breeze:

```typescript
const U = match(getPowerSource(), {
    battery: voltage => voltage,
    ac: status => match(status, {
        on: voltage => voltage,
        off: () => null,
    }),
});
```

One could envision a more concise syntax for this, in line with the simpler syntax for creating nested ADTs, but I am already stretching the capabilities of the type system (and my brain) as it is.

Anyway, something like this would be nice:

```typescript
const U = match(getPowerSource(), {
    battery: voltage => voltage,
    // Does NOT work, but would be nice:
    ac: { // <-- this is the only difference
        on: voltage => voltage,
        off: () => null,
    },
});
```

### Going deeper

You can go as deep as you want with nested ADTs:

```typescript
const activity = adt({
    idle: null,
    moving: {
        running: {
            sprinting: null,
            jogging: null,
        },
        driving: null,
    },
});

type Activity = Variants<typeof activity>;

const myActivity = activity.moving.running.sprinting as Activity;

const res = match(sprinting, {
    idle: () => "idle",
    moving: (mode) => match(mode, {
        running: (intensity) => match(intensity, {
            sprinting: () => "sprinting",
            jogging: () => "jogging",
        }),
        driving: () => "driving",
    }),
});

console.log(res); // "sprinting"
```

### Linked list

If you want to create a more complex ADT that for instance needs to be recursive and/or generic, you could do this without using the `adt` function at all:

```typescript
import { variant, match } from "@korkje/adt";

type LL<T> =
    | ["nil", null]
    | ["cons", readonly [T, LL<T>]];

const nil = variant("nil", null);
const cons = <T>(h: T, t: LL<T>) => variant("cons", [h, t] as const);

const list: LL<number> = cons(1, cons(2, cons(3, nil)));

const llToArr = <T>(ll: LL<T>): T[] => match(ll, {
    nil: () => [],
    cons: ([h, t]) => [h, ...llToArr(t)],
});

console.log(llToArr(list)); // [1, 2, 3]
```

## Option and Result

`adt` also exports two useful types: `Option` and `Result`. These are similar to Rust's `Option` and `Result` types.

### Option

`Option` is a type that can either be `some` or `none`. It is useful for representing the possibility of a value not existing.

```typescript
import { type Option, some, none } from "@korkje/adt";

const getOption = (): Option<number> => 
    Math.random() > 0.5
        ? some(42)
        : none;

const option = getOption();

const value = match(option, {
    some: value => value,
    none: () => null,
});
```

### Result

`Result` is a type that can either be `ok` or `err`. It is useful for representing the possibility of a function failing.

```typescript
import { type Result, ok, err } from "@korkje/adt";

const getResult = (): Result<number, Error> => 
    Math.random() > 0.5
        ? ok(42)
        : err(new Error("Something went wrong!"));

const result = getResult();

const value = match(result, {
    ok: value => value,
    err: error => {
        console.error(error);
        return null;
    },
});
```

## Additional helpers

### ifLet

`ifLet` is a helper function inspired by Rust's [if let](https://doc.rust-lang.org/rust-by-example/flow_control/if_let.html), that can be used to match a variant and call a function with the associated data if the variant matches:

```typescript
import { ifLet } from "@korkje/adt";

ifLet(getPowerSource(), "battery", voltage => {
    console.log(`Battery voltage: ${voltage}`);
});
```

### letElse

`letElse` is a helper function inspired by Rust's [let-else](https://doc.rust-lang.org/rust-by-example/flow_control/let_else.html), that can be used to match a variant, or call a function and throw if the variant doesn't match:

```typescript
import { letElse } from "@korkje/adt";

const voltage = letElse(getPowerSource(), "battery", () => {
    throw new Error("Not a battery!");
});
```

### unwrap

`unwrap`, `unwrapErr`, `unwrapOr` and `unwrapOrElse` are helper functions inspired by those exposed by the `Option` and/or `Result` types in Rust. Similarly, these work on the previously mentioned `Option` and/or `Result` types. The purpose of these functions is to extract the associated data from a variant, or (in some cases) to throw an error if the variant is `none` or `err`.

`unwrap` simply extracts the associated data from a variant if it is `some` or `ok`, or throws an error if it is `none` or `err`:

```typescript
import { unwrap } from "@korkje/adt";

const value = unwrap(getOption());
```

`unwrapErr` is similar to `unwrap`, except it extracts the error from a `Result` variant if it is `err`, or throws an error if it is `ok`:

```typescript
import { unwrapErr } from "@korkje/adt";

const error = unwrapErr(getResult());
```

`unwrapOr` is also similar to `unwrap`, but it takes a default value as its second argument, which is returned if the variant is `none` or `err`:

```typescript
import { unwrapOr } from "@korkje/adt";

const value = unwrapOr(getOption(), 0);
```

`unwrapOrElse` is similar to `unwrapOr`, but it takes a function as its second argument, which is used to construct the default value if the variant is `none` or `err`:

```typescript
import { unwrapOrElse } from "@korkje/adt";

const value = unwrapOrElse(getOption(), () => 0);
```

### expect

`expect` and `expectErr` are very similar to `unwrap` and `unwrapErr`, but they take a message as their second argument, which is used to construct the error that is thrown if the variant is `none` or `err`:

```typescript
import { expect, expectErr } from "@korkje/adt";

const value = expect(getOption(), "No value!");
const error = expectErr(getResult(), "No error!");
```
