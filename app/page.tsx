"use client";
import { Suspense, lazy, memo, useMemo, useState } from "react";
import {
  BackgroundImage,
  Box,
  Card,
  Center,
  Container,
  Flex,
  Grid,
  Loader,
  Paper,
  Text,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import SearchBar from "./ui/components/navbar/search-bar/NavSearchBar";
import { Word } from "./lib/definitions";
import { spotlight } from "@mantine/spotlight";
import HomeSearchBar from "./ui/components/home-search-bar/HomeSearchBar";
import { useFirebaseContext } from "./providers/FirebaseProvider";
import { searchWords } from "./lib/firebase/storage/words-storage";

//Only import the components that are needed
const WordResult = lazy(() => import("./ui/components/word-result/WordResult"));

const Loading = () => (
  <Center>
    <Loader color="green" />
  </Center>
);

const NothingFound = () => (
  <Center>
    <Text size="xl">Nothing found...</Text>
  </Center>
);

const Results = memo(
  ({ results, query }: { results: Word[]; query: string }) => (
    <Grid>
      {results.map((word, index) => (
        <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 4 }}>
          <Suspense fallback={<Loading />}>
            <WordResult word={word} query={query} />
          </Suspense>
        </Grid.Col>
      ))}
    </Grid>
  )
);

const Home = () => {
  const { firestore } = useFirebaseContext();
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Word[]>([]);
  const [searched, setSearched] = useState(false);

  const titleColor = useMemo(
    () => (colorScheme === "dark" ? theme.colors.dark[9] : theme.white),
    [colorScheme, theme]
  );

  const performSearch = async (input: string) => {
    return await searchWords(firestore, input)
      .then((words) => {
        console.log(words);
        setResults(words);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Container size="lg" className="my-8 mx-auto">
      <Paper shadow="md" p="lg" radius="md" className="mb-8">
        <BackgroundImage src="/image/jade-background.jpg" radius="lg">
          <Flex direction="column" className="p-8 text-center">
            <Title c={titleColor}>Jade English-Chinese Dictionary</Title>
            <Center className="mt-5">
              <HomeSearchBar
                query={query}
                setQuery={setQuery}
                performSearch={performSearch}
              />
            </Center>
          </Flex>
        </BackgroundImage>
      </Paper>

      {results.length > 0 && <Results results={results} query={query} />}
    </Container>
  );
};

export default Home;
