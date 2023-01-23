import { tag } from "./adt";
import type { Variant } from "./adt";

/**
 * Calls a callback if a variant is of a specific kind.
 *
 * @param variant
 * The variant to check.
 *
 * @param kind
 * The kind to check for.
 *
 * @param callback
 * The callback to call if the variant is of the specified kind. The value of
 * the variant is passed to the callback.
 */
export const if_let = <
    T extends Variant<string, any>,
    U extends T[typeof tag],
    V extends T extends Variant<U, infer X>
        ? X
        : never,
>(
    variant: T,
    kind: U,
    callback: (value: V) => void,
) => {
    if (variant[tag] === kind) {
        callback(variant.value);
    }
};

export default if_let;