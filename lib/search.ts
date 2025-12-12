import {cosineDistance, sql, gt, desc} from "drizzle-orm";
import {db} from "./db-config";
import { documents } from "./db-schema";
import { generateEmbedding } from "./embeddings";
/**
 * Search for similar documents using Drizzle ORM with cosineDistance
 */
export async function searchDocuments(
  query: string,
  limit: number = 5,
  threshold: number = 0.5
) {
 // Generate embedding
const raw = await generateEmbedding(query);

// Force HuggingFace output into a clean number[]
const embedding = raw.flat(Infinity) as number[];

if (!Array.isArray(embedding) || typeof embedding[0] !== "number") {
  throw new Error("Embedding returned from generateEmbedding() is invalid.");

}

// Convert JS array → pgvector literal
  const pgVector = embedding.join(",");
  
  const similarity = sql<number>`1 - (
    ${cosineDistance(
      documents.embedding,
      sql`[${pgVector}]`
    )}
  )`;

  // Use Drizzle's query builder for the search
  const similarDocuments = await db
    .select({
      id: documents.id,
      content: documents.content,
      similarity,
    })
    .from(documents)
    .where(gt(similarity, threshold))
    .orderBy(desc(similarity))
    .limit(limit);

  return similarDocuments;
}