"use client";
import { searchWords } from "@/app/lib/firebase/storage/words-storage";
import { useDictionaryContext } from "@/app/providers/DictionaryProvider";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import {
  Accordion,
  ActionIcon,
  Button,
  Center,
  Group,
  Input,
  ScrollArea,
  Text,
} from "@mantine/core";
import { setQuery } from "@mantine/spotlight/lib/spotlight.store";
import { IconSearch, IconX } from "@tabler/icons-react";
import React, { Suspense, memo, useEffect, useState } from "react";
import WordResult from "../../word-result/WordResult";
import { Word } from "@/app/lib/definitions";
import { Spotlight, spotlight } from "@mantine/spotlight";

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
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Check if window height is less than or equal to a certain threshold (e.g., 600 pixels)
      setIsFullScreen(window.innerHeight <= 640);
    };

    // Set initial value based on current window height
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      fullScreen={isFullScreen} // Apply conditional fullScreen
      centered
    >
      <Group className="top-0 px-4 py-2">
        <Input
          className="flex-grow ms-3"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder="Search via English, Pinyin, or Chinese..."
          onKeyDown={handleEnterKeyPress}
          size="md"
        />
        <Button onClick={onSearch} variant="outline" className="me-3 shrink-0">
          <IconSearch className="w-6 h-6" />
        </Button>

        {isFullScreen && (
          <ActionIcon variant="outline" onClick={() => spotlight.close()}>
            <IconX size={20} />
          </ActionIcon>
        )}
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
