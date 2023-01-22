import { test, expect } from "vitest";

import match, { def } from "./match";

import adt, { empty } from "./adt";
import type { Variants } from "./adt";

test("Simple usage", () => {
    const foot = adt({
        left: empty,
        right: empty,
    });

    const left = foot.left;
    const right = foot.right;

    const left_result = match(left, {
        left: () => "left",
        right: () => "right",
    });

    expect(left_result).toBe("left");

    const right_result = match(right, {
        left: () => "left",
        right: () => "right",
    });

    expect(right_result).toBe("right");
});

test("Simple usage with fallback", () => {
    const foot = adt({
        left: empty,
        right: empty,
    });

    type Foot = Variants<typeof foot>;

    const right = foot.right as Foot;

    const left_result = match(right, {
        left: () => "left",
        [def]: () => "unknown",
    });

    expect(left_result).toBe("unknown");
});

test("Advanced usage", () => {
    const command = adt({
        move: (x: number, y: number) => ({ x, y }),
        attack: (target: string) => target,
    });

    type Command = Variants<typeof command>;

    const move = command.move(10, 20) as Command;
    const attack = command.attack("enemy") as Command;

    const move_result = match(move, {
        move: ({ x, y }) => `move(${x}, ${y})`,
        attack: target => `attack(${target})`,
    });

    expect(move_result).toBe("move(10, 20)");

    const attack_result = match(attack, {
        move: ({ x, y }) => `move(${x}, ${y})`,
        attack: target => `attack(${target})`,
    });

    expect(attack_result).toBe("attack(enemy)");
});

test("Throw on unmatched variant", () => {
    const foot = adt({
        left: empty,
        right: empty,
    });

    type Foot = Variants<typeof foot>;

    const right = foot.right as Foot;

    // @ts-expect-error
    expect(() => match(right, {
        left: () => "left",
    })).toThrow();
});
