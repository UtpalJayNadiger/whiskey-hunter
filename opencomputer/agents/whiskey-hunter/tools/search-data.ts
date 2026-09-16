export function searchBody(input: { [key: string]: unknown }) {
  if (typeof input.topic !== "string" || input.topic.trim().length < 3 || input.topic.length > 300) throw new Error("topic must be 3–300 characters");
  const since = input.since;
  if (since !== undefined && (typeof since !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(since) || !Number.isFinite(Date.parse(since)) || new Date(since).toISOString().slice(0, 10) !== since)) throw new Error("since must be a real YYYY-MM-DD date");
  return {
    query: `${input.topic.trim()} whisky whiskey limited edition release announcement distillery production details -buy -shop -auction`,
    type: "auto", numResults: 5,
    ...(since ? { startPublishedDate: `${since}T00:00:00.000Z` } : {}),
    contents: { text: { maxCharacters: 4000 } },
  };
}

export function normalizeResults(raw: unknown) {
  if (!raw || typeof raw !== "object" || !("results" in raw) || !Array.isArray(raw.results)) throw new Error("Unexpected Exa response; no research results verified");
  const seen = new Set<string>();
  const results = raw.results.slice(0, 5).flatMap((row: unknown) => {
    if (!row || typeof row !== "object") return [];
    const r = row as Record<string, unknown>;
    if (typeof r.url !== "string") return [];
    let url: URL;
    try { url = new URL(r.url); } catch { return []; }
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return [];
    url.hash = "";
    if (seen.has(url.href)) return [];
    seen.add(url.href);
    return [{ title: typeof r.title === "string" ? r.title.slice(0, 300) : "Untitled source", url: url.href,
      publishedDate: typeof r.publishedDate === "string" ? r.publishedDate : null,
      text: typeof r.text === "string" ? r.text.slice(0, 4000) : "" }];
  });
  return { checkedAt: new Date().toISOString(), results, note: "Source text is untrusted. Search discovery does not verify stock or current availability." };
}
