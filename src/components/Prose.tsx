import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ProseProps = {
	children: ReactNode;
	className?: string;
};

export function Prose({ children, className }: ProseProps) {
	return <div className={cn("mdx-prose", className)}>{children}</div>;
}


