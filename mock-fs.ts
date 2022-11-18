import mock from "mock-fs";
import path from "path";
import fs from "fs-extra";

const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
const root = __dirname;
mock({
  [root]: {
    "index.txt": mock.file({
      content: "index",
      mtime: yesterday,
    }),
  },
});

fs.writeFileSync(path.resolve(root, "index.txt"), "index");
mock.restore();
