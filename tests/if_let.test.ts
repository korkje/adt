import { spy, assertSpyCall, assertSpyCalls } from "@std/testing/mock";
import adt, { type Variants } from "lib/adt.ts";
import if_let from "lib/if_let.ts";

Deno.test("Simple usage", () => {
    const foot = adt({
        left: null,
        right: null,
    });

    type Foot = Variants<typeof foot>;

    const left = foot.left as Foot;

    const matcher = spy();

    if_let(left, "left", matcher);

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

    if_let(move, "move", matcher);

    assertSpyCall(matcher, 0, { args: [{ x: 10, y: 20 }] });

    if_let(move, "attack", matcher);

    assertSpyCalls(matcher, 1);
});

Deno.test("Nested usage", () => {
    const ac_status = adt({
        on: null,
        off: null,
    });

    type ACStatus = Variants<typeof ac_status>;

    const power_source = adt({
        battery: (voltage: number) => voltage,
        ac: (status: ACStatus, voltage: number) => ({ status, voltage }),
    });

    type PowerSource = Variants<typeof power_source>;

    const ac_on = power_source.ac(ac_status.on, 230) as PowerSource;

    const outer = spy();

    if_let(ac_on, "ac", outer);

    assertSpyCall(outer, 0, { args: [{ status: ac_status.on, voltage: 230 }] });

    const inner = spy();

    if_let(ac_on, "ac", ({ status }) => {
        if_let(status, "on", inner);
    });

    assertSpyCall(inner, 0, { args: [null] });
});
