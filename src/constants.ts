import * as core from "@actions/core";

export const TMPDIR = process.env.RUNNER_TEMP
  ?? process.env.TEMP
  ?? core.toPlatformPath("/tmp");

export enum State {
  CachePrimaryKey = 'CACHE_PRIMARY_KEY',
  CacheMatchedKey = 'CACHE_MATCHED_KEY',
}

export enum Outputs {
  Version = 'llvm-version',
  CacheHit = 'cache-hit',
}