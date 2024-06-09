// deno-lint-ignore-file no-explicit-any

import type Option from "lib/option.ts";
import type { Result, ExtractErr } from "lib/result.ts";

/**
 * Unwraps a variant, throwing an error if it is not 'some' or 'ok'.
 *
 * @param variant
 * - The variant to unwrap, must be Option or Result.
 *
 * @returns
 * The value of the variant.
 *
 * @throws
 * An error if the variant is not 'some' or 'ok'.
 */
export const unwrap = <T>(variant: Option<T> | Result<T, any>): T => {
    const [tag, value] = variant;

    if (tag === "some" || tag === "ok") {
        return value;
    }

    throw tag === "none"
        ? new Error("Variant was 'none'")
        : new Error(`Variant was 'err': ${value}`);
}

/**
 * Unwraps a variant, throwing an error with a custom message if it is not
 * 'err'.
 *
 * @param variant
 * - The variant to unwrap, must be Result.
 *
 * @param message
 * - The error message to throw.
 *
 * @returns
 * The value of the variant.
 *
 * @throws
 * An error if the variant is not 'err'.
 */
export const unwrap_err = <R extends Result>(variant: R): ExtractErr<R> => {
    const [tag, value] = variant;

    if (tag === "err") {
        return value;
    }

    throw new Error(`${value}`);
};

/**
 * Unwraps a variant, returning a fallback value if it is not 'some' or 'ok'.
 *
 * @param variant
 * - The variant to unwrap, must be Option or Result.
 *
 * @param fallback
 * - The fallback value to return.
 *
 * @returns
 * The value of the variant, or the fallback value.
 */
export const unwrap_or = <T>(
    variant: Option<T> | Result<T, any>,
    fallback: T
): T => {
    const [tag, value] = variant;

    if (tag === "some" || tag === "ok") {
        return value;
    }

    return fallback;
}

/**
 * Unwraps a variant, returning the result of a fallback function if it is not
 * 'some' or 'ok'.
 *
 * @param variant
 * - The variant to unwrap, must be Option or Result.
 *
 * @param fallback
 * - The fallback function to call.
 *
 * @returns
 * The value of the variant, or the result of the fallback function.
 */
export const unwrap_or_else = <T>(
    variant: Option<T> | Result<T, any>,
    fallback: () => T,
): T => {
    const [tag, value] = variant;

    if (tag === "some" || tag === "ok") {
        return value;
    }

    return fallback();
}

export default unwrap;
