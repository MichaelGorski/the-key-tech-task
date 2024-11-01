import { useState } from "react";

export const LoginForm = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log("Username:", username);
		console.log("Password:", password);
	};

	// todo - add login logic
	return (
		<form>
			<div className="sm:col-span-4">
				<label
					for="username"
					className="block text-sm/6 font-medium text-gray-900"
				>
					Username
				</label>
				<div className="mt-2">
					<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
						<span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
							workcation.com/
						</span>
						<input
							type="text"
							name="username"
							id="username"
							autocomplete="username"
							className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6"
							placeholder="janesmith"
						/>
					</div>
				</div>
			</div>
		</form>
	);
};
