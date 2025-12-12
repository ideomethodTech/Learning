import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_API_KEY!);

export async function generateEmbedding(text: string) {
  const input = text.replace(/\n/g, " ");


  const result = await hf.featureExtraction({
    model: "sentence-transformers/all-MiniLM-L6-v2",
    inputs: input,
  });

  const embedding = Array.isArray(result[0])
    ? result[0]               // normal case: [384 values]
    : result;                 // fallback

  return embedding;
}

export async function generateEmbeddings(texts: string[]) {
  const inputs = texts.map((t) => t.replace("\n", " "));

  const results = await Promise.all(
    inputs.map((text) => hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: text,
    }))
  );

  return results.map((res) =>
    Array.isArray(res[0]) ? res[0] : res
  );
}
