import type Option from "./option";
import type Result from "./result";

/**
 * Unwraps a variant, throwing an error with a custom message if it is not
 * 'some' or 'ok'.
 *
 * @param variant
 * The variant to unwrap, must be Option or Result.
 *
 * @param message
 * The error message to throw.
 *
 * @returns
 * The value of the variant.
 *
 * @throws
 * An error if the variant is not 'some' or 'ok'.
 */
export const expect = <T>(
    variant: Option<T> | Result<T, any>,
    message: string,
) => {
    const [tag, value] = variant;

    if (tag === "some" || tag === "ok") {
        return value;
    }

    throw new Error(message);
};

/**
 * Unwraps a variant, throwing an error if it is not 'some' or 'ok'.
 *
 * @param variant
 * The variant to unwrap, must be Option or Result.
 *
 * @returns
 * The value of the variant.
 *
 * @throws
 * An error if the variant is not 'some' or 'ok'.
 */
export const unwrap = <T>(variant: Option<T> | Result<T, any>) => {
    const [tag, value] = variant;

    if (tag === "some" || tag === "ok") {
        return value;
    }

    throw new Error(`Variant was '${tag}'!`);
}

/**
 * Unwraps a variant, returning a fallback value if it is not 'some' or 'ok'.
 *
 * @param variant
 * The variant to unwrap, must be Option or Result.
 *
 * @param fallback
 * The fallback value to return.
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
 * The variant to unwrap, must be Option or Result.
 *
 * @param fallback
 * The fallback function to call.
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
