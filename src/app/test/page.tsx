import { Metadata } from "next";
import { GlobeSection } from "@/components/globe/GlobeSection";

export const metadata: Metadata = {
	title: "Test",
};

export default function TestPage() {
	return (
		<div>
			<GlobeSection />
		</div>
	);
}


