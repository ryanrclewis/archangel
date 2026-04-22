import PortfolioHome from "./components/portfolio-home";
import { projects } from "./data/projects";

export default function Home() {
  const ourWork = projects.filter((project) => project.folder === "Our Work");

  return <PortfolioHome projects={ourWork} />;
}
