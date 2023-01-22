import { test, expect } from "vitest";

import type Option from "./option";
import { some, none } from "./option";

import { empty, tag } from "./adt";
import match from "./match";

test("Simple usage", () => {
    const some_result = some(10) as Option<number>;
    const none_result = none as Option<number>;

    expect(some_result).toEqual({ [tag]: "some", value: 10 });
    expect(none_result).toEqual({ [tag]: "none", value: empty });
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
