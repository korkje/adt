import { tag } from "./adt";
import type { ADT, Variant, Variants } from "./adt";

export type Option<T> = Variants<ADT<{
    some: (value: T) => T;
    none: null;
}>>;

export const some = <T,>(value: T): Variant<"some", T> =>
    ({ [tag]: "some", value });

export const none: Variant<"none", null> =
    ({ [tag]: "none", value: null });

export default Option;
