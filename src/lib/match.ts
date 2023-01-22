import { Variant, tag, Out } from "./adt";

export type MatchAll<T extends Variant<string, any>> = {
    [K in T[typeof tag]]: T extends Variant<K, infer U>
    ? (value: U) => any
    : never;
};

export const def = Symbol("[def]ault");

export type MatchSome<T extends Variant<string, any>> =
    Partial<MatchAll<T>> & {
        [def]: (value: any) => any;
    };

export type Matchers<T extends Variant<string, any>> =
    | MatchAll<T>
    | MatchSome<T>

export const match = <
    T extends Variant<U, V>,
    U extends string,
    V extends any,
    M extends Matchers<T>,
>(variant: T, matchers: M) => {
    const matcher = matchers[variant[tag]]
        ?? (matchers as MatchSome<T>)[def];

    if (matcher === undefined) {
        throw new Error(`no matcher for ${variant[tag]}!`);
    }

    return matcher(variant.value) as Out<M[keyof M]>
};

export default match;
