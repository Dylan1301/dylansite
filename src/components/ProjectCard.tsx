import Link from "next/link";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
	slug: string;
	title: string;
	summary: string;
	tags?: string[];
	year?: number;
	repo?: string;
	demo?: string;
	className?: string;
};

export function ProjectCard({ slug, title, summary, tags, year, repo, demo, className }: ProjectCardProps) {
	return (
		<article className={cn("rounded-lg border border-border p-5 hover:shadow-sm transition-shadow", className)}>
			<header className="mb-3">
				<h3 className="text-lg font-semibold tracking-tight">
					<Link href={`/projects/${slug}`} className="hover:underline underline-offset-4">
						{title}
					</Link>
				</h3>
				{year ? <p className="text-xs text-muted-foreground mt-1">{year}</p> : null}
			</header>
			<p className="text-sm text-muted-foreground">{summary}</p>
			{tags && tags.length > 0 ? (
				<ul className="mt-3 flex flex-wrap gap-2">
					{tags.map((t) => (
						<li key={t} className="text-xs rounded border px-2 py-0.5">
							{t}
						</li>
					))}
				</ul>
			) : null}
			{repo || demo ? (
				<div className="mt-4 flex gap-4 text-sm">
					{repo ? (
						<a href={repo} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
							Repo
						</a>
					) : null}
					{demo ? (
						<a href={demo} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
							Demo
						</a>
					) : null}
				</div>
			) : null}
		</article>
	);
}


