import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
	children: ReactNode;
	className?: string;
	title?: string;
	ariaLabel?: string;
};

export function Section({ children, className, title, ariaLabel }: SectionProps) {
	return (
		<section className={cn("py-12 md:py-16", className)} aria-label={ariaLabel ?? title}>
			{title ? <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">{title}</h2> : null}
			{children}
		</section>
	);
}


