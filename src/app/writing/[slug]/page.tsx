import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { renderPost, getAllPosts } from "@/lib/mdx";

type Params = { params: { slug: string } };

export async function generateStaticParams() {
	const items = await getAllPosts();
	return items.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Params) {
	const items = await getAllPosts();
	const item = items.find((i) => i.slug === params.slug);
	return { title: item?.frontmatter.title ?? "Post" };
}

export default async function PostDetailPage({ params }: Params) {
	try {
		const { content, frontmatter } = await renderPost(params.slug);
		return (
			<div>
				<Container>
					<article>
						<header className="mb-8">
							<h1 className="text-3xl font-semibold tracking-tight">{frontmatter.title}</h1>
							<time className="text-sm text-muted-foreground" dateTime={frontmatter.date}>
								{new Date(frontmatter.date).toLocaleDateString(undefined, {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</time>
						</header>
						{content}
					</article>
				</Container>
			</div>
		);
	} catch {
		notFound();
	}
}


