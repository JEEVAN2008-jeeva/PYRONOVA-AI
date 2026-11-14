import { useState } from "react";
import { searchNASAResearch } from "../services/nasaApi";
import {
  Search,
  ExternalLink,
  Loader2,
  Database,
  AlertCircle,
} from "lucide-react";

export default function NasaResearchSearch() {
  const [query, setQuery] = useState(
    "microgravity combustion"
  );

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const data = await searchNASAResearch(query);
      setResults(data);

      if (data.length === 0) {
        setError("No matching records were returned.");
      }
    } catch (err) {
      setError(
        "Unable to connect to NASA research services. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ marginTop: 30 }}>

      <div className="pn-panel">

        <div style={{ marginBottom: 20 }}>
          <h2 style={{ marginBottom: 8 }}>
            <Database
              size={22}
              style={{ display: "inline", color: "#54d9ff" }}
            />{" "}
            Live NASA Research Search
          </h2>

          <p style={{ color: "#91a0b8", fontSize: 13 }}>
            Search publicly available NASA technical research records.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >

          <input
            className="pn-input"
            style={{ flex: 1, minWidth: 200 }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search NASA research..."
          />

          <button
            type="submit"
            className="pn-btn pn-btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} />
                Searching...
              </>
            ) : (
              <>
                <Search size={16} />
                Search NASA
              </>
            )}
          </button>

        </form>


        {error && (
          <div className="pn-notice" style={{ marginTop: 20 }}>
            <AlertCircle size={17} />
            {error}
          </div>
        )}


        {results.length > 0 && (

          <div style={{ marginTop: 25 }}>

            <p className="pn-result-count">
              Retrieved {results.length} NASA research records.
            </p>

            {results.map((item) => (

              <article
                key={item.id}
                className="pn-investigation-card"
                style={{ marginBottom: 14 }}
              >

                <span className="pn-tag">
                  NASA RESEARCH RECORD
                </span>

                <h3 style={{ marginTop: 13 }}>
                  {item.title}
                </h3>

                <p style={{ marginTop: 10 }}>
                  {item.description}
                </p>

                <p style={{
                  marginTop: 12,
                  color: "#91a0b8",
                  fontSize: 11,
                }}>
                  Publication date: {item.publishedDate}
                </p>

                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pn-source-link"
                  style={{ marginTop: 12 }}
                >
                  Open original NASA record
                  <ExternalLink size={14} />
                </a>

              </article>

            ))}

          </div>

        )}

      </div>

    </section>
  );
}