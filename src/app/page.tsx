"use client";
import { lazy, useEffect } from "react";
import {
  BackgroundImage,
  Center,
  Container,
  Flex,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import HomeSearchBar from "../components/home-search-bar/HomeSearchBar";
import useHome from "../hooks/useHome";
import { performAddWordToList } from "../lib/utils/lists";
const WordSearchResults = lazy(
  () => import("../components/results/word-search-results/WordSearchResults")
);


const Home = () => {
  const {
    query,
    setQuery,
    results,
    setResults,
    onSearch,
    searched,
    titleColor,
    setTitleColor,
    colorScheme,
    loadHomeSessionStorage,
    saveQuery,
    saveResults,
  } = useHome();

  useEffect(() => {
    setTitleColor(colorScheme === "dark" ? "black" : "white");
  }, [colorScheme]);

  useEffect(() => {
    loadHomeSessionStorage();
  }, []);

  useEffect(() => {
    saveQuery();
  }, [query]);

  useEffect(() => {
    saveResults();
  }, [results]);

  return (
    <Container size="lg" className="my-8 mx-auto">
      <Paper shadow="md" p="lg" radius="md" className="mb-8">
        <BackgroundImage src="/image/jade-background.jpg" radius="lg">
          <Flex direction="column" className="p-8 text-center">
            <Title c={titleColor}>Jade English-Chinese Dictionary</Title>
            <Center className="mt-5 bg-transparent border-none">
              <HomeSearchBar
                query={query}
                setQuery={setQuery}
                onSearch={() => onSearch(query)}
              />
            </Center>
          </Flex>
        </BackgroundImage>
      </Paper>

      {results.length > 0 && (
        <WordSearchResults
          gridSpan={{ base: 12, sm: 6, lg: 4 }}
          searched={searched}
          results={results}
          query={query}
          onAddToWordList={performAddWordToList}
        />
      )}

      {results.length === 0 && searched && (
        <Center>
          <Text size="xl">Nothing found...</Text>
        </Center>
      )}
    </Container>
  );
};

export default Home;
