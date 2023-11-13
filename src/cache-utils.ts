import { Options } from "./options";
import * as crypto from "crypto";

const excludedOptions = [
  "cache",
  "compiler",
  // "install-prefix",
  "include-prerelease"
];

export function getCacheKey(options: Options) {
  const optionsString = Object.entries(options)
    .filter(([key, _]) => !excludedOptions.includes(key))
    .map(([key, value]) => `${key}:${value}`)
    .join(",");

  const cacheKey = crypto
    .createHash("sha256")
    .update(optionsString)
    .digest("hex");

  return `rush-lang/setup-llvm-action-${process.platform}-${options.compiler}-${cacheKey}`;
}
