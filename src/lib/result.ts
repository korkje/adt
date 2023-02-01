import { variant } from "./adt";
import type { Variant } from "./adt";

export type Result<T, E> =
    | Variant<"ok", T>
    | Variant<"err", E>;

/**
 * Creates a new 'ok' variant.
 *
 * @param value
 * The value to wrap.
 *
 * @returns
 * The new variant.
 */
export const ok = <T>(value: T) => variant("ok", value);

/**
 * Creates a new 'err' variant.
 *
 * @param error
 * The value to wrap.
 *
 * @returns
 * The new variant.
 */
export const err = <E>(error: E) => variant("err", error);

export const result = { ok, err };

export default Result;
