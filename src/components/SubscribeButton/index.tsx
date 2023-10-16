import { useSession, signIn } from "next-auth/react";
import styles from "./styles.module.scss";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import { useRouter } from "next/router";

interface SubscribeButtonProps {
  priceId: string;
}

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

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const session = useSession() as Session;
  const router = useRouter();

  async function handleSubscribe() {
    if (session.status == "unauthenticated") {
      signIn("github");
      return;
    }

    if (session?.data?.activeSubscription) {
      router.push("/posts");
      return;
    }

    try {
      const response = await api.post("/subscribe");
      const { sessionId } = response.data;
      const stripe = await getStripeJs();
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
