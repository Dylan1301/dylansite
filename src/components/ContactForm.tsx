"use client";

import { useState } from "react";

export function ContactForm() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
	const [submitted, setSubmitted] = useState(false);

	function validate() {
		const e: typeof errors = {};
		if (!name.trim()) e.name = "Name is required";
		if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Valid email is required";
		if (!message.trim() || message.trim().length < 10) e.message = "Please write at least 10 characters";
		setErrors(e);
		return Object.keys(e).length === 0;
	}

	function onSubmit(ev: React.FormEvent) {
		ev.preventDefault();
		if (!validate()) return;
		// No server action configured yet. Consider adding one later.
		setSubmitted(true);
	}

	return (
		<form onSubmit={onSubmit} className="space-y-4 max-w-xl">
			<div>
				<label className="block text-sm font-medium mb-1" htmlFor="name">
					Name
				</label>
				<input
					id="name"
					name="name"
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="w-full rounded-md border px-3 py-2 text-sm"
					required
				/>
				{errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
			</div>
			<div>
				<label className="block text-sm font-medium mb-1" htmlFor="email">
					Email
				</label>
				<input
					id="email"
					name="email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="w-full rounded-md border px-3 py-2 text-sm"
					required
				/>
				{errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
			</div>
			<div>
				<label className="block text-sm font-medium mb-1" htmlFor="message">
					Message
				</label>
				<textarea
					id="message"
					name="message"
					rows={5}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					className="w-full rounded-md border px-3 py-2 text-sm"
					required
				/>
				{errors.message ? <p className="mt-1 text-xs text-red-600">{errors.message}</p> : null}
			</div>
			<div className="flex items-center gap-3">
				<button type="submit" className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium">
					Send
				</button>
				{submitted ? <span className="text-sm text-green-700">Thanks — we'll be in touch!</span> : null}
			</div>
		</form>
	);
}

