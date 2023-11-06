import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import { TMPDIR } from '../constants';
import { Options } from '../options'
import { extractTarXz } from '../utils';

function getDownloadUrl(version: string, prefix: string, suffix: string = "src.tar.xz") {
  const baseUrl = `https://github.com/llvm/llvm-project/releases/download/llvmorg-${version}`;
  return `${baseUrl}/${prefix}-${version}.${suffix}`;
}

export default async (options: Options) => {
  const llvmSourceDownloadUrl = getDownloadUrl(options.llvm_version, 'llvm');

  core.info(`Downloading from '${llvmSourceDownloadUrl}'...`);
  const archive = await tc.downloadTool(llvmSourceDownloadUrl,
    core.toPlatformPath(`${TMPDIR}/llvm-${options.llvm_version}.src.tar.xz`));

  core.info(`Extracting '${archive}'...`);
  await extractTarXz(archive, TMPDIR);
}
