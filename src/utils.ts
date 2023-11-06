import * as io from "@actions/io";
import * as exec from "@actions/exec";
import * as tc from "@actions/tool-cache";

export async function extractTarXz(archive: string, outDir: string) {
  if (process.platform === "win32") {
    let exit = await exec.exec("7z", ["x", archive, `-o${outDir}`, "-y"]);
    if (exit !== 0) {
      throw new Error(`Failed to extract ${archive} archive.`);
    }

    const tarArchive = archive.substring(0, archive.lastIndexOf('.'));
    exit = await exec.exec("7z", ["x", tarArchive, `-o${outDir}`, "-y"]);
    await io.rmRF(tarArchive); // remove temporary tar archive.

    if (exit !== 0) {
      throw new Error(`Failed to extract ${archive} archive.`);
    }
  } else {
    await tc.extractTar(archive, outDir, 'x').catch((err) => {
      throw new Error(`Failed to extract ${archive} archive.\n${err.message}`);
    });
  }
}