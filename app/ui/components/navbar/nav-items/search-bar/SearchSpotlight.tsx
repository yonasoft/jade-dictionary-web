"use client";
import {} from "@/app/lib/firebase/words-storage";
import { useDictionaryContext } from "@/app/providers/DictionaryProvider";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import { Accordion, Center, ScrollArea, Text } from "@mantine/core";
import { Spotlight, SpotlightAction } from "@mantine/spotlight";
import { setQuery } from "@mantine/spotlight/lib/spotlight.store";
import { IconSearch } from "@tabler/icons-react";
import React from "react";
import WordResult from "../../../word-result/WordResult";

type Props = {};

const SearchSpotlight = (props: Props) => {
  const dictionary = useDictionaryContext();

  const showloading = () => {
    return (
      <Spotlight.Empty>
        <Center>
          <Text size="xl">Loading...</Text>
        </Center>
      </Spotlight.Empty>
    );
  };

  const showResults = () => {
    return dictionary.results.map((word, index) => {
      return <WordResult key={index} word={word} query={dictionary.query} />;
    });
  };

  const showNothingFound = () => {
    return (
      <Spotlight.Empty>
        <Center>
          <Text size="xl">Nothing found...</Text>
        </Center>
      </Spotlight.Empty>
    );
  };

  return (
    <Spotlight.Root
      query={dictionary.query}
      onQueryChange={(query) => {
        dictionary.setQuery(query);
        if (query.length > 0) {
          dictionary.performSearch(query);
        }
      }}
      closeOnClickOutside
      closeOnEscape
      scrollable
    >
      <Spotlight.Search
        className="sticky"
        placeholder="Search via English, Pinyin, or Chinese..."
        leftSection={<IconSearch stroke={1.5} />}
      />
      <ScrollArea>
        {dictionary.loading == true
          ? showloading()
          : dictionary.results.length > 0
          ? showResults()
          : showNothingFound()}
      </ScrollArea>
    </Spotlight.Root>
  );
};

export default SearchSpotlight;
