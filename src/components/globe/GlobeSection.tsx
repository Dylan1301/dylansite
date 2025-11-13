"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { GlobeScene } from "./GlobeScene";
import { Container } from "@/components/Container";
import Link from "next/link";

type ExperienceDetail = {
	title: string;
	years: string;
	summary: string;
};

const hanoiProgression: ExperienceDetail[] = [
	{ title: "RMIT University", years: "2018 – 2021", summary: "Bachelor of Supply Chain Management and Analytics." },
	{ title: "Junior Data Engineer", years: "2022 – 2023", summary: "Built batch ingestion jobs and governed warehouse models for local fintechs." },
	{ title: "Lead Data Engineer", years: "2022 – 2023", summary: "Scaled streaming analytics for APAC partners and mentored engineers." },
];

const melbourneProgression: ExperienceDetail[] = [
	{ title: "Platform Architect", years: "2024", summary: "Designing resilient data mesh patterns for AU enterprises." },
	{ title: "Creative Technologist", years: "2024 – 2025", summary: "Combining immersive web and data viz to tell richer stories." },
	// { title: "Community Builder", years: "Ongoing", summary: "Organising meetups and advising startups across Melbourne." },
];

const clampValue = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

type CityId = "hanoi" | "melbourne";

type CityTimelineConfig = {
	id: CityId;
	label: string;
	location: string;
	accent: string;
	start: number;
	end: number;
	experiences: ExperienceDetail[];
};

type TimelineHeaderEntry = {
	type: "header";
	id: string;
	city: CityId;
	accent: string;
	label: string;
	location: string;
};

type TimelineExperienceEntry = {
	type: "experience";
	id: string;
	city: CityId;
	accent: string;
	experience: ExperienceDetail;
	index: number;
	total: number;
};

type TimelineEntry = TimelineHeaderEntry | TimelineExperienceEntry;

const HeroContent = () => (
	<div className="text-center">
		<h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white">Dylan Nguyen</h1>
		<p className="mt-4 text-lg text-white/80">Data engineer & creative technologist in Melbourne.</p>
		<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
			<Link href="/projects" className="rounded-md bg-white text-black px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-white/90">
				View Projects
			</Link>
			<a
				href="/Dylannguyen2025.pdf"
				className="rounded-md border border-white/40 px-4 py-2 text-sm text-white transition-colors hover:border-white"
				target="_blank"
				rel="noopener noreferrer"
			>
				Download CV
			</a>
			<a href="mailto:hello@example.com" className="rounded-md border border-white/40 px-4 py-2 text-sm text-white transition-colors hover:border-white">
				Email me
			</a>
		</div>
	</div>
);

