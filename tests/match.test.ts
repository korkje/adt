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

    const leftResult = match(left, {
        left: () => "left",
        right: () => "right",
    });

    assertEquals(leftResult, "left");

    const rightResult = match(right, {
        left: () => "left",
        right: () => "right",
    });

    assertEquals(rightResult, "right");
});

Deno.test("Simple usage with fallback", () => {
    const foot = adt({
        left: null,
        right: null,
    });

    type Foot = Variants<typeof foot>;

    const right = foot.right as Foot;

    const leftResult = match(right, {
        left: () => "left",
        [def]: () => "not left",
    });

    assertEquals(leftResult, "not left");
});

Deno.test("Advanced usage", () => {
    const command = adt({
        move: (x: number, y: number) => ({ x, y }),
        attack: (target: string) => target,
    });

    type Command = Variants<typeof command>;

    const move = command.move(10, 20) as Command;
    const attack = command.attack("enemy") as Command;

    const moveResult = match(move, {
        move: ({ x, y }) => `move(${x}, ${y})`,
        attack: target => `attack(${target})`,
    });

    assertEquals(moveResult, "move(10, 20)");

    const attackResult = match(attack, {
        move: ({ x, y }) => `move(${x}, ${y})`,
        attack: target => `attack(${target})`,
    });

    assertEquals(attackResult, "attack(enemy)");
});

Deno.test("Extract matched variant", () => {
    const command = adt({
        move: (x: number, y: number) => ({ x, y }),
        attack: (target: string) => target,
    });

    type Command = Variants<typeof command>;

    const moveCmd = command.move(10, 20) as Command;

    const moveResult = match(moveCmd, {
        move: ({ x, y }, variant) => {
            assertEquals(variant, moveCmd);
            return `move(${x}, ${y})`;
        },
        attack: target => `attack(${target})`,
    });

    assertEquals(moveResult, "move(10, 20)");

    const defaultResult = match(moveCmd, {
        [def]: (value, variant) => {
            assertEquals(variant[0], "move");
            assertEquals(variant[1], { x: 10, y: 20 });
            return value;
        },
    });

    assertEquals(defaultResult, moveCmd[1]);
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

    const moveResult0 = match(move, {
        move: ({ direction, distance }) => match(direction, {
            [def]: () => `move(${direction[0]}, ${distance})`,
        }),
        attack: target => `attack(${target})`,
        jump: () => "jump",
    });

    assertEquals(moveResult0, "move(right, 10)");

    const moveResult1 = match(move, {
        move: ({ direction, distance }) => match(direction, {
            left: () => `move(left, ${distance})`,
            right: () => `move(right, ${distance})`,
        }),
        attack: target => `attack(${target})`,
        jump: () => "jump",
    });

    assertEquals(moveResult1, "move(right, 10)");
});

Deno.test("Nested usage, special syntax", () => {
    const powerSource = adt({
        battery: (voltage: number) => voltage,
        ac: {
            on: (voltage: number) => voltage,
            off: null,
        },
    });

    type PowerSource = Variants<typeof powerSource>;

    const battery = powerSource.battery(12) as PowerSource;
    const acOn = powerSource.ac.on(230) as PowerSource;
    const acOff = powerSource.ac.off as PowerSource;

    const batteryResult = match(battery, {
        battery: charge => `battery(${charge})`,
        ac: (status) => match(status, {
            on: voltage => `ac.on(${voltage})`,
            off: () => "ac.off",
        }),
    });

    assertEquals(batteryResult, "battery(12)");

    const acOnResult = match(acOn, {
        battery: charge => `battery(${charge})`,
        ac: (status) => match(status, {
            on: voltage => `ac.on(${voltage})`,
            off: () => "ac.off",
        }),
    });

    assertEquals(acOnResult, "ac.on(230)");

    const acOffResult = match(acOff, {
        battery: charge => `battery(${charge})`,
        ac: (status) => match(status, {
            on: voltage => `ac.on(${voltage})`,
            off: () => "ac.off",
        }),
    });

    assertEquals(acOffResult, "ac.off");
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

    const sprintingResult = match(sprinting, {
        idle: () => "idle",
        moving: (mode) => match(mode, {
            running: (intensity) => match(intensity, {
                sprinting: () => "sprinting",
                jogging: () => "jogging",
            }),
            driving: () => "driving",
        }),
    });

    assertEquals(sprintingResult, "sprinting");
});

Deno.test("Linked list", () => {
    type LL<T> =
        | ["nil", null]
        | ["cons", readonly [T, LL<T>]];

    const nil = variant("nil", null);
    const cons = <T>(h: T, t: LL<T>) => variant("cons", [h, t] as const);

    const myList = cons(1, cons(2, cons(3, nil)));

    const llToArr = <T>(ll: LL<T>): T[] => match(ll, {
        nil: () => [],
        cons: ([h, t]) => [h, ...llToArr(t)],
    });

    assertEquals(llToArr(myList), [1, 2, 3]);
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
