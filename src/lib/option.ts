import { variant } from "./adt";
import type { Variant } from "./adt";

export type Option<T> =
    | Variant<"some", T>
    | Variant<"none", null>;

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
