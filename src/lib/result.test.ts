import { test, expect } from "vitest";
import type Result from "./result";
import { ok, err } from "./result";
import match from "./match";

test("Simple usage", () => {
    const ok_result = ok(10) as Result<number, string>;
    const err_result = err("error") as Result<number, string>;

    expect(ok_result).toEqual(["ok", 10 ]);
    expect(err_result).toEqual(["err", "error"]);
});

test("Usage with match", () => {
    type StringResult = Result<string, Error>;

    const ok_string = ok("hello") as StringResult;
    const err_string = err(new Error("error")) as StringResult;

    const ok_result = match(ok_string, {
        ok: value => value,
        err: error => error.message,
    });

    expect(ok_result).toBe("hello");

    const err_result = match(err_string, {
        ok: value => value,
        err: error => error.message,
    });

    expect(err_result).toBe("error");
});

test("Usage with throw", () => {
    type StringResult = Result<string, Error>;

    const err_string = err(new Error("error")) as StringResult;

    expect(() => {
        match(err_string, {
            ok: value => value,
            err: error => {
                throw error;
            },
        });
    }).toThrowError("error");
});
