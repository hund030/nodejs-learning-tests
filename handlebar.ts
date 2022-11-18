/*
let rawTemplate =
  "var f = list('${ output.value.{{resourceId}} }/config/appsettings', '2021-02-01')";
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
*/

import * as Handlebars from "handlebars";
Handlebars.registerHelper("contains", (value, array) => {
  array = array instanceof Array ? array : [array];
  return array.indexOf(value) > -1 ? this : "";
});
Handlebars.registerHelper("notContains", (value, array) => {
  array = array instanceof Array ? array : [array];
  return array.indexOf(value) == -1 ? this : "";
});
Handlebars.registerHelper("equals", (value, target) => {
  return value === target ? this : "";
});

const rawString = `{{#if (contains "aad-app" connections)}}
    INITIATE_LOGIN_ENDPOINT: uri({{azure-web-app.outputs.endpoint}}, 'auth-start.html') // The page is used to let users consent required OAuth permissions during bot SSO process
    M365_AUTHORITY_HOST: m365OauthAuthorityHost // AAD authority host
    M365_CLIENT_ID: m365ClientId // Client id of AAD application
    M365_CLIENT_SECRET: m365ClientSecret // Client secret of AAD application
    M365_TENANT_ID: m365TenantId // Tenant id of AAD application
    M365_APPLICATION_ID_URI: m365ApplicationIdUri // Application ID URI of AAD application
    {{/if}}`;

const rawString2 = `{{#if (equals "Tab" scenario)}}
AA
{{else}}
BB
{{/if}}`;

const rawString3 = `\\{{escaped}}
{{escaped}}
`;

let template = Handlebars.compile(rawString);
console.log(template({ connections: ["aad-app", "teams-tab"] }));

template = Handlebars.compile(rawString2);
console.log(template({ scenario: "Tab" }));

template = Handlebars.compile(rawString3);
console.log(template({ escaped: "Tab" }));
