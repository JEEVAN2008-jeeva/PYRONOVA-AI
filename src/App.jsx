import ResearchAssistant from "./components/ResearchAssistant";
import NasaResearchSearch from "./components/NasaResearchSearch";
import { useMemo, useState } from "react";

import {
  Activity,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Database,
  ExternalLink,
  Filter,
  FlaskConical,
  Globe2,
  Info,
  Layers,
  Microscope,
  Moon,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  X,
  GitCompareArrows,
  BrainCircuit,
  Satellite,
  TrendingUp,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import investigations from "./data/investigations";
import { calculateEvidenceRank } from "./data/evidenceRank";


/* --------------------------------------------------
   HELPERS
-------------------------------------------------- */

const getResearchArea = (item) =>
  item.researchArea || item.category || "Other";

const getEnvironment = (item) =>
  item.environment || "Not specified";

const getTitle = (item) =>
  item.title || item.name || item.shortName || "Research Investigation";

const getDescription = (item) =>
  item.description || item.summary || item.abstract || "No description available.";

const getSource = (item) =>
  item.source || "NASA Research";

const getSourceUrl = (item) =>
  item.sourceUrl || item.url || "";

const getRankScore = (item) => {
  try {
    const result = calculateEvidenceRank(item);

    if (typeof result === "number") {
      return result;
    }

    if (typeof result?.score === "number") {
      return result.score;
    }

    if (typeof item.ranking?.score === "number") {
      return item.ranking.score;
    }

    return 0;
  } catch {
    return item.ranking?.score || 0;
  }
};

const getRankLabel = (score) => {
  if (score >= 80) return "High relevance";
  if (score >= 50) return "Moderate relevance";
  return "Exploratory relevance";
};


/* --------------------------------------------------
   GLOBAL STYLES
-------------------------------------------------- */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

:root {
  --bg: #070b16;
  --panel: #10182a;
  --panel-light: #141f35;
  --border: rgba(148,163,184,0.16);
  --text: #edf3ff;
  --muted: #91a0b8;
  --cyan: #54d9ff;
  --blue: #6685ff;
  --purple: #a78bfa;
  --green: #4ade80;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
}

button, input, select {
  font: inherit;
}

button {
  cursor: pointer;
}

a {
  color: inherit;
  text-decoration: none;
}

.pn-app {
  min-height: 100vh;
  background:
    radial-gradient(circle at 80% 5%, rgba(49,75,150,0.15), transparent 30%),
    var(--bg);
}

.pn-container {
  width: min(1200px, 92%);
  margin: auto;
}

.pn-navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(7,11,22,0.92);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--border);
}

.pn-nav-inner {
  min-height: 76px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 25px;
}

.pn-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 21px;
}

.pn-logo {
  width: 39px;
  height: 39px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: #07111e;
  background: linear-gradient(135deg, var(--cyan), var(--blue));
}

.pn-nav-links {
  display: flex;
  align-items: center;
  gap: 25px;
  color: var(--muted);
  font-size: 13px;
}

.pn-nav-links a:hover {
  color: var(--cyan);
}

.pn-hero {
  padding: 105px 0 85px;
  position: relative;
  overflow: hidden;
}

.pn-hero-content {
  max-width: 780px;
  position: relative;
  z-index: 2;
}

.pn-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--cyan);
  background: rgba(84,217,255,0.08);
  border: 1px solid rgba(84,217,255,0.2);
  padding: 9px 14px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.pn-hero h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(42px, 7vw, 76px);
  line-height: 1.08;
  margin: 25px 0;
  letter-spacing: -3px;
}

.pn-gradient-text {
  background: linear-gradient(90deg, var(--cyan), #9aabff, var(--purple));
  -webkit-background-clip: text;
  color: transparent;
}

.pn-hero p {
  max-width: 680px;
  color: var(--muted);
  font-size: 17px;
  line-height: 1.8;
}

.pn-hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 13px;
  margin-top: 30px;
}

.pn-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 13px 19px;
  border-radius: 9px;
  border: 1px solid var(--border);
  background: var(--panel);
  color: var(--text);
  font-weight: 600;
  font-size: 13px;
  transition: 0.2s;
}

.pn-btn:hover {
  transform: translateY(-2px);
  border-color: var(--cyan);
}

