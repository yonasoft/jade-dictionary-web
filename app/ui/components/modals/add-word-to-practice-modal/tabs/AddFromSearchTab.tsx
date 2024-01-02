"use client";
import { Word } from "@/app/lib/definitions";
import { Button, Input } from "@mantine/core";
import React, { useState } from "react";
import WordSearchResults from "../../../results/word-search-results/WordSearchResults";

import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import { IconSearch } from "@tabler/icons-react";
import { handleKeyPress } from "@/app/lib/utils/events";
import { performSearch } from "@/app/lib/utils/dictionary";

type Props = {
  isWordInPractice: (word: Word) => boolean;
  addWordFromSearch: (word: Word) => Promise<void>;
};

const AddFromSearchTab = ({ isWordInPractice, addWordFromSearch }: Props) => {
  const { firestore } = useFirebaseContext();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Word[]>([]);
  const [searched, setSearched] = useState(false);

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
          onChange={(e) => {
            setQuery(e.currentTarget.value);
          }}
          onKeyUp={(event) => {handleKeyPressSearch(event) }}
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
    </>
  );
};

export default AddFromSearchTab;
