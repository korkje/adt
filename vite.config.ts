import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        sourcemap: true,
        lib: {
            // entry: resolve(__dirname, "src/index.ts"),
            entry: {
                "index": resolve(__dirname, "src/index.ts"),
                "lib/adt": resolve(__dirname, "src/lib/adt.ts"),
                "lib/if_let": resolve(__dirname, "src/lib/if_let.ts"),
                "lib/match": resolve(__dirname, "src/lib/match.ts"),
                "lib/option": resolve(__dirname, "src/lib/option.ts"),
                "lib/result": resolve(__dirname, "src/lib/result.ts"),
                "lib/unwrap": resolve(__dirname, "src/lib/unwrap.ts"),
            },
            formats: ["es"],
        },
    },
    plugins: [dts()],
});
