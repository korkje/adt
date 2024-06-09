import type Option from "lib/option.ts";
import type { Result, ExtractErr } from "lib/result.ts";

/**
 * Unwraps a variant, throwing an error with a custom message if it is not
 * 'some' or 'ok'.
 *
 * @param variant
 * - The variant to unwrap, must be Option or Result.
 *
 * @param message
 * - The error message to throw.
 *
 * @returns
 * The value of the variant.
 *
 * @throws
 * An error if the variant is not 'some' or 'ok'.
 */
export const expect = <T>(
    variant: Option<T> | Result<T>,
    message: string,
): T => {
    const [tag, value] = variant;

    if (tag === "some" || tag === "ok") {
        return value;
    }

    throw tag === "none"
        ? new Error(message)
        : new Error(`${message}: ${value}`);
};

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
export const expect_err = <R extends Result>(
    variant: R,
    message: string,
): ExtractErr<R> => {
    const [tag, value] = variant;

    if (tag === "err") {
        return value;
    }

    throw new Error(`${message}: ${value}`);
};
