import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		template: "%s | Dylan Nguyen",
		default: "Dylan Nguyen",
	},
	description: "Data engineer & creative technologist in Melbourne.",
	openGraph: {
		type: "website",
		locale: "en_AU",
		siteName: "Dylan Nguyen",
		images: [
			{
				url: "/og.png",
				width: 1200,
				height: 630,
				alt: "Dylan Nguyen",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
	},
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"),
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<body className={`${inter.variable} antialiased`}>
				<Navbar />
				<main className="min-h-[50vh]">{children}</main>
				<Footer />
				<Analytics />
			</body>
		</html>
	);
}
