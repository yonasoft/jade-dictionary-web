"use client";
import { Button, Input } from "@mantine/core";
import React, { useEffect, useState } from "react";
import WordSearchResults from "../../../results/word-search-results/WordSearchResults";

import { useFirebaseContext } from "@/src/providers/FirebaseProvider";
import { IconSearch } from "@tabler/icons-react";
import { Word } from "@/src/lib/types/word";
import { performSearch } from "@/src/lib/utils/dictionary";
import { handleKeyPress } from "@/src/lib/utils/events";
import ChineseInput from "@/src/components/chinese-input/ChineseInput";
import { createPortal } from "react-dom";

type Props = {
  isWordInPractice: (word: Word) => boolean;
  addWordFromSearch: (word: Word) => Promise<void>;
};

const AddFromSearchTab = ({ isWordInPractice, addWordFromSearch }: Props) => {
  const { firestore } = useFirebaseContext();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Word[]>([]);
  const [searched, setSearched] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    // Set the container state to the existing HTML element
    const el = document.getElementById("chinese-input-root");
    setContainer(el);
  }, []); // Empty dependency array ensures this effect runs once after the initial render

  // Portal for ChineseInput
  const chineseInputPortal =
    showKeyboard && container
      ? createPortal(
          <ChineseInput
            query={query}
            setQuery={setQuery}
            onClose={() => {
              setShowKeyboard(false);
            }}
          setReadOnly={setReadOnly}
          />,
          container
        )
      : null;

  const onSearch = () => {
    performSearch(firestore, query).then((results) => {
      setSearched(true);
      setResults(results);
    });
  };

  const handleKeyPressSearch = (event: React.KeyboardEvent) => {
    handleKeyPress(event, ["Enter", "Go", "Search", "ArrowRight"], () => {
      onSearch();
    });
  };

  return (
    <>
      <div className="flex mt-3 mb-2">
        <Input
          className="flex-1"
          placeholder="Search Hanzi, English or Pinyin..."
          value={query}
          onFocus={() => {
            setShowKeyboard(true);
          }}
          onBlur={() => {
            setShowKeyboard(false);
            setReadOnly(false);
          }}
          onChange={(e) => {
            setQuery(e.currentTarget.value);
          }}
          onKeyUp={(event) => {
            handleKeyPressSearch(event);
          }}
          readOnly={readOnly}
        />
        <Button
          variant="filled"
          onClick={() => {
            onSearch();
          }}
        >
          <IconSearch />
        </Button>
      </div>

      <WordSearchResults
        query={query}
        searched={searched}
        results={results}
        isWordUsed={isWordInPractice}
        onAddToPracticeList={addWordFromSearch}
      />
      {chineseInputPortal}
    </>
  );
};

export default AddFromSearchTab;
