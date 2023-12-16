"use client";
import { searchWords } from "@/app/lib/firebase/storage/words-storage";
import { useDictionaryContext } from "@/app/providers/DictionaryProvider";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import {
  Accordion,
  Button,
  Center,
  Group,
  Input,
  ScrollArea,
  Text,
} from "@mantine/core";
import { Spotlight, SpotlightAction } from "@mantine/spotlight";
import { setQuery } from "@mantine/spotlight/lib/spotlight.store";
import { IconSearch } from "@tabler/icons-react";
import React, { useState } from "react";
import WordResult from "../word-result/WordResult";

type Props = {};

const SearchSpotlight = (props: Props) => {
  const dictionary = useDictionaryContext();
  const [query, setQuery] = useState("");

  const onSearch = async () => {
    dictionary.setQuery(query);
    dictionary.performSearch(query);
  };

  const handleEnterKeyPress = (event: React.KeyboardEvent) => {
    const keysToTriggerSearch = ["Enter", "Go", "Search", "ArrowRight"]; // Add other keys as needed
    if (keysToTriggerSearch.includes(event.key)) {
      onSearch();
    }
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
      zIndex={2000}
      closeOnEscape
      withinPortal
      closeOnClickOutside
      scrollable
    >
      <Group className="sticky my-3 flex w-full items-center">
        <Input
          className="flex-grow ms-3"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder="Search via English, Pinyin, or Chinese..."
          onKeyDown={handleEnterKeyPress}
        />
        <Button
          onClick={onSearch}
          variant="outline"
          color="gray"
          className="me-3 shrink-0"
        >
          <IconSearch className="w-6 h-6" />
        </Button>
      </Group>

      {dictionary.loading == true
        ? showloading()
        : dictionary.results.length > 0
        ? showResults()
        : showNothingFound()}
    </Spotlight.Root>
  );
};

export default SearchSpotlight;
