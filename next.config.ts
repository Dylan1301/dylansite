import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
	// You can add remark/rehype plugins here later if needed
});

const nextConfig: NextConfig = {
	pageExtensions: ["ts", "tsx", "md", "mdx"],
};

export default withMDX(nextConfig);
