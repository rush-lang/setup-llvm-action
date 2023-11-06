import * as core from '@actions/core';
import * as cache from '@actions/cache';
import { Options, getOptions } from './options';
import { getCacheKey } from './cache-utils';
import { State } from './constants';

async function run(options: Options) {
  if (!options.cache) {
    core.info('Cache is disabled, not saving cache.');
    return;
  }

  const cacheKey = core.getState(State.CachePrimaryKey) ?? getCacheKey(options);
  const matchedKey = core.getState(State.CacheMatchedKey) ?? '';

  if (cacheKey === matchedKey) {
    core.info(`Cache hit occurred on the primary key ${cacheKey}, not saving cache.`);
    return;
  }

  const cacheId = await cache.saveCache([options.install_prefix], cacheKey);
  if (cacheId === -1) {
    return;
  }

  core.info(`Cache saved with the key ${cacheKey}`);
}

run(getOptions()).catch((err) => {
  core.setFailed(err.message);
});