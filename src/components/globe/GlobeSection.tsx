"use client";

import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import { GlobeScene } from "./GlobeScene";
import Image from "next/image";
import { Container } from "@/components/Container";

export function GlobeSection() {
	const [scrollProgress, setScrollProgress] = useState(0);
	const [isMobile, setIsMobile] = useState(false);
	const [mounted, setMounted] = useState(false);

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

	// Show overlay when scroll progress > 0.75
	const showOverlay = scrollProgress > 0.75;

	// Don't render anything until mounted (avoid hydration mismatch)
	if (!mounted) {
		return (
			<section className="h-screen w-full bg-black relative flex items-center justify-center">
				<div className="text-white">Loading...</div>
			</section>
		);
	}

	// Mobile fallback: static image
	if (isMobile) {
		return (
			<section className="h-screen w-full bg-black relative flex items-center justify-center overflow-hidden">
				<Image
					src="/images/globe_fallback.svg"
					alt="Earth globe view focusing on Australia"
					fill
					className="object-cover opacity-70"
					priority
				/>
				<Container className="relative z-10 text-center">
					<div className="bg-black/60 backdrop-blur-sm rounded-lg p-8 max-w-2xl mx-auto">
						<h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">Based in Melbourne</h2>
						<p className="text-lg text-white/90">
							Data engineer & creative technologist building resilient platforms and expressive interfaces across Australia and beyond.
						</p>
					</div>
				</Container>
			</section>
		);
	}

	// Desktop: 3D globe with scroll animation
	return (
		<section className="h-[200vh] w-full relative">
			<div className="sticky top-0 h-screen w-full bg-black">
				<Canvas
					camera={{ position: [0, 0, 5], fov: 45 }}
					dpr={[1, 1.5]} // Cap device pixel ratio for performance
					gl={{ antialias: true, alpha: false }}
				>
					<Suspense fallback={null}>
						<ScrollControls pages={3} damping={0.2}>
							<GlobeScene onScrollProgress={setScrollProgress} />
						</ScrollControls>
					</Suspense>
				</Canvas>

				{/* Overlay that appears on scroll */}
				<div
					className={`absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-700 ${
						showOverlay ? "opacity-100" : "opacity-0"
					}`}
				>
					<Container>
						<div className="bg-black/70 backdrop-blur-md rounded-lg p-8 md:p-12 max-w-3xl mx-auto border border-white/10">
							<h2 className="text-3xl md:text-5xl font-semibold text-white mb-4 tracking-tight">Based in Melbourne</h2>
							<p className="text-lg md:text-xl text-white/90 leading-relaxed">
								I'm a data engineer and creative technologist focused on building resilient data platforms and expressive interfaces. My work
								spans streaming architectures, graph exploration, and modern web applications across Australia and beyond.
							</p>
							<div className="mt-6 flex gap-4">
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
							</div>
						</div>
					</Container>
				</div>

				{/* Scroll indicator (shows at start) */}
				<div
					className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm transition-opacity duration-500 ${
						scrollProgress > 0.1 ? "opacity-0" : "opacity-100"
					}`}
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

