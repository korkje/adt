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
