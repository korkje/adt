import { test, expect } from "vitest";
import adt, { tag, Variants } from "./adt";

test("Simple usage", () => {
    const foot = adt({
        left: null,
        right: null,
    });

    const left = foot.left;
    const right = foot.right;

    expect(left).toEqual({ [tag]: "left", value: null });
    expect(right).toEqual({ [tag]: "right", value: null });
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

    const ac_on = power_source.ac(ac_status.on, 230);
    const ac_off = power_source.ac(ac_status.off, 230);
    const battery = power_source.battery(12);

    expect(ac_on).toEqual({
        [tag]: "ac",
        value: {
            status: { [tag]: "on", value: null },
            voltage: 230,
        },
    });

    expect(ac_off).toEqual({
        [tag]: "ac",
        value: {
            status: { [tag]: "off", value: null },
            voltage: 230,
        },
    });

    expect(battery).toEqual({
        [tag]: "battery",
        value: 12,
    });
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

    const my_activity = activity.moving.running.sprinting;

    expect(my_activity).toEqual({
        [tag]: "moving",
        value: {
            [tag]: "running",
            value: {
                [tag]: "sprinting",
                value: null,
            },
        },
    });
});
