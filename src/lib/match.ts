/**
 * Symbol used to specify a default matcher.
 *
 * @see {@link match}
 */
export const def = Symbol("[def]ault");

type MatchFor<T extends [string, any], K extends PropertyKey> = {
    [_K in K]: (
        value: Extract<T, [_K, any]>[1],
        variant: Extract<T, [_K, any]>,
    ) => any;
};

type Matchers<T extends [string, any], K extends PropertyKey> =
    Exclude<T[0], K> extends never
    ? (MatchFor<T, K>)
    : (MatchFor<T, K> & {
        [def]: (
            value: Exclude<T, [K, any]>[1],
            variant: Exclude<T, [K, any]>,
        ) => any;
    });

type MatchAll<T extends [string, any]> = Matchers<T, T[0]>;

type Out<M, K extends string> = Exclude<K, keyof M> extends never
    ? M extends {
        [_K in K]: (...args: any[]) => infer R;
    } ? R : never
    : M extends {
        [key: string | symbol]: (...args: any[]) => infer R;
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
    T extends [string, any],
    K extends PropertyKey,
    M extends Matchers<T, K>,
>(
    variant: T,
    matchers: M | Matchers<T, K> | MatchAll<T>,
): Out<M, T[0]>;

// All matchers specified:
export function match<
    T extends [string, any],
    M extends MatchAll<T>,
>(
    variant: T,
    matchers: M | MatchAll<T>,
): Out<M, T[0]>;

// Implementation:
export function match(variant: any, matchers: any) {
    const [tag, value] = variant;

    const matcher = matchers[tag] ?? matchers[def];

    if (matcher === undefined) {
        throw new Error(`No matcher for ${tag}!`);
    }

    return matcher(value, variant);
};

export default match;
