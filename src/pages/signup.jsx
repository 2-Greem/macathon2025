import "../app/globals.css";
import Header from "@/components/header";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		// Basic validation
		if (!formData.name || !formData.email || !formData.password) {
			setError("Please fill in all required fields");
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (formData.password.length < 8) {
			setError("Password must be at least 8 characters long");
			return;
		}

		setIsLoading(true);

		// Simulate API call
		try {
			// Replace with actual registration logic
			await new Promise((resolve) => setTimeout(resolve, 1500));
			console.log("Signup attempt with:", formData);
			// Redirect to home page after successful signup
			window.location.href = "/";
		} catch (err) {
			setError("Failed to create account. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-zinc-900 flex flex-col">
			<Header />
			<div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
				<div className="w-full max-w-md">
					<div className="bg-zinc-800 rounded-lg shadow-xl p-8 border border-orange-500/20">
						<h1 className="text-2xl font-bold text-orange-500 mb-6 text-center">
							Create Account
						</h1>

						{error && (
							<div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-md mb-6">
								{error}
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-5">
							<div>
								<label
									htmlFor="name"
									className="block text-sm font-medium text-orange-400 mb-1"
								>
									Name
								</label>
								<input
									id="name"
									name="name"
									type="text"
									value={formData.name}
									onChange={handleChange}
									className="w-full px-4 py-2 bg-zinc-700 text-white rounded-md border border-orange-500/30 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
									placeholder="Your name"
									required
								/>
							</div>

							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-orange-400 mb-1"
								>
									Email
								</label>
								<input
									id="email"
									name="email"
									type="email"
									value={formData.email}
									onChange={handleChange}
									className="w-full px-4 py-2 bg-zinc-700 text-white rounded-md border border-orange-500/30 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
									placeholder="your@email.com"
									required
								/>
							</div>

							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-orange-400 mb-1"
								>
									Password
								</label>
								<div className="relative">
									<input
										id="password"
										name="password"
										type={
											showPassword ? "text" : "password"
										}
										value={formData.password}
										onChange={handleChange}
										className="w-full px-4 py-2 bg-zinc-700 text-white rounded-md border border-orange-500/30 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
										placeholder="••••••••"
										required
									/>
									<button
										type="button"
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-tan-300 hover:text-orange-400"
										aria-label={
											showPassword
												? "Hide password"
												: "Show password"
										}
									>
										{showPassword ? (
											<EyeOff size={18} />
										) : (
											<Eye size={18} />
										)}
									</button>
								</div>
								<p className="mt-1 text-xs text-tan-300">
									Must be at least 8 characters long
								</p>
							</div>

							<div>
								<label
									htmlFor="confirmPassword"
									className="block text-sm font-medium text-orange-400 mb-1"
								>
									Confirm Password
								</label>
								<input
									id="confirmPassword"
									name="confirmPassword"
									type={showPassword ? "text" : "password"}
									value={formData.confirmPassword}
									onChange={handleChange}
									className="w-full px-4 py-2 bg-zinc-700 text-white rounded-md border border-orange-500/30 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
									placeholder="••••••••"
									required
								/>
							</div>

							<div>
								<button
									type="submit"
									disabled={isLoading}
									className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-zinc-900 font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
								>
									{isLoading ? (
										<>
											<svg
												className="animate-spin -ml-1 mr-2 h-4 w-4 text-zinc-900"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											Creating account...
										</>
									) : (
										"Create account"
									)}
								</button>
							</div>
						</form>

						<div className="mt-6 text-center">
							<p className="text-tan-300">
								Already have an account?{" "}
								<Link
									href="/login"
									className="text-orange-400 hover:text-orange-300 font-medium"
								>
									Sign in
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
