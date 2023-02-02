import { test, expect } from "vitest";
import type Option from "./option";
import { some, none } from "./option";
import match from "./match";

test("Simple usage", () => {
    const some_result = some(10) as Option<number>;
    const none_result = none as Option<number>;

    expect(some_result).toEqual({ tag: "some", value: 10 });
    expect(none_result).toEqual({ tag: "none", value: null });
});

test("Usage with match", () => {
    type StringOption = Option<string>;

    const some_string = some("hello") as StringOption;
    const none_string = none as StringOption;

    const some_result = match(some_string, {
        some: value => value,
        none: () => "none",
    });

    expect(some_result).toBe("hello");

    const none_result = match(none_string, {
        some: value => value,
        none: () => "none",
    });

    expect(none_result).toBe("none");
});

test("Linked list", () => {
    type LL<T> = Option<[T, LL<T>]>;

    const list: LL<number> = some([10, some([20, some([30, none])])]);

    const ll_to_arr = (ll: LL<number>): number[] => match(ll, {
        some: ([ head, tail ]) => [head, ...ll_to_arr(tail)],
        none: () => [],
    });

    expect(ll_to_arr(list)).toEqual([10, 20, 30]);

    const arr_to_ll = (arr: number[]): LL<number> =>
        arr.length > 0 ? some([arr[0], arr_to_ll(arr.slice(1))]) : none;

    expect(arr_to_ll([10, 20, 30])).toEqual(list);
});
