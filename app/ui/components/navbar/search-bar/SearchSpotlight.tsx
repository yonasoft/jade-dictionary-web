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
import React, { Suspense, lazy, memo, useEffect, useState } from "react";
import { Spotlight, spotlight } from "@mantine/spotlight";
import { searchWords } from "@/app/lib/firebase/storage/words";
import WordResult from "../../word-components/word-result/WordResult";
import {
  Firestore,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { handleKeyPress } from "@/app/lib/utils/events";
import NothingFound from "../../results/nothing-found/NothingFound";
import { performAddWordToList } from "@/app/lib/utils/lists";
import { Word } from "@/app/lib/types/word";

const WordSearchResults = lazy(
  () => import("../../results/word-search-results/WordSearchResults")
);

type Props = {
  query: string;
  setQuery: (query: string) => void;
  results: Word[];
  onSearch: () => void;
  searched: boolean;
};

const SearchSpotlight = ({
  query,
  setQuery,
  results,
  onSearch,
  searched,
}: Props) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { firestore, updateWordLists } = useFirebaseContext();
  useEffect(() => {
    const handleResize = () => {
      setIsFullScreen(window.innerHeight <= 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleKeyPressSearch = (event: React.KeyboardEvent) => {
    handleKeyPress(event, ["Enter", "Go", "Search", "ArrowRight"], () => {
      onSearch();
    });
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
          onKeyDown={handleKeyPressSearch}
          size="md"
        />
        <Button
          onClick={() => onSearch}
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

      {results.length > 0 && (
        <WordSearchResults
          results={results}
          query={query}
          searched={searched}
          onAddToWordList={performAddWordToList}
        />
      )}

      {results.length === 0 && searched && (
        <Center>
          <Spotlight.Empty>
            <NothingFound />
          </Spotlight.Empty>
        </Center>
      )}
    </Spotlight.Root>
  );
};

export default SearchSpotlight;
