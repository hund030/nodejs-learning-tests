import Mustache, { Context, TemplateSpans, Writer } from "mustache";

const view: Record<string, string> = { api: "mmo" };
const view2: Record<string, string> = { api: "mmo", endpoint: "mi" };

const rawString = ` {{api}} {{endpoint}} `;
const token = escapeEmptyVariableInPlace(rawString, view);
const writer = new Writer();
const template = writer.renderTokens(token as string[][], new Context(view));
console.log(template); // mmo {{endpoint}}
// Mustache cache the parsed token. Since we modify the parsed token in place, below render escape endpoint
console.log(Mustache.render(rawString, view2)); // mmo {{endpoint}}

const rawString2 = ` {{api}}-{{endpoint}} `;
const token2 = escapeEmptyVariable(rawString2, view);
const template2 = writer.renderTokens(token2 as string[][], new Context(view));
console.log(template2); // mmo-{{endpoint}}
console.log(Mustache.render(rawString2, view2)); // mmo-mi

function escapeEmptyVariableInPlace(
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

function escapeEmptyVariable(
  template: string,
  view: Record<string, string | undefined>,
  tags: [string, string] = ["{{", "}}"]
): TemplateSpans {
  const parsed = Mustache.parse(template, tags);
  let tokens = JSON.parse(JSON.stringify(parsed)); // deep copy
  let shift = 0;
  for (const v of tokens) {
    v[2] += shift;
    if (v[0] === "name" && !view[v[1]]) {
      v[0] = "text";
      v[1] = tags[0] + v[1] + tags[1];
      shift += 4;
    }
    v[3] += shift;
  }
  return tokens;
}
