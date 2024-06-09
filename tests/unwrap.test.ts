import { assertEquals, assertThrows } from "@std/assert";
import { type Option, some, none } from "lib/option.ts";
import { type Result, ok, err } from "lib/result.ts";
import { unwrap, unwrapOr, unwrapOrElse } from "lib/unwrap.ts";

type StringOption = Option<string>;
type StringResult = Result<string, Error>;

const optionSome = some("hello") as StringOption;
const optionNone = none as StringOption;

const resultOk = ok("hello") as StringResult;
const resultErr = err(new Error("error")) as StringResult;

Deno.test("unwrap", () => {
    const unwrapOptionSome = unwrap(optionSome);
    assertEquals(unwrapOptionSome, "hello");

    const unwrapResultOk = unwrap(resultOk);
    assertEquals(unwrapResultOk, "hello");

    const unwrapOptionNoneFn = () => unwrap(optionNone);
    assertThrows(unwrapOptionNoneFn, Error);

    const unwrapResultErrFn = () => unwrap(resultErr);
    assertThrows(unwrapResultErrFn, Error, `${new Error("error")}`);
});

Deno.test("unwrapOr", () => {
    const unwrapOrOptionSome = unwrapOr(optionSome, "default");
    assertEquals(unwrapOrOptionSome, "hello");

    const unwrapOrResultOk = unwrapOr(resultOk, "default");
    assertEquals(unwrapOrResultOk, "hello");

    const unwrapOrOptionNone = unwrapOr(optionNone, "default");
    assertEquals(unwrapOrOptionNone, "default");

    const unwrapOrResultErr = unwrapOr(resultErr, "default");
    assertEquals(unwrapOrResultErr, "default");
});

Deno.test("unwrapOrElse", () => {
    const unwrapOrElseOptionSome = unwrapOrElse(optionSome, () => "default");
    assertEquals(unwrapOrElseOptionSome, "hello");

    const unwrapOrElseResultOk = unwrapOrElse(resultOk, () => "default");
    assertEquals(unwrapOrElseResultOk, "hello");

    const unwrapOrElseOptionNone = unwrapOrElse(optionNone, () => "default");
    assertEquals(unwrapOrElseOptionNone, "default");

    const unwrapOrElseResultErr = unwrapOrElse(resultErr, () => "default");
    assertEquals(unwrapOrElseResultErr, "default");
});
