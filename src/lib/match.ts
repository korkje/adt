import { tag } from "./adt";
import type { Variant, Out } from "./adt";

export type MatchAll<T extends Variant<string, any>> = {
    [K in T[typeof tag]]: T extends Variant<K, infer U>
    ? (value: U) => any
    : never;
};

/**
 * Symbol used to specify a default matcher.
 *
 * @see {@link match}
 */
export const def = Symbol("[def]ault");

export type MatchSome<T extends Variant<string, any>> =
    Partial<MatchAll<T>> & {
        [def]: (value: T["value"]) => any,
    };

export type Matchers<T extends Variant<string, any>> =
    | MatchAll<T>
    | MatchSome<T>

/**
 * Matches a variant against a set of matchers.
 *
 * @param variant
 * The variant to match.
 *
 * @param matchers
 * The matchers to use.
 *
 * @returns
 * The result of the matched matcher.
 *
 * @throws
 * If no matcher is found for the variant, and no default matcher is specified.
 * This should be prevented by the type system.
 *
 * @example
 * const color = adt({
 *     red: null,
 *     green: null,
 *     blue: null,
 * });
 *
 * const red = color.red as Variants<typeof color>;
 *
 * const color_name = match(color, {
 *     red: () => "red",
 *     green: () => "green",
 *     blue: () => "blue",
 * });
 */
export const match = <
    T extends Variant<string, any>,
    M extends Matchers<T>,
>(variant: T, matchers: M) => {
    const matcher = matchers[variant[tag] as keyof M]
        ?? (matchers as MatchSome<T>)[def];

    if (matcher === undefined) {
        throw new Error(`no matcher for ${variant[tag]}!`);
    }

    return matcher(variant.value) as Out<M[keyof M]>;
};

export default match;
