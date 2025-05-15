import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";

export class BlobStorage {
  private readonly blobServiceClient: BlobServiceClient;

  public constructor(name: string) {
    const credential = new DefaultAzureCredential();
    this.blobServiceClient = new BlobServiceClient(
      `https://${name}.blob.core.windows.net`,
      credential
    );
  }

  public async listBlobInContainer(containerName: string): Promise<string[]> {
    let blobPrefix = "";
    if (containerName.includes("/")) {
      blobPrefix = containerName.split("/")[1];
      containerName = containerName.split("/")[0];
    }
    const containerClient: ContainerClient =
      this.blobServiceClient.getContainerClient(containerName);
    const blobNames: string[] = [];

    try {
      for await (const blob of containerClient.listBlobsFlat()) {
        if (blob.name.startsWith(blobPrefix)) {
          blobNames.push(blob.name);
        }
      }
    } catch (e: any) {
      if (e instanceof Error) {
        console.error(
          `Failed to list blobs in container ${containerName}: ${e.message}`
        );
      }
    }

    return blobNames;
  }

  public async downloadBlob(
    containerName: string,
    blobName: string
  ): Promise<Buffer> {
    const containerClient: ContainerClient =
      this.blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    const downloadBlockBlobResponse = await blobClient.download(0);
    const downloaded = await this.streamToBuffer(
      downloadBlockBlobResponse.readableStreamBody!
    );

    return downloaded;
  }

  private async streamToBuffer(
    readableStream: NodeJS.ReadableStream
  ): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      readableStream.on("data", (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on("error", reject);
    });
  }
}

// Usage
async function main() {
  const blobStorage = new BlobStorage(
    process.env["accountName"] || "stzhihuanhub110601856061"
  );
  const containerName =
    process.env["containerName"] ||
    "c3aa818d-4544-4b63-b101-5e0dcdcc4f51-azureml-blobstore/path/to";
  const blobNames = await blobStorage.listBlobInContainer(containerName);
  console.log(blobNames);
}

main().catch(console.error);
