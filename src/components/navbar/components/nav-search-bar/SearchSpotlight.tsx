"use client";
import { ActionIcon, Button, Center, Group, Input } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import React, { lazy, useEffect, useState } from "react";
import { Spotlight, spotlight } from "@mantine/spotlight";

import NothingFound from "../../../results/nothing-found/NothingFound";
import { Word } from "@/src/lib/types/word";
import { handleKeyPress } from "@/src/lib/utils/events";
import { performAddWordToList } from "@/src/lib/utils/lists";
import ChineseInput from "@/src/components/chinese-input/ChineseInput";

const WordSearchResults = lazy(
  () => import("../../../results/word-search-results/WordSearchResults")
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
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsFullScreen(window.innerHeight <= 520);
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

  const handleBlur = () => {
    setShowKeyboard(false);
  };

  const handleFocus = () => {
    setShowKeyboard(true);
  };

  return (
    <>
      <Spotlight.Root
        zIndex={20}
        closeOnEscape
        withinPortal
        closeOnClickOutside
        scrollable
        fullScreen={isFullScreen} // Apply conditional fullScreen
        centered
      >
        <Group className="top-0 px-4 py-2 " wrap="nowrap">
          <Input
            className="flex-grow ms-3"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search via English, Pinyin, or Chinese..."
            onKeyDown={handleKeyPressSearch}
            onFocus={handleFocus}
            onBlur={() => {
              handleBlur();
              setReadOnly(false);
            }}
            readOnly={readOnly}
            size="md"
          />
          <Button
            onClick={() => {
              onSearch();
            }}
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
          <Spotlight.ActionsList>
            <WordSearchResults
              results={results}
              query={query}
              searched={searched}
              onAddToWordList={performAddWordToList}
            />
          </Spotlight.ActionsList>
        )}

        {results.length === 0 && searched && (
          <Center>
            <Spotlight.Empty>
              <NothingFound />
            </Spotlight.Empty>
          </Center>
        )}
      </Spotlight.Root>
      {showKeyboard && (
        <ChineseInput
          query={query}
          setQuery={setQuery}
          onClose={() => {
            setShowKeyboard(false);
          }}
          setReadOnly={setReadOnly}
        />
      )}
    </>
  );
};

export default SearchSpotlight;
