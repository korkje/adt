import { assertEquals, assertThrows } from "@std/assert";
import { type Option, some, none } from "lib/option.ts";
import { type Result, ok, err } from "lib/result.ts";
import { expect, expectErr } from "lib/expect.ts";

type StringOption = Option<string>;
type StringResult = Result<string, Error>;

const optionSome = some("hello") as StringOption;
const optionNone = none as StringOption;

const resultOk = ok("hello") as StringResult;
const resultErr = err(new Error("error")) as StringResult;

Deno.test("expect", () => {
    const expectOptionSome = expect(optionSome, "Variant was 'none'");
    assertEquals(expectOptionSome, "hello");

    const expectResultOk = expect(resultOk, "Variant was 'err'");
    assertEquals(expectResultOk, "hello");

    const expectOptionNoneFn = () => expect(optionNone, "Variant was 'none'");
    assertThrows(expectOptionNoneFn, Error, "Variant was 'none'");

    const expectResultErrFn = () => expect(resultErr, "Variant was 'err'");
    assertThrows(expectResultErrFn, Error, "Variant was 'err'");
});

Deno.test("expectErr", () => {
    const expectErrResultOkFn = () => expectErr(resultOk, "Variant was 'ok'");
    assertThrows(expectErrResultOkFn, Error, "Variant was 'ok'");

    const expectErrResultErrFn = expectErr(resultErr, "Variant was 'ok'");
    assertEquals(expectErrResultErrFn, new Error("error"));
});
