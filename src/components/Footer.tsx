import { Container } from "@/components/Container";

const year = new Date().getFullYear();

export function Footer() {
	return (
		<footer className="border-t border-border py-8 mt-16 " role="contentinfo">
			<Container className="flex items-center justify-between text-sm text-muted-foreground">
				<p>© {year} Dylan Nguyen</p>
				<nav aria-label="Social">
					<ul className="flex gap-4">
						<li>
							<a className="hover:underline underline-offset-4" href="https://github.com/Dylan1301" target="_blank" rel="noopener noreferrer">
								GitHub
							</a>
						</li>
						<li>
							<a className="hover:underline underline-offset-4" href="https://www.linkedin.com/dylannguyen131" target="_blank" rel="noopener noreferrer">
								LinkedIn
							</a>
						</li>
						<li>
							<a className="hover:underline underline-offset-4" href="mailto:dylannguyen131@gmail.com">
								Email
							</a>
						</li>
					</ul>
				</nav>
			</Container>
		</footer>
	);
}


