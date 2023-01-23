import { test, expect } from "vitest";
import Option, { some, none } from "./option";
import Result, { ok, err } from "./result";
import {
    expect as _expect,
    unwrap,
    unwrap_or,
    unwrap_or_else,
} from "./unwrap";

type StringOption = Option<string>;
type StringResult = Result<string, Error>;

const option_some = some("hello") as StringOption;
const option_none = none as StringOption;

const result_ok = ok("hello") as StringResult;
const result_err = err(new Error("error")) as StringResult;

test("expect", () => {
    const expect_option_some = _expect(option_some, "Variant was 'none'!");
    expect(expect_option_some).toBe("hello");

    const expect_result_ok = _expect(result_ok, "Variant was 'err'!");
    expect(expect_result_ok).toBe("hello");

    const expect_option_none = () => _expect(option_none, "Variant was 'none'!");
    expect(expect_option_none).toThrowError("Variant was 'none'!");

    const expect_result_err = () => _expect(result_err, "Variant was 'err'!");
    expect(expect_result_err).toThrowError("Variant was 'err'!");
});

test("unwrap", () => {
    const unwrap_option_some = unwrap(option_some);
    expect(unwrap_option_some).toBe("hello");

    const unwrap_result_ok = unwrap(result_ok);
    expect(unwrap_result_ok).toBe("hello");

    const unwrap_option_none = () => unwrap(option_none);
    expect(unwrap_option_none).toThrowError("Variant was 'none'!");

    const unwrap_result_err = () => unwrap(result_err);
    expect(unwrap_result_err).toThrowError("Variant was 'err'!");
});

test("unwrap_or", () => {
    const unwrap_or_option_some = unwrap_or(option_some, "default");
    expect(unwrap_or_option_some).toBe("hello");

    const unwrap_or_result_ok = unwrap_or(result_ok, "default");
    expect(unwrap_or_result_ok).toBe("hello");

    const unwrap_or_option_none = unwrap_or(option_none, "default");
    expect(unwrap_or_option_none).toBe("default");

    const unwrap_or_result_err = unwrap_or(result_err, "default");
    expect(unwrap_or_result_err).toBe("default");
});

test("unwrap_or_else", () => {
    const unwrap_or_else_option_some = unwrap_or_else(option_some, () => "default");
    expect(unwrap_or_else_option_some).toBe("hello");

    const unwrap_or_else_result_ok = unwrap_or_else(result_ok, () => "default");
    expect(unwrap_or_else_result_ok).toBe("hello");

    const unwrap_or_else_option_none = unwrap_or_else(option_none, () => "default");
    expect(unwrap_or_else_option_none).toBe("default");

    const unwrap_or_else_result_err = unwrap_or_else(result_err, () => "default");
    expect(unwrap_or_else_result_err).toBe("default");
});
