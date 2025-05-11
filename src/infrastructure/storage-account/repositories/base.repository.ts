import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";
import { BaseEntity } from "../entities/base.entity";

export class AzureTableClient {
  private client: TableClient;

  constructor(accountName: string, accountKey: string, tableName: string) {
    const credential = new AzureNamedKeyCredential(accountName, accountKey);
    const url = `https://${accountName}.table.core.windows.net`;
    this.client = new TableClient(url, tableName, credential, { allowInsecureConnection: true });
    
    this.ensureTableExists().catch((err) => {
      console.error(`Error ensuring table exists: ${err.message}`);
    });
  }

  protected getClient(): TableClient {
    return this.client;
  }

  async ensureTableExists(): Promise<void> {
    await this.client.createTable();
  }

  async insert<T extends BaseEntity>(entity: T): Promise<void> {
    await this.client.createEntity(entity);
  }

  async update<T extends BaseEntity>(entity: T): Promise<void> {
    await this.client.updateEntity(entity, "Merge");
  }

  async delete<T extends BaseEntity>(entity: T): Promise<void> {
    await this.client.deleteEntity(entity.partitionKey, entity.rowKey)
  }

  async getAll<T extends BaseEntity>(): Promise<T[]> {
    const results: T[] = [];
    for await (const entity of this.client.listEntities<T>()) {
      results.push(entity);
    }
    return results;
  }

  async getByPartitionKey<T extends BaseEntity>(partitionKey: string): Promise<T[]> {
    const results: T[] = [];
    for await (const entity of this.client.listEntities<T>(
      {
        queryOptions: { 
          filter: `PartitionKey eq '${partitionKey}'`
        } 
      })) {
      results.push(entity);
    }
    return results;
  }

  async getById<T extends BaseEntity>(partitionKey: string, rowKey: string): Promise<T> {
    try {
      return await this.client.getEntity(partitionKey, rowKey);
    } catch (error: any) {
      if (error?.statusCode === 404) return null;
      throw new Error(`Failed to retrieve entity: ${error.message}`);
    }
  }

  async query<T extends BaseEntity>(queryFilter: string): Promise<T[]> {
    try {
      const results: T[] = [];
      for await (const entity of this.client.listEntities<T>({
        queryOptions: {
          filter: queryFilter
        }
      })) {
        results.push(entity);
      }
      return results;
    } catch (error) {
      throw error;
    }
  }
}