"use client";
import { searchSimplified } from "@/app/lib/firebase/words-storage";
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

  const results = dictionary.results.map((word) => {
    return (
      <WordResult
        word={word}
        query={dictionary.query}
        scriptType={dictionary.scriptType}
      ></WordResult>
    );
  });

  return (
    <Spotlight.Root
      query={dictionary.query}
      onQueryChange={dictionary.setQuery}
      closeOnClickOutside
      closeOnEscape
      scrollable
    >
      <Spotlight.Search
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
        {dictionary.results.length > 0 ? (
          <Accordion>{results}</Accordion>
        ) : (
          <Spotlight.Empty>
            <Center>
              <Text size="xl">Nothing found...</Text>
            </Center>
          </Spotlight.Empty>
        )}
      </Spotlight.ActionsList>
    </Spotlight.Root>
  );
};

export default SearchSpotlight;
