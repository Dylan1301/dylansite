import Link from "next/link";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { ProjectCard } from "@/components/ProjectCard";
import { GlobeLoader } from "@/components/GlobeLoader";
import { getAllProjects, getAllPosts } from "@/lib/mdx";

export default async function Home() {
	// Ensure placeholder content exists for first render
	const [projects, posts] = await Promise.all([getAllProjects(), getAllPosts()]);
	const featured = projects.slice(0, 3);
	const latest = posts.slice(0, 3);

	return (
		<main >
			{/* 3D Globe Section - scroll-driven, desktop only */}
			<GlobeLoader />

			<Container>
				<Section title="Featured Projects">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{featured.map((p) => (
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

				<Section title="Latest Writing">
					<ul className="space-y-4">
						{latest.map((post) => (
							<li key={post.slug} className="flex items-baseline justify-between gap-4">
								<div>
									<Link href={`/writing/${post.slug}`} className="font-medium hover:underline underline-offset-4">
										{post.frontmatter.title}
									</Link>
									{post.frontmatter.summary ? (
										<p className="text-sm text-muted-foreground">{post.frontmatter.summary}</p>
									) : null}
								</div>
								<time className="text-xs text-muted-foreground" dateTime={post.frontmatter.date}>
									{new Date(post.frontmatter.date).toLocaleDateString(undefined, {
										year: "numeric",
										month: "short",
										day: "numeric",
									})}
								</time>
							</li>
						))}
					</ul>
				</Section>
			</Container>
		</main>
	);
}
