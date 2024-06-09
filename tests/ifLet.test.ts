import { spy, assertSpyCall, assertSpyCalls } from "@std/testing/mock";
import adt, { type Variants } from "lib/adt.ts";
import ifLet from "lib/ifLet.ts";

Deno.test("Simple usage", () => {
    const foot = adt({
        left: null,
        right: null,
    });

    type Foot = Variants<typeof foot>;

    const left = foot.left as Foot;

    const matcher = spy();

    ifLet(left, "left", matcher);

    assertSpyCall(matcher, 0, { args: [null] });
});

Deno.test("Advanced usage", () => {
    const command = adt({
        move: (x: number, y: number) => ({ x, y }),
        attack: (target: string) => target,
    });

    type Command = Variants<typeof command>;

    const move = command.move(10, 20) as Command;

    const matcher = spy();

    ifLet(move, "move", matcher);

    assertSpyCall(matcher, 0, { args: [{ x: 10, y: 20 }] });

    ifLet(move, "attack", matcher);

    assertSpyCalls(matcher, 1);
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

    type PowerSource = Variants<typeof powerSource>;

    const acOn = powerSource.ac(acStatus.on, 230) as PowerSource;

    const outer = spy();

    ifLet(acOn, "ac", outer);

    assertSpyCall(outer, 0, { args: [{ status: acStatus.on, voltage: 230 }] });

    const inner = spy();

    ifLet(acOn, "ac", ({ status }) => {
        ifLet(status, "on", inner);
    });

    assertSpyCall(inner, 0, { args: [null] });
});
