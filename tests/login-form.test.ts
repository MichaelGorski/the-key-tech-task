// import { expect, test } from "bun:test";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import { MockedProvider } from "@apollo/client/testing";
// import { LOGIN_MUTATION } from "~/lib/graphql/mutations/auth/login";
// import { useRouter } from "next/router";

// jest.mock("next/router", () => ({
// 	useRouter: jest.fn(),
// }));

// const mocks = [
// 	{
// 		request: {
// 			query: LOGIN_MUTATION,
// 			variables: {
// 				email: "editor.staging@example.com",
// 				password: "HtxbYgJfB1ysRCEDX6b2",
// 			},
// 		},
// 		result: {
// 			data: {
// 				Auth: {
// 					loginJwt: {
// 						loginResult: {
// 							jwtTokens: {
// 								accessToken: "validToken",
// 							},
// 						},
// 					},
// 				},
// 			},
// 		},
// 	},
// ];

// const failedMocks = [
// 	{
// 		request: {
// 			query: LOGIN_MUTATION,
// 			variables: {
// 				email: "editor.staging@example.com",
// 				password: "wrongPassword",
// 			},
// 		},
// 		error: new Error("Invalid credentials"),
// 	},
// ];

// describe("<LoginForm />", () => {
// 	const mockReplace = jest.fn();

// 	beforeEach(() => {
// 		(useRouter as jest.Mock).mockReturnValue({
// 			replace: mockReplace,
// 		});

// 		localStorage.clear();
// 	});

// 	afterEach(() => {
// 		jest.clearAllMocks();
// 	});

// 	it("login and navigate to home", async () => {
// 		render(
// 			<MockedProvider mocks={mocks} addTypename={false}>
// 				<LoginForm />
// 			</MockedProvider>,
// 		);

// 		const emailInput = screen.getByLabelText(/email/i);
// 		const passwordInput = screen.getByLabelText(/password/i);
// 		const submitButton = screen.getByRole("button", { name: /sign in/i });

// 		fireEvent.change(emailInput, {
// 			target: { value: "editor.staging@example.com" },
// 		});
// 		fireEvent.change(passwordInput, {
// 			target: { value: "HtxbYgJfB1ysRCEDX6b2" },
// 		});

// 		fireEvent.click(submitButton);

// 		await waitFor(() => {
// 			expect(localStorage.getItem("auth_token")).toBe("validToken");
// 			expect(localStorage.getItem("user_email")).toBe(
// 				"editor.staging@example.com",
// 			);
// 			expect(mockReplace).toHaveBeenCalledWith("/home");
// 		});
// 	});

// 	it("shows an error message for invalid login", async () => {
// 		render(
// 			<MockedProvider mocks={failedMocks} addTypename={false}>
// 				<LoginForm />
// 			</MockedProvider>,
// 		);
// });
