import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Header } from ".";

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});

jest.mock("next-auth/react", () => {
  return {
    useSession() {
      return {
        data: {
          expires: "fake-expires",
        },
      };
    },
  };
});

describe("ActiveLink component", () => {
  it("renders correctly", () => {
    render(<Header />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Posts")).toBeInTheDocument();
  });
});
