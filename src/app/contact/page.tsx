import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
	title: "Contact",
};

export default function ContactPage() {
	return (
		<div>
			<Container>
				<Section title="Contact">
					<ContactForm />
					<p className="mt-6 text-sm text-muted-foreground">
						Prefer email?{" "}
						<a className="underline underline-offset-4" href="mailto:hello@example.com">
							hello@example.com
						</a>
					</p>
					{/* TODO: Add server action or API route to handle form submissions */}
				</Section>
			</Container>
		</div>
	);
}


