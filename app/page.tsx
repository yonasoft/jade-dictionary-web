"use client";
import { Suspense, lazy, memo, useMemo, useState } from "react";
import {
  BackgroundImage,
  Box,
  Center,
  Container,
  Flex,
  Text,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import SearchBar from "./ui/components/search-bar/SearchBar";
import { Word } from "./lib/definitions";
import { useDictionaryContext } from "./providers/DictionaryProvider";
import { spotlight } from "@mantine/spotlight";

//Only import the components that are needed
const WordResult = lazy(() => import("./ui/components/word-result/WordResult"));

const Loading = () => (
  <Center>
    <Text size="xl">Loading...</Text>
  </Center>
);

const NothingFound = () => (
  <Center>
    <Text size="xl">Nothing found...</Text>
  </Center>
);

const Results = memo(
  ({ results, query }: { results: Word[]; query: string }) => (
    <>
      {results.map((word, index) => (
        <Suspense key={index} fallback={<Loading />}>
          <WordResult word={word} query={query} />
        </Suspense>
      ))}
    </>
  )
);

const Home = () => {
  const { results, loading, performSearch } = useDictionaryContext();
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const [query, setQuery] = useState("");

  const titleColor = useMemo(
    () => (colorScheme === "dark" ? theme.colors.dark[9] : theme.white),
    [colorScheme, theme]
  );

  return (
    <Container size="lg" className="relative">
      <Box h={250}>
        <BackgroundImage src="/image/jade-background.jpg" radius="lg" h={250}>
          <Center p="md">
            <Flex direction="column">
              <Title c={titleColor}>Jade English-Chinese Dictionary</Title>
              <Center className="mt-5">
                <SearchBar
                  outsideQuery={query}
                  outsideSetQuery={setQuery}
                  openSpotlight={false}
                />
              </Center>
            </Flex>
          </Center>
        </BackgroundImage>
      </Box>
      {loading ? (
        <Loading />
      ) : results.length > 0 ? (
        <Results results={results} query={query} />
      ) : (
        <NothingFound />
      )}
    </Container>
  );
};

export default Home;
