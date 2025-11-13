import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "About",
};

const skills = ["AWS", "Kafka", "FastAPI", "Neo4j", "Next.js", "Snowflake", "dbt", "Terraform"];

export default function AboutPage() {
	return (
		<div>
			<Container>
				<Section title="About">
					<p className="text-lg text-muted-foreground">
						I’m a data engineer and creative technologist based in Melbourne, focused on building resilient data platforms and expressive
						interfaces. I enjoy connecting infrastructure, analytics, and design to deliver reliable systems with human-friendly
						experiences. My work spans streaming architectures, graph exploration, and modern web applications.
					</p>
				</Section>
				<Section title="Skills">
					<ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
						{skills.map((s) => (
							<li key={s} className="rounded-md border px-3 py-2 text-sm">
								{s}
							</li>
						))}
					</ul>
				</Section>
				<Section>
					<a href="/DylanNguyen2025.pdf" className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium" target="_blank" rel="noopener noreferrer">
						Download Resume
					</a>
					{/* TODO: Replace with actual resume.pdf in /public */}
				</Section>
			</Container>
		</div>
	);
}


