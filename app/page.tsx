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
  Paper,
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
  const { results, loading } = useDictionaryContext();
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const [query, setQuery] = useState("");

  return (
    <Container size="lg" className="my-8 mx-auto">
      <Paper shadow="md" p="lg" radius="md" className="mb-8">
        <BackgroundImage src="/image/jade-background.jpg" radius="lg">
          <Flex direction="column" className="p-8 text-center">
            <Title
              className={`text-${colorScheme === "dark" ? "white" : "black"}`}
            >
              Jade English-Chinese Dictionary
            </Title>
            <Center className="mt-5">
              <SearchBar
                outsideQuery={query}
                outsideSetQuery={setQuery}
                openSpotlight={false}
              />
            </Center>
          </Flex>
        </BackgroundImage>
      </Paper>

      {loading ? (
        <Loading />
      ) : results.length > 0 ? (
        <Grid>
          {results.map((word, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 4 }}>
              <Suspense fallback={<Loading />}>
                <WordResult word={word} query={query} />
              </Suspense>
            </Grid.Col>
          ))}
        </Grid>
      ) : (
        <NothingFound />
      )}
    </Container>
  );
};

export default Home;
