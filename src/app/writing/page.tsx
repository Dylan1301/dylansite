import Link from "next/link";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { getAllPosts } from "@/lib/mdx";

export const metadata = {
	title: "Writing",
};

export default async function WritingPage() {
	const posts = await getAllPosts();
	return (
		<main>
			<Container>
				<Section title="Writing">
					<ul className="space-y-6">
						{posts.map((post) => (
							<li key={post.slug} className="flex items-baseline justify-between gap-6">
								<div>
                                    <Link href={`/writing/${post.slug}`} className="font-medium hover:underline underline-offset-4">
                                        {post.frontmatter.title}
                                    </Link>
									{post.frontmatter.summary ? <p className="text-sm text-muted-foreground">{post.frontmatter.summary}</p> : null}
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


