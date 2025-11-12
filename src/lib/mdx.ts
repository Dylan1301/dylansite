import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { ReactElement, createElement } from "react";
import { Prose } from "@/components/Prose";

const CONTENT_DIR = path.join(process.cwd(), "content");
const POSTS_DIR = path.join(CONTENT_DIR, "posts");
const PROJECTS_DIR = path.join(CONTENT_DIR, "projects");

export type PostFrontmatter = {
	title: string;
	summary?: string;
	date: string; // ISO
	tags?: string[];
};

export type ProjectFrontmatter = {
	title: string;
	summary: string;
	tags?: string[];
	year?: number;
	repo?: string;
	demo?: string;
};

export type ContentItem<T> = {
	slug: string;
	frontmatter: T;
};

async function readDirMdx<T>(dir: string): Promise<Array<ContentItem<T>>> {
	await fs.mkdir(dir, { recursive: true });
	const files = await fs.readdir(dir);
	const mdxFiles = files.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
	const items: Array<ContentItem<T>> = [];
	for (const file of mdxFiles) {
		const full = path.join(dir, file);
		const raw = await fs.readFile(full, "utf8");
		const { data } = matter(raw);
		items.push({ slug: path.basename(file, path.extname(file)), frontmatter: data as T });
	}
	return items;
}

export async function getAllPosts(): Promise<Array<ContentItem<PostFrontmatter>>> {
	const items = await readDirMdx<PostFrontmatter>(POSTS_DIR);
	return items
		.filter((i) => i.frontmatter?.title && i.frontmatter?.date)
		.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
}

export async function getAllProjects(): Promise<Array<ContentItem<ProjectFrontmatter>>> {
	const items = await readDirMdx<ProjectFrontmatter>(PROJECTS_DIR);
	return items.filter((i) => i.frontmatter?.title && i.frontmatter?.summary);
}

export async function renderPost(slug: string): Promise<{ frontmatter: PostFrontmatter; content: ReactElement }> {
	const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
	const raw = await fs.readFile(filePath, "utf8");
	const { content, data } = matter(raw);
	const { content: MDXContent } = await compileMDX({
		source: content,
		options: { parseFrontmatter: false },
	});
	return {
		frontmatter: data as PostFrontmatter,
		content: createElement(Prose, undefined, MDXContent),
	};
}

export async function renderProject(slug: string): Promise<{ frontmatter: ProjectFrontmatter; content: ReactElement }> {
	const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);
	const raw = await fs.readFile(filePath, "utf8");
	const { content, data } = matter(raw);
	const { content: MDXContent } = await compileMDX({
		source: content,
		options: { parseFrontmatter: false },
	});
	return {
		frontmatter: data as ProjectFrontmatter,
		content: createElement(Prose, undefined, MDXContent),
	};
}

export async function ensureSampleContent() {
	// Create dirs and add sample files if none exist (idempotent).
	await fs.mkdir(POSTS_DIR, { recursive: true });
	await fs.mkdir(PROJECTS_DIR, { recursive: true });

	// Posts
	const posts = await fs.readdir(POSTS_DIR);
	if (posts.length === 0) {
		await fs.writeFile(
			path.join(POSTS_DIR, "hello-world.mdx"),
			`---
title: Hello World
summary: A short hello world post to demo MDX rendering.
date: ${new Date().toISOString()}
tags: [intro, nextjs]
---

Welcome to my new site. This is **MDX** content rendered in the App Router.

- It supports rich typography
- It is fast and accessible
`
		);
	}

	// Projects
	const projects = await fs.readdir(PROJECTS_DIR);
	if (projects.length === 0) {
		await fs.writeFile(
			path.join(PROJECTS_DIR, "data-platform.mdx"),
			`---
title: Streaming Data Platform
summary: Built a resilient Kafka-based data platform on AWS.
tags: [AWS, Kafka, Terraform]
year: 2024
repo:
demo:
---

This case study outlines a modern streaming data platform with Kafka, Terraform, and observability baked in.
`
		);
		await fs.writeFile(
			path.join(PROJECTS_DIR, "feature-store.mdx"),
			`---
title: Real-time Feature Store
summary: Low-latency feature store with Redis and dbt orchestration.
tags: [Redis, dbt, Python]
year: 2023
repo:
demo:
---

Serving real-time ML features with sub-10ms latency.
`
		);
		await fs.writeFile(
			path.join(PROJECTS_DIR, "graph-insights.mdx"),
			`---
title: Graph Insights
summary: Neo4j-powered insight exploration for connected data.
tags: [Neo4j, Next.js, TypeScript]
year: 2022
repo:
demo:
---

Interactive graph exploration UI with a clean editorial aesthetic.
`
		);
	}
}


