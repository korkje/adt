import { tag } from "./adt";
import type { ADT, Variant, Variants } from "./adt";

export type Result<T, E> = Variants<ADT<{
    ok: (value: T) => T;
    err: (error: E) => E;
}>>;

/**
 * Creates a new 'ok' variant.
 *
 * @param value
 * The value to wrap in the variant.
 *
 * @returns
 * The new variant.
 */
export const ok = <T>(value: T): Variant<"ok", T> =>
    ({ [tag]: "ok", value });

/**
 * Creates a new 'err' variant.
 *
 * @param error
 * The value to wrap in the variant.
 *
 * @returns
 * The new variant.
 */
export const err = <E>(error: E): Variant<"err", E> =>
    ({ [tag]: "err", value: error });

export const result = { ok, err };

export default Result;
