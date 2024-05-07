const { watch } = require("node:fs/promises");

const file = process.argv[2];

function previewMustache(filepath: string) {
  const { readFile } = require("node:fs/promises");
  const { render } = require("mustache");
  const { basename } = require("node:path");

  return readFile(filepath, "utf8").then((template: string) => {
    const filename = basename(filepath);
    const rendered = render(template, { filename });
    // write to a file
    const { writeFile } = require("node:fs/promises");
    const { join } = require("node:path");
    const { dirname } = require("node:path");
    return writeFile(join(dirname(filepath), `${filename}.html`), rendered);
  });
}

(async () => {
  try {
    const watcher = watch(file);
    for await (const event of watcher) {
      console.log(event);
      if (event.eventType === "change") {
        await previewMustache(file);
      }
    }
  } catch (err: any) {
    if (err.name === "AbortError") return;
    console.error(err);
  }
})();
