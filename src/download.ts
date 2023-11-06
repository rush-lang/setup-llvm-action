import * as core from "@actions/core";
import { Options } from "./options";
import * as semver from "semver";
import { TMPDIR } from "./constants";

import defaultStrategy from './download-strategies/default';
import missingCmakeModulesStrategy from "./download-strategies/missing-cmake-modules";

export async function download(options: Options): Promise<void> {
  const strategies: { [key: string]: any } = {
    ">=15": {
      name: 'missing-cmake-modules',
      fn: missingCmakeModulesStrategy
    },
    "*": {
      name: 'default',
      fn: defaultStrategy
    },
  };

  const key = Object.keys(strategies).find((key) => semver.satisfies(options.llvm_version, key));
  core.info(`Downloading and extracting LLVM ${options.llvm_version}...`);
  core.info("Download strategy: " + strategies[key!].name);
  await strategies[key!].fn(options)
}