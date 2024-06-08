import { assertEquals, assertThrows } from "@std/assert";
import match, { def } from "lib/match.ts";
import adt, { variant, type Variants } from "lib/adt.ts";

Deno.test("Simple usage", () => {
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

    assertEquals(left_result, "left");

    const right_result = match(right, {
        left: () => "left",
        right: () => "right",
    });

    assertEquals(right_result, "right");
});

Deno.test("Simple usage with fallback", () => {
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

    assertEquals(left_result, "not left");
});

Deno.test("Advanced usage", () => {
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

    assertEquals(move_result, "move(10, 20)");

    const attack_result = match(attack, {
        move: ({ x, y }) => `move(${x}, ${y})`,
        attack: target => `attack(${target})`,
    });

    assertEquals(attack_result, "attack(enemy)");
});

Deno.test("Extract matched variant", () => {
    const command = adt({
        move: (x: number, y: number) => ({ x, y }),
        attack: (target: string) => target,
    });

    type Command = Variants<typeof command>;

    const moveCmd = command.move(10, 20) as Command;

    const move_result = match(moveCmd, {
        move: ({ x, y }, variant) => {
            assertEquals(variant, moveCmd);
            return `move(${x}, ${y})`;
        },
        attack: target => `attack(${target})`,
    });

    assertEquals(move_result, "move(10, 20)");

    const default_result = match(moveCmd, {
        [def]: (value, variant) => {
            assertEquals(variant[0], "move");
            assertEquals(variant[1], { x: 10, y: 20 });
            return value;
        },
    });

    assertEquals(default_result, moveCmd[1]);
});

Deno.test("Nested usage", () => {
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
            [def]: () => `move(${direction[0]}, ${distance})`,
        }),
        attack: target => `attack(${target})`,
        jump: () => "jump",
    });

    assertEquals(move_result_0, "move(right, 10)");

    const move_result_1 = match(move, {
        move: ({ direction, distance }) => match(direction, {
            left: () => `move(left, ${distance})`,
            right: () => `move(right, ${distance})`,
        }),
        attack: target => `attack(${target})`,
        jump: () => "jump",
    });

    assertEquals(move_result_1, "move(right, 10)");
});

Deno.test("Nested usage, special syntax", () => {
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

    assertEquals(battery_result, "battery(12)");

    const ac_on_result = match(ac_on, {
        battery: charge => `battery(${charge})`,
        ac: (status) => match(status, {
            on: voltage => `ac.on(${voltage})`,
            off: () => "ac.off",
        }),
    });

    assertEquals(ac_on_result, "ac.on(230)");

    const ac_off_result = match(ac_off, {
        battery: charge => `battery(${charge})`,
        ac: (status) => match(status, {
            on: voltage => `ac.on(${voltage})`,
            off: () => "ac.off",
        }),
    });

    assertEquals(ac_off_result, "ac.off");
});

Deno.test("Deeply nested usage", () => {
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

    assertEquals(sprinting_result, "sprinting");
});

Deno.test("Linked list", () => {
    type LL<T> =
        | ["nil", null]
        | ["cons", readonly [T, LL<T>]];

    const nil = variant("nil", null);
    const cons = <T>(h: T, t: LL<T>) => variant("cons", [h, t] as const);

    const my_ll = cons(1, cons(2, cons(3, nil)));

    const ll_to_arr = <T>(ll: LL<T>): T[] => match(ll, {
        nil: () => [],
        cons: ([h, t]) => [h, ...ll_to_arr(t)],
    });

    assertEquals(ll_to_arr(my_ll), [1, 2, 3]);
});

Deno.test("Throw on unmatched variant", () => {
    const foot = adt({
        left: null,
        right: null,
    });

    type Foot = Variants<typeof foot>;

    const right = foot.right as Foot;

    assertThrows(() => {
        // @ts-expect-error: Non-exhaustive
        match(right, { left: () => "left" });
    });
});