.pn-btn-primary {
  background: linear-gradient(100deg, #39c8ed, #647bff);
  color: #07111e;
  border: none;
}

.pn-section {
  padding: 75px 0;
  border-top: 1px solid var(--border);
}

.pn-section-heading {
  margin-bottom: 30px;
}

.pn-section-heading span {
  color: var(--cyan);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.pn-section-heading h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(27px, 4vw, 39px);
  margin: 10px 0;
}

.pn-section-heading p {
  color: var(--muted);
  line-height: 1.7;
  max-width: 720px;
  font-size: 14px;
}

.pn-panel {
  background: linear-gradient(145deg, var(--panel), #0d1424);
  border: 1px solid var(--border);
  border-radius: 15px;
  padding: 22px;
}

.pn-dashboard-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.pn-stat-card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 13px;
  padding: 22px;
}

.pn-stat-icon {
  color: var(--cyan);
  margin-bottom: 18px;
}

.pn-stat-value {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 31px;
  font-weight: 700;
}

.pn-stat-label {
  color: var(--muted);
  font-size: 12px;
  margin-top: 6px;
}

.pn-chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.pn-chart-card h3 {
  font-size: 15px;
  margin-bottom: 20px;
}

.pn-chart {
  width: 100%;
  height: 280px;
}

.pn-chart-wide {
  grid-column: 1 / -1;
}

.pn-notice {
  padding: 14px 16px;
  margin-top: 18px;
  background: rgba(84,217,255,0.06);
  border: 1px solid rgba(84,217,255,0.18);
  border-radius: 10px;
  color: #b5c6db;
  font-size: 12px;
  line-height: 1.7;
  display: flex;
  gap: 10px;
}

.pn-filter-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.pn-input-wrap {
  position: relative;
}

.pn-input-wrap svg {
  position: absolute;
  left: 13px;
  top: 13px;
  color: var(--muted);
}

.pn-input, .pn-select {
  width: 100%;
  padding: 13px 14px;
  background: var(--panel);
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: 9px;
  outline: none;
}

.pn-input {
  padding-left: 40px;
}

.pn-input:focus, .pn-select:focus {
  border-color: var(--cyan);
}

.pn-select option {
  background: var(--panel);
}

.pn-result-count {
  color: var(--muted);
  font-size: 12px;
  margin-bottom: 17px;
}

.pn-investigation-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 17px;
}

.pn-investigation-card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 21px;
  transition: 0.2s;
}

.pn-investigation-card:hover {
  transform: translateY(-3px);
  border-color: rgba(84,217,255,0.5);
}

.pn-card-top {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  margin-bottom: 17px;
}

.pn-tag {
  display: inline-flex;
  padding: 6px 9px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  color: var(--cyan);
  background: rgba(84,217,255,0.09);
}

.pn-card-score {
  font-size: 11px;
  color: var(--green);
}

.pn-investigation-card h3 {
  font-size: 17px;
  line-height: 1.4;
  margin-bottom: 11px;
}

.pn-investigation-card p {
  color: var(--muted);
  font-size: 13px;
  line-height: 1.7;
}

.pn-card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 13px;
  margin: 16px 0;
  color: #aab8cb;
  font-size: 11px;
}

.pn-source-card {
  border-top: 1px solid var(--border);
  padding-top: 15px;
  margin-top: 15px;
}

.pn-source-heading {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--green);
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 9px;
}

.pn-source-link {
  color: var(--cyan);
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  overflow-wrap: anywhere;
}

.pn-card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 17px;
}

