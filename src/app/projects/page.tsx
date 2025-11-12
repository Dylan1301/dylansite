import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { ProjectCard } from "@/components/ProjectCard";
import { getAllProjects } from "@/lib/mdx";

export const metadata = {
	title: "Projects",
};

export default async function ProjectsPage() {
	const projects = await getAllProjects();
	return (
		<main>
			<Container>
				<Section title="Projects">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{projects.map((p) => (
							<ProjectCard
								key={p.slug}
								slug={p.slug}
								title={p.frontmatter.title}
								summary={p.frontmatter.summary}
								tags={p.frontmatter.tags}
								year={p.frontmatter.year}
								repo={p.frontmatter.repo}
								demo={p.frontmatter.demo}
							/>
						))}
					</div>
				</Section>
			</Container>
		</main>
	);
}


