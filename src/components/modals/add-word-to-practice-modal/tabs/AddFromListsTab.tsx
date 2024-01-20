"use client";
import { Button, Input, Title } from "@mantine/core";
import React, { useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { useFirebaseContext } from "@/src/providers/FirebaseProvider";
import WordListRow from "@/src/components/lists-components/word-list-components/word-list-row/WordListRow";
import { getWordsByIds } from "@/src/lib/firebase/storage/words";
import { Word } from "@/src/lib/types/word";
import { WordList } from "@/src/lib/types/word-list";
import { handleKeyPress } from "@/src/lib/utils/events";
import ChineseInput from "@/src/components/chinese-input/ChineseInput";

type Props = {
  addWords: (Words: Word[]) => Promise<void>;
};

const AddFromListsTab = ({ addWords }: Props) => {
  const { firestore, wordLists, auth } = useFirebaseContext();
  const [query, setQuery] = useState("");
  const [showChineseInput, setShowChineseInput] = useState(false);

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
              onFocus={() => setShowChineseInput(true)}
              onBlur={() => setShowChineseInput(false)}
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
          {showChineseInput && (
            <ChineseInput query={query} setQuery={setQuery} />
          )}
        </>
      ) : (
        <Title order={1}>Please login to add words from your lists</Title>
      )}
    </>
  );
};

export default AddFromListsTab;
