import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { renderProject, getAllProjects } from "@/lib/mdx";

type Params = { params: { slug: string } };

export async function generateStaticParams() {
	const items = await getAllProjects();
	return items.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Params) {
	const items = await getAllProjects();
	const item = items.find((i) => i.slug === params.slug);
	return { title: item?.frontmatter.title ?? "Project" };
}

export default async function ProjectDetailPage({ params }: Params) {
	try {
		const { content, frontmatter } = await renderProject(params.slug);
		return (
			<main>
				<Container>
					<article>
						<header className="mb-8">
							<h1 className="text-3xl font-semibold tracking-tight">{frontmatter.title}</h1>
							{frontmatter.summary ? <p className="text-muted-foreground mt-2">{frontmatter.summary}</p> : null}
						</header>
						{content}
					</article>
				</Container>
			</main>
		);
	} catch {
		notFound();
	}
}


