export interface CorpusDocument {
  id: string;
  source: string;
  text: string;
}

export const TOY_RAG_CORPUS: CorpusDocument[] = [
  {
    id: 'doc-fastapi-async',
    source: 'fastapi_guide.md',
    text: 'FastAPI uses async def endpoints on Uvicorn to handle concurrent I/O requests cleanly without blocking the event loop. Always set request timeouts when calling external LLM providers.',
  },
  {
    id: 'doc-rag-overlap',
    source: 'rag_chunking.md',
    text: 'Chunk overlap (typically 10% to 20%) preserves semantic continuity across split boundaries. Without overlap, definitions spanning two chunks may fail top-k retrieval.',
  },
  {
    id: 'doc-linux-env',
    source: 'linux_ops.md',
    text: 'Store API credentials in .env outside Git and commit only .env.example. Verify working directory with pwd before launching systemd or Docker entrypoints.',
  },
];

export interface RetrievedChunk {
  id: string;
  source: string;
  text: string;
  score: number;
}

export function chunkAndRetrieve(
  corpus: CorpusDocument[],
  chunkSize: number,
  overlap: number,
  query: string
): RetrievedChunk[] {
  const safeChunkSize = Math.max(40, chunkSize);
  const safeOverlap = Math.min(safeChunkSize - 10, Math.max(0, overlap));
  const step = Math.max(20, safeChunkSize - safeOverlap);

  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2);

  const out: RetrievedChunk[] = [];
  for (const doc of corpus) {
    for (let start = 0, idx = 1; start < doc.text.length; start += step, idx++) {
      const slice = doc.text.slice(start, start + safeChunkSize);
      const lower = slice.toLowerCase();
      const hits = terms.filter((t) => lower.includes(t)).length;
      out.push({
        id: `${doc.source}#c${idx}`,
        source: doc.source,
        text: slice,
        score: hits,
      });
    }
  }
  return out.sort((a, b) => b.score - a.score);
}
