import * as core from "@actions/core";
import * as cache from "@actions/cache";
import { getCacheKey } from "./cache-utils";
import { Options } from "./options";
import { State, Outputs } from "./constants";

export async function restoreCache(options: Options): Promise<boolean> {
  core.info(`Checking LLVM ${options.llvm_version} cache...`);

  const cacheKey = getCacheKey(options);
  core.saveState(State.CachePrimaryKey, cacheKey);

  const matchedkey = await cache.restoreCache([options.install_prefix], cacheKey);
  const cacheHit = !!matchedkey;

  core.setOutput(Outputs.CacheHit, cacheHit);
  if (cacheHit) {
    core.saveState(State.CacheMatchedKey, matchedkey);
    core.info(`LLVM ${options.llvm_version} cached restored.`);
  } else {
    core.info(`No LLVM ${options.llvm_version} cache found.`);
  }

  return cacheHit;
}