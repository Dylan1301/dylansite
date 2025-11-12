import Link from "next/link";
import { Container } from "@/components/Container";

export function Navbar() {
	return (
		<header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
			<Container className="flex h-14 items-center justify-between">
				<Link href="/" className="font-semibold tracking-tight" aria-label="Go to homepage">
					Dylan Nguyen
				</Link>
				<nav aria-label="Primary">
					<ul className="flex gap-4 text-sm">
						<li>
							<Link href="/projects" className="hover:underline underline-offset-4">
								Projects
							</Link>
						</li>
						<li>
							<Link href="/writing" className="hover:underline underline-offset-4">
								Writing
							</Link>
						</li>
						<li>
							<Link href="/about" className="hover:underline underline-offset-4">
								About
							</Link>
						</li>
						<li>
							<Link href="/contact" className="hover:underline underline-offset-4">
								Contact
							</Link>
						</li>
						<li>
							<Link href="/resume" className="hover:underline underline-offset-4">
								Resume
							</Link>
						</li>
					</ul>
				</nav>
			</Container>
		</header>
	);
}


