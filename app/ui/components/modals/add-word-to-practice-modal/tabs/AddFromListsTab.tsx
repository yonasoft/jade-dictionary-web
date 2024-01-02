"use client";
import { Button, Input, ScrollArea, Title } from "@mantine/core";
import React, { useState } from "react";
import WordSearchResults from "../../../results/word-search-results/WordSearchResults";
import { IconSearch } from "@tabler/icons-react";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";

import { handleKeyPress } from "@/app/lib/utils/events";
import { Word, WordList } from "@/app/lib/definitions";
import WordListRow from "../../../word-list-components/word-list-row/WordListRow";
import { getWordsByIds } from "@/app/lib/firebase/storage/words";

type Props = {
  addWords: (Words: Word[]) => Promise<void>;
};

const AddFromListsTab = ({ addWords }: Props) => {
  const { firestore, wordLists, auth } = useFirebaseContext();

  const [query, setQuery] = useState("");

  const onSearch = () => {};
  const onAdd = async (wordList: WordList) => {
    const wordIds = wordList.wordIds;
    const words = await getWordsByIds(firestore, wordIds);
    addWords(words);
  };

  const handleKeyPressSearch = (event: React.KeyboardEvent) => {
    handleKeyPress(event, ["Enter", "Go", "Search", "ArrowRight"], () => {
      onSearch();
    });
  };

  return (
    <>
      {auth.currentUser ? (
        <>
          <div className="flex mt-3 mb-2">
            <Input
              className="flex-1"
              placeholder="Search Hanzi, English or Pinyin..."
              value={query}
              onChange={(e) => {
                setQuery(e.currentTarget.value);
              }}
              onKeyUp={(event) => {
                handleKeyPressSearch(event);
              }}
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
          <div>
            {wordLists.map((wordList) => {
              if (
                query === "" ||
                wordList.title.includes(query) ||
                wordList.description?.includes(query)
              ) {
                return (
                  <WordListRow
                    key={wordList.id}
                    query={query}
                    wordList={wordList}
                    onAdd={onAdd}
                  />
                );
              }
            })}
          </div>
        </>
      ) : (
        <Title order={1}>Please login to add words from your lists</Title>
      )}
    </>
  );
};

export default AddFromListsTab;
