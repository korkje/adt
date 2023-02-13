import { test, expect } from "vitest";
import adt, { Variants } from "./adt";

test("Simple usage", () => {
    const foot = adt({
        left: null,
        right: null,
    });

    const left = foot.left;
    const right = foot.right;

    expect(left).toEqual(["left", null]);
    expect(right).toEqual(["right", null]);
});

test("Advanced usage", () => {
    const command = adt({
        move: (x: number, y: number) => ({ x, y }),
        attack: (target: string) => target,
    });

    const move = command.move(10, 20);
    const attack = command.attack("enemy");

    expect(move).toEqual(["move", { x: 10, y: 20 }]);

    expect(attack).toEqual(["attack", "enemy"]);
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

    expect(ac_on).toEqual([
        "ac", {
            status: ["on", null],
            voltage: 230,
        },
    ]);

    expect(ac_off).toEqual([
        "ac", {
            status: ["off", null],
            voltage: 230,
        },
    ]);

    expect(battery).toEqual(["battery", 12]);
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

    expect(my_activity).toEqual([
        "moving", [
            "running", [
                "sprinting",
                null,
            ],
        ],
    ]);
});

test("Linked list", () => {
    type Cons<T> = {
        head: T;
        tail: List<T>;
    };

    const ll = <T>() => adt({
        nil: null,
        cons: (arg: Cons<T>) => arg,
    });

    type List<T> = Variants<ReturnType<typeof ll<T>>>;

    const lln = ll<number>();

    const my_list = lln.cons({ head: 1, tail: lln.cons({ head: 2, tail: lln.nil })});

    // Iterate the linked list:
    let current = my_list as List<number>;
    const values: number[] = [];

    while (current[0] !== "nil") {
        values.push(current[1].head);
        current = current[1].tail;
    }

    expect(values).toEqual([1, 2]);

    expect(my_list).toEqual([
        "cons", {
            head: 1,
            tail: [
                "cons", {
                    head: 2,
                    tail: ["nil", null],
                },
            ],
        },
    ]);
});
