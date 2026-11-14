export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export async function searchNASAResearch(query) {
  if (!query || !query.trim()) {
    return [];
  }

  const params = new URLSearchParams({
    q: query.trim(),
  });

  const response = await fetch(
    `${API_BASE_URL}/api/nasa-search?${params}`
  );

  if (!response.ok) {
    throw new Error(`NASA search failed: ${response.status}`);
  }

  const data = await response.json();

  return data.results || [];
}