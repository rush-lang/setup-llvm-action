import * as core from "@actions/core";
import * as path from "path";
import { Options, getOptions } from "./options";
import { restoreCache } from './cache-restore';
import { install } from "./install";
import { download } from "./download";
import { Outputs } from "./constants";

async function run(options: Options): Promise<void> {
  core.setOutput(Outputs.Version, options.llvm_version);
  core.setOutput(Outputs.CacheHit, false);

  if (!(options.cache && await restoreCache(options))) {
    await download(options);
    await install(options);
  }

  const bin = path.join(options.install_prefix, "bin");
  const lib = path.join(options.install_prefix, "lib");

  core.addPath(bin);

  const ld = process.env.LD_LIBRARY_PATH ?? "";
  const dyld = process.env.DYLD_LIBRARY_PATH ?? "";

  core.exportVariable("LLVM_PATH", options.install_prefix);
  core.exportVariable("LD_LIBRARY_PATH", `${lib}${path.delimiter}${ld}`);
  core.exportVariable("DYLD_LIBRARY_PATH", `${lib}${path.delimiter}${dyld}`);
}

run(getOptions()).catch((err) => {
  core.setFailed(err.message);
});