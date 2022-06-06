import { Box, Flex, Text } from '@chakra-ui/react';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import gfm from 'remark-gfm';
import { z } from 'zod';
import { adminDB } from 'firebase/server';
import { githubMarkdownCss } from 'pages/board/github-markdown';

const timestampScheme = z.object({
  _seconds: z.number(),
  _nanoseconds: z.number(),
});

const boardScheme = z.object({
  id: z.string(),
  cardSize: z.number(),
  name: z.string(),
  order: z.array(z.string()),
  owner: z.string(),
  ownerName: z.string(),
  updatedAt: timestampScheme,
});

const cardScheme = z.object({
  id: z.string(),
  color: z.string(),
  createdAt: timestampScheme,
  createdBy: z.string(),
  mdStr: z.string(),
  previewEnabled: z.boolean(),
  starred: z.boolean(),
  title: z.string(),
  updatedAt: timestampScheme,
  updatedBy: z.string(),
});

interface Props {
  board: z.infer<typeof boardScheme>;
  cards: Array<z.infer<typeof cardScheme>>;
}

const Board: NextPage<Props> = ({ board, cards }) => {
  return (
    <>
      <Flex align="center" justify="space-between" px={5} h={10}>
        <Text fontWeight="bold">{board.name}</Text>
        <Link href="/">
          <a>Go to top page</a>
        </Link>
      </Flex>
      <Box h={10} />
      <Flex align="center" justify="space-evenly" wrap="wrap" px={5} h={10} gap={10}>
        {cards.map((card) => (
          <Box key={card.id} css={githubMarkdownCss} w={96} h={96}>
            <Box className="markdown-body" p={3} h="100%" overflow="auto" rounded="xl">
              <ReactMarkdown remarkPlugins={[gfm, remarkBreaks]}>{card.mdStr}</ReactMarkdown>
            </Box>
          </Box>
        ))}
      </Flex>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const boardQuerySnap = await adminDB.collection(`public`).get();
  const ids = boardQuerySnap.docs.map((doc) => ({ params: { id: doc.id } }));

  return {
    paths: ids,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  // TODO: consider undefined
  const id = params?.id;

  const [boardDocSnap, cardQuerySnap] = await Promise.all([
    adminDB.doc(`public/${id}`).get(),
    adminDB.collection(`public/${id}/publicCards`).get(),
  ]);

  const board = boardScheme.parse({ id, ...boardDocSnap.data() });

  const cards = cardQuerySnap.docs.map((doc) => cardScheme.parse({ id: doc.id, ...doc.data() }));

  return {
    props: { board, cards },
    revalidate: 20,
  };
};

export default Board;
