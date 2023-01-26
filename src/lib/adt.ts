type Description = {
    [key: string]:
    | null
    | ((...args: any[]) => any);
};

/**
 * The tag used internally to identify variants. It is not a symbol, because
 * they don't survive serialization.
 */
export const tag = "__tag__" // Symbol("discriminant");

export type Variant<T, U> = {
    [tag]: T;
    value: U;
};

type In<T> =
    T extends (...args: infer U) => any
    ? U
    : never;

type Out<T> =
    T extends (...args: any[]) => infer U
    ? U
    : never;

export type ADT<T extends Description> = {
    [K in keyof T]: T[K] extends null
    ? Variant<K, T[K]>
    : (...args: In<T[K]>) => Variant<K, Out<T[K]>>;
};

/**
 * Extracts the variants' union type from an ADT.
 *
 * @param adt
 * The ADT to extract the variants' union type from.
 *
 * @returns
 * The variants' union type.
 *
 * @example
 * const color = adt({
 *     red: null,
 *     green: null,
 *     blue: null,
 * });
 *
 * type Color = Variants<typeof color>;
 */
export type Variants<T> =
    T extends ADT<infer U>
    ? {
        [K in keyof U]: U[K] extends null
        ? Variant<K, U[K]>
        : Variant<K, Out<U[K]>>;
    }[keyof U]
    : never;

/**
 * Creates an ADT instantiator from a description object.
 *
 * @param desc
 * The description object.
 *
 * @returns
 * The ADT instantiator.
 *
 * @example
 * const ip = adt({
 *     v4: (parts: [number, number, number, number]) => parts,
 *     v6: (value: string) => value,
 * });
 *
 * type IP = Variants<typeof ip>;
 *
 * const v4 = ip.v4(127, 0, 0, 1);
 * const v6 = ip.v6("::1");
 */
export const adt = <T extends Description>(desc: T) =>
    Object.entries(desc)
        .reduce((a, [key, value]) => Object.assign(a, {
            [key]: value === null
                ? { [tag]: key, value: null }
                : (...args: any[]) => ({
                    [tag]: key,
                    value: value(...args)
                })
        }), {}) as ADT<T>;

export default adt;
