"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Word, WordList } from "@/app/lib/definitions";
import {
  editWordList,
  getWordListByDocId,
} from "@/app/lib/firebase/storage/wordLists-storage";
import { getWordsByIds } from "@/app/lib/firebase/storage/words-storage";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import WordCard from "@/app/ui/components/word-card/WordCard";
import {
  Button,
  Group,
  Input,
  Textarea,
  Text,
  Center,
  Grid,
  ActionIcon,
} from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { doc } from "firebase/firestore";

type Props = {
  params: { id: string };
};

const applyFilter = (words: Word[], query: string): Word[] => {
  return words.filter(
    (word) =>
      word.simplified.includes(query) ||
      word.traditional.includes(query) ||
      word.pinyin.includes(query) ||
      word.definition.includes(query)
  );
};

const FilteredWords = ({
  words,
  wordList,
  query,
  onWordRemove,
}: {
  words: Word[];
  wordList: WordList;
  query: string;
  onWordRemove: (wordId: number) => void;
}) => {
  return (
    <Grid gutter={{ base: 4, lg: 8 }}>
      {words.map((word, index) => (
        <Grid.Col key={index} span={{ base: 4, xs: 3, md: 2 }}>
          <WordCard
            word={word}
            wordList={wordList}
            onWordRemove={onWordRemove}
            query={query}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
};

const ListDetailPage = ({ params }: Props) => {
  const { firestore } = useFirebaseContext();
  const [wordList, setWordList] = useState<WordList | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  const fetchWords = useCallback(
    async (wordIds: number[]) => {
      const fetchedWords = await getWordsByIds(firestore, wordIds);
      setWords(fetchedWords);
      setFilteredWords(applyFilter(fetchedWords, query));
    },
    [firestore]
  );

  useEffect(() => {
    if (params.id) {
      getWordListByDocId(firestore, params.id).then((fetchedWordList) => {
        if (fetchedWordList) {
          setTitle(fetchedWordList.title);
          setDescription(fetchedWordList.description);
          setWordList(fetchedWordList);
          fetchWords(fetchedWordList.wordIds);
        }
      });
    }
  }, [params.id, firestore, fetchWords]);

  useEffect(() => {
    setFilteredWords(applyFilter(words, query));
  }, [query, words]);

  const onSearch = useCallback(() => {
    setFilteredWords(applyFilter(words, query));
  }, [words, query]);

  const handleWordRemove = useCallback((wordId: number) => {
    setWords((currentWords) =>
      currentWords.filter((word) => word._id !== wordId)
    );
    setFilteredWords((currentFilteredWords) =>
      currentFilteredWords.filter((word) => word._id !== wordId)
    );
  }, []);

  const handleSave = async () => {
    if (wordList && params.id) {
      try {
        await editWordList(
          doc(firestore, "wordLists", params.id),
          title,
          description
        );
        console.log("Word list updated successfully");
        // Redirect logic...
      } catch (error) {
        console.error("Error updating word list: ", error);
      }
    }
  };

  if (!wordList) {
    return (
      <Center style={{ height: "100vh" }}>
        <Text>Loading word list details...</Text>
      </Center>
    );
  }

  return (
    <div className="p-4" style={{ maxWidth: "1200px", margin: "auto" }}>
      <Group justify="flex-end">
        <Button variant="filled" onClick={handleSave}>
          Save
        </Button>
      </Group>

      <div className="mb-4">
        <Input.Label htmlFor="title">Title</Input.Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Input.Label htmlFor="description">Description</Input.Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <Group className="sticky flex w-full items-center my-3">
        <Input
          className="flex-grow"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder="Search via English, Pinyin, or Chinese..."
        />
        <ActionIcon
          variant="outline"
          size="lg"
          onClick={() => {
            setQuery("");
          }}
          title="Clear"
        >
          <IconX size={24} />
        </ActionIcon>
      </Group>

      {words.length === 0 ? (
        <Center className="h-full">
          <Text color="dimmed" size="md">
            Your word list is empty. Search for words using the search bar
            (Ctrl+K) and add them from there.
          </Text>
        </Center>
      ) : (
        <FilteredWords
          words={filteredWords}
          wordList={wordList}
          query={query}
          onWordRemove={handleWordRemove}
        />
      )}
    </div>
  );
};

export default ListDetailPage;
