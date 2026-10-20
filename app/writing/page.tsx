import type { Metadata } from "next";
import { PageLayout } from "@/app/components/PageLayout";
export const metadata: Metadata = { title: "Writing | Archangel Laboratories", description: "Essays and notes from Archangel Laboratories." };
export default function WritingPage() { return <PageLayout><section className="content-band"><p className="eyebrow">Writing</p><h1>Essays and working notes.</h1><div className="essay-index"><article><h2>Essay index</h2></article></div></section></PageLayout>; }
