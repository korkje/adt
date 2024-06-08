import { variant } from "lib/adt.ts";

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
export const some = <T>(value: T) => variant("some", value);

/**
 * *Is* the 'none' variant.
 */
export const none = variant("none", null);

export const option = { some, none };

export default Option;
