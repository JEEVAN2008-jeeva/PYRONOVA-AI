// PyroNova AI - EvidenceRank
// Transparent prototype scoring engine.
// Scores are heuristic estimates, NOT scientific conclusions.

export function calculateEvidenceRank(investigation) {
  const factors = [];

  // 1. Combustion research relevance (30 points)
  const researchArea = investigation.researchArea?.toLowerCase() || "";

  const combustionScore = researchArea.includes("combustion") ? 30 : 10;

  factors.push({
    name: "Combustion Research",
    score: combustionScore,
    maximum: 30,
    explanation:
      combustionScore === 30
        ? "The investigation is directly categorized under combustion research."
        : "The investigation has a limited direct connection to combustion research."
  });

  // 2. Microgravity relevance (25 points)
  const environment = investigation.environment?.toLowerCase() || "";

  const gravityScore = environment.includes("microgravity") ? 25 : 10;

  factors.push({
    name: "Microgravity Relevance",
    score: gravityScore,
    maximum: 25,
    explanation:
      gravityScore === 25
        ? "The investigation explicitly identifies a microgravity environment."
        : "The environment information does not explicitly identify microgravity."
  });

  // 3. Mission relevance (25 points)
  const missionText =
    investigation.insight?.missionRelevance?.toLowerCase() || "";

  const missionKeywords = [
    "space",
    "spacecraft",
    "mission",
    "exploration",
    "fire safety"
  ];

  const missionMatches = missionKeywords.filter((keyword) =>
    missionText.includes(keyword)
  ).length;

  const missionScore = Math.min(25, missionMatches * 5);

  factors.push({
    name: "Mission Relevance",
    score: missionScore,
    maximum: 25,
    explanation: `${missionMatches} relevant mission-related keywords were identified in the investigation summary.`
  });

  // 4. Source information (10 points)
  const sourceScore =
    investigation.source && investigation.sourceUrl ? 10 : 0;

  factors.push({
    name: "Source Information",
    score: sourceScore,
    maximum: 10,
    explanation:
      sourceScore === 10
        ? "The investigation includes a named source and a source link. The link still requires verification."
        : "Source information is incomplete."
  });

  // 5. Documented limitations (10 points)
  const limitations =
    investigation.insight?.limitations?.trim() || "";

  const limitationsScore = limitations.length > 20 ? 10 : 0;

  factors.push({
    name: "Research Limitations",
    score: limitationsScore,
    maximum: 10,
    explanation:
      limitationsScore === 10
        ? "The investigation includes a documented limitations statement."
        : "More information about research limitations is needed."
  });

  const totalScore = factors.reduce(
    (total, factor) => total + factor.score,
    0
  );

  return {
    score: totalScore,
    factors,
    label:
      totalScore >= 80
        ? "High prototype relevance"
        : totalScore >= 60
        ? "Moderate prototype relevance"
        : "Limited prototype relevance"
  };
}