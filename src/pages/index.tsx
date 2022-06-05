import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <>
      <h1 className="text-3xl font-bold underline">
        Hello world from Docker! </h1>
      <div>
        <Link href="/public"><a>Go to public page.</a></Link>
      </div>
      <div>
        <Link href="/board/JwFVwo9pJLWN1TfNoHW3"><a>Go to board page.</a></Link>
      </div>
    </>
  );
};

export default Home;
