import { AgentsClient } from "@azure/ai-agents";
import { DefaultAzureCredential } from "@azure/identity";
import { ServiceClient } from "@azure/ms-rest-js";

const credential = new DefaultAzureCredential();

const accountName = "";
const projectName = "";
const agentEndpoint = `https://int.ai.azure.com/api/projects/${projectName}`;
const agentConnectionString = `https://${accountName}.services.ai.azure.com/api/projects/${projectName}`;
const agentClient = new AgentsClient(agentEndpoint, credential);
const fileId = "assistant-8dNWcc7pFwSuHTMiwspUs5";

credential.getToken("https://ai.azure.com/.default").then((token) => {
  fetch(
    `${agentConnectionString}/files/${fileId}/content?api-version=2025-05-15-preview`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then(async (response) => {
    if (!response.body) {
      throw new Error("No response body");
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    // Combine all chunks into a single Uint8Array
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const combinedChunks = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      combinedChunks.set(chunk, offset);
      offset += chunk.length;
    }

    // Convert to base64
    const base64 = Buffer.from(combinedChunks).toString("base64");
    const plainText = Buffer.from(combinedChunks).toString("utf-8");
    const imageDataUrl = `data:application/octet-stream;base64,${base64}`;

    return imageDataUrl;
  });
});

/*
agentClient.getFileContent(fileId).then((response) => {
  const buffer = Buffer.from(response);
  // Convert buffer to base64 string
  const base64Image = buffer.toString("base64");
  // Create a data URL with application/octet-stream MIME type
  const imageDataUrl = `data:application/octet-stream;base64,${base64Image}`;

  return imageDataUrl;
});
*/
