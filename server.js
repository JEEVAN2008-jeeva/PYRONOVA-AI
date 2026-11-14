import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;

const ai = apiKey
  ? new GoogleGenAI({ apiKey })
  : null;

// Home route
app.get("/", (req, res) => {
  res.json({
    status: "success",
    project: "PyroNova AI",
    message: "Backend is running successfully.",
  });
});
// NASA NTRS research proxy
app.get("/api/nasa-search", async (req, res) => {
  try {
    const query = req.query.q;

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        error: "Please provide a research query.",
      });
    }

    const params = new URLSearchParams({
      q: query,
      "page.size": "10",
      "page.number": "0",
    });

    const nasaUrl =
      `https://ntrs.nasa.gov/api/citations/search?${params}`;

    const response = await fetch(nasaUrl);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `NASA API returned status ${response.status}`,
      });
    }

    const data = await response.json();

    const records = (data.results || []).map((record) => ({
      id: record.id,
      title: record.title || "Untitled NASA Research",
      description:
        record.abstract ||
        record.description ||
        "No abstract available.",
      source: "NASA Technical Reports Server",
      sourceUrl: `https://ntrs.nasa.gov/citations/${record.id}`,
      publishedDate:
        record.issueDate ||
        record.publicationDate ||
        "Not specified",
    }));

    res.json({
      success: true,
      count: records.length,
      results: records,
    });

  } catch (error) {
    console.error("NASA Search Error:", error);

    res.status(500).json({
      error: "Unable to retrieve NASA research.",
      details: error.message,
    });
  }
});

// Gemini research assistant route
app.post("/api/assistant", async (req, res) => {
  try {
    // Check API key
    if (!ai) {
      return res.status(500).json({
        error: "Gemini API key is missing. Check your .env file.",
      });
    }

    const { question, research } = req.body;

    // Validate question
    if (
      typeof question !== "string" ||
      question.trim().length === 0
    ) {
      return res.status(400).json({
        error: "Please enter a research question.",
      });
    }

    // Validate NASA research
    if (!Array.isArray(research) || research.length === 0) {
      return res.status(400).json({
        error: "No NASA research records were provided.",
      });
    }

    // Prepare research evidence
    const evidence = research.slice(0, 10).map((item, index) => ({
      number: index + 1,
      title: String(item.title || "Untitled publication").slice(0, 500),
      abstract: String(
        item.description || "No abstract available."
      ).slice(0, 4000),
      publicationDate: String(
        item.publishedDate || "Not specified"
      ),
      source: String(item.source || "NASA NTRS"),
      sourceUrl: String(item.sourceUrl || ""),
    }));

    // Create research prompt
    const prompt = `
You are PyroNova AI, a scientific research assistant
specializing in space combustion research.

USER QUESTION:
${question.trim().slice(0, 1000)}

NASA RESEARCH RECORDS:
${JSON.stringify(evidence, null, 2)}

INSTRUCTIONS:

1. Answer using the supplied research records.
2. Do not invent NASA experiments, measurements, or findings.
3. Explain scientific concepts in simple language.
4. Clearly identify when evidence is insufficient.
5. Distinguish documented findings from interpretations.
6. Do not assume microgravity results directly apply to
   Moon or Mars environments.
7. Do not provide operational spacecraft fire-safety instructions.
8. Mention the relevant publication titles when discussing evidence.
9. Never invent publication citations.

FORMAT YOUR ANSWER:

## Research Answer

Explain the topic clearly.

## Evidence-Based Insights

Summarize what the supplied publications support.

## Research Limitations

Explain what the supplied records cannot establish.

## Conclusion

Give a short summary.
`;

    // Generate Gemini response
    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: prompt,
    });

    const answer = result.text;

    if (!answer) {
      return res.status(502).json({
        error: "Gemini returned an empty response.",
      });
    }

    // Return answer and original sources
    return res.json({
      success: true,
      answer,
      sources: evidence.map((item) => ({
        title: item.title,
        url: item.sourceUrl,
        publicationDate: item.publicationDate,
      })),
    });

  } catch (error) {
    console.error("Research Assistant Error:", error);

    return res.status(500).json({
      error: "Unable to generate the research answer.",
      details: error.message,
    });
  }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`PyroNova AI backend running on port ${PORT}`);
});