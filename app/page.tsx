"use client";
import { Suspense, lazy, memo, useEffect, useMemo, useState } from "react";
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
import SearchBar from "./ui/components/navbar/components/nav-search-bar/NavSearchBar";
import { spotlight } from "@mantine/spotlight";
import HomeSearchBar from "./components/home-search-bar/HomeSearchBar";
import { useFirebaseContext } from "./providers/FirebaseProvider";
import { searchWords } from "./lib/firebase/storage/words";
import {
  Firestore,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { handleKeyPress } from "./lib/utils/events";
import Loading from "./ui/components/results/loading/Loading";
import { Word } from "./lib/types/word";
import { performSearch } from "./lib/utils/dictionary";
import { performAddWordToList } from "./lib/utils/lists";
import useHomeSessions from "./hooks/useHomeSessions";
import useHome from "./hooks/useHomeSessions";

//Only import the components that are needed
const WordSearchResults = lazy(
  () => import("./ui/components/results/word-search-results/WordSearchResults")
);

const Home = () => {
  const { colorScheme } = useMantineColorScheme();
  const [titleColor, setTitleColor] = useState("black");
  const {
    query,
    setQuery,
    results,
    onSearch,
    searched,
    loadSessions,
    saveQuerySession,
    saveResultSession,
  } = useHome();

  useEffect(() => {
    setTitleColor(colorScheme === "dark" ? "black" : "white");
  }, [colorScheme]);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    saveQuerySession();
  }, [query]);

  useEffect(() => {
    saveResultSession();
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
