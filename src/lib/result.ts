import { ADT, tag, Variant, Variants } from "./adt";

export type Result<T, E> = Variants<ADT<{
    ok: (value: T) => T;
    err: (error: E) => E;
}>>;

export const ok = <T,>(value: T): Variant<"ok", T> =>
    ({ [tag]: "ok", value });

export const err = <E,>(value: E): Variant<"err", E> =>
    ({ [tag]: "err", value });

export default Result;
