let rawTemplate =
  "var f = list('${output.value.{{postCurlyBrace resourceId}}/config/appsettings', '2021-02-01')";

const Handlebars = require("handlebars");
Handlebars.registerHelper("postCurlyBrace", (text: string) => {
  var result = text + "}";
  return new Handlebars.SafeString(result);
});
let template = Handlebars.compile(rawTemplate);
console.log(template({ resourceId: "Momo" }));

rawTemplate = "{{preDoubleCurlyBraces pluginId}}.path}}";
Handlebars.registerHelper("preDoubleCurlyBraces", (text: string) => {
  var result = "{{" + text;
  return new Handlebars.SafeString(result);
});
template = Handlebars.compile(rawTemplate);
console.log(template({ pluginId: "ShaMiKo"}));
template = Handlebars.compile(template({ pluginId: "ShaMiKo"}));
console.log(template({ShaMiKo: { path: "Momo" } }));
