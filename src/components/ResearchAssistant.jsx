import { useState } from "react";
import {
  BrainCircuit,
  Search,
  ExternalLink,
  Loader2,
  Info,
} from "lucide-react";

import {
  API_BASE_URL,
  searchNASAResearch,
} from "../services/nasaApi";

export default function ResearchAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function askResearchAssistant(e) {
    e.preventDefault();

    if (!question.trim()) {
      setError("Please enter a research question.");
      return;
    }

    setLoading(true);
    setError("");
    setAnswer("");
    setSources([]);

    try {
      // STEP 1: Retrieve NASA research
      const research = await searchNASAResearch(question);

      if (!research || research.length === 0) {
        throw new Error("No matching NASA publications were found.");
      }

      // STEP 2: Send NASA evidence to Gemini backend
      const response = await fetch(
        "`${API_BASE_URL}/api/assistant`",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
            research,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gemini request failed.");
      }

      // STEP 3: Display Gemini answer
      setAnswer(data.answer);
      setSources(data.sources || []);

    } catch (err) {
      console.error("PyroNova Assistant Error:", err);
      setError(err.message || "Unable to process your research question.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pn-panel">

      <div style={{ marginBottom: 20 }}>
        <BrainCircuit size={32} color="#54d9ff" />

        <h2 style={{ margin: "12px 0" }}>
          PyroNova AI Research Assistant
        </h2>

        <p style={{ color: "#91a0b8", fontSize: 13 }}>
          Ask scientific questions and explore NASA research
          with AI-powered explanations.
        </p>
      </div>

      <form
        onSubmit={askResearchAssistant}
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <input
          className="pn-input"
          style={{ flex: 1, minWidth: 200 }}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="How does microgravity affect combustion?"
        />

        <button
          className="pn-btn pn-btn-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={16} />
              Analysing...
            </>
          ) : (
            <>
              <Search size={16} />
              Ask PyroNova
            </>
          )}
        </button>
      </form>

      {loading && (
        <div className="pn-notice" style={{ marginTop: 20 }}>
          <Loader2 size={18} />
          Retrieving NASA research and generating your explanation...
        </div>
      )}

      {error && (
        <div className="pn-notice" style={{ marginTop: 20 }}>
          <Info size={18} />
          {error}
        </div>
      )}

      {answer && (
        <div style={{ marginTop: 30 }}>

          <div className="pn-notice">
            <BrainCircuit size={18} />
            Gemini AI generated this explanation using retrieved
            NASA research records.
          </div>

          <div
            className="pn-investigation-card"
            style={{ marginTop: 18 }}
          >
            <h3 style={{ marginBottom: 18 }}>
              Research Analysis
            </h3>

            <div
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.8,
                color: "#dce6f5",
              }}
            >
              {answer}
            </div>
          </div>

          <div style={{ marginTop: 25 }}>
            <h3 style={{ marginBottom: 15 }}>
              NASA Evidence Sources
            </h3>

            {sources.map((source, index) => (
              <div
                className="pn-investigation-card"
                key={`${source.url}-${index}`}
                style={{ marginBottom: 12 }}
              >
                <h4>{source.title}</h4>

                {source.publicationDate && (
                  <p style={{ fontSize: 12, color: "#91a0b8" }}>
                    Publication: {source.publicationDate}
                  </p>
                )}

                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pn-source-link"
                  >
                    Read original NASA publication
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="pn-notice" style={{ marginTop: 20 }}>
            <Info size={18} />
            AI-generated explanations are research assistance,
            not verified spacecraft fire-safety recommendations.
            Consult the original publications.
          </div>

        </div>
      )}
    </div>
  );
}