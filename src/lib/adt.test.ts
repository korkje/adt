import { test, expect } from "vitest";
import adt, { empty, tag } from "./adt";

test("Simple usage", () => {
    const foot = adt({
        left: empty,
        right: empty,
    });

    const left = foot.left;
    const right = foot.right;

    expect(left).toEqual({ [tag]: "left", value: empty });
    expect(right).toEqual({ [tag]: "right", value: empty });
});

test("Advanced usage", () => {
    const command = adt({
        move: (x: number, y: number) => ({ x, y }),
        attack: (target: string) => target,
    });

    const move = command.move(10, 20);
    const attack = command.attack("enemy");

    expect(move).toEqual({
        [tag]: "move",
        value: { x: 10, y: 20 },
    });

    expect(attack).toEqual({
        [tag]: "attack",
        value: "enemy",
    });
});
