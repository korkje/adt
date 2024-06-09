// deno-lint-ignore-file no-explicit-any

/**
 * Matches a variant, or calls a callback if it does not match.
 *
 * @param variant
 * - The variant to check.
 *
 * @param tag
 * - The tag to check for.
 *
 * @param callback
 * - The callback to call if the variant has the specified tag. This callback
 *   must throw.
 */
export const letElse = <
    V extends [string, any],
    T extends V[0],
    U extends V extends [T, infer U]
        ? U
        : never,
>(
    variant: V,
    tag: T,
    callback: () => never,
): U => {
    if (variant[0] !== tag) {
        callback();
        throw new Error("'letElse' callback did not throw");
    }

    return variant[1];
};

export default letElse;
