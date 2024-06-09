import { assertEquals, assertThrows } from "@std/assert";
import { type Option, some, none } from "lib/option.ts";
import { type Result, ok, err } from "lib/result.ts";
import { expect, expect_err } from "lib/expect.ts";

type StringOption = Option<string>;
type StringResult = Result<string, Error>;

const option_some = some("hello") as StringOption;
const option_none = none as StringOption;

const result_ok = ok("hello") as StringResult;
const result_err = err(new Error("error")) as StringResult;

Deno.test("expect", () => {
    const expect_option_some = expect(option_some, "Variant was 'none'");
    assertEquals(expect_option_some, "hello");

    const expect_result_ok = expect(result_ok, "Variant was 'err'");
    assertEquals(expect_result_ok, "hello");

    const expect_option_none = () => expect(option_none, "Variant was 'none'");
    assertThrows(expect_option_none, Error, "Variant was 'none'");

    const expect_result_err = () => expect(result_err, "Variant was 'err'");
    assertThrows(expect_result_err, Error, "Variant was 'err'");
});

Deno.test("expect_err", () => {
    const expect_err_result_ok = () => expect_err(result_ok, "Variant was 'ok'");
    assertThrows(expect_err_result_ok, Error, "Variant was 'ok'");

    const expect_err_result_err = expect_err(result_err, "Variant was 'ok'");
    assertEquals(expect_err_result_err, new Error("error"));
});
