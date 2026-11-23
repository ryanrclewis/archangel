import { tagToSlug } from "@/app/data/projects";

export type TagEncyclical = {
  documentTitle: string;
  author: string;
  year: string;
  href: string;
  description: string;
};

const ENCYCLICALS_BY_SLUG: Record<string, TagEncyclical> = {
  "magnificent-humanity": {
    documentTitle: "Magnifica Humanitas",
    author: "Pope Leo XIV",
    year: "2026",
    href: "https://www.vaticannews.va/en/pope/news/2026-05/pope-leo-xiv-first-encyclical-magnifica-humanitas.html",
    description:
      "Work guided by Pope Leo XIV's Magnifica Humanitas, reflecting on the dignity of the human person and what it means to build technology that honors human life.",
  },
  "the-human-heart": {
    documentTitle: "Dilexit Nos",
    author: "Pope Francis",
    year: "2024",
    href: "https://www.vatican.va/content/francesco/en/encyclicals/documents/20241024-enciclica-dilexit-nos.html",
    description:
      "Projects shaped by Pope Francis's Dilexit Nos, calling us back to the human heart, memory, and personal connection in an increasingly impersonal digital world.",
  },
  fraternity: {
    documentTitle: "Fratelli Tutti",
    author: "Pope Francis",
    year: "2020",
    href: "https://www.vatican.va/content/francesco/en/encyclicals/documents/papa-francesco_20201003_enciclica-fratelli-tutti.html",
    description:
      "Work inspired by Pope Francis's Fratelli Tutti, focusing on social friendship, civic community, and tools that help neighbors work together.",
  },
  "our-common-home": {
    documentTitle: "Laudato Si'",
    author: "Pope Francis",
    year: "2015",
    href: "https://www.vatican.va/content/francesco/en/encyclicals/documents/papa-francesco_20150524_enciclica-laudato-si.html",
    description:
      "Software and public systems grounded in Pope Francis's Laudato Si', supporting careful stewardship of water, forests, and the environment we share.",
  },
  light: {
    documentTitle: "Lumen Fidei",
    author: "Pope Francis",
    year: "2013",
    href: "https://www.vatican.va/content/francesco/en/encyclicals/documents/papa-francesco_20130629_enciclica-lumen-fidei.html",
    description:
      "Projects informed by Lumen Fidei, reflecting on faith as a steady light that clarifies how we understand the world and build for others.",
  },
  truth: {
    documentTitle: "Caritas in Veritate",
    author: "Pope Benedict XVI",
    year: "2009",
    href: "https://www.vatican.va/content/benedict-xvi/en/encyclicals/documents/hf_ben-xvi_enc_20090629_caritas-in-veritate.html",
    description:
      "Work shaped by Pope Benedict XVI's Caritas in Veritate, pairing charity with honesty and clarity in how technology serves genuine human development.",
  },
  hope: {
    documentTitle: "Spe Salvi",
    author: "Pope Benedict XVI",
    year: "2007",
    href: "https://www.vatican.va/content/benedict-xvi/en/encyclicals/documents/hf_ben-xvi_enc_20071130_spe-salvi.html",
    description:
      "Projects rooted in Pope Benedict XVI's Spe Salvi, building practical, hopeful tools while staying clear-eyed that technology serves people rather than saving them.",
  },
  love: {
    documentTitle: "Deus Caritas Est",
    author: "Pope Benedict XVI",
    year: "2005",
    href: "https://www.vatican.va/content/benedict-xvi/en/encyclicals/documents/hf_ben-xvi_enc_20051225_deus-caritas-est.html",
    description:
      "Work inspired by Pope Benedict XVI's Deus Caritas Est, ordered toward concrete care and practical charity for the people on the other side of the screen.",
  },
  faith: {
    documentTitle: "Fides et Ratio",
    author: "Pope St. John Paul II",
    year: "1998",
    href: "https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_14091998_fides-et-ratio.html",
    description:
      "Projects grounded in Pope St. John Paul II's Fides et Ratio, bringing careful scholarship, open inquiry, and Christian heritage together in accessible software.",
  },
  reason: {
    documentTitle: "Fides et Ratio",
    author: "Pope St. John Paul II",
    year: "1998",
    href: "https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_14091998_fides-et-ratio.html",
    description:
      "Research and design work shaped by Pope St. John Paul II's Fides et Ratio, honoring disciplined human inquiry, evidence-based user research, and clear thinking.",
  },
  unity: {
    documentTitle: "Ut Unum Sint",
    author: "Pope St. John Paul II",
    year: "1995",
    href: "https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_25051995_ut-unum-sint.html",
    description:
      "Work guided by Pope St. John Paul II's Ut Unum Sint, aiming for shared understanding and genuine unity across communities.",
  },
  life: {
    documentTitle: "Evangelium Vitae",
    author: "Pope St. John Paul II",
    year: "1995",
    href: "https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_25031995_evangelium-vitae.html",
    description:
      "Work inspired by Pope St. John Paul II's Evangelium Vitae, honoring the inviolable value and dignity of every human life.",
  },
  labor: {
    documentTitle: "Centesimus Annus",
    author: "Pope St. John Paul II",
    year: "1991",
    href: "https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_01051991_centesimus-annus.html",
    description:
      "Tools shaped by Pope St. John Paul II's Centesimus Annus, built to respect the dignity of everyday work and make people's responsibilities clearer and more humane.",
  },
  capital: {
    documentTitle: "Rerum Novarum",
    author: "Pope Leo XIII",
    year: "1891",
    href: "https://www.vatican.va/content/leo-xiii/en/encyclicals/documents/hf_l-xiii_enc_15051891_rerum-novarum.html",
    description:
      "Commercial and industry work informed by Pope Leo XIII's Rerum Novarum, seeking a fair harmony between productive enterprise and the well-being of the people it serves.",
  },
  evangelization: {
    documentTitle: "Redemptoris Missio",
    author: "Pope St. John Paul II",
    year: "1990",
    href: "https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_07121990_redemptoris-missio.html",
    description:
      "Digital projects guided by Pope St. John Paul II's Redemptoris Missio, putting modern craft in service of sharing the Gospel and supporting ministry.",
  },
  charity: {
    documentTitle: "Sollicitudo Rei Socialis",
    author: "Pope St. John Paul II",
    year: "1987",
    href: "https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_30121987_sollicitudo-rei-socialis.html",
    description:
      "Work shaped by Pope St. John Paul II's Sollicitudo Rei Socialis, oriented toward solidarity and authentic human development.",
  },
  dignity: {
    documentTitle: "Laborem Exercens",
    author: "Pope St. John Paul II",
    year: "1981",
    href: "https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_14091981_laborem-exercens.html",
    description:
      "Public systems and accessibility work rooted in Pope St. John Paul II's Laborem Exercens, treating every person as an end in themselves through inclusive, thoughtful design.",
  },
  "our-posterity": {
    documentTitle: "Humanae Vitae",
    author: "Pope St. Paul VI",
    year: "1968",
    href: "https://www.vatican.va/content/paul-vi/en/encyclicals/documents/hf_p-vi_enc_25071968_humanae-vitae.html",
    description:
      "Work informed by Pope St. Paul VI's Humanae Vitae, focused on families, generational stewardship, and leaving durable tools and memories for those who come after us.",
  },
  prosperity: {
    documentTitle: "Populorum Progressio",
    author: "Pope St. Paul VI",
    year: "1967",
    href: "https://www.vatican.va/content/paul-vi/en/encyclicals/documents/hf_p-vi_enc_26031967_populorum.html",
    description:
      "Projects guided by Pope St. Paul VI's Populorum Progressio, building practical software that helps households and teams flourish rather than extracting from them.",
  },
  "peace-on-earth": {
    documentTitle: "Pacem in Terris",
    author: "Pope St. John XXIII",
    year: "1963",
    href: "https://www.vatican.va/content/john-xxiii/en/encyclicals/documents/hf_j-xxiii_enc_11041963_pacem.html",
    description:
      "Work informed by Pope St. John XXIII's Pacem in Terris, grounded in truth, justice, and the stable civic order that lets communities live in peace.",
  },
  subsidiarity: {
    documentTitle: "Quadragesimo Anno",
    author: "Pope Pius XI",
    year: "1931",
    href: "https://www.vatican.va/content/pius-xi/en/encyclicals/documents/hf_p-xi_enc_19310515_quadragesimo-anno.html",
    description:
      "Research and tools shaped by Pope Pius XI's Quadragesimo Anno, keeping authority, data, and capability as close as possible to the people directly affected.",
  },
  liberty: {
    documentTitle: "Declaration of Independence",
    author: "Founding Document",
    year: "1776",
    href: "https://www.archives.gov/founding-docs/declaration-transcript",
    description:
      "Work guided by the civic principles of the Declaration of Independence, building tools that respect human agency and personal freedom.",
  },
  "the-pursuit-of-happiness": {
    documentTitle: "Declaration of Independence",
    author: "Founding Document",
    year: "1776",
    href: "https://www.archives.gov/founding-docs/declaration-transcript",
    description:
      "Work guided by the civic principles of the Declaration of Independence, oriented toward everyday human flourishing.",
  },
  justice: {
    documentTitle: "Constitution of the United States",
    author: "Founding Document",
    year: "1787",
    href: "https://www.senate.gov/about/origins-foundations/senate-and-constitution/constitution.htm",
    description:
      "Work rooted in the constitutional commitment to justice and fair, dependable public institutions.",
  },
  "domestic-tranquility": {
    documentTitle: "Constitution of the United States",
    author: "Founding Document",
    year: "1787",
    href: "https://www.senate.gov/about/origins-foundations/senate-and-constitution/constitution.htm",
    description:
      "Work rooted in the constitutional commitment to domestic tranquility and trustworthy civic services.",
  },
  "the-common-defense": {
    documentTitle: "Constitution of the United States",
    author: "Founding Document",
    year: "1787",
    href: "https://www.senate.gov/about/origins-foundations/senate-and-constitution/constitution.htm",
    description:
      "Work supporting resilient infrastructure and the constitutional duty of the common defense.",
  },
  "the-general-welfare": {
    documentTitle: "Constitution of the United States",
    author: "Founding Document",
    year: "1787",
    href: "https://www.senate.gov/about/origins-foundations/senate-and-constitution/constitution.htm",
    description:
      "Public systems and tools built to serve the general welfare clearly and accessibly.",
  },
  "the-united-states-of-america": {
    documentTitle: "Constitution of the United States",
    author: "Founding Document",
    year: "1787",
    href: "https://www.senate.gov/about/origins-foundations/senate-and-constitution/constitution.htm",
    description:
      "Civic technology and public-interest work built in service of American communities and institutions.",
  },
};

export function getTagEncyclical(tagNameOrSlug: string): TagEncyclical | undefined {
  return ENCYCLICALS_BY_SLUG[tagToSlug(tagNameOrSlug)];
}
