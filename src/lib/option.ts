import { ADT, empty, Empty, tag, Variant, Variants } from "./adt";

export type Option<T> = Variants<ADT<{
    some: (value: T) => T;
    none: Empty;
}>>;

export const some = <T,>(value: T): Variant<"some", T> =>
    ({ [tag]: "some", value });

export const none: Variant<"none", Empty> =
    ({ [tag]: "none", value: empty });

export default Option;
