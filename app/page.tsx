import PortfolioHome from "./components/portfolio-home";
import { projects } from "./data/projects";

const OUR_WORK_FOLDER = "Our Work" as const;

export default function Home() {
  const ourWork = projects.filter((project) => project.folder === OUR_WORK_FOLDER);

  return <PortfolioHome projects={ourWork} />;
}
