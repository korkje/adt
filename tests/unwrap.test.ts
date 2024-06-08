import { assertEquals, assertThrows } from "@std/assert";
import { type Option, some, none } from "lib/option.ts";
import { type Result, ok, err } from "lib/result.ts";
import { expect, unwrap, unwrap_or, unwrap_or_else } from "lib/unwrap.ts";

type StringOption = Option<string>;
type StringResult = Result<string, Error>;

const option_some = some("hello") as StringOption;
const option_none = none as StringOption;

const result_ok = ok("hello") as StringResult;
const result_err = err(new Error("error")) as StringResult;

Deno.test("expect", () => {
    const expect_option_some = expect(option_some, "Variant was 'none'!");
    assertEquals(expect_option_some, "hello");

    const expect_result_ok = expect(result_ok, "Variant was 'err'!");
    assertEquals(expect_result_ok, "hello");

    const expect_option_none = () => expect(option_none, "Variant was 'none'!");
    assertThrows(expect_option_none, Error, "Variant was 'none'!");

    const expect_result_err = () => expect(result_err, "Variant was 'err'!");
    assertThrows(expect_result_err, Error, "Variant was 'err'!");
});

Deno.test("unwrap", () => {
    const unwrap_option_some = unwrap(option_some);
    assertEquals(unwrap_option_some, "hello");

    const unwrap_result_ok = unwrap(result_ok);
    assertEquals(unwrap_result_ok, "hello");

    const unwrap_option_none = () => unwrap(option_none);
    assertThrows(unwrap_option_none, Error, "Variant was 'none'!");

    const unwrap_result_err = () => unwrap(result_err);
    assertThrows(unwrap_result_err, Error, "Variant was 'err'!");
});

Deno.test("unwrap_or", () => {
    const unwrap_or_option_some = unwrap_or(option_some, "default");
    assertEquals(unwrap_or_option_some, "hello");

    const unwrap_or_result_ok = unwrap_or(result_ok, "default");
    assertEquals(unwrap_or_result_ok, "hello");

    const unwrap_or_option_none = unwrap_or(option_none, "default");
    assertEquals(unwrap_or_option_none, "default");

    const unwrap_or_result_err = unwrap_or(result_err, "default");
    assertEquals(unwrap_or_result_err, "default");
});

Deno.test("unwrap_or_else", () => {
    const unwrap_or_else_option_some = unwrap_or_else(option_some, () => "default");
    assertEquals(unwrap_or_else_option_some, "hello");

    const unwrap_or_else_result_ok = unwrap_or_else(result_ok, () => "default");
    assertEquals(unwrap_or_else_result_ok, "hello");

    const unwrap_or_else_option_none = unwrap_or_else(option_none, () => "default");
    assertEquals(unwrap_or_else_option_none, "default");

    const unwrap_or_else_result_err = unwrap_or_else(result_err, () => "default");
    assertEquals(unwrap_or_else_result_err, "default");
});
