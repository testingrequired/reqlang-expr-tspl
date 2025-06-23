import { globSync } from "glob";
import { expect, test } from "vitest";
import { exec } from "child_process";
import { readFile } from "fs/promises";

const tsFiles = globSync("./spec/*.expr.ts");

test.concurrent.each(tsFiles)("test %s", async (tsFile) => {
  const interpretedFile = `${tsFile}.interpreted`;

  const interpretedContent = await readFile(interpretedFile, {
    encoding: "utf-8",
  });

  const [firstLine, ...rest] = interpretedContent.split("\n");
  const [args, interpretedContentCode]: [string, string] = firstLine.startsWith(
    "//"
  )
    ? [firstLine.slice(2), rest.join("\n")]
    : ["", interpretedContent];

  const [stdout] = await asyncCallExecProcess(tsFile, args);

  expect(stdout).toBe(interpretedContentCode);
});

function asyncCallExecProcess(
  tsFile: string,
  args: string
): Promise<[string, string]> {
  return new Promise((resolve, reject) => {
    exec(`./node_modules/.bin/tsx ${tsFile} ${args}`, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      }

      resolve([stdout, stderr]);
    });
  });
}
