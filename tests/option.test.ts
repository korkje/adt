import { assertEquals } from "@std/assert";
import { type Option, some, none} from "lib/option.ts";
import match from "lib/match.ts";

Deno.test("Simple usage", () => {
    const some_result = some(10) as Option<number>;
    const none_result = none as Option<number>;

    assertEquals(some_result, ["some", 10]);
    assertEquals(none_result, ["none", null]);
});

Deno.test("Usage with match", () => {
    type StringOption = Option<string>;

    const some_string = some("hello") as StringOption;
    const none_string = none as StringOption;

    const some_result = match(some_string, {
        some: value => value,
        none: () => "none",
    });

    assertEquals(some_result, "hello");

    const none_result = match(none_string, {
        some: value => value,
        none: () => "none",
    });

    assertEquals(none_result, "none");
});

Deno.test("Linked list", () => {
    type LL<T> = Option<[T, LL<T>]>;

    const list: LL<number> = some([10, some([20, some([30, none])])]);

    const ll_to_arr = (ll: LL<number>): number[] => match(ll, {
        some: ([ head, tail ]) => [head, ...ll_to_arr(tail)],
        none: () => [],
    });

    assertEquals(ll_to_arr(list), [10, 20, 30]);

    const arr_to_ll = (arr: number[]): LL<number> =>
        arr.length > 0 ? some([arr[0], arr_to_ll(arr.slice(1))]) : none;

    assertEquals(arr_to_ll([10, 20, 30]), list);
});
