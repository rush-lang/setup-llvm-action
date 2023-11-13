import * as core from '@actions/core';
import * as semver from "semver";
import VERSION_CATALOG from "./version-catalog";
import fs from 'fs';

const DEFAULT_NIX_INSTALL_PREFIX = "/opt/llvm";
const DEFAULT_WIN32_INSTALL_PREFIX = "C:/Program Files/LLVM";

const BUILD_TYPES = ["Release", "Debug", "RelWithDebInfo", "MinSizeRel"];
const SUPPORTED_COMPILERS = [ "clang", "gcc", "msvc" ];

const PLATFORM_INSTALL_PREFIX = process.platform === "win32"
  ? DEFAULT_WIN32_INSTALL_PREFIX
  : DEFAULT_NIX_INSTALL_PREFIX;

const PLATFORM_COMPILER =
  process.platform === "win32" ? "msvc" :
  process.platform === "linux" ? "gcc" : "clang";

const BUILD_TARGETS = [
  "all",
  "AArch64",
  "AMDGPU",
  "ARM",
  "AVR",
  "BPF",
  "Hexagon",
  "Lanai",
  "LoongArch",
  "Mips",
  "MSP430",
  "NVPTX",
  "PowerPC",
  "RISCV",
  "Sparc",
  "SystemZ",
  "VE",
  "WebAssembly",
  "X86",
  "XCore",
];

const LLVM_PROJECTS = [
  "all",
  "clang",
  "clang-tools-extra",
  "cross-project-tests",
  "libc",
  "libclc",
  "lld",
  "lldb",
  "openmp",
  "polly",
  "pstl",
];

const LLVM_RUNTIMES = [
  "all",
  "compiler-rt",
  "libc",
  "libcxx",
  "libcxxabi",
  "libunwind",
  "openmp",
];

export interface Options {
  compiler: string;
  llvm_version: string;
  install_prefix: string;
  build_type: string;
  build_targets?: string;
  build_tools: boolean;
  build_tests: boolean;
  build_examples: boolean;
  build_benchmarks: boolean;
  build_shared_libs: boolean;
  enable_projects?: string;
  enable_runtimes?: string;
  build_32_bits: boolean;
  cache: boolean;
}

type ValidatedInputOptions = core.InputOptions & { values?: string[] };

export function getOptions(): Options {
  return {
    compiler: getValidatedInput("compiler", { values: SUPPORTED_COMPILERS }) ?? PLATFORM_COMPILER,
    llvm_version: getSpecificVersion(),
    install_prefix: getValidatedInput("install-prefix") ?? PLATFORM_INSTALL_PREFIX,
    build_type: getValidatedInput("build-type", { values: BUILD_TYPES }) ?? "Release",
    build_targets: getValidatedInput("build-targets", {
      values: BUILD_TARGETS,
    }),
    enable_projects: getValidatedInput("enable-projects", {
      values: LLVM_PROJECTS,
    }),
    enable_runtimes: getValidatedInput("enable-runtimes", {
      values: LLVM_RUNTIMES,
    }),
    build_tools: core.getBooleanInput("build-tools"),
    build_tests: core.getBooleanInput("build-tests"),
    build_examples: core.getBooleanInput("build-examples"),
    build_benchmarks: core.getBooleanInput("build-benchmarks"),
    build_shared_libs: core.getBooleanInput("build-shared-libs"),
    build_32_bits: core.getBooleanInput("build-32-bits"),
    cache: core.getBooleanInput("cache"),
  };
}

/** Gets a specific version */
function getSpecificVersion() {
  const includePrerelease = core.getBooleanInput("include-prerelease")
  const inputVersion = core.getInput("llvm-version", { required: true });

  if (inputVersion === 'latest') {
    return semver.maxSatisfying(VERSION_CATALOG, "*", { includePrerelease: includePrerelease })!;
  }

  if (!semver.valid(semver.coerce(inputVersion))) {
    throw new Error(`Invalid input version '${inputVersion}'.`);
  }

  const maxVersion = semver.maxSatisfying(VERSION_CATALOG, inputVersion, { includePrerelease: includePrerelease });
  if (!maxVersion) {
    throw new Error(`No matching version found for input version '${inputVersion}'.`);
  }

  return maxVersion;
}

function getValidatedInput(name: string, options?: ValidatedInputOptions) {
  const input = core.getInput(name, options);
  if (!input || input === "") {
    if (options?.required) throw new Error(`Missing required input: ${name}`);
    return undefined;
  }

  const expected = options?.values;
  if (expected) {
    const splitInput = input.split(";");
    if (!splitInput.every((input) => expected.includes(input))) {
      throw new Error([
        `Invalid ${name}: '${input}'`,
        `Expected one or more of: ${expected.join(";")}`
      ].join("\n"));
    }
  }

  return input;
}