export function GlobeSection() {
	const [scrollProgress, setScrollProgress] = useState(0);
	const [isMobile, setIsMobile] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [manualRotation, setManualRotation] = useState({ 	 x: 0, y: 0 });
	const sectionRef = useRef<HTMLElement | null>(null);
	const dragState = useRef({ active: false, x: 0, y: 0 });

	useEffect(() => {
		setMounted(true);
		// Check if mobile (simplified check)
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	useEffect(() => {
		const updateScrollProgress = () => {
			if (!sectionRef.current) return;
			const section = sectionRef.current;
			const sectionTop = section.offsetTop;
			const sectionHeight = section.offsetHeight;
			const windowHeight = window.innerHeight;

			const scrollY = window.scrollY;
			const progress = (scrollY - sectionTop) / Math.max(sectionHeight - windowHeight, 1);
			const clamped = Math.min(Math.max(progress, 0), 1);
			setScrollProgress(clamped);
		};

		updateScrollProgress();
		window.addEventListener("scroll", updateScrollProgress, { passive: true });
		window.addEventListener("resize", updateScrollProgress);

		return () => {
			window.removeEventListener("scroll", updateScrollProgress);
			window.removeEventListener("resize", updateScrollProgress);
		};
	}, []);

	// Show overlay when scroll progress > 0.75
	const showOverlay = scrollProgress > 0.9;
	const heroOpacity = Math.max(1 - scrollProgress * 11, 0);
	const heroInteractionClass = heroOpacity > 0.05 ? "pointer-events-auto" : "pointer-events-none";
	const clampRotation = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

	// central control for content transition durations (milliseconds)
	const TRANSITION_MS = 700;
	const HANOI_STAGE_END = 0.25;
	const MELBOURNE_STAGE_START = 0.60;

	const timelineSections: CityTimelineConfig[] = [
		{
			id: "hanoi",
			label: "Hanoi Experience",
			location: "Vietnam",
			accent: "#f97316",
			start: 0.05,
			end: HANOI_STAGE_END,
			experiences: hanoiProgression,
		},
		{
			id: "melbourne",
			label: "Melbourne Experience",
			location: "Australia",
			accent: "#38bdf8",
			start: MELBOURNE_STAGE_START,
			end: 0.80,
			experiences: melbourneProgression,
		},
	];

	const cityProgress = timelineSections.reduce<Record<CityId, number>>((acc, section) => {
		acc[section.id] = clampValue((scrollProgress - section.start) / Math.max(section.end - section.start, 0.0001));
		return acc;
	}, { hanoi: 0, melbourne: 0 });

	const timelineEntries = timelineSections.flatMap<TimelineEntry>((section) => [
		{
			type: "header",
			id: `${section.id}-header`,
			city: section.id,
			accent: section.accent,
			label: section.label,
			location: section.location,
		},
		...section.experiences.map((exp, index, arr): TimelineExperienceEntry => ({
			type: "experience",
			id: `${section.id}-exp-${index}`,
			city: section.id,
			accent: section.accent,
			experience: exp,
			index,
			total: arr.length,
		})),
	]);
	const timelineOpacity = Math.max(cityProgress.hanoi ?? 0, cityProgress.melbourne ?? 0);

	const handlePointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
		dragState.current = { active: true, x: event.clientX, y: event.clientY };
		event.currentTarget.setPointerCapture(event.pointerId);
	};

	const handlePointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
		if (!dragState.current.active) return;
		const dx = event.clientX - dragState.current.x;
		const dy = event.clientY - dragState.current.y;
		dragState.current = { active: true, x: event.clientX, y: event.clientY };

		setManualRotation((prev) => ({
			x: clampRotation(prev.x + dy * 0.004, -Math.PI / 2, Math.PI / 2),
			y: prev.y + dx * 0.004,
		}));
	};

	const handlePointerUp = (event: ReactPointerEvent<HTMLCanvasElement>) => {
		dragState.current = { ...dragState.current, active: false };
		if (event.currentTarget.hasPointerCapture(event.pointerId)) {
			event.currentTarget.releasePointerCapture(event.pointerId);
		}
	};

	// Don't render anything until mounted (avoid hydration mismatch)
	if (!mounted) {
		return (
			<section className="h-screen w-full bg-black relative flex items-center justify-center">
				<div className="text-white">Loading...</div>
			</section>
		);
	}

	// Mobile fallback: static image
	// if (isMobile) {
	// 	return (
	// 		<section className="h-screen w-full bg-black relative flex items-center justify-center overflow-hidden">
	// 			<Image
	// 				src="/images/globe_fallback.svg"
	// 				alt="Earth globe view focusing on Australia"
	// 				fill
	// 				className="object-cover opacity-70"
	// 				priority
	// 			/>
	// 			<Container className="relative z-10 flex flex-col gap-8 text-center">
	// 				<div className="bg-black/80 backdrop-blur-xl rounded-3xl p-10 md:p-12 max-w-3xl mx-auto text-white shadow-[0_0_60px_rgba(15,23,42,0.45)]">
	// 					<HeroContent />
	// 				</div>
	// 				<div className="bg-black/70 backdrop-blur-md rounded-3xl p-10 max-w-3xl mx-auto text-left">
	// 					<h2 className="text-3xl md:text-4xl font-semibold text-white mb-5">Based in Melbourne</h2>
	// 					<p className="text-lg md:text-xl text-white/90 leading-relaxed">
	// 						Data engineer & creative technologist building resilient platforms and expressive interfaces across Australia and beyond.
	// 					</p>
	// 				</div>
	// 				<div className="space-y-6 text-left text-base">
	// 					{timelineSections.map((section) => (
	// 						<div key={section.id} className="rounded-3xl border border-white/15 bg-black/70 p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
	// 							<p className="text-xs uppercase tracking-[0.3em] text-white/50">{section.location}</p>
	// 							<h3 className="mt-1 text-xl font-semibold">{section.label}</h3>
	// 							<ul className="mt-5 space-y-4 text-white/80">
	// 								{section.experiences.map((exp) => (
	// 									<li key={exp.title}>
	// 										<p className="font-semibold text-white">{exp.title}</p>
	// 										<p className="text-xs uppercase tracking-[0.3em] text-white/50">{exp.years}</p>
	// 										<p className="mt-1 text-sm">{exp.summary}</p>
	// 									</li>
	// 								))}
	// 							</ul>
	// 							</div>
	// 					))}
	// 				</div>
	// 			</Container>
	// 		</section>
	// 	);
	// }

	// Desktop: 3D globe with scroll animation
	return (
		<section ref={sectionRef} className="h-[600vh] w-full relative px-4 -mt-14 pt-14">
			<div className="sticky top-0 h-screen w-full">
				<div className="relative mx-auto h-full w-full bg-black overflow-hidden rounded-3xl">
                    <Canvas
                        camera={{ position: [0, 0, 0], fov: 45 }}
                        frameloop="demand"
						dpr={window.innerWidth < 768 ? [1, 1.2] : [1, 1.5]}
						gl={{
							antialias: window.innerWidth >= 768,
							powerPreference: "high-performance",
						}}
                        // onPointerDown={handlePointerDown}
                        // onPointerMove={handlePointerMove}
                        // onPointerUp={handlePointerUp}
                        // onPointerLeave={handlePointerUp}
                        // className="cursor-grab active:cursor-grabbing"
                    >
                        <Suspense fallback={null}>
                            <GlobeScene progress={scrollProgress} manualRotation={manualRotation} />
                        </Suspense>
                    </Canvas>
				</div>
				{/* Hero content that fades as you scroll */}
				<div
					className={`absolute inset-0 z-10 flex items-center justify-center px-4 transition-opacity ${heroInteractionClass}`}
					style={{ opacity: heroOpacity, transitionDuration: `${TRANSITION_MS}ms` }}
				>
					<Container className="max-w-3xl mx-auto text-white">
						<HeroContent />
					</Container>
				</div>
				{/* Vertical experience timeline (right side) */}
				<div className="pointer-events-none absolute inset-y-0 right-6 z-30 hidden lg:flex">
					<div className="relative w-[28rem]">
						<div
							className="absolute left-6 top-0 bottom-0 w-px bg-white/15 transition-opacity duration-500"
							style={{ opacity: timelineOpacity }}
						/>
						<div
							className="relative flex flex-col gap-8 pl-14 transition-opacity duration-500"
							style={{ opacity: timelineOpacity }}
						>
							{timelineEntries.map((entry, index) => {
								const progressAmount = cityProgress[entry.city] ?? 0;
								const reveal =
									entry.type === "header" ? clampValue(progressAmount * 1.2) : clampValue(progressAmount * entry.total - entry.index);
								return (
									<TimelineEntryRow
										key={entry.id}
										entry={entry}
										reveal={reveal}
										isLast={index === timelineEntries.length - 1}
										transitionDuration={TRANSITION_MS}
									/>
								);
							})}
						</div>
					</div>
				</div>
				{/* Overlay that appears on scroll */}
				<div
					className={`absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity ${
						showOverlay ? "opacity-100" : "opacity-0"
					}`}
					style={{ transitionDuration: `${TRANSITION_MS}ms` }}
				>
					<Container>
						<div className="bg-black/70 backdrop-blur-md rounded-lg p-8 md:p-12 max-w-xl mx-auto border border-white/10">
							<h2 className="text-3xl md:text-5xl font-semibold text-white mb-4 tracking-tight">Based in Melbourne</h2>
							<p className="text-lg md:text-xl text-white/90 leading-relaxed">
								I'm a data engineer and creative technologist focused on building resilient data platforms and expressive interfaces. My work
								spans streaming architectures, graph exploration, and modern web applications across Australia and beyond.
							</p>
							{/* <div className="mt-6 flex gap-4">
								<a
									href="#projects"
									className="text-sm font-medium text-white hover:text-white/80 transition-colors underline underline-offset-4"
								>
									View Projects →
								</a>
								<a
									href="/about"
									className="text-sm font-medium text-white hover:text-white/80 transition-colors underline underline-offset-4"
								>
									Learn More →
								</a>
							</div> */}
						</div>
					</Container>
				</div>

				{/* Scroll indicator (shows at start) */}
				<div
					className={`absolute bottom-32 left-1/2 -translate-x-1/2 text-white/60 text-m transition-opacity ${
						scrollProgress > 0.1 ? "opacity-0" : "opacity-100"
					}`}
					style={{ transitionDuration: `${TRANSITION_MS}ms` }}
				>
					<div className="flex flex-col items-center gap-2">
						<span>Scroll to explore</span>
						<svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
						</svg>
					</div>
				</div>
			</div>
		</section>
	);
}

