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
import React, { Suspense, memo, useEffect, useState } from "react";
import WordResult from "../word-result/WordResult";
import { Word } from "@/app/lib/definitions";

const Loading = () => {
  return (
    <Spotlight.Empty>
      <Center>
        <Text size="xl">Loading...</Text>
      </Center>
    </Spotlight.Empty>
  );
};

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

const NothingFound = () => {
  return (
    <Spotlight.Empty>
      <Center>
        <Text size="xl">Nothing found...</Text>
      </Center>
    </Spotlight.Empty>
  );
};

type Props = {
  query: string;
  setQuery: (query: string) => void;
};

const SearchSpotlight = ({ query, setQuery }: Props) => {
  const { performSearch, results, loading } = useDictionaryContext();

  const onSearch = async () => {
    performSearch(query);
  };

  const handleEnterKeyPress = (event: React.KeyboardEvent) => {
    const keysToTriggerSearch = ["Enter", "Go", "Search", "ArrowRight"]; // Add other keys as needed
    if (keysToTriggerSearch.includes(event.key)) {
      onSearch();
    }
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

      {loading == true ? (
        <Loading />
      ) : results.length > 0 ? (
        <Results results={results} query={query} />
      ) : (
        <NothingFound />
      )}
    </Spotlight.Root>
  );
};

export default SearchSpotlight;
