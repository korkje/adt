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

export type Variant<K, V> = {
    [tag]: K;
    value: V;
};

type In<F> = F extends (...args: infer P) => any ? P : never;

type Out<F> = F extends (...args: any[]) => infer R ? R : never;

export type ADT<D extends Description> = {
    [K in keyof D]: D[K] extends null
        ? Variant<K, D[K]>
        : (...args: In<D[K]>) => Variant<K, Out<D[K]>>;
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
export type Variants<A> = A extends ADT<infer D> ? {
    [K in keyof D]: D[K] extends null
        ? Variant<K, D[K]>
        : Variant<K, Out<D[K]>>;
}[keyof D] : never;

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
export const adt = <D extends Description>(desc: D) =>
    Object.entries(desc)
        .reduce((a, [key, value]) => Object.assign(a, {
            [key]: value === null
                ? { [tag]: key, value: null }
                : (...args: any[]) => ({
                    [tag]: key,
                    value: value(...args)
                })
        }), {}) as ADT<D>;

export default adt;
