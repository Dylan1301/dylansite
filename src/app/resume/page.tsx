import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Resume",
};

export default function ResumePage() {
	return (
		<main>
			<Container>
				<Section title="Resume">
					<p className="text-muted-foreground mb-4">You can download my resume below.</p>
					<a className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
						Download Resume (PDF)
					</a>
					{/* TODO: Add resume.pdf to /public */}
				</Section>
			</Container>
		</main>
	);
}


