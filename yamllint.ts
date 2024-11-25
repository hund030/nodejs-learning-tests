const yamlLint = require("yaml-lint");
const mustache = require("mustache");
const fs = require("fs");

const tpl = fs.readFileSync("teamsapp.yaml.tpl", "utf8");
const variables = {};
const rendered = mustache.render(tpl, variables);
const linted = yamlLint
  .lint(rendered)
  .then(() => {
    console.log("Valid yaml file.");
  })
  .catch((err: Error) => {
    console.error("Invalid yaml file", err);
  });
