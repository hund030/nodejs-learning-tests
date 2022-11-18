import Mustache, { Context, TemplateSpans, Writer } from "mustache";

const rawString = `
    {{api}}
    {{endpoint}}
    `;
const view: Record<string, string> = { api: "mmo" };

const token = escapeEmptyVariable(rawString, view);
const writer = new Writer();
const template = writer.renderTokens(token as string[][], new Context(view));
console.log(template);

function escapeEmptyVariable(
  template: string,
  view: Record<string, string | undefined>,
  tags: [string, string] = ["{{", "}}"]
): TemplateSpans {
  let parsed = Mustache.parse(template, tags);
  let shift = 0;
  for (const v of parsed) {
    v[2] += shift;
    if (v[0] === "name" && !view[v[1]]) {
      v[0] = "text";
      v[1] = tags[0] + v[1] + tags[1];
      shift += 4;
    }
    v[3] += shift;
  }
  return parsed;
}
