"use client";

import dynamic from "next/dynamic";

// Lazy-load GlobeSection with no SSR (client-only, WebGL)
const GlobeSection = dynamic(() => import("@/components/globe/GlobeSection").then((mod) => ({ default: mod.GlobeSection })), {
	ssr: false,
	loading: () => (
		<section className="h-screen w-full bg-black flex items-center justify-center">
			<div className="text-white text-sm">Loading globe...</div>
		</section>
	),
});

export function GlobeLoader() {
	return <GlobeSection />;
}

