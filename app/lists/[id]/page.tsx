"use client";
import { Word, WordList } from "@/app/lib/definitions";
import {
  editWordList,
  getWordListByDocId,
} from "@/app/lib/firebase/wordLists-storage";
import { getWordsByIds } from "@/app/lib/firebase/words-storage";
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
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { doc } from "firebase/firestore";
import { IconSearch, IconX } from "@tabler/icons-react";

const ListDetailPage = ({ params }: { params: { id: string } }) => {
  const firebase = useFirebaseContext();
  const [wordList, setWordList] = useState<WordList | null>({} as WordList);
  const [words, setWords] = useState<Word[]>([]);
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (params.id) {
      getWordListByDocId(firebase.firestore, params.id as string).then(
        (fetchedWordList) => {
          if (fetchedWordList) {
            setTitle(fetchedWordList.title);
            setDescription(fetchedWordList.description);
            setWordList(fetchedWordList);
            setIsEmpty(fetchedWordList.wordIds.length === 0);
          }
        }
      );
    }
  }, [params.id, firebase.firestore]);

  useEffect(() => {
    if (wordList?.wordIds && wordList.wordIds.length > 0) {
      getWordsByIds(firebase.firestore, wordList.wordIds).then((words) => {
        setWords(words);
        setFilteredWords(words);
      });
    }
  }, [wordList, firebase.firestore]);

  const onSearch = async () => {
    if (query) {
      const searchedWords = words.filter(
        (word) =>
          word.simplified.includes(query) ||
          word.traditional.includes(query) ||
          word.pinyin.includes(query)
      );
      setFilteredWords(searchedWords);
    } else {
      // If the query is empty, show all words
      setFilteredWords(words);
    }
  };

  const showWords = () => {
    return (
      <Grid gutter={{ base: 4, lg: 8 }}>
        {filteredWords.map((word, index) => (
          <Grid.Col key={word._id} span={{ base: 4, xs: 3, md: 2 }}>
            <WordCard
              word={word}
              wordList={wordList as WordList}
              onWordRemove={handleWordRemove}
              query={query}
            />
          </Grid.Col>
        ))}
      </Grid>
    );
  };

  const handleEnterKeyPress = (event: React.KeyboardEvent) => {
    const keysToTriggerSearch = ["Enter", "Go", "Search", "ArrowRight"]; // Add other keys as needed
    if (keysToTriggerSearch.includes(event.key)) {
      onSearch();
    }
  };

  const handleSave = async () => {
    if (wordList && params.id) {
      try {
        await editWordList(
          doc(firebase.firestore, "wordLists", params.id),
          title,
          description
        );
        console.log("Word list updated successfully");
        if (typeof window !== "undefined") {
          window.location.href = "/lists";
        }
      } catch (error) {
        console.error("Error updating word list: ", error);
      }
    }
  };

  const handleWordRemove = (wordId: number) => {
    setWords((currentWords) =>
      currentWords.filter((word) => word._id !== wordId)
    );
    setFilteredWords((currentFilteredWords) =>
      currentFilteredWords.filter((word) => word._id !== wordId)
    );
  };

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
          className="shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Input.Label htmlFor="description">Description</Input.Label>
        <Textarea
          className="shadow "
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      <Group className="stickyflex w-full items-center my-3">
        <Input
          className="flex-grow"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder="Search via English, Pinyin, or Chinese..."
          onKeyDown={handleEnterKeyPress}
        />

        <ActionIcon
          variant="outline"
          size="lg" // Ensure sufficient size for the clickable area
          onClick={() => {
            console.log("Clearing search");
            setQuery("");
            setFilteredWords(words);
          }}
          title="Clear"
        >
          <IconX size={24} />
        </ActionIcon>

        <Button
          onClick={onSearch}
          variant="outline"
          color="gray"
          className="me-3 shrink-0"
        >
          <IconSearch className="w-6 h-6" />
        </Button>
      </Group>

      {isEmpty ? (
        <Center className="h-full">
          <Text color="dimmed" size="md">
            Your word list is empty. Search for words using the search bar
            (Ctrl+K) and add them from there.
          </Text>
        </Center>
      ) : (
        showWords()
      )}
    </div>
  );
};

export default ListDetailPage;
