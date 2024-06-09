import { assertEquals } from "@std/assert";
import { type Option, some, none} from "lib/option.ts";
import match from "lib/match.ts";

Deno.test("Simple usage", () => {
    const someResult = some(10) as Option<number>;
    const noneResult = none as Option<number>;

    assertEquals(someResult, ["some", 10]);
    assertEquals(noneResult, ["none", null]);
});

Deno.test("Usage with match", () => {
    type StringOption = Option<string>;

    const someString = some("hello") as StringOption;
    const noneString = none as StringOption;

    const someResult = match(someString, {
        some: value => value,
        none: () => "none",
    });

    assertEquals(someResult, "hello");

    const noneResult = match(noneString, {
        some: value => value,
        none: () => "none",
    });

    assertEquals(noneResult, "none");
});

Deno.test("Linked list", () => {
    type LL<T> = Option<[T, LL<T>]>;

    const list: LL<number> = some([10, some([20, some([30, none])])]);

    const llToArr = (ll: LL<number>): number[] => match(ll, {
        some: ([ head, tail ]) => [head, ...llToArr(tail)],
        none: () => [],
    });

    assertEquals(llToArr(list), [10, 20, 30]);

    const arrToLl = (arr: number[]): LL<number> =>
        arr.length > 0 ? some([arr[0], arrToLl(arr.slice(1))]) : none;

    assertEquals(arrToLl([10, 20, 30]), list);
});
