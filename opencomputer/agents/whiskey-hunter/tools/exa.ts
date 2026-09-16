import { defineConnection, defineTool, secretHeader, useSecret } from "@opencomputer/agent";
import { searchBody, normalizeResults } from "./search-data.js";

export const exa = defineConnection({
  id: "exa", origin: "https://api.exa.ai", methods: ["POST"], pathPrefix: "/search",
  headers: { "x-api-key": secretHeader(useSecret("EXA_API_KEY")) },
});

export const researchReleases = defineTool({
  name: "research_releases",
  description: "Research whisky/whiskey release announcements, production details and distillery news using Exa. Returns source text and citations, not shopping or retailer availability. Up to five results per call; no automatic retries.",
  input: {
    type: "object", additionalProperties: false, required: ["topic"],
    properties: {
      topic: { type: "string", minLength: 3, maxLength: 300, description: "Distillery, expression, vintage or release series to research." },
      since: { type: "string", description: "Optional earliest publication date, YYYY-MM-DD. Omit for historical releases." },
    },
  },
  async run({ input, signal }) {
    const response = await exa.fetch("/search", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify(searchBody(input)),
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(30_000)]) : AbortSignal.timeout(30_000),
    });
    if (!response.ok) throw new Error(`Exa search failed (HTTP ${response.status}). Check the managed EXA_API_KEY, quota and service status. Do not retry automatically.`);
    return normalizeResults(await response.json());
  },
});
