import "../app/globals.css";
import Header from "@/components/header";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/pages/api/functions";

export default function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!username || !password) {
			setError("Please fill in all fields");
			return;
		}

		setIsLoading(true);

		try {
			const res = await login(username, password);

			if (!res) {
				setError("Invalid username or password");
				return;
			} else {
				localStorage.setItem("username", username); // store the username in local storage
				window.location.href = "/";
			}
		} catch (err) {
			setError("Invalid username or password");
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
							Sign In
						</h1>

						{error && (
							<div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-md mb-6">
								{error}
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label
									htmlFor="username"
									className="block text-sm font-medium text-orange-400 mb-1"
								>
									Username
								</label>
								<input
									id="username"
									type="text"
									value={username}
									onChange={(e) =>
										setUsername(e.target.value)
									}
									className="w-full px-4 py-2 bg-zinc-700 text-white rounded-md border border-orange-500/30 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
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
										type={
											showPassword ? "text" : "password"
										}
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										className="w-full px-4 py-2 bg-zinc-700 text-white rounded-md border border-orange-500/30 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
										required
									/>
									<button
										type="button"
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-300 hover:text-orange-400"
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
											Signing in...
										</>
									) : (
										"Sign in"
									)}
								</button>
							</div>
						</form>

						<div className="mt-6 text-center">
							<p className="text-zinc-300">
								Dont have an account?{" "}
								<Link
									href="/signup"
									className="text-orange-400 hover:text-orange-300 font-medium"
								>
									Sign up
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
