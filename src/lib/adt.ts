type Description = {
    [key: string]:
    | null
    | ((...args: any[]) => any)
    | Description;
};

/**
 * The tag used internally to identify variants. It is not a symbol, because
 * they don't survive serialization.
 */
export const tag = "__tag__" // Symbol("discriminant");

export type Variant<K extends string, V> = {
    [tag]: K;
    value: V;
};

type In<F> = F extends (...args: infer P) => any ? P : never;
type Out<F> = F extends (...args: any[]) => infer R ? R : never;

type Str<T> = T extends string ? T : never;
type StrArr<T> = T extends string[] ? T : never;

export type ADT<D extends Description, W extends string[] = []> = {
    [K in keyof D]: D[K] extends null
        ? Wrap<Variant<Str<K>, D[K]>, W>
        : D[K] extends Description
            ? ADT<D[K], [...W, Str<K>]>
            : (...args: In<D[K]>) => Wrap<Variant<Str<K>, Out<D[K]>>, W>;
};

type Wrap<V extends Variant<string, any>, W extends string[]> =
    W extends [...infer H, infer T]
        ? Wrap<Variant<Str<T>, V>, StrArr<H>>
        : V;

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
        ? Variant<Str<K>, D[K]>
        : D[K] extends Description
            ? Variant<Str<K>, Variants<ADT<D[K]>>>
            : Variant<Str<K>, Out<D[K]>>;
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
export function adt<D extends Description>(desc: D): ADT<D>;
export function adt<D extends Description>(desc: D, wrap_keys: string[] = []): ADT<D> {
    return Object.entries(desc)
        .reduce((a, [key, value]) => Object.assign(a, {
            [key]: value === null
                ? wrap({ [tag]: key, value: null }, wrap_keys)
                : typeof value === "function"
                    ? (...args: any[]) => wrap({
                        [tag]: key,
                        value: value(...args)
                    }, wrap_keys)
                    // @ts-ignore
                    : adt(value, [...wrap_keys, key])
        }), {}) as ADT<D>;
};

const wrap = (value: any, keys: string[]) =>
    keys.reduceRight((a, k) => ({ [tag]: k, value: a }), value);

export default adt;
