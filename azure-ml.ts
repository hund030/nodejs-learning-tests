import {
  AzureBlobDatastore,
  AzureMachineLearningServicesManagementClient,
} from "@azure/arm-machinelearning";
import { CognitiveServicesManagementClient } from "@azure/arm-cognitiveservices";
import { DefaultAzureCredential } from "@azure/identity";

function getMLServicesManagementClient() {
  const subscriptionId =
    process.env["subscription"] || "00000000-0000-0000-0000-000000000000";
  const credential = new DefaultAzureCredential();
  return new AzureMachineLearningServicesManagementClient(
    credential,
    subscriptionId
  );
}

function getCogniiveServicesManagementClient() {
  const subscriptionId =
    process.env["subscription"] || "00000000-0000-0000-0000-000000000000";
  const credential = new DefaultAzureCredential();
  return new CognitiveServicesManagementClient(credential, subscriptionId);
}

function parseResourceId(resourceId: string, regex: RegExp) {
  const match = resourceId.match(regex);
  if (match && match[1]) {
    return match[1];
  }
  return "";
}

function parseResourceGroup(resourceId?: string) {
  if (!resourceId) {
    return "";
  }
  const regex = /\/resourceGroups\/([^\/]+)/;
  return parseResourceId(resourceId, regex);
}

function parseCoginitiveAccountName(resourceId?: string) {
  if (!resourceId) {
    return "";
  }
  const regex = /\/providers\/Microsoft\.CognitiveServices\/accounts\/([^\/]+)/;
  return parseResourceId(resourceId, regex);
}

async function getWorkspacesBySubscription(
  client: AzureMachineLearningServicesManagementClient
) {
  const resArray = new Array();
  for await (let item of client.workspaces.listBySubscription()) {
    if (item.kind === "Project" || item.kind === "Hub") {
      resArray.push(item);
    }
  }
  return resArray;
}

async function getModelByWorkspace(
  client: AzureMachineLearningServicesManagementClient,
  cognitiveservices: CognitiveServicesManagementClient,
  resourceGroupName: string,
  workspaceName: string
) {
  const resArray = new Array();
  for await (let connection of client.workspaceConnections.list(
    resourceGroupName,
    workspaceName
  )) {
    const accountName = parseCoginitiveAccountName(
      connection.properties?.metadata?.ResourceId
    );
    const accountResourceGroup = parseResourceGroup(
      connection.properties?.metadata?.ResourceId
    );
    try {
      for await (let model of cognitiveservices.deployments.list(
        accountResourceGroup,
        accountName
      )) {
        resArray.push(model.name);
      }
    } catch (e) {
      console.debug(e.message);
    }
  }
  return resArray;
}

async function getDataByWorkspace(
  client: AzureMachineLearningServicesManagementClient,
  resourceGroupName: string,
  workspaceName: string
) {
  const resArray = new Array();
  for await (let data of client.datastores.list(
    resourceGroupName,
    workspaceName
  )) {
    const accountName = (data.properties as AzureBlobDatastore).accountName;
    const resourceGroup = (data.properties as AzureBlobDatastore).resourceGroup;
    const datastoreType = (data.properties as AzureBlobDatastore).datastoreType; // AzureBlob, AzureFile
    const containerName = (data.properties as AzureBlobDatastore).containerName; // AzureBlob
    const isDefault = data.properties.isDefault; // true
    if (isDefault) {
      resArray.push({
        accountName,
        resourceGroup,
        datastoreType,
        containerName,
      });
    }
  }
  return resArray;
}

async function main() {
  const client = getMLServicesManagementClient();
  const cognitiveservices = getCogniiveServicesManagementClient();
  const workspaces = await getWorkspacesBySubscription(client);
  for (let workspace of workspaces) {
    const resourceGroupName = parseResourceGroup(workspace.id);
    const workspaceName = workspace.name;
    const dataStore = await getDataByWorkspace(
      client,
      resourceGroupName,
      workspaceName
    );
    console.log(
      `DataStore ${JSON.stringify(
        dataStore
      )} in workspace ${workspaceName} in resource group ${resourceGroupName}`
    );
    const models = await getModelByWorkspace(
      client,
      cognitiveservices,
      resourceGroupName,
      workspaceName
    );
    console.log(
      `Models ${models} in workspace ${workspaceName} in resource group ${resourceGroupName}`
    );
  }
}

main().catch(console.error);
