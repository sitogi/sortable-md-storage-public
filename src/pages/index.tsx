import { Flex, Heading } from '@chakra-ui/react';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <Flex h="100vh" w="100vw" align="center" justify="center" bg="blue.50">
      <Heading size="4xl">Hello Next.js! with docker compose</Heading>
    </Flex>
  );
};

export default Home;
