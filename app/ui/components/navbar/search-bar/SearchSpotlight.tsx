"use client";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import {
  Accordion,
  ActionIcon,
  Button,
  Center,
  Grid,
  Group,
  Input,
  Loader,
  ScrollArea,
  Text,
} from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import React, { Suspense, memo, useEffect, useState } from "react";
import { Word } from "@/app/lib/definitions";
import { Spotlight, spotlight } from "@mantine/spotlight";
import { searchWords } from "@/app/lib/firebase/storage/words-storage";
import WordResult from "../../word-components/word-result/WordResult";

const Loading = () => (
  <Spotlight.Empty>
    <Center>
      <Loader color="green" />
    </Center>
  </Spotlight.Empty>
);

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
  results: Word[];
  performSearch: (query: string) => void;
  searched: boolean;
};

const SearchSpotlight = ({
  query,
  setQuery,
  results,
  performSearch,
  searched,
}: Props) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsFullScreen(window.innerHeight <= 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleEnterKeyPress = (event: React.KeyboardEvent) => {
    const keysToTriggerSearch = ["Enter", "Go", "Search", "ArrowRight"]; // Add other keys as needed
    if (keysToTriggerSearch.includes(event.key)) {
      performSearch(query);
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
        <Button
          onClick={() => performSearch(query)}
          variant="outline"
          className="me-3 shrink-0"
        >
          <IconSearch className="w-6 h-6" />
        </Button>

        {isFullScreen && (
          <ActionIcon variant="filled" onClick={() => spotlight.close()}>
            <IconX size={20} />
          </ActionIcon>
        )}
      </Group>

      {results.length > 0 && <Results results={results} query={query} />}

      {results.length === 0 && searched && (
        <Center>
          <NothingFound />
        </Center>
      )}
    </Spotlight.Root>
  );
};

export default SearchSpotlight;
