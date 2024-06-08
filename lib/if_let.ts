// deno-lint-ignore-file no-explicit-any

/**
 * Calls a callback if a variant matches a specific tag.
 *
 * @param variant
 * The variant to check.
 *
 * @param tag
 * The tag to check for.
 *
 * @param callback
 * The callback to call if the variant has the specified tag. The value of
 * the variant is passed to the callback.
 */
export const if_let = <
    V extends [string, any],
    T extends V[0],
    U extends V extends [T, infer U]
        ? U
        : never,
>(
    variant: V,
    tag: T,
    callback: (value: U) => void,
): void => {
    if (variant[0] === tag) {
        callback(variant[1]);
    }
};

export default if_let;