type TimelineEntryRowProps = {
	entry: TimelineEntry;
	reveal: number;
	isLast: boolean;
	transitionDuration: number;
};

function TimelineEntryRow({ entry, reveal, isLast, transitionDuration }: TimelineEntryRowProps) {
	const accent = entry.accent;
	return (
		<div
			className="relative pl-14"
			style={{
				opacity: reveal,
				transform: `translateX(${(1 - reveal) * 20}px)`,
				transitionDuration: `${transitionDuration}ms`,
			}}
		>
			<span
				className="pointer-events-none absolute top-2 h-3.5 w-3.5 rounded-full border-2"
				style={{
					left: "0.5rem",
					borderColor: accent,
					background: entry.type === "header" || reveal > 0.6 ? accent : "transparent",
					boxShadow: reveal > 0.6 ? `0 0 10px ${accent}` : undefined,
					transitionDuration: `${transitionDuration}ms`,
				}}
			/>
			{!isLast ? (
					<span
						className="pointer-events-none absolute w-px bg-white/20"
						style={{
							left: "0.75rem",
							top: "1.75rem",
							height: "calc(100% + 24px)",
							opacity: Math.max(reveal, 0.1),
						transitionDuration: `${transitionDuration}ms`,
					}}
				/>
			) : null}
			<div className="pl-4 text-white">
				{entry.type === "header" ? (
					<div className="space-y-1">
						<p className="text-xs uppercase tracking-[0.3em] text-white/60">{entry.location}</p>
						<p className="text-sm font-semibold">{entry.label}</p>
					</div>
				) : (
					<div className="pb-4 space-y-1 text-xs text-white/70">
						<p className="text-sm font-semibold text-white">{entry.experience.title}</p>
						<p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/60">{entry.experience.years}</p>
						<p>{entry.experience.summary}</p>
					</div>
				)}
			</div>
		</div>
	);
}
