// ADT
import adt, { tag, empty } from "./lib/adt";
import type { Variants } from "./lib/adt";
export { adt, tag, empty, Variants };

// Match
import match from "./lib/match";
export { match };

// Result
import type Result from "./lib/result";
import { ok, err } from "./lib/result";
export { Result, ok, err };

// Option
import type Option from "./lib/option";
import { some, none } from "./lib/option";
export { Option, some, none };

// Default
export default adt;
