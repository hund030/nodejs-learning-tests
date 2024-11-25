import yaml from "yaml";
import mustache from "mustache";
import Ajv from "ajv";

type Variable = {
  [key: string]: boolean | string;
};

const template = `  # Creates a new Microsoft Entra app to authenticate users if
  # the environment variable that stores clientId is empty
  - uses: aadApp/create
    with:
      # Note: when you run aadApp/update, the Microsoft Entra app name will be updated
      # based on the definition in manifest. If you don't want to change the
      # name, make sure the name in Microsoft Entra manifest is the same with the name
      # defined here.
      name: {{appName}}
      # If the value is false, the action will not generate client secret for you
  {{#skipClientSecret}}
      generateClientSecret: false
  {{/skipClientSecret}}
  {{^skipClientSecret}}
      generateClientSecret: true
  {{/skipClientSecret}}
      # Authenticate users with a Microsoft work or school account in your
      # organization's Microsoft Entra tenant (for example, single tenant).
      signInAudience: AzureADMyOrg
    # Write the information of created resources into environment file for the
    # specified environment variable(s).
    writeToEnvironmentFile:
      clientId: AAD_APP_CLIENT_ID
  {{^skipClientSecret}}
      # Environment variable that starts with \`SECRET_\` will be stored to the
      # .env.{envName}.user environment file
      clientSecret: SECRET_AAD_APP_CLIENT_SECRET
  {{/skipClientSecret}}
      objectId: AAD_APP_OBJECT_ID
      tenantId: AAD_APP_TENANT_ID
      authority: AAD_APP_OAUTH_AUTHORITY
      authorityHost: AAD_APP_OAUTH_AUTHORITY_HOST`; // Your template string here
const result = `  # Creates a new Microsoft Entra app to authenticate users if
  # the environment variable that stores clientId is empty
  - uses: aadApp/create
    with:
      # Note: when you run aadApp/update, the Microsoft Entra app name will be updated
      # based on the definition in manifest. If you don't want to change the
      # name, make sure the name in Microsoft Entra manifest is the same with the name
      # defined here.
      name: {{appName}}\${{APP_SUFFIX}}
      # If the value is false, the action will not generate client secret for you
      generateClientSecret: true
      # Authenticate users with a Microsoft work or school account in your
      # organization's Microsoft Entra tenant (for example, single tenant).
      signInAudience: AzureADMyOrg
    # Write the information of created resources into environment file for the
    # specified environment variable(s).
    writeToEnvironmentFile:
      clientId: AAD_APP_CLIENT_ID
      objectId: AAD_APP_OBJECT_ID
      tenantId: AAD_APP_TENANT_ID
      authority: AAD_APP_OAUTH_AUTHORITY
      authorityHost: AAD_APP_OAUTH_AUTHORITY_HOST`; // Your result string here

function extractRenderVariables(template: string) {
  let variables = [{}];
  const regex = /\{\{([^}]+)\}\}/g;
  let match;

  while ((match = regex.exec(template)) !== null) {
    const variable = match[1].replace(/[#^\/]/g, "");

    if (variable !== match[1]) {
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

function getRenderValue(
  variables: Variable[],
  template: string,
  result: string
) {
  yaml.parse(result);
}

const variables = extractRenderVariables(template);
variables.forEach((v) => {
  mustache.render(template, v);
});
// const variables2 = extractRenderVariables(result);
// console.log(variables2);
// const ymlDoc = yaml.parse(mustache.render(result, variables2));
// console.log(JSON.stringify(ymlDoc));

export {};
