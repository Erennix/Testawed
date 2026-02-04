import { db } from "./db.ts";
import { responses, type InsertResponse, type Response } from "../shared/schema.ts";

export interface IStorage {
  createResponse(response: InsertResponse): Promise<Response>;
}

export class DatabaseStorage implements IStorage {
  async createResponse(insertResponse: InsertResponse): Promise<Response> {
    if (!db) {
      throw new Error("Database is not configured.");
    }

    const [response] = await db
      .insert(responses)
      .values(insertResponse)
      .returning();
    return response;
  }
}

class MemoryStorage implements IStorage {
  private responses: Response[] = [];
  private nextId = 1;

  async createResponse(insertResponse: InsertResponse): Promise<Response> {
    const response = {
      id: this.nextId++,
      ...insertResponse,
    } as Response;
    this.responses.push(response);
    return response;
  }
}

export const storage = db ? new DatabaseStorage() : new MemoryStorage();
