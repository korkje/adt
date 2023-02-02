import type { Variant } from "./adt";

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
    V extends Variant<string, any>,
    T extends V["tag"],
    U extends V extends Variant<T, infer U>
        ? U
        : never,
>(
    variant: V,
    tag: T,
    callback: (value: U) => void,
) => {
    if (variant.tag === tag) {
        callback(variant.value);
    }
};

export default if_let;
