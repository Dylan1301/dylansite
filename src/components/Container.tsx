import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
	children: ReactNode;
	className?: string;
};

export function Container({ children, className }: ContainerProps) {
	return <div className={cn("mx-auto max-w-3xl px-6 md:px-8", className)}>{children}</div>;
}


