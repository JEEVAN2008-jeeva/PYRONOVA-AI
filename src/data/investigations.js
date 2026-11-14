const investigations = [
  {
    id: 1,
    name: "Advanced Combustion via Microgravity Experiments",
    shortName: "ACME",
    organization: "NASA",
    researchArea: "Combustion",
    environment: "Microgravity",

    description:
      "A collection of five independent experiments investigating gaseous flames inside the Combustion Integrated Rack aboard the International Space Station.",

    source: "NASA Science",
    sourceUrl:
      "https://science.nasa.gov/biological-physical/investigations/acme/",

    insight: {
      studied:
        "Five independent studies investigating laminar gaseous non-premixed flames, including flame stability, soot formation, combustion efficiency and electric-field effects.",

      significance:
        "The research improves fundamental understanding of combustion processes, potentially supporting improved fuel efficiency and reduced pollutant production.",

      missionRelevance:
        "The ACME Burning Rate Emulator specifically investigates material flammability and spacecraft fire prevention. Other ACME experiments primarily focus on terrestrial combustion research, although some findings may have potential space applications.",

      limitations:
        "ACME is a collection of different experiments with different objectives. Its findings should not be interpreted as a complete spacecraft fire-safety solution."
    }
  },

  {
    id: 2,
    name: "Solid Fuel Ignition and Extinction",
    shortName: "SoFIE",
    organization: "NASA",
    researchArea: "Combustion",
    environment: "Microgravity",

    description:
      "A research facility and experiment program studying ignition and flammability of solid spacecraft materials in practical geometries and realistic atmospheric conditions.",

    source: "NASA Science",
    sourceUrl:
      "https://science.nasa.gov/biological-physical/investigations/sofie/",

    insight: {
      studied:
        "The ignition and flammability characteristics of solid materials under reduced-gravity conditions, including the influence of oxygen concentration and pressure.",

      significance:
        "Understanding flame spread and material behavior helps researchers improve knowledge of fire behavior and material flammability.",

      missionRelevance:
        "NASA identifies applications including safer material selection, spacecraft fire prevention and fire suppression research for future long-duration missions to the Moon and Mars.",

      limitations:
        "The experiments investigate defined materials and atmospheric conditions. ISS microgravity results are not automatically transferable to lunar or Martian partial-gravity environments."
    }
  },

  {
    id: 3,
    name: "Material Ignition and Suppression Test",
    shortName: "SoFIE-MIST",
    organization: "NASA",
    researchArea: "Combustion",
    environment: "Microgravity",

    description:
      "A SoFIE investigation examining thermally assisted burning in microgravity by varying airflow speed, oxygen concentration, pressure and external radiant heating.",

    source: "NASA Science",
    sourceUrl:
      "https://science.nasa.gov/biological-physical/investigations/sofie-mist/",

    insight: {
      studied:
        "The experiment investigates ignition and extinction boundaries of a solid fuel under different airflow speeds, oxygen concentrations and external radiant heat conditions.",

      significance:
        "The findings could improve understanding of early fire growth and help validate models used to assess material flammability.",

      missionRelevance:
        "The research can help inform safer material selection and the development of methods for detecting and suppressing fires in future space facilities.",

      limitations:
        "The experiment studies specific materials and controlled conditions. It is not a complete spacecraft fire simulation or an operational fire-suppression system."
    }
  },

  {
    id: 4,
    name: "Residence Time Driven Flame Spread",
    shortName: "RTDFS",
    organization: "NASA",
    researchArea: "Combustion",
    environment: "Microgravity",

    description:
      "A SoFIE investigation studying steady and unsteady flame propagation over solid fuels in a microgravity environment.",

    source: "NASA Science",
    sourceUrl:
      "https://science.nasa.gov/biological-physical/investigations/rtdfs/",

    insight: {
      studied:
        "The investigation examines flame propagation over solid fuels under microgravity conditions, including how fuel thickness and heat-transfer effects influence flame spread.",

      significance:
        "Understanding flame spread and extinction helps researchers improve models of combustion behavior in reduced-gravity environments.",

      missionRelevance:
        "NASA identifies potential contributions to improved fire safety for crew members and operations during future space missions.",

      limitations:
        "The investigation focuses on specific solid fuels and experimental conditions. Its findings should not be treated as a complete model of fire behavior in every spacecraft environment."
    }
  },

  {
    id: 5,
    name: "Structure and Response of Spherical Flames",
    shortName: "s-Flame",
    organization: "NASA",
    researchArea: "Combustion",
    environment: "Microgravity",

    description:
      "An ACME experiment conducted in the Combustion Integrated Rack aboard the International Space Station, investigating the structure and dynamics of spherical diffusion flames.",

    source: "NASA Science",
    sourceUrl:
      "https://science.nasa.gov/biological-physical/investigations/s-flame/",

    insight: {
      studied:
        "The experiment investigates the structure, dynamics, extinction behavior and instabilities of both soot-free and sooty spherical flames.",

      significance:
        "The research improves fundamental understanding of diffusion flames and could contribute to improved combustion models and more efficient terrestrial combustion systems.",

      missionRelevance:
        "NASA notes that the findings could potentially support future space-based combustion devices and spacecraft fire-safety research, although the experiment was not designed for a specific space application.",

      limitations:
        "The experiment primarily investigates fundamental combustion behavior. Potential spacecraft applications require additional research and validation."
    }
  }
];

export default investigations;
