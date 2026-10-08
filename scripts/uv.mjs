import { spawn } from "node:child_process";
import { homedir } from "node:os";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const executable = process.platform === "win32" ? "uv.exe" : "uv";
const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const candidates = [
  executable,
  resolve(projectRoot, ".tools/bin", executable),
  resolve(homedir(), ".local/bin", executable),
  resolve(homedir(), ".cargo/bin", executable),
  resolve(projectRoot, "../fastapi-nextjs/.tools/bin", executable),
];

let child;

function run(index = 0) {
  if (index === candidates.length) {
    console.error("uv를 찾을 수 없습니다. uv를 설치하거나 프로젝트의 .tools/bin에 배치하세요.");
    process.exitCode = 1;
    return;
  }

  child = spawn(candidates[index], process.argv.slice(2), { stdio: "inherit" });
  child.on("error", (error) => {
    if (error.code === "ENOENT") {
      run(index + 1);
    } else {
      console.error(`uv 실행 실패: ${error.message}`);
      process.exitCode = 1;
    }
  });
  child.on("exit", (code, signal) => {
    process.exitCode = code ?? (signal === "SIGINT" ? 130 : 1);
  });
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child?.kill(signal));
}

run();
