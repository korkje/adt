import { spy, assertSpyCalls } from "@std/testing/mock";
import { assertEquals, assertThrows } from "@std/assert";
import adt, { type Variants } from "lib/adt.ts";
import let_else from "lib/let_else.ts";

Deno.test("Simple usage", () => {
    const foot = adt({
        left: null,
        right: null,
    });

    type Foot = Variants<typeof foot>;

    const left = foot.left as Foot;

    const callback = spy(() => { throw new Error() });

    let_else(left, "left", callback);

    assertSpyCalls(callback, 0);
});

Deno.test("Advanced usage", () => {
    const command = adt({
        move: (x: number, y: number) => ({ x, y }),
        attack: (target: string) => target,
    });

    type Command = Variants<typeof command>;

    const move = command.move(10, 20) as Command;

    const callback = spy(() => { throw new Error("Illegal command") });

    const result = let_else(move, "move", callback);

    assertSpyCalls(callback, 0);
    assertEquals(result, { x: 10, y: 20 });
    assertThrows(() => let_else(move, "attack", callback), Error, "Illegal command");
});

Deno.test("Assures throw", () => {
    const foot = adt({
        left: null,
        right: null,
    });

    type Foot = Variants<typeof foot>;

    const left = foot.left as Foot;

    const callback = spy(() => undefined as never);

    assertThrows(() => let_else(left, "right", callback), Error);
});
