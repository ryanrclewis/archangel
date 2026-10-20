import type { Metadata } from "next";
import { PageLayout } from "@/app/components/PageLayout";
import siteConfig from "@/app/data/site-config.json";

export const metadata: Metadata = { title: "Bespoke engagements | Archangel Laboratories", description: "How Archangel Laboratories works with bespoke clients." };

export default function BespokePage() {
  return <PageLayout><section className="content-band"><p className="eyebrow">Bespoke</p><h1>Work shaped to the problem.</h1><div className="content-grid">
    <section><h2>What an engagement looks like</h2></section>
    <section><h2>What we take on and decline</h2></section>
    <section><h2>Long-term support</h2></section>
  </div><a className="button-primary" href={`mailto:${siteConfig.contactEmail}`}>Start a conversation</a></section></PageLayout>;
}
