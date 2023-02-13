// ADT
import adt from "./lib/adt";
import type { Variants } from "./lib/adt";
export { adt, Variants };

// if_let
import if_let from "./lib/if_let";
export { if_let };

// match
import match, { def } from "./lib/match";
export { match, def };

// Option
import type Option from "./lib/option";
import { some, none } from "./lib/option";
export { Option, some, none };

// Result
import type Result from "./lib/result";
import { ok, err } from "./lib/result";
export { Result, ok, err };

// unwrap
import { expect, unwrap, unwrap_or, unwrap_or_else } from "./lib/unwrap";
export { expect, unwrap, unwrap_or, unwrap_or_else };

// default
export default adt;
