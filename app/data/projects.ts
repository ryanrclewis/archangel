export type ProjectStatus = "LIVE" | "IN PROGRESS" | "COMPLETED" | "ONLINE";

export type ProjectClientTone = "ink" | "muted" | "blue" | "green" | "amber" | "red" | "purple";

export type ProjectClient = {
  name: string;
  tone?: ProjectClientTone;
};

export type Project = {
  id: string;
  name: string;
  type: string;
  status: ProjectStatus;
  description: string;
  url?: string;
  clients?: ProjectClient[];
  tags?: string[];
  features?: string[];
  launchDate?: string;
};

const client = (name: string, tone: ProjectClientTone = "muted"): ProjectClient => ({
  name,
  tone,
});

export const projects: Project[] = [
  {
    id: "saintstombs",
    name: "SaintsTombs",
    type: "Web Application",
    status: "LIVE",
    url: "https://saintstombs.com",
    description:
      "Database of saints and their final resting places, built as a resource for pilgrims and anyone interested in the saints.",
    clients: [client("BKO", "blue")],
    tags: ["Catholic", "History", "Geography", "Web"],
  },
  {
    id: "mithril",
    name: "Mithril",
    type: "Docker / Networking",
    status: "LIVE",
    url: "https://github.com/ryanrclewis/mithril",
    description:
      "Docker-based DNS filtering solution that blocks NSFW content across your network.",
    clients: [client("Self-directed")],
    tags: ["Docker", "DNS", "Networking", "Security"],
  },
  {
    id: "heirloom",
    name: "Heirloom",
    type: "Web Application",
    status: "IN PROGRESS",
    url: "https://heirloom-two.vercel.app/login",
    description: "A digital keepsake for your family's history.",
    clients: [client("Self-directed")],
    tags: ["Family", "History", "Digital Preservation"],
  },
  {
    id: "crisis-catalog",
    name: "Crisis Catalog",
    type: "Web Application",
    status: "IN PROGRESS",
    url: "https://crisis-catalog.pages.dev/",
    description: "A checklist for emergency preparedness for Catholic families.",
    clients: [client("Self-directed")],
    tags: ["Catholic", "Preparedness", "Checklist", "Emergency"],
  },
  {
    id: "psalm113-3",
    name: "Psalm 113:3",
    type: "Web Visualization",
    status: "IN PROGRESS",
    url: "https://github.com/ryanrclewis/psalm113-3",
    description: "A visualization of Earth, reactive to the Consecration of the Eucharist.",
    clients: [client("Self-directed")],
    tags: ["Catholic", "Visualization", "Interactive", "Spiritual"],
  },
  {
    id: "pantrie",
    name: "Pantrie",
    type: "Docker / CLI Tool",
    status: "IN PROGRESS",
    url: "https://github.com/ryanrclewis/pantrie",
    description: "Docker utility to catalog what is in your pantry and when it expires.",
    clients: [client("Self-directed")],
    tags: ["Docker", "Home", "Inventory", "CLI"],
  },
  {
    id: "gm",
    name: "General Motors",
    type: "Experience Architecture",
    status: "COMPLETED",
    launchDate: "May 2025",
    url: "",
    description: "",
    clients: [client("General Motors", "blue")],
    features: [
    ],
  },
  {
    id: "nsfm",
    name: "National Sci-Fi Museum",
    type: "iOS Application",
    status: "COMPLETED",
    launchDate: "Feb 2025",
    url: "https://www.figma.com/proto/GdY0LPiZM0vdwgDAXdW5r6/National-Sci-Fi-Museum?node-id=1-854&starting-point-node-id=1%3A854&t=S4vZQfH4qJKE4kb5-1",
    description:
      "I approached the problem by trying to understand the primary interactions users would have with a museum app. For true Sci-Fi fans like Dan, Harry, and Tay, this could become a favorite app, so it needed to be a catered experience. For visitors less interested in Sci-Fi like Lori, the app had to be accessible and avoid jarring flows or interaction methods. To build a crafted experience, I opted for an alternative typeface. I used Avenir Next for its futuristic feel over the more neutral SF Pro or the serif New York, which might have felt too old-fashioned or stuffy. Other Sci-Fi fonts like Orbitron were considered but ultimately rejected to ensure legibility for a diverse audience. Purple was chosen as the primary theme color to stand out from the common blue, red, yellow, and green in apps. It makes the app noticeable, recognizable, and connects with the mystery and unknown that is essential to the genre. I relied on many Apple-designed components for accessibility and familiarity, especially for users who might not use the app daily. These tried-and-true elements ensure usability isn’t a barrier to enjoying the museum. One assumption I made was that a public museum would handle most accessibility needs. If not, I would have added more detail to activity and map views to show experiences were accessible. Lori’s persona, and her son Daniel, made me consider icons denoting accessibility features to help users make the best use of their time. The most important accessibility aspect I followed was embracing iOS best practices, along with attention to color contrast and font legibility. Inclusivity was central to the app’s design. Profiles and a community chat feature allow users to personalize their experience and feel part of the museum community. Tay’s persona made me think about using iconography to denote media types in exhibits, helping users engage with content they truly care about.",
    clients: [client("National Sci-Fi Museum", "purple"), client("Michigan State University", "green")],
    features: [
      "Avenir Next-led visual system for a futuristic but legible UI",
      "Accessibility-conscious interaction patterns and color contrast",
      "Inclusive features such as icon-supported exhibit media discovery",
      "Persona-driven design decisions for diverse museum audiences",
    ],
  },
  {
    id: "lwt",
    name: "Long Walk Technologies",
    type: "Web Development",
    status: "COMPLETED",
    launchDate: "Dec 2024",
    url: "https://www.lwt.com",
    description: "Website project for Long Walk Technologies.",
    clients: [client("Long Walk Technologies", "red")],
    features: [
      "Creative direction and strategy",
      "Web application development",
      "Technical consulting",
      "Brand implementation",
    ],
  },
  {
    id: "stellantis",
    name: "Stellantis",
    type: "Experience Architecture",
    status: "COMPLETED",
    launchDate: "Jan 2022",
    url: "",
    description: "",
    clients: [client("Stellantis", "blue")],
    features: [
    ],
  },
  {
    id: "coetic",
    name: "CoeticHR",
    type: "Web Redesign",
    status: "COMPLETED",
    launchDate: "Oct 2020",
    url: "https://coetichr.com/",
    description: "Coetic Website 4.0 redesign and architecture refresh for CoeticHR.",
    clients: [client("CoeticHR", "blue")],
    features: [
      "Website architecture redesign",
      "Platform showcase for CoeticHR offerings",
      "Cross-functional collaboration with product and design teammates",
      "Improved UX clarity for navigation and feature communication",
    ],
  },
  {
    id: "people-science",
    name: "People Science",
    type: "Web Experience",
    status: "COMPLETED",
    launchDate: "Oct 2020",
    url: "https://coetichr.com/people-science",
    description: "Companion experience within the Coetic ecosystem focused on people science content.",
    clients: [client("CoeticHR", "blue")],
    features: [
      "Content-forward experience design",
      "Information architecture aligned with Coetic products",
      "Collaborative implementation with cross-functional creators",
      "Audience-friendly storytelling and conversion pathways",
    ],
  },
  {
    id: "effective-ministry-360",
    name: "Effective Ministry 360",
    type: "Product Experience",
    status: "COMPLETED",
    launchDate: "Oct 2020",
    description: "Collaborative project focused on product and experience strategy for ministry operations.",
    clients: [client("CoeticHR", "blue")],
    features: [
      "Product and UX planning",
      "Cross-functional creator collaboration",
      "Information flow and workflow definition",
      "Experience refinement across core journeys",
    ],
  },
  {
    id: "woether",
    name: "Woether",
    type: "Web Application",
    status: "COMPLETED",
    launchDate: "Oct 2020",
    description: "Project management application founded on organizational psychology.",
    clients: [client("CoeticHR", "blue")],
    features: [
      "Organizational psychology framework",
      "Team workflow management",
      "Psychology-based productivity",
      "Custom reporting",
    ],
  },
  {
    id: "finer-dining",
    name: "Finer Dining",
    type: "UX / Product Design",
    status: "COMPLETED",
    launchDate: "May 2019",
    url: "https://www.figma.com/file/eUZ07Ey7U74UHdyJOMAa7RAR/Finer-Dining",
    description:
      "Value-centered design exploration for improving the dining discovery experience with research-backed prototyping.",
    clients: [client("Michigan State University", "green")],
    features: [
      "Apple Maps integration design",
      "Restaurant discovery features",
      "Enhanced dining information",
      "User experience research",
    ],
  },
  {
    id: "dsl",
    name: "Digital Scholarship Lab",
    type: "Web Redesign",
    status: "COMPLETED",
    launchDate: "Dec 2018",
    description:
      "Research and redesign initiative delivering data and concepts to improve the Digital Scholarship Lab website experience.",
    clients: [client("Michigan State University", "green")],
    features: [
      "User research and analysis",
      "Complete visual redesign",
      "Improved navigation",
      "Accessibility improvements",
    ],
  },
  {
    id: "h2home",
    name: "H2home",
    type: "Product Design",
    status: "COMPLETED",
    launchDate: "Mon YYYY",
    description: "Sustainable product design, centered on water conservation.",
    clients: [client("Michigan State University", "green")],
    features: [
      "Sustainable design principles",
      "Water conservation focus",
      "Product prototyping",
      "Environmental impact analysis",
    ],
  },
  {
    id: "soundwriting",
    name: "Soundwriting",
    type: "Interface Design",
    status: "COMPLETED",
    launchDate: "Aug 2018",
    description:
      "Experimental audio interface for publishing and interacting with scholarly sound content.",
    clients: [client("Michigan State University", "green")],
    features: [
      "Audio content navigation",
      "Innovative interface design",
      "Accessibility considerations",
      "Cross-platform implementation",
    ],
  },
  {
    id: "all-aboard",
    name: "All Aboard",
    type: "Game Prototype",
    status: "COMPLETED",
    launchDate: "Jun 2018",
    url: "https://www.figma.com/file/WZDUSUHeqSbW7HArjMvHe97k/All-Aboard",
    description:
      "Participatory design game prototype built to teach accessibility, with an initial focus on visual disabilities.",
    clients: [client("Michigan State University", "green")],
    features: [
      "Educational game design",
      "Accessibility awareness training",
      "Interactive prototype",
      "User testing",
    ],
  },
  {
    id: "coetic-3",
    name: "Coetic Website 3.0",
    type: "Web Redesign",
    status: "COMPLETED",
    launchDate: "Aug 2019",
    description: "Earlier Coetic website redesign iteration produced in a rapid collaborative cycle.",
    clients: [client("CoeticHR", "blue")],
    features: [
      "Rapid website iteration and redesign",
      "Cross-functional creator collaboration",
      "Content and navigation restructuring",
      "Brand and UI consistency improvements",
    ],
  },
  {
    id: "michigan-avenue-2030",
    name: "Michigan Avenue 2030",
    type: "Human-Centered Research",
    status: "COMPLETED",
    launchDate: "May 2019",
    description:
      "Collaboration with the Michigan Avenue Corridor Improvement Authority and Michigan State University to provide human-centered research for proposed corridor developments.",
    clients: [client("Michigan Avenue Corridor Improvement Authority", "blue"), client("Michigan State University", "green")],
    features: [
      "Community-centered research planning",
      "Stakeholder collaboration with public institutions",
      "Insight synthesis for urban development decisions",
      "Human-centered framing for strategic proposals",
    ],
  },
  {
    id: "global-payment-network",
    name: "Global Payment Network",
    type: "Research Project",
    status: "COMPLETED",
    launchDate: "Apr 2019",
    description: "Investigation into online payments and the underlying technology stack that enables them.",
    clients: [client("Michigan State University", "green")],
    features: [
      "Payments ecosystem research",
      "Technology stack analysis",
      "User and system flow mapping",
      "Findings documentation and presentation",
    ],
  },
  {
    id: "jane-the-brain",
    name: "Jane The Brain",
    type: "Campaign Design",
    status: "COMPLETED",
    launchDate: "Mon YYYY",
    url: "https://www.figma.com/file/L5vtCesfaLYyz8LVorePmjQx/Jane-the-Brain-Presents-Mental-Health-Awareness",
    description:
      "Mental health awareness campaign designed to educate Michigan State University students on available campus resources.",
    clients: [client("Michigan State University", "green")],
    features: [
      "Rhetorical and campaign design strategy",
      "Student-focused mental health education",
      "Messaging and experience design for campus audiences",
      "Figma-based campaign artifact production",
    ],
  },
  {
    id: "allo-redesign",
    name: "Allo Redesign",
    type: "UX Concept",
    status: "COMPLETED",
    launchDate: "Mon YYYY",
    description:
      "UX concept exploring the future of Google Material Design through an Allo redesign before platform sunset.",
    clients: [client("Michigan State University", "green")],
    features: [
      "Material Design exploration",
      "Conversation-focused interaction redesign",
      "Concept validation through UX principles",
      "Product narrative for emerging interface patterns",
    ],
  },
  {
    id: "fiop-modernization",
    name: "Food Inspections Online Postings",
    type: "Government Modernization",
    status: "COMPLETED",
    launchDate: "Apr 2025",
    description:
      "In order to comply with federal legislation on accessibility and in service of improving the user experience, I redeveloped the Food Inspections Online Postings in accordance with the One Stand, One Brand initiative.",
    clients: [client("Michigan Department of Agriculture, and Rural Development", "muted")],
    features: [

    ],
  }, 
  {
    id: "wrrs-modernization",
    name: "Well Record Retrieval System",
    type: "Government Modernization",
    status: "COMPLETED",
    launchDate: "Apr 2025",
    description:
      "In order to comply with federal legislation on accessibility and in service of improving the user experience, I redeveloped the Well Record Retrieval System in accordance with the One Stand, One Brand initiative.",
    clients: [client("Michigan Department of Enivronment, Great Lakes, and Energy", "blue")],
    features: [

    ],
  }, {
    id: "opcert-modernization",
    name: "Operator Training and Certification Information System (OTCIS / OpCert)",
    type: "Government Modernization",
    status: "IN PROGRESS",
    launchDate: "",
    description:
      "This website provides the ability to look up certified drinking water operators, certified drinking water operators by a Water Supply Serial Number (WSSN), and Advisory Board approved courses that count towards continuing education. The modernization effort is focused on providing this service using modern technology and making sure it meets industry standards for user experience and accessibility.",
    clients: [client("Michigan Department of Enivronment, Great Lakes, and Energy", "blue")],
    features: [

    ],
  },
  {
    id: "burn-permits-modernization",
    name: "Burn Permits",
    type: "Government Modernization",
    status: "COMPLETED",
    launchDate: "Apr 2025",
    description:
      "Modernized the legacy Burn Permits system used to meet ADA guidelines and align with the One State, One Brand initiative.",
    clients: [client("Michigan Department of Natural Resources", "green")],
    features: [

    ],
  },
  {
    id: "icdb-modernization",
    name: "Intentional Conversation Database (ICDB)",
    type: "Government Modernization",
    status: "IN PROGRESS",
    description:
      "Modernized the legacy Intentional Conversation Database used to track performance conversations and policy adherence at MDARD.",
    clients: [client("Michigan Department of Agriculture and Rural Development", "blue")],
    features: [
      "Legacy database modernization",
      "Lower-cost architecture and improved sustainability",
      "Updated UX aligned to state guidelines",
      "Support for performance and pay-period workflows",
    ],
  },
  {
    id: "fish-modernization",
    name: "Fisheries Information System Hub (FISH)",
    type: "Government Modernization",
    status: "IN PROGRESS",
    description:
      "Supported modernization of the Fisheries Information System Hub to strengthen data quality and collaboration for fisheries management.",
    clients: [client("Michigan Department of Natural Resources", "green")],
    features: [
      "Data-heavy system modernization",
      "Cross-agency collaboration support",
      "Improved usability for science and policy workflows",
      "Platform updates for long-term program resilience",
    ],
  },
  {
    id: "wwat-modernization",
    name: "Water Withdrawal Assessment Tool (WWAT)",
    type: "Government Modernization",
    status: "COMPLETED",
    launchDate: "Apr 2025",
    description:
      "Modernization of the Water Withdrawal Assessment Tool to support required pre-installation impact checks for large quantity withdrawals.",
    clients: [client("Michigan Department of Environment, Great Lakes, and Energy", "blue")],
    features: [
      "Modernization of a critical statewide assessment tool",
      "Continuity after transfer from Michigan State University",
      "Improved digital experience and system reliability",
      "Policy-aligned workflows for water resource protection",
    ],
  },
  {
    id: "mif-modernization",
    name: "Michigan Forest Inventory (MiFI)",
    type: "Government Digital Platform",
    status: "IN PROGRESS",
    description:
      "Web platform work supporting Michigan Forest Inventory workflows for conservation, treatment planning, and timber sale execution.",
    clients: [client("Michigan Department of Natural Resources", "green")],
    features: [
      "Forestry operations workflow support",
      "Inventory and treatment planning enablement",
      "Business function continuity for MDNR teams",
      "Improved digital tooling for forest management",
    ],
  },
  {
    id: "miehdwis",
    name: "MIEHDWIS",
    type: "Government Digital Platform",
    status: "IN PROGRESS",
    description:
      "Delivered platform improvements for MiEHDWIS, the regulated-entity workspace for monitoring results, permits, and program documentation.",
    clients: [client("Michigan Department of Environment, Great Lakes, and Energy", "blue")],
    features: [
      "Regulated-entity submission experience",
      "Permit and licensing workflow support",
      "Documentation and monitoring result intake",
      "Program operations enablement for DWEHD teams",
    ],
  },
  {
    id: "digital-standards",
    name: "Digtial Standards",
    type: "Design System",
    status: "IN PROGRESS",
    description:
      "Contributed to statewide digital standards focused on consistent, trustworthy, and seamless citizen experiences across agencies.",
    clients: [client("State of Michigan", "blue")],
    features: [
      "Cross-channel consistency framework",
      "Guidance for websites, apps, and digital communication",
      "Trust-centered user experience principles",
      "Scalable standards for multi-agency implementation",
    ],
  },
  {
    id: "digital-guidelines",
    name: "Digital Guidelines",
    type: "Design System",
    status: "IN PROGRESS",
    description:
      "Helped shape practical digital guidelines that enable teams to kickstart app design and development with user-trusted patterns.",
    clients: [client("State of Michigan", "blue")],
    features: [
      "Developer and designer onboarding support",
      "Pattern guidance for trusted digital experiences",
      "Usability-first implementation recommendations",
      "Alignment with broader One State, One Brand direction",
    ],
  },
  {
    id: "one-state-one-brand",
    name: "One State, One Brand",
    type: "GovernmentExperience Architecture",
    status: "IN PROGRESS",
    description:
      "Experience strategy work advancing consistent service experiences across Michigan digital properties for residents, businesses, and visitors.",
    clients: [client("State of Michigan", "blue")],
    features: [
      "Human-centered strategy alignment",
      "Cross-agency digital experience consistency",
      "Support for strategic IT and service objectives",
      "Design-led modernization advocacy",
    ],
  },
  {
    id: "portfolio",
    name: "Portfolio",
    type: "Portfolio Website",
    status: "LIVE",
    url: "http://ryanrclewis.family",
    description: "Professional portfolio created to present work and capabilities to employers and collaborators.",
    clients: [client("Self-directed")],
    tags: ["Portfolio", "Design", "Development"],
  },
  {
    id: "contact",
    name: "Contact",
    type: "Info",
    status: "ONLINE",
    url: "mailto:contact@archangel-labs.com",
    description: "Get in touch with Archangel Laboratories.",
    clients: [client("Archangel Laboratories", "red")],
  },
];

export function getProjectById(id: string) {
  return projects.find((project) => project.id === id);
}

export function getProjectIds() {
  return projects.map((project) => project.id);
}

export function getProjectLaunchLabel(project: Project) {
  return project.launchDate ?? (project.status === "IN PROGRESS" ? "IN PROGRESS" : project.status);
}
