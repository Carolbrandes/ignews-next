import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./styles.module.scss";

interface Session {
  data: {
    session: {
      user: {
        name: string;
        email: string;
        image: string;
      };
      expires: string;
    };
    token: {
      name: string;
      email: string;
      picture: string;
      sub: string;
      iat: number;
      exp: number;
      jti: string;
    };
    activeSubscription: any;
  };
  status: "authenticated" | "unauthenticated";
}

export function SignInButton() {
  const session = useSession() as Session;
  console.log("🚀 ~ file: index.tsx:8 ~ SignInButton ~ session:", session);

  return session.status == "authenticated" ? (
    <button
      className={styles.signInButton}
      type="button"
      onClick={() => signOut()}
    >
      <FaGithub color="#84d361" />
      {session?.data?.session?.user?.name}
      <FiX className={styles.closeIcon} color="#737380" />
    </button>
  ) : (
    <button
      className={styles.signInButton}
      type="button"
      onClick={() => signIn("github")}
    >
      <FaGithub color="#eba417" />
      Sign in with Github
    </button>
  );
}
