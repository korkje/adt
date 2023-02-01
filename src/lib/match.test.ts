import { test, expect } from "vitest";
import match, { def } from "./match";
import adt, { tag, variant } from "./adt";
import type { Variants, Variant } from "./adt";

test("Simple usage", () => {
    const foot = adt({
        left: null,
        right: null,
    });

    type Foot = Variants<typeof foot>;

    const left = foot.left as Foot;
    const right = foot.right as Foot;

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
        left: null,
        right: null,
    });

    type Foot = Variants<typeof foot>;

    const right = foot.right as Foot;

    const left_result = match(right, {
        left: () => "left",
        [def]: () => "not left",
    });

    expect(left_result).toBe("not left");
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

test("Nested usage", () => {
    const direction = adt({
        left: null,
        right: null,
    });

    type Direction = Variants<typeof direction>;

    const command = adt({
        move: (direction: Direction, distance: number) => ({ direction, distance }),
        attack: (target: string) => target,
        jump: null,
    });

    type Command = Variants<typeof command>;

    const move = command.move(direction.right, 10) as Command;

    const move_result_0 = match(move, {
        move: ({ direction, distance }) => match(direction, {
            [def]: () => `move(${direction[tag]}, ${distance})`,
        }),
        attack: target => `attack(${target})`,
        jump: () => "jump",
    });

    expect(move_result_0).toBe("move(right, 10)");

    const move_result_1 = match(move, {
        move: ({ direction, distance }) => match(direction, {
            left: () => `move(left, ${distance})`,
            right: () => `move(right, ${distance})`,
        }),
        attack: target => `attack(${target})`,
        jump: () => "jump",
    });

    expect(move_result_1).toBe("move(right, 10)");
});

test("Nested usage, special syntax", () => {
    const power_source = adt({
        battery: (voltage: number) => voltage,
        ac: {
            on: (voltage: number) => voltage,
            off: null,
        },
    });

    type PowerSource = Variants<typeof power_source>;

    const battery = power_source.battery(12) as PowerSource;
    const ac_on = power_source.ac.on(230) as PowerSource;
    const ac_off = power_source.ac.off as PowerSource;

    const battery_result = match(battery, {
        battery: charge => `battery(${charge})`,
        ac: (status) => match(status, {
            on: voltage => `ac.on(${voltage})`,
            off: () => "ac.off",
        }),
    });

    expect(battery_result).toBe("battery(12)");

    const ac_on_result = match(ac_on, {
        battery: charge => `battery(${charge})`,
        ac: (status) => match(status, {
            on: voltage => `ac.on(${voltage})`,
            off: () => "ac.off",
        }),
    });

    expect(ac_on_result).toBe("ac.on(230)");

    const ac_off_result = match(ac_off, {
        battery: charge => `battery(${charge})`,
        ac: (status) => match(status, {
            on: voltage => `ac.on(${voltage})`,
            off: () => "ac.off",
        }),
    });

    expect(ac_off_result).toBe("ac.off");
});

test("Deeply nested usage", () => {
    const activity = adt({
        idle: null,
        moving: {
            running: {
                sprinting: null,
                jogging: null,
            },
            driving: null,
        },
    });

    type Activity = Variants<typeof activity>;

    const sprinting = activity.moving.running.sprinting as Activity;

    const sprinting_result = match(sprinting, {
        idle: () => "idle",
        moving: (mode) => match(mode, {
            running: (intensity) => match(intensity, {
                sprinting: () => "sprinting",
                jogging: () => "jogging",
            }),
            driving: () => "driving",
        }),
    });

    expect(sprinting_result).toBe("sprinting");
});

test("Linked list", () => {
    type LL<T> =
        | Variant<"nil", null>
        | Variant<"cons", readonly [T, LL<T>]>;

    const nil = variant("nil", null);
    const cons = <T>(h: T, t: LL<T>) => variant("cons", [h, t] as const);

    const my_ll: LL<number> = cons(1, cons(2, cons(3, nil)));

    const ll_to_arr = <T>(ll: LL<T>): T[] => match(ll, {
        nil: () => [],
        cons: ([h, t]) => [h, ...ll_to_arr(t)],
    });

    expect(ll_to_arr(my_ll)).toEqual([1, 2, 3]);
});

test("Throw on unmatched variant", () => {
    const foot = adt({
        left: null,
        right: null,
    });

    type Foot = Variants<typeof foot>;

    const right = foot.right as Foot;

    // @ts-expect-error
    expect(() => match(right, {
        left: () => "left",
    })).toThrow();
});
