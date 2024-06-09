import { variant } from "lib/adt.ts";

/**
 * Represents a value or an error.
 */
export type Result<T = unknown, E = unknown> =
    | ["ok", T]
    | ["err", E];

/**
 * Extracts the 'err' type from a Result.
 */
export type ExtractErr<R extends Result<unknown, unknown>> =
    Exclude<R, ["ok", unknown]>[1];

/**
 * Creates a new 'ok' variant.
 *
 * @param value
 * - The value to wrap.
 *
 * @returns
 * The new variant.
 */
export const ok: {
    <T>(value: T): ["ok", T];
    (): ["ok", undefined];
} = <T>(value?: T) => variant("ok", value);

/**
 * Creates a new 'err' variant.
 *
 * @param error
 * - The value to wrap.
 *
 * @returns
 * The new variant.
 */
export const err = <E>(error: E): ["err", E] => variant("err", error);

/**
 * Contains the 'ok' and 'err' variants.
 */
export const result = { ok, err };

export default Result;
