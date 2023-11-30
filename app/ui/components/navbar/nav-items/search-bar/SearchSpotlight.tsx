"use client";
import {} from "@/app/lib/firebase/words-storage";
import { useDictionaryContext } from "@/app/providers/DictionaryProvider";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import { Accordion, Center, Text } from "@mantine/core";
import { Spotlight, SpotlightAction } from "@mantine/spotlight";
import { setQuery } from "@mantine/spotlight/lib/spotlight.store";
import { IconSearch } from "@tabler/icons-react";
import React from "react";
import WordResult from "../../../word-result/WordResult";

type Props = {};

const SearchSpotlight = (props: Props) => {
  const dictionary = useDictionaryContext();
  const firebase = useFirebaseContext();

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
    return (
      <Accordion>
        {dictionary.results.map((word) => {
          return <WordResult word={word} query={dictionary.query} />;
        })}
      </Accordion>
    );
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
      onQueryChange={dictionary.setQuery}
      closeOnClickOutside
      closeOnEscape
      scrollable
    >
      <Spotlight.Search
        className="sticky"
        placeholder="Search via English, Pinyin, or Chinese..."
        rightSection={
          <IconSearch
            stroke={1.5}
            onClick={() => {
              dictionary.performSearch();
            }}
          />
        }
      />

      <Spotlight.ActionsList>
        {dictionary.loading == true
          ? showloading()
          : dictionary.results.length > 0
          ? showResults()
          : showNothingFound()}
      </Spotlight.ActionsList>
    </Spotlight.Root>
  );
};

export default SearchSpotlight;
