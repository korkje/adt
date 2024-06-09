import { assertEquals, assertThrows } from "@std/assert";
import { type Result, ok, err } from "lib/result.ts";
import match from "lib/match.ts";

Deno.test("Simple usage", () => {
    const okResult = ok(10) as Result<number, string>;
    const errResult = err("error") as Result<number, string>;

    assertEquals(okResult, ["ok", 10 ]);
    assertEquals(errResult, ["err", "error"]);
});

Deno.test("Usage without ok value", () => {
    const okResult = ok();

    assertEquals(okResult, ["ok", undefined]);
});

Deno.test("Usage with match", () => {
    type StringResult = Result<string, Error>;

    const okString = ok("hello") as StringResult;
    const errString = err(new Error("error")) as StringResult;

    const okResult = match(okString, {
        ok: value => value,
        err: error => error.message,
    });

    assertEquals(okResult, "hello");

    const errResult = match(errString, {
        ok: value => value,
        err: error => error.message,
    });

    assertEquals(errResult, "error");
});

Deno.test("Usage with throw", () => {
    type StringResult = Result<string, Error>;

    const errString = err(new Error("error")) as StringResult;

    assertThrows(() => {
        match(errString, {
            ok: value => value,
            err: error => {
                throw error;
            },
        });
    }, Error, "error");
});
