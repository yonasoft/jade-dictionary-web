"use client";
import {
  BackgroundImage,
  Box,
  Center,
  Container,
  Flex,
  ScrollArea,
  Text,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import Image from "next/image";
import SearchBar from "./ui/components/search-bar/SearchBar";
import WordResult from "./ui/components/word-result/WordResult";
import { Spotlight } from "@mantine/spotlight";
import { useDictionaryContext } from "./providers/DictionaryProvider";
import { useColorScheme } from "@mantine/hooks";

const Home = () => {
  const dictionary = useDictionaryContext();
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const titleColor =
    colorScheme === "dark" ? theme.colors.dark[9] : theme.white;

  const showloading = () => {
    return (
      <Center>
        <Text size="xl">Loading...</Text>
      </Center>
    );
  };

  const showResults = () => {
    return dictionary.results.map((word, index) => {
      return <WordResult key={index} word={word} query={dictionary.query} />;
    });
  };

  const showNothingFound = () => {
    return (
      <Center>
        <Text size="xl">Nothing found...</Text>
      </Center>
    );
  };

  return (
    <Container size="lg" className="relative">
      <Box h={250}>
        <BackgroundImage src="image/jade-background.jpg" radius="lg" h={250}>
          <Center p="md">
            <Flex direction="column">
              <Title c={titleColor}>Jade English-Chinese Dictionary</Title>
              <Center className="mt-5">
                <SearchBar
                  onSearch={async (query: string) => {
                    dictionary.performSearch(query);
                  }}
                />
              </Center>
            </Flex>
          </Center>
        </BackgroundImage>
      </Box>
      {dictionary.loading == true
        ? showloading()
        : dictionary.results.length > 0
        ? showResults()
        : showNothingFound()}
    </Container>
  );
};

export default Home;
