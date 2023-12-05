"use client";
import { searchWords } from "@/app/lib/firebase/words-storage";
import { useDictionaryContext } from "@/app/providers/DictionaryProvider";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import {
  Accordion,
  Button,
  Center,
  Group,
  ScrollArea,
  Text,
} from "@mantine/core";
import { Spotlight, SpotlightAction } from "@mantine/spotlight";
import { setQuery } from "@mantine/spotlight/lib/spotlight.store";
import { IconSearch } from "@tabler/icons-react";
import React from "react";
import WordResult from "../../../word-result/WordResult";

type Props = {};

const SearchSpotlight = (props: Props) => {
  const dictionary = useDictionaryContext();

  const onSearch = async () => {
    dictionary.performSearch(dictionary.query);
  };

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
      onQueryChange={(query: string) => {
        dictionary.setQuery(query);
      }}
      closeOnClickOutside
      closeOnEscape
      scrollable
    >
      <Group style={{ display: "flex", width: "100%", alignItems: "stretch" }}>
        <Spotlight.Search
          style={{ flexGrow: 1 }}
          placeholder="Search via English, Pinyin, or Chinese..."
          onKeyDown={(event: React.KeyboardEvent) => {
            if (event.key === "Enter") {
              onSearch();
            }
          }}
          rightSection={
            <div
              onClick={() => {
                console.log("Search icon clicked");
                onSearch();
              }}
              style={{ cursor: "pointer" }}
            >
              <IconSearch size={16} />
            </div>
          }
        />
      </Group>

      <Spotlight.Action>
        {dictionary.loading == true
          ? showloading()
          : dictionary.results.length > 0
          ? showResults()
          : showNothingFound()}
      </Spotlight.Action>
    </Spotlight.Root>
  );
};

export default SearchSpotlight;
