import { test, expect, vi } from "vitest";
import adt, { Variants } from "./adt";
import if_let from "./if_let";

test("Simple usage", () => {
    const foot = adt({
        left: null,
        right: null,
    });

    type Foot = Variants<typeof foot>;

    const left = foot.left as Foot;

    const matcher = vi.fn();

    if_let(left, "left", matcher);

    expect(matcher).toBeCalledWith(null);
});

test("Advanced usage", () => {
    const command = adt({
        move: (x: number, y: number) => ({ x, y }),
        attack: (target: string) => target,
    });

    type Command = Variants<typeof command>;

    const move = command.move(10, 20) as Command;

    const matcher = vi.fn();

    if_let(move, "move", matcher);

    expect(matcher).toBeCalledWith({ x: 10, y: 20 });

    matcher.mockClear();

    if_let(move, "attack", matcher);

    expect(matcher).not.toBeCalled();
});

test("Nested usage", () => {
    const ac_status = adt({
        on: null,
        off: null,
    });

    type ACStatus = Variants<typeof ac_status>;

    const power_source = adt({
        battery: (voltage: number) => voltage,
        ac: (status: ACStatus, voltage: number) => ({ status, voltage }),
    });

    type PowerSource = Variants<typeof power_source>;

    const ac_on = power_source.ac(ac_status.on, 230) as PowerSource;

    const outer = vi.fn();

    if_let(ac_on, "ac", outer);

    expect(outer).toBeCalledWith({ status: ac_status.on, voltage: 230 });

    const inner = vi.fn();

    if_let(ac_on, "ac", ({ status }) => {
        if_let(status, "on", inner);
    });

    expect(inner).toBeCalledWith(null);
});
