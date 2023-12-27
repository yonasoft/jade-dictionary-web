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
import SearchBar from "./ui/components/navbar/search-bar/NavSearchBar";
import { Word, WordList } from "./lib/definitions";
import { spotlight } from "@mantine/spotlight";
import HomeSearchBar from "./ui/components/home-search-bar/HomeSearchBar";
import { useFirebaseContext } from "./providers/FirebaseProvider";
import { searchWords } from "./lib/firebase/storage/words";
import {
  Firestore,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { performAddWordToList, performSearch } from "./lib/utils/words";
import { handleKeyPress } from "./lib/utils/events";
import Loading from "./ui/components/results/loading/Loading";
import WordSearchResults from "./ui/components/results/word-search-results/WordSearchResults";

//Only import the components that are needed
const WordSearchResultS = lazy(
  () => import("./ui/components/word-components/word-result/WordResult")
);

const Home = () => {
  const { firestore } = useFirebaseContext();
  const { colorScheme } = useMantineColorScheme();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Word[]>([]);
  const [searched, setSearched] = useState(false);
  const [titleColor, setTitleColor] = useState("black"); // default color

  useEffect(() => {
    setTitleColor(colorScheme === "dark" ? "black" : "white");
  }, [colorScheme]);

  useEffect(() => {
    // Load state from localStorage when the component mounts
    const loadedQuery = JSON.parse(sessionStorage.getItem("homeQuery") || "");
    const loadedResults = JSON.parse(
      sessionStorage.getItem("homeResults") || "[]"
    );

    if (loadedQuery.length > 0) setQuery(loadedQuery);

    if (loadedResults.length > 0) setResults(loadedResults);
  }, []);

  useEffect(() => {
    sessionStorage.setItem("homeQuery", JSON.stringify(query));
  }, [query]);

  useEffect(() => {
    sessionStorage.setItem("homeResults", JSON.stringify(results));
  }, [results]);

  const onSearch = () => {
    performSearch(firestore, query).then((results) => {
      setSearched(true);
      setResults(results);
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
                onSearch={onSearch}
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
