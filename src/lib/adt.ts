export type Description = {
    [key: string]:
    | null
    | ((...args: any[]) => any);
};

export const tag = "__tag__" // Symbol("discriminant");

export type Variant<T, U> = {
    [tag]: T;
    value: U;
};

export type In<T> =
    T extends (...args: infer U) => any
    ? U
    : never;

export type Out<T> =
    T extends (...args: any[]) => infer U
    ? U
    : never;

export type ADT<T extends Description> = {
    [K in keyof T]: T[K] extends null
    ? Variant<K, T[K]>
    : (...args: In<T[K]>) => Variant<K, Out<T[K]>>;
};

export type Variants<T> =
    T extends ADT<infer U>
    ? {
        [K in keyof U]: U[K] extends null
        ? Variant<K, U[K]>
        : Variant<K, Out<U[K]>>;
    }[keyof U]
    : never;

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
