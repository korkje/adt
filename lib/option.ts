import { variant } from "lib/adt.ts";

/**
 * Represents a value or absence.
 */
export type Option<T> =
    | ["some", T]
    | ["none", null];

/**
 * Creates a new 'some' variant.
 *
 * @param value
 * The value to wrap.
 *
 * @returns
 * The new variant.
 */
export const some = <T>(value: T): ["some", T] => variant("some", value);

/**
 * *Is* the 'none' variant.
 */
export const none: ["none", null] = variant("none", null);

/**
 * Contains the 'some' and 'none' variants.
 */
export const option = { some, none };

export default Option;
