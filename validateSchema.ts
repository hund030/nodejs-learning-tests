import fs from "fs";
import mustache from "mustache";
import Ajv from "ajv";
import schema from "./yaml.schema.json";
import { load } from "js-yaml";

type Variable = {
  [key: string]: boolean | string;
};

function extractRenderVariables(template: string) {
  let variables = [{}];
  const regex = /([\{]+)([^{}}]+)([\}]+)/g;
  let match;

  while ((match = regex.exec(template)) !== null) {
    const variable = match[2].replace(/[#^\/]/g, "");

    if (variable !== match[2]) {
      if (!variables.some((v: Variable) => v[variable])) {
        variables = [
          ...variables.map((v) => {
            return { ...v, [variable]: true };
          }),
          ...variables.map((v) => {
            return { ...v, [variable]: false };
          }),
        ];
      }
    } else {
      variables = variables.map((v) => {
        return { ...v, [variable]: variable };
      });
    }
  }

  return variables;
}

const validator = new Ajv({ allowUnionTypes: true }).compile(schema);
const ymlFile = fs.readFileSync("teamsapp.yaml.tpl", "utf8");
const variables = extractRenderVariables(ymlFile);
variables.forEach((v) => {
  const res = mustache.render(ymlFile, v);
  const ymlDoc = load(res);
  if (!validator(ymlDoc)) {
    console.error(validator.errors);
  }
});
