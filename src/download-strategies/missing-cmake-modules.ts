import * as io from '@actions/io';
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
  const cmakeSourceDownloadUrl = getDownloadUrl(options.llvm_version, 'cmake');

  core.info(`Downloading from '${llvmSourceDownloadUrl}'...`);
  core.info(`Downloading from '${cmakeSourceDownloadUrl}'...`);

  const [llvmArchive, cmakeArchive] = await Promise.all([
    tc.downloadTool(llvmSourceDownloadUrl, core.toPlatformPath(`${TMPDIR}/llvm-${options.llvm_version}.src.tar.xz`)),
    tc.downloadTool(cmakeSourceDownloadUrl, core.toPlatformPath(`${TMPDIR}/cmake-${options.llvm_version}.src.tar.xz`)),
  ]);

  core.info(`Extracting '${llvmArchive}'...`);
  core.info(`Extracting '${cmakeArchive}'...`);

  await Promise.all([
    extractTarXz(llvmArchive, TMPDIR),
    extractTarXz(cmakeArchive, TMPDIR),
  ]);

  io.mv(
    core.toPlatformPath(`${TMPDIR}/cmake-${options.llvm_version}.src`),
    core.toPlatformPath(`${TMPDIR}/cmake`));
}
