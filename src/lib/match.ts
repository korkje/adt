import { tag } from "./adt";
import type { Variant } from "./adt";

/**
 * Symbol used to specify a default matcher.
 *
 * @see {@link match}
 */
export const def = Symbol("[def]ault");

type MatchFor<T extends Variant<string, any>, K extends PropertyKey> = {
    [_K in K]: (value: Extract<T, { [tag]: _K }>["value"]) => any;
};

type Matchers<T extends Variant<string, any>, K extends PropertyKey> =
    Exclude<T[typeof tag], K> extends never
    ? (MatchFor<T, K>)
    : (MatchFor<T, K> & {
        [def]: (value: Exclude<T, { [tag]: K }>["value"]) => any;
    });

type MatchAll<T extends Variant<string, any>> = Matchers<T, T[typeof tag]>;

type Out<M, K extends string> = Exclude<K, keyof M> extends never
    ? M extends {
        [_K in K]: (value: any) => infer R;
    } ? R : never
    : M extends {
        [key: string | symbol]: (value: any) => infer R;
    } ? R : never;

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

// Covers all cases:
export function match<
    T extends Variant<string, any>,
    K extends PropertyKey,
    M extends Matchers<T, K>,
>(
    variant: T,
    matchers: M | Matchers<T, K> | MatchAll<T>
): Out<M, T[typeof tag]>;

// All matchers specified:
export function match<
    T extends Variant<string, any>,
    M extends MatchAll<T>,
>(
    variant: T,
    matchers: M | MatchAll<T>
): Out<M, T[typeof tag]>;

// Implementation:
export function match(variant: any, matchers: any) {
    // @ts-ignore
    const matcher = matchers[variant[tag]] ?? matchers[def];

    if (matcher === undefined) {
        throw new Error(`no matcher for ${variant[tag]}!`);
    }

    return matcher(variant.value);
};

export default match;
