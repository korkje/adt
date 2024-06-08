import { assertEquals, assertThrows } from "@std/assert";
import { type Result, ok, err } from "lib/result.ts";
import match from "lib/match.ts";

Deno.test("Simple usage", () => {
    const ok_result = ok(10) as Result<number, string>;
    const err_result = err("error") as Result<number, string>;

    assertEquals(ok_result, ["ok", 10 ]);
    assertEquals(err_result, ["err", "error"]);
});

Deno.test("Usage without ok value", () => {
    const ok_result = ok();

    assertEquals(ok_result, ["ok", undefined]);
});

Deno.test("Usage with match", () => {
    type StringResult = Result<string, Error>;

    const ok_string = ok("hello") as StringResult;
    const err_string = err(new Error("error")) as StringResult;

    const ok_result = match(ok_string, {
        ok: value => value,
        err: error => error.message,
    });

    assertEquals(ok_result, "hello");

    const err_result = match(err_string, {
        ok: value => value,
        err: error => error.message,
    });

    assertEquals(err_result, "error");
});

Deno.test("Usage with throw", () => {
    type StringResult = Result<string, Error>;

    const err_string = err(new Error("error")) as StringResult;

    assertThrows(() => {
        match(err_string, {
            ok: value => value,
            err: error => {
                throw error;
            },
        });
    }, Error, "error");
});