.pn-small-btn {
  padding: 9px 12px;
  border-radius: 7px;
  border: 1px solid var(--border);
  background: #17243a;
  color: var(--text);
  font-size: 11px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.pn-small-btn:hover {
  border-color: var(--cyan);
}

.pn-comparison-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.pn-comparison-select {
  width: 100%;
  margin-bottom: 15px;
}

.pn-comparison-result {
  margin-top: 20px;
  padding: 20px;
  background: rgba(84,217,255,0.05);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.pn-comparison-result h3 {
  margin-bottom: 12px;
}

.pn-comparison-result p {
  color: var(--muted);
  line-height: 1.7;
  font-size: 13px;
  margin-top: 8px;
}

.pn-mission-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.pn-mission-card {
  padding: 22px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 13px;
  cursor: pointer;
  text-align: left;
  color: var(--text);
}

.pn-mission-card.active {
  border-color: var(--cyan);
  background: rgba(84,217,255,0.07);
}

.pn-mission-card svg {
  color: var(--cyan);
  margin-bottom: 16px;
}

.pn-mission-card h3 {
  margin-bottom: 8px;
}

.pn-mission-card p {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.6;
}

.pn-mission-output {
  margin-top: 18px;
  padding: 23px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--panel);
}

.pn-mission-output h3 {
  margin-bottom: 12px;
}

.pn-mission-output p {
  color: var(--muted);
  font-size: 13px;
  line-height: 1.8;
}

.pn-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(0,0,0,0.78);
  backdrop-filter: blur(8px);
}

.pn-modal {
  width: min(700px, 100%);
  max-height: 85vh;
  overflow-y: auto;
  background: #101a2d;
  border: 1px solid var(--border);
  border-radius: 17px;
  padding: 25px;
}

.pn-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.pn-modal-header h2 {
  font-size: 20px;
}

.pn-close {
  border: 0;
  color: var(--text);
  background: transparent;
}

.pn-modal p {
  color: var(--muted);
  font-size: 13px;
  line-height: 1.8;
  margin: 12px 0;
}

.pn-evidence-box {
  background: rgba(84,217,255,0.06);
  border: 1px solid rgba(84,217,255,0.17);
  border-radius: 10px;
  padding: 16px;
  margin-top: 17px;
}

.pn-evidence-box h4 {
  color: var(--cyan);
  margin-bottom: 9px;
  font-size: 13px;
}

.pn-evidence-box p {
  margin: 6px 0;
}

.pn-footer {
  border-top: 1px solid var(--border);
  padding: 35px 0;
  color: var(--muted);
  font-size: 12px;
  text-align: center;
  line-height: 1.8;
}

.pn-footer strong {
  color: var(--cyan);
}

@media(max-width: 850px) {
  .pn-nav-links {
    display: none;
  }

  .pn-dashboard-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .pn-chart-grid {
    grid-template-columns: 1fr;
  }

  .pn-chart-wide {
    grid-column: auto;
  }

  .pn-investigation-grid {
    grid-template-columns: 1fr;
  }

  .pn-mission-grid {
    grid-template-columns: 1fr;
  }
}

