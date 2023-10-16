import { GetServerSideProps } from "next";
import { getSession, signIn, useSession } from "next-auth/react";
import { getPrismicClient } from "../../services/prismic";
import { RichText } from "prismic-dom";
import { PostsResult } from "../../types";
import Head from "next/head";
import styles from "./post.module.scss";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
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

export default function Post({ post }: PostProps) {
  const session = useSession() as Session;
  const router = useRouter();

  useEffect(() => {
    console.log("🚀 ~ file: [slug].tsx:36 ~ PostPreview ~ session:", session);

    if (session.status == "unauthenticated") {
      signIn("github");
    }

    if (!session?.data?.activeSubscription) {
      router.push(`/posts/preview/${post.slug}`);
    }
  }, [session]);

  useEffect(() => {
    console.log("pag do post completo");
  }, []);
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });
  console.log("🚀 ~ file: [slug].tsx:44 ~ session:", session);
  const { slug } = params;

  // if(!session?.activeSubscription){
  //     return{
  //       redirect: {
  //         destination: '/',
  //         permanent: false
  //       }
  //     }
  // }

  const prismic = getPrismicClient(req);

  const response: PostsResult = await prismic.getByUID(
    "publication",
    String(slug),
    {}
  );

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      "pr-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return {
    props: {
      post,
    },
  };
};
