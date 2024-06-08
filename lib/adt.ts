// deno-lint-ignore-file no-explicit-any

/**
 * Represents a description of an algebraic data type.
 */
export type Description = {
    [tag: string]:
    | null
    | ((...args: any[]) => any)
    | Description;
};

type In<F> = F extends (...args: infer P) => any ? P : never;
type Out<F> = F extends (...args: any[]) => infer R ? R : never;

type Str<T> = T extends string ? T : never;
type StrArr<T> = T extends string[] ? T : never;

/**
 * Represents the instantiator produced by a given description.
 */
export type ADT<D extends Description, W extends string[] = []> = {
    [T in keyof D]: D[T] extends null
        ? Wrap<[Str<T>, D[T]], W>
        : D[T] extends Description
            ? ADT<D[T], [...W, Str<T>]>
            : (...args: In<D[T]>) => Wrap<[Str<T>, Out<D[T]>], W>;
};

type Wrap<V extends [string, any], W extends string[]> =
    W extends [...infer H, infer T]
        ? Wrap<[Str<T>, V], StrArr<H>>
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
    [T in keyof D]: D[T] extends null
        ? [Str<T>, D[T]]
        : D[T] extends Description
            ? [Str<T>, Variants<ADT<D[T]>>]
            : [Str<T>, Out<D[T]>];
}[keyof D] : never;

/**
 * Creates a new tag/value pair.
 *
 * @param tag
 * The tag of the variant.
 *
 * @param value
 * The value of the variant.
 *
 * @returns
 * The new variant.
 */
export const variant = <T extends string, V>(tag: T, value: V) => [tag, value] as [T, V];

const wrap = (value: any, tags: string[]) =>
    tags.reduceRight((value, tag) => variant(tag, value), value);

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
export function adt<D extends Description>(desc: D, tags: string[] = []): ADT<D> {
    return Object.entries(desc)
        .reduce((a, [tag, value]) => Object.assign(a, {
            [tag]: value === null
                ? wrap(variant(tag, null), tags)
                : typeof value === "function"
                    ? (...args: any[]) => wrap(variant(tag, value(...args)), tags)
                    // @ts-ignore: This is fine.
                    : adt(value, [...tags, tag])
        }), {}) as ADT<D>;
};

export default adt;
