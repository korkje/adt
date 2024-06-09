import { assertEquals } from "@std/assert";
import adt, { type Variants } from "lib/adt.ts";

Deno.test("Simple usage", () => {
    const foot = adt({
        left: null,
        right: null,
    });

    const left = foot.left;
    const right = foot.right;

    assertEquals(left, ["left", null]);
    assertEquals(right, ["right", null]);
});

Deno.test("Advanced usage", () => {
    const command = adt({
        move: (x: number, y: number) => ({ x, y }),
        attack: (target: string) => target,
    });

    const move = command.move(10, 20);
    const attack = command.attack("enemy");

    assertEquals(move, ["move", { x: 10, y: 20 }]);
    assertEquals(attack, ["attack", "enemy"]);
});

Deno.test("Nested usage", () => {
    const acStatus = adt({
        on: null,
        off: null,
    });

    type ACStatus = Variants<typeof acStatus>;

    const powerSource = adt({
        battery: (voltage: number) => voltage,
        ac: (status: ACStatus, voltage: number) => ({ status, voltage }),
    });

    const acOn = powerSource.ac(acStatus.on, 230);
    const acOff = powerSource.ac(acStatus.off, 230);
    const battery = powerSource.battery(12);

    assertEquals(acOn, [
        "ac", {
            status: ["on", null],
            voltage: 230,
        },
    ]);
    assertEquals(acOff, [
        "ac", {
            status: ["off", null],
            voltage: 230,
        },
    ]);
    assertEquals(battery, ["battery", 12]);
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

    const myActivity = activity.moving.running.sprinting;

    assertEquals(myActivity, [
        "moving", [
            "running", [
                "sprinting",
                null,
            ],
        ],
    ]);
});

Deno.test("Linked list", () => {
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

    const myList = lln.cons({ head: 1, tail: lln.cons({ head: 2, tail: lln.nil })});

    // Iterate the linked list:
    let current = myList as List<number>;
    const values: number[] = [];

    while (current[0] !== "nil") {
        values.push(current[1].head);
        current = current[1].tail;
    }

    assertEquals(values, [1, 2]);
    assertEquals(myList, [
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
