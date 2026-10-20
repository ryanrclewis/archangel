import type { Metadata } from "next";
import { PageLayout } from "@/app/components/PageLayout";
export const metadata: Metadata = { title: "About | Archangel Laboratories", description: "The practice, teaching, and research agenda of Archangel Laboratories." };
export default function AboutPage() { return <PageLayout><section className="content-band"><p className="eyebrow">About</p><h1>A practice of craft, restraint, and rigor.</h1><div className="content-grid">{["Bio","CV","Teaching statement","Research agenda","Methods","Talks and writing"].map((label)=><section key={label}><h2>{label}</h2></section>)}</div></section></PageLayout>; }
