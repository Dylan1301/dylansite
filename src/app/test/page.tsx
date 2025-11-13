import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { GlobeSection } from "@/components/globe/GlobeSection";
import { GlobeLoader } from "@/components/GlobeLoader";

export const metadata: Metadata = {
	title: "Test",
};

export default function TestPage() {
	return (
		<div>
			<GlobeSection />
		</div>
	);
}


