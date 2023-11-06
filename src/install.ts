import * as core from "@actions/core";
import * as exec from "@actions/exec";
import { Options } from "./options";
import { TMPDIR } from "./constants";

function getBuildArgs(options: Options) {
  return [
    `-DCMAKE_BUILD_TYPE=${options.build_type}`,
    `-DCMAKE_INSTALL_PREFIX=${options.install_prefix}`,
    options.enable_projects !== undefined
      ? `-DLLVM_ENABLE_PROJECTS=${options.enable_projects}` : '',
    options.enable_runtimes !== undefined
      ? `-DLLVM_ENABLE_RUNTIMES=${options.enable_runtimes}` : '',
    options.build_targets !== undefined
      ? `-DLLVM_TARGETS_TO_BUILD=${options.build_targets}`  : '',
    `-DLLVM_BUILD_TOOLS=${options.build_tools ? 'ON' : 'OFF'}`,
    `-DLLVM_BUILD_TESTS=${options.build_tests ? 'ON' : 'OFF'}`,
    `-DLLVM_BUILD_EXAMPLES=${options.build_examples ? 'ON' : 'OFF'}`,
    `-DLLVM_BUILD_BENCHMARKS=${options.build_benchmarks ? 'ON' : 'OFF'}`,
    `-DLLVM_BUILD_LLVM_DYLIB=${options.build_shared_libs ? 'ON' : 'OFF'}`,
    `-DLLVM_INCLUDE_TOOLS=${options.build_tools ? 'ON' : 'OFF'}`,
    `-DLLVM_INCLUDE_TESTS=${options.build_tests ? 'ON' : 'OFF'}`,
    `-DLLVM_INCLUDE_EXAMPLES=${options.build_examples ? 'ON' : 'OFF'}`,
    `-DLLVM_INCLUDE_BENCHMARKS=${options.build_benchmarks ? 'ON' : 'OFF'}`,
    `-DLLVM_BUILD_32_BITS=${options.build_32_bits ? 'ON' : 'OFF'}`,
  ].filter(Boolean);
}

export async function install(options: Options): Promise<void> {
  const srcDir = core.toPlatformPath(`${TMPDIR}/llvm-${options.llvm_version}.src`);
  const buildDir = core.toPlatformPath(`${srcDir}/build`);

  let exit = 0;
  core.info(`Building LLVM ${options.llvm_version}...`);
  exit = await exec.exec("cmake", ["-B", buildDir, "-S", srcDir, ...getBuildArgs(options)]);

  if (exit !== 0) {
    throw new Error("Failed to configure LLVM build.");
  }

  exit = await exec.exec("cmake", [
    "--build", buildDir,
    "--target", "install",
    "--config", options.build_type
  ]);

  if (exit !== 0) {
    throw new Error("Failed to build and install LLVM.");
  }

  core.info(`Installed LLVM ${options.llvm_version}`);
  core.info(`Install location: ${options.install_prefix}`);
}
