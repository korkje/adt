# [a]lgebraic [d]ata [t]ypes

[![npm version](https://badge.fury.io/js/%40korkje%2Fadt.svg)](https://badge.fury.io/js/%40korkje%2Fadt)

## Introduction

This package attempts to bring a version of Rust's "fancy enums" to TypeScript. These are referred to as algebraic data types (which is where the name of this package comes from), tagged unions, discriminated unions, disjoint unions, sum types, or variants. Read more about them [here](https://en.wikipedia.org/wiki/Algebraic_data_type).

TypeScript's enums are not very powerful, and they are often advised against for various reasons. Rust's enums are much more powerful, and can be used to represent a wide variety of data structures. This package attempts to bring some of that power to TypeScript.

## Table of contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
  - [Emulating enums](#emulating-enums)
  - [Useful typing](#useful-typing)
  - [Matching variants](#matching-variants)
  - [Default cases](#default-cases)
  - [Narrowing types](#narrowing-types)
  - [Beyond enums](#beyond-enums)
  - [Nested variants](#nested-variants)
  - [Matching nested variants](#matching-nested-variants)
- [Option and Result](#option-and-result)
  - [Option](#option)
  - [Result](#result)

## Installation
```bash
npm install --save @korkje/adt
```

## Usage

### Emulating enums

In the most simple case, `adt` can be used as a drop-in replacement for TypeScript's enums:

```typescript
import adt, { empty } from "@korkje/adt";

const power_status = adt({
    on: empty,
    off: empty,
});
```

In this case, `power_status`'s properties are the variants of the enum. The `empty` symbol is used to indicate that the variant has no associated data.

### Useful typing

If you have a function that should return one of the variants, you can extract the union of the variants using the `Variants` type:

```typescript
import type { Variants } from "@korkje/adt";

type PowerStatus = Variants<typeof power_status>;

const get_power_status = (): PowerStatus => 
    Math.random() > 0.5
        ? power_status.on
        : power_status.off;
```

### Matching variants

When you have a value of a variant, you can use the `match` function to determine which variant it is:

```typescript
import { match } from "@korkje/adt";

const current_power_status = get_power_status();

match(current_power_status, {
    on: () => console.log("The power is on"),
    off: () => console.log("The power is off"),
});
```

### Default cases

If you want to handle all any unmatched variant, you can use the `def` symbol to specify a default case:

```typescript
const color = adt({
    red: empty,
    green: empty,
    blue: empty,
});

const get_color = (): Variants<typeof color> => 
    Math.random() > (2 / 3)
        ? color.red
        : Math.random() > 0.5
            ? color.green
            : color.blue;

match(get_color(), {
    red: () => console.log("red"),
    [def]: () => console.log("blue or green"),
});
```

The `match` function also returns the result of the function that matched the variant:

```typescript
const is_on = match(current_power_status, {
    on: () => true,
    off: () => false,
});
```

### Narrowing types

The return type of the `match` function is the union of the return types of the functions passed to it, so using `as const` can be useful for narrowing the type:

```typescript
// Returns: string
match(current_power_status, {
    on: () => "on",
    off: () => "off",
});

// Returns: "on" | "off"
match(current_power_status, {
    on: () => "on" as const,
    off: () => "off" as const,
});
```

### Beyond enums

Where TypeScript's enums are limited to encapsulating strings or numbers, `adt` allows you to associate arbitrary data with variants by providing "creator" functions:

```typescript
const power_status = adt({
    on: (voltage: number) => voltage,
    off: empty,
});
```

The `match` function can then be used to extract the data:

```typescript
const U = match(current_power_status, {
    on: voltage => voltage,
    off: () => null,
});
```

The type of `U` in this case is `number | null`.

As it is only the return type of the creator function that determines the type of the variant's associated data, you can get creative with it:

```typescript
const power_status = adt({
    on: (current: number, resistance: number) => ({
        U: current * resistance,
        I: current,
        R: resistance,
    }),
    off: empty,
});

const U = match(current_power_status, {
    on: ({ U }) => U,
    off: () => null,
});
```

### Nested variants

You can also nest variants inside of variants:

```typescript
const ac_status = adt({
    on: (voltage: number) => voltage,
    off: empty,
});

type ACStatus = Variants<typeof ac_status>;

const power_source = adt({
    battery: (voltage: number) => voltage,
    ac: (status: ACStatus) => status,
});

type PowerSource = Variants<typeof power_source>;

const get_power_source = (): PowerSource => 
    Math.random() > 0.5
        ? power_source.battery(12)
        : power_source.ac(ac_status.on(230));
```

### Matching nested variants

Using the `match` function, decoding nested variants is a breeze:

```typescript
const U = match(get_power_source(), {
    battery: voltage => voltage,
    ac: status => match(status, {
        on: voltage => voltage,
        off: () => null,
    }),
});
```

## Option and Result

`adt` also exports two useful types: `Option` and `Result`. These are similar to Rust's `Option` and `Result` types.

### Option

`Option` is a type that can either be `some` or `none`. It is useful for representing the possibility of a value not existing.

```typescript
import type { Option } from "@korkje/adt";
import { some, none } from "@korkje/adt";

const get_option = (): Option<number> => 
    Math.random() > 0.5
        ? some(42)
        : none;

const option = get_option();

const value = match(option, {
    some: value => value,
    none: () => null,
});
```

### Result

`Result` is a type that can either be `ok` or `err`. It is useful for representing the possibility of a function failing.

```typescript
import type { Result } from "@korkje/adt";
import { ok, err } from "@korkje/adt";

const get_result = (): Result<number, Error> => 
    Math.random() > 0.5
        ? ok(42)
        : err(new Error("Something went wrong!"));

const result = get_result();

const value = match(result, {
    ok: value => value,
    err: error => {
        console.error(error);
        return null;
    },
});
```