@media(max-width: 600px) {
  .pn-hero {
    padding: 75px 0 60px;
  }

  .pn-hero h1 {
    letter-spacing: -1.5px;
  }

  .pn-filter-row {
    grid-template-columns: 1fr;
  }

  .pn-dashboard-stats {
    grid-template-columns: 1fr 1fr;
  }

  .pn-stat-card {
    padding: 15px;
  }

  .pn-stat-value {
    font-size: 25px;
  }

  .pn-comparison-grid {
    grid-template-columns: 1fr;
  }
}
`;


/* --------------------------------------------------
   MAIN APP
-------------------------------------------------- */

export default function App() {

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [environmentFilter, setEnvironmentFilter] = useState("All");

  const [selectedInvestigation, setSelectedInvestigation] = useState(null);

  const [firstComparison, setFirstComparison] = useState("");
  const [secondComparison, setSecondComparison] = useState("");

  const [selectedMission, setSelectedMission] = useState("ISS");


  /* -------------------------------
     DATA PREPARATION
  -------------------------------- */

  const safeInvestigations = Array.isArray(investigations)
    ? investigations
    : [];

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(safeInvestigations.map(getResearchArea)),
    ];
  }, [safeInvestigations]);

  const environments = useMemo(() => {
    return [
      "All",
      ...new Set(safeInvestigations.map(getEnvironment)),
    ];
  }, [safeInvestigations]);


  const rankedInvestigations = useMemo(() => {
    return safeInvestigations.map((item) => ({
      ...item,
      ranking: {
        ...(item.ranking || {}),
        score: getRankScore(item),
      },
    }));
  }, [safeInvestigations]);


  const filteredInvestigations = useMemo(() => {
    return rankedInvestigations.filter((item) => {

      const matchesSearch = [
        getTitle(item),
        getDescription(item),
        getResearchArea(item),
        getEnvironment(item),
        getSource(item),
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" ||
        getResearchArea(item) === categoryFilter;

      const matchesEnvironment =
        environmentFilter === "All" ||
        getEnvironment(item) === environmentFilter;

      return matchesSearch && matchesCategory && matchesEnvironment;
    });
  }, [
    rankedInvestigations,
    searchTerm,
    categoryFilter,
    environmentFilter,
  ]);


  /* -------------------------------
     DASHBOARD DATA
  -------------------------------- */

  const categoryData = categories
    .filter((category) => category !== "All")
    .map((category) => ({
      name: category,
      total: safeInvestigations.filter(
        (item) => getResearchArea(item) === category
      ).length,
    }));


  const environmentData = environments
    .filter((environment) => environment !== "All")
    .map((environment) => ({
      name: environment,
      value: safeInvestigations.filter(
        (item) => getEnvironment(item) === environment
      ).length,
    }));


  const evidenceData = rankedInvestigations.map((item, index) => ({
    name: item.shortName || `Study ${index + 1}`,
    score: item.ranking.score,
  }));


  const totalInvestigations = safeInvestigations.length;
  const totalCategories = categoryData.length;
  const totalEnvironments = environmentData.length;

  const COLORS = ["#54d9ff", "#6685ff", "#a78bfa", "#4ade80", "#f59e0b", "#fb7185"];


  /* -------------------------------
     COMPARISON DATA
  -------------------------------- */

  const firstItem = safeInvestigations.find(
    (item) => String(item.id) === String(firstComparison)
  );

  const secondItem = safeInvestigations.find(
    (item) => String(item.id) === String(secondComparison)
  );


  /* -------------------------------
     MISSION DATA
  -------------------------------- */

  const missions = [
    {
      id: "ISS",
      title: "International Space Station",
      subtitle: "Microgravity research environment",
      icon: Satellite,
      description:
        "The ISS provides a microgravity research environment for studying combustion behavior. Results from individual experiments should be interpreted within their specific experimental conditions.",
    },
    {
      id: "Moon",
      title: "Moon Missions",
      subtitle: "Partial-gravity research considerations",
      icon: Moon,
      description:
        "The Moon has partial gravity, which differs from microgravity. Research conducted in microgravity can offer useful scientific questions, but its findings cannot automatically be treated as lunar fire behavior.",
    },
    {
      id: "Mars",
      title: "Mars Missions",
      subtitle: "Planetary exploration considerations",
      icon: Rocket,
      description:
        "Mars has a different gravity level and atmospheric environment from the ISS. Microgravity research may inform future research questions, but mission-specific testing would be needed before drawing conclusions.",
    },
  ];

  const activeMission = missions.find(
    (mission) => mission.id === selectedMission
  );


  /* -------------------------------
     AI ANALYSIS
  -------------------------------- */

  const openAnalysis = (item) => {
    setSelectedInvestigation(item);
  };


  /* -------------------------------
     RENDER
  -------------------------------- */

  return (
    <div className="pn-app">

      <style>{styles}</style>


      {/* NAVIGATION */}

      <header className="pn-navbar">
        <div className="pn-container pn-nav-inner">

          <a href="#home" className="pn-brand">
            <span className="pn-logo">
              <FlaskConical size={21} />
            </span>
            PyroNova AI
          </a>

          <nav>
  <a href="#home">Home</a>
  <a href="#live-nasa">NASA Research</a>
  <a href="#explorer">Data Explorer</a>
  <a href="#assistant">AI Assistant</a>
  <a href="#dashboard">Dashboard</a>
</nav>

          <a href="#explorer" className="pn-btn pn-btn-primary">
            Explore Research
            <ArrowUpRight size={15} />
          </a>

        </div>
      </header>


      {/* HERO */}

      <section className="pn-hero" id="home">
        <div className="pn-container">

          <div className="pn-hero-content">

            <div className="pn-eyebrow">
              <Sparkles size={14} />
              Space Science Intelligence Platform
            </div>

            <h1>
              Decoding Fire
              <br />
              <span className="pn-gradient-text">
                Beyond Gravity.
              </span>
            </h1>

            <p>
              Explore microgravity combustion research through an
              intelligent research platform. Discover scientific
              investigations, compare evidence, and explore questions
              relevant to future spacecraft fire-safety research.
            </p>

            <div className="pn-hero-buttons">
              <a href="#explorer" className="pn-btn pn-btn-primary">
                <Database size={16} />
                Explore NASA Research
              </a>

              <a href="#dashboard" className="pn-btn">
                <BarChart3 size={16} />
                View Intelligence Dashboard
              </a>
            </div>

          </div>

        </div>
      </section>

{/* PYRONOVA RESEARCH ASSISTANT */}

<section className="pn-section" id="assistant">
  <div className="pn-container">

    <div className="pn-section-heading">
      <span>Research Intelligence</span>
      <h2>Ask PyroNova AI</h2>
      <p>
        Explore relevant NASA publications using natural-language
        research questions.
      </p>
    </div>

    <ResearchAssistant />

  </div>
</section>


      {/* INTELLIGENCE DASHBOARD */}

      <section className="pn-section" id="dashboard">
        <div className="pn-container">

          <div className="pn-section-heading">
            <span>Mission Intelligence</span>
            <h2>Research Intelligence Dashboard</h2>
            <p>
              A visual overview of the research records currently
              available in the PyroNova AI dataset.
            </p>
          </div>


          {/* STAT CARDS */}

          <div className="pn-dashboard-stats">

            <div className="pn-stat-card">
              <Database className="pn-stat-icon" size={23} />
              <div className="pn-stat-value">
                {totalInvestigations}
              </div>
              <div className="pn-stat-label">
                Research Investigations
              </div>
            </div>

            <div className="pn-stat-card">
              <Layers className="pn-stat-icon" size={23} />
              <div className="pn-stat-value">
                {totalCategories}
              </div>
              <div className="pn-stat-label">
                Research Categories
              </div>
            </div>

            <div className="pn-stat-card">
              <Globe2 className="pn-stat-icon" size={23} />
              <div className="pn-stat-value">
                {totalEnvironments}
              </div>
              <div className="pn-stat-label">
                Research Environments
              </div>
            </div>

            <div className="pn-stat-card">
              <TrendingUp className="pn-stat-icon" size={23} />
              <div className="pn-stat-value">
                {rankedInvestigations.length}
              </div>
              <div className="pn-stat-label">
                Records Evaluated by Prototype
              </div>
            </div>

          </div>


          {/* CHARTS */}

          <div className="pn-chart-grid">

            <div className="pn-panel pn-chart-card">
              <h3>Research Category Distribution</h3>

              <div className="pn-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#26334b"
                    />

                    <XAxis
                      dataKey="name"
                      stroke="#91a0b8"
                      tick={{ fontSize: 10 }}
                    />

                    <YAxis
                      stroke="#91a0b8"
                      allowDecimals={false}
                    />

                    <Tooltip
                      contentStyle={{
                        background: "#10182a",
                        border: "1px solid #26334b",
                        borderRadius: 8,
                        color: "#fff",
                      }}
                    />

                    <Bar
                      dataKey="total"
                      fill="#54d9ff"
                      radius={[5, 5, 0, 0]}
                    />

                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>


            <div className="pn-panel pn-chart-card">
              <h3>Research Environment Distribution</h3>

              <div className="pn-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>

                    <Pie
                      data={environmentData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >

                      {environmentData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}

                    </Pie>

                    <Tooltip
                      contentStyle={{
                        background: "#10182a",
                        border: "1px solid #26334b",
                        borderRadius: 8,
                        color: "#fff",
                      }}
                    />

                    <Legend />

                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>


            <div className="pn-panel pn-chart-card pn-chart-wide">
              <h3>EvidenceRank Prototype Scores</h3>

              <div className="pn-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={evidenceData}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#26334b"
                    />

                    <XAxis
                      dataKey="name"
                      stroke="#91a0b8"
                      tick={{ fontSize: 10 }}
                    />

                    <YAxis
                      stroke="#91a0b8"
                      domain={[0, 100]}
                    />

                    <Tooltip
                      contentStyle={{
                        background: "#10182a",
                        border: "1px solid #26334b",
                        borderRadius: 8,
                        color: "#fff",
                      }}
                    />

                    <Bar
                      dataKey="score"
                      fill="#a78bfa"
                      radius={[5, 5, 0, 0]}
                    />

                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>


          <div className="pn-notice">
            <Info size={17} />
            <span>
              Dashboard values are calculated from the local project
              dataset. EvidenceRank values are prototype relevance
              scores, not NASA measurements or scientific validation.
              The charts do not represent real-time NASA data.
            </span>
          </div>

        </div>
      </section>

{/* LIVE NASA RESEARCH SEARCH */}

<section className="pn-section" id="live-nasa">
  <div className="pn-container">

    <div className="pn-section-heading">
      <span>Live Research Integration</span>
      <h2>Explore Real NASA Publications</h2>
      <p>
        Search NASA's public technical research records.
      </p>
    </div>

    <NasaResearchSearch />

  </div>
</section>

      {/* NASA DATA EXPLORER */}

      <section className="pn-section" id="explorer">
        <div className="pn-container">

          <div className="pn-section-heading">
            <span>Research Discovery</span>
            <h2>NASA Data Explorer</h2>
            <p>
              Search and explore available combustion research records.
              Use the filters to narrow your investigation.
            </p>
          </div>


          {/* FILTERS */}

          <div className="pn-filter-row">

            <div className="pn-input-wrap">
              <Search size={17} />

              <input
                className="pn-input"
                type="text"
                placeholder="Search research, keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>


            <select
              className="pn-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "All" ? "All Categories" : category}
                </option>
              ))}
            </select>


            <select
              className="pn-select"
              value={environmentFilter}
              onChange={(e) => setEnvironmentFilter(e.target.value)}
            >
              {environments.map((environment) => (
                <option key={environment} value={environment}>
                  {environment === "All"
                    ? "All Environments"
                    : environment}
                </option>
              ))}
            </select>

          </div>


          <div className="pn-result-count">
            <Filter size={13} style={{ display: "inline" }} />
            {" "}
            Showing {filteredInvestigations.length} of{" "}
            {totalInvestigations} investigations
          </div>


          {/* INVESTIGATION CARDS */}

          <div className="pn-investigation-grid">

            {filteredInvestigations.map((item, index) => {

              const score = item.ranking.score;

              return (

                <article
                  className="pn-investigation-card"
                  key={item.id ?? index}
                >

                  <div className="pn-card-top">

                    <span className="pn-tag">
                      {getResearchArea(item)}
                    </span>

                    <span className="pn-card-score">
                      EvidenceRank: {score}
                    </span>

                  </div>


                  <h3>{getTitle(item)}</h3>

                  <p>{getDescription(item)}</p>


                  <div className="pn-card-meta">

                    <span>
                      <Globe2
                        size={12}
                        style={{ display: "inline" }}
                      />
                      {" "}
                      {getEnvironment(item)}
                    </span>

                    <span>
                      <Microscope
                        size={12}
                        style={{ display: "inline" }}
                      />
                      {" "}
                      {getSource(item)}
                    </span>

                  </div>


                  {/* SOURCE VERIFICATION */}

                  <div className="pn-source-card">

                    <div className="pn-source-heading">
                      <ShieldCheck size={14} />
                      SOURCE REFERENCE
                    </div>

                    {getSourceUrl(item) ? (

                      <a
                        className="pn-source-link"
                        href={getSourceUrl(item)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View NASA Investigation
                        <ExternalLink size={13} />
                      </a>

                    ) : (

                      <span className="pn-source-link">
                        No source URL supplied in this record.
                      </span>

                    )}

                  </div>


                  <div className="pn-card-actions">

                    <button
                      className="pn-small-btn"
                      onClick={() => openAnalysis(item)}
                    >
                      <BrainCircuit size={14} />
                      AI Analysis
                    </button>

                    <button
                      className="pn-small-btn"
                      onClick={() => {
                        setFirstComparison(String(item.id));
                        document
                          .getElementById("comparison")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      <GitCompareArrows size={14} />
                      Compare
                    </button>

                  </div>

                </article>

              );

            })}

          </div>


          {filteredInvestigations.length === 0 && (

            <div className="pn-panel" style={{ textAlign: "center" }}>
              <Search size={30} color="#54d9ff" />
              <h3 style={{ margin: "15px 0" }}>
                No matching investigations found
              </h3>
              <p style={{ color: "#91a0b8", fontSize: 13 }}>
                Try another keyword or change the filters.
              </p>
            </div>

          )}

        </div>
      </section>


      {/* RESEARCH COMPARISON LAB */}

      <section className="pn-section" id="comparison">
        <div className="pn-container">

          <div className="pn-section-heading">
            <span>Comparative Research</span>
            <h2>Research Comparison Lab</h2>
            <p>
              Compare two available research records using their
              dataset information and prototype relevance scores.
            </p>
          </div>


          <div className="pn-panel">

            <div className="pn-comparison-grid">

              <div>
                <h3 style={{ marginBottom: 12 }}>
                  Investigation One
                </h3>

                <select
                  className="pn-select pn-comparison-select"
                  value={firstComparison}
                  onChange={(e) => setFirstComparison(e.target.value)}
                >

                  <option value="">
                    Select first investigation
                  </option>

                  {safeInvestigations.map((item, index) => (
                    <option
                      key={item.id ?? index}
                      value={String(item.id ?? index)}
                    >
                      {getTitle(item)}
                    </option>
                  ))}

                </select>
              </div>


              <div>
                <h3 style={{ marginBottom: 12 }}>
                  Investigation Two
                </h3>

                <select
                  className="pn-select pn-comparison-select"
                  value={secondComparison}
                  onChange={(e) => setSecondComparison(e.target.value)}
                >

                  <option value="">
                    Select second investigation
                  </option>

                  {safeInvestigations.map((item, index) => (
                    <option
                      key={item.id ?? index}
                      value={String(item.id ?? index)}
                    >
                      {getTitle(item)}
                    </option>
                  ))}

                </select>
              </div>

            </div>


            {firstItem && secondItem && (

              <div className="pn-comparison-result">

                <h3>
                  <GitCompareArrows
                    size={18}
                    style={{ display: "inline" }}
                  />
                  {" "}
                  Comparison Results
                </h3>


                <div className="pn-comparison-grid">

                  <div>
                    <span className="pn-tag">
                      Investigation One
                    </span>

                    <h3 style={{ marginTop: 12 }}>
                      {getTitle(firstItem)}
                    </h3>

                    <p>
                      Research Area: {getResearchArea(firstItem)}
                    </p>

                    <p>
                      Environment: {getEnvironment(firstItem)}
                    </p>

                    <p>
                      EvidenceRank: {getRankScore(firstItem)}
                    </p>

                    <p>
                      {getDescription(firstItem)}
                    </p>
                  </div>


                  <div>
                    <span className="pn-tag">
                      Investigation Two
                    </span>

                    <h3 style={{ marginTop: 12 }}>
                      {getTitle(secondItem)}
                    </h3>

                    <p>
                      Research Area: {getResearchArea(secondItem)}
                    </p>

                    <p>
                      Environment: {getEnvironment(secondItem)}
                    </p>

                    <p>
                      EvidenceRank: {getRankScore(secondItem)}
                    </p>

                    <p>
                      {getDescription(secondItem)}
                    </p>
                  </div>

                </div>


                <div className="pn-notice">
                  <Info size={16} />

                  <span>
                    This comparison organizes information from the
                    project dataset. Differences in relevance scores
                    do not establish that one scientific experiment
                    is more accurate or important than another.
                  </span>

                </div>

              </div>

            )}

          </div>

        </div>
      </section>


      {/* MISSION SIMULATOR */}

      <section className="pn-section" id="missions">
        <div className="pn-container">

          <div className="pn-section-heading">
            <span>Mission Research</span>
            <h2>Mission Environment Explorer</h2>
            <p>
              Explore how the research context differs between
              the International Space Station, Moon and Mars.
            </p>
          </div>


          <div className="pn-mission-grid">

            {missions.map((mission) => {

              const Icon = mission.icon;

              return (

                <button
                  key={mission.id}
                  className={
                    `pn-mission-card ${
                      selectedMission === mission.id ? "active" : ""
                    }`
                  }
                  onClick={() => setSelectedMission(mission.id)}
                >

                  <Icon size={26} />

                  <h3>{mission.title}</h3>

                  <p>{mission.subtitle}</p>

                </button>

              );

            })}

          </div>


          <div className="pn-mission-output">

            <h3>
              <Activity
                size={18}
                style={{ display: "inline" }}
              />
              {" "}
              {activeMission.title} — Research Context
            </h3>

            <p>{activeMission.description}</p>

            <div className="pn-notice">
              <Info size={16} />

              <span>
                This is a conceptual research-context explorer.
                It does not simulate physical fire behavior or
                predict spacecraft fire hazards.
              </span>
            </div>

          </div>

        </div>
      </section>


      {/* ABOUT */}

      <section className="pn-section" id="about">
        <div className="pn-container">

          <div className="pn-section-heading">
            <span>About PyroNova AI</span>
            <h2>Turning Research Into Insight</h2>

            <p>
              PyroNova AI is a prototype research intelligence
              platform designed to organize microgravity combustion
              research, explore available evidence, and communicate
              scientific information in an accessible way.
            </p>
          </div>


          <div className="pn-chart-grid">

            <div className="pn-panel">
              <FlaskConical
                color="#54d9ff"
                size={28}
              />

              <h3 style={{ margin: "15px 0 10px" }}>
                Research Discovery
              </h3>

              <p style={{ color: "#91a0b8", fontSize: 13, lineHeight: 1.8 }}>
                Explore research records and discover information
                about combustion under different experimental
                conditions.
              </p>
            </div>


            <div className="pn-panel">
              <BrainCircuit
                color="#a78bfa"
                size={28}
              />

              <h3 style={{ margin: "15px 0 10px" }}>
                Evidence-Based Analysis
              </h3>

              <p style={{ color: "#91a0b8", fontSize: 13, lineHeight: 1.8 }}>
                Organize research information and make its source
                references easier to inspect.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* FOOTER */}

      <footer className="pn-footer">
        <div className="pn-container">

          <strong>PyroNova AI</strong>

          <p>
            Decoding Fire Beyond Gravity.
          </p>

          <p>
            A research exploration prototype for microgravity
            combustion science.
          </p>

          <p>
            Not a certified spacecraft fire-safety system.
            Not an operational hazard prediction tool.
          </p>

          <p style={{ marginTop: 15 }}>
            © 2026 PyroNova AI. Built for scientific exploration.
          </p>

        </div>
      </footer>


      {/* AI ANALYSIS MODAL */}

      {selectedInvestigation && (

        <div
          className="pn-modal-overlay"
          onClick={() => setSelectedInvestigation(null)}
        >

          <div
            className="pn-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="pn-modal-header">

              <h2>
                <BrainCircuit
                  size={21}
                  style={{ display: "inline" }}
                />
                {" "}
                Research Analysis
              </h2>

              <button
                className="pn-close"
                onClick={() => setSelectedInvestigation(null)}
              >
                <X size={22} />
              </button>

            </div>


            <span className="pn-tag">
              {getResearchArea(selectedInvestigation)}
            </span>


            <h3 style={{ marginTop: 15 }}>
              {getTitle(selectedInvestigation)}
            </h3>


            <p>
              {getDescription(selectedInvestigation)}
            </p>


            <div className="pn-evidence-box">

              <h4>
                <CheckCircle2
                  size={15}
                  style={{ display: "inline" }}
                />
                {" "}
                EVIDENCE TRAIL
              </h4>

              <p>
                Research source: {getSource(selectedInvestigation)}
              </p>

              <p>
                Research environment: {getEnvironment(selectedInvestigation)}
              </p>

              <p>
                Research category: {getResearchArea(selectedInvestigation)}
              </p>

              <p>
                Prototype EvidenceRank: {getRankScore(selectedInvestigation)}
              </p>

              <p>
                Relevance classification:{" "}
                {getRankLabel(getRankScore(selectedInvestigation))}
              </p>


              {getSourceUrl(selectedInvestigation) && (

                <a
                  href={getSourceUrl(selectedInvestigation)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pn-source-link"
                >
                  Open source reference
                  <ExternalLink size={13} />
                </a>

              )}

            </div>


            <div className="pn-notice">
              <Info size={17} />

              <span>
                This analysis panel displays information from the
                selected local dataset record. It is not connected
                to a live large language model and does not generate
                independently verified scientific conclusions.
                Always inspect the original source.
              </span>
            </div>


            <button
              className="pn-btn pn-btn-primary"
              style={{ marginTop: 20 }}
              onClick={() => setSelectedInvestigation(null)}
            >
              Close Analysis
            </button>

          </div>

        </div>

      )}

    </div>
  );
}