import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import "@testing-library/jest-dom";
import { SignInButton } from ".";

jest.mock("next-auth/react");

describe("ActiveLink component", () => {
  it("renders correctly when user is not authenticated", () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: {
        expires: "fake-expires",
      },
      status: "unauthenticated",
    } as any);
    render(<SignInButton />);

    expect(screen.getByText("Sign in with Github")).toBeInTheDocument();
  });

  it("renders correctly when user is authenticated", () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: {
        session: {
          user: { name: "John Doe", email: "john.doe@example.com" },
        },
        expires: "fake-expires",
      },
      status: "authenticated",
    } as any);

    const { debug } = render(<SignInButton />);
    debug();

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
