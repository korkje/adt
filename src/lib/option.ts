import { tag } from "./adt";
import type { ADT, Variant, Variants } from "./adt";

export type Option<T> = Variants<ADT<{
    some: (value: T) => T;
    none: null;
}>>;

/**
 * Creates a new 'some' variant.
 *
 * @param value
 * The value to wrap in the variant.
 *
 * @returns
 * The new variant.
 */
export const some = <T>(value: T): Variant<"some", T> =>
    ({ [tag]: "some", value });

/**
 * Creates a new 'none' variant.
 *
 * @returns
 * The new variant.
 */
export const none: Variant<"none", null> =
    ({ [tag]: "none", value: null });

export const option = { some, none };

export default Option;
