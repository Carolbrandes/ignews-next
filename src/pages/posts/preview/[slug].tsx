import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { getPrismicClient } from "../../../services/prismic";
import { RichText } from "prismic-dom";
import { PostsResult } from "../../../types";
import Head from "next/head";
import styles from "../post.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface PostPreviewProps {
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

export default function PostPreview({ post }: PostPreviewProps) {
  const session = useSession() as Session;
  console.log("🚀 ~ file: [slug].tsx:24 ~ PostPreview ~ session:", session);
  const router = useRouter();

  useEffect(() => {
    if (session?.data?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session]);
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
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">Subscribe now 🤭</Link>
          </div>
        </article>
      </main>
    </>
  );
}

//* No next podemos gerar:
// *paginas estaticas durante a build
// *gerar a página estatica no primeiro acesso
// *metade durante a build e a outra no primeiro acesso
// *no caso abaixo, vamos deixar o path vazio, pq queremos que seja gerado no primero acesso
// *para gerar no build, ficaria:
// export const getStaticPaths: GetStaticPaths = () => {
//   return {
//     paths: [{params: {slug: 'boas-praticas-para-freelancer-em-programacao'}}],
//     fallback: "blocking",
//   };
// };
// * O getStaticPaths só existe em pagina que tem parametros dinamicos [algo].tsx
// *fallback:
// *true: se alguem tentar acessar um post que ainda nao foi gerado de forma estatica, carregar pelo client (browser). tem quebra de layout, fica em branco e depois carrega e prejudica o seo
// *false: se alguem tentar acessar um post que ainda nao foi gerado de forma estatica, ele vem como 404
// *blocking: se alguem tentar acessar um post que ainda nao foi gerado de forma estatica, ele vai carregar usando server side rendering

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response: PostsResult = await prismic.getByUID(
    "publication",
    String(slug),
    {}
  );

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)), //*pega os 3 primeiros paragrafos
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
    redirect: 60 * 30, //* 30minutos
  };
};
