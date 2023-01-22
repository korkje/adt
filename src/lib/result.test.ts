import { test, expect } from "vitest";

import type Result from "./result";
import { ok, err } from "./result";

import { tag } from "./adt";
import match from "./match";

test("Simple usage", () => {
    const ok_result = ok(10) as Result<number, string>;
    const err_result = err("error") as Result<number, string>;

    expect(ok_result).toEqual({ [tag]: "ok", value: 10 });
    expect(err_result).toEqual({ [tag]: "err", value: "error" });
});

test("Usage with match", () => {
    type StringResult = Result<string, string>;

    const ok_string = ok("hello") as StringResult;
    const err_string = err("error") as StringResult;

    const ok_result = match(ok_string, {
        ok: value => value,
        err: () => "error",
    });

    expect(ok_result).toBe("hello");

    const err_result = match(err_string, {
        ok: value => value,
        err: () => "error",
    });

    expect(err_result).toBe("error");
});
