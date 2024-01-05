"use client";
import React, { useEffect, useState, useCallback, memo } from "react";
import { useFirebaseContext } from "../providers/FirebaseProvider";
import WordListCard from "../ui/components/word-list-components/word-list-card/WordListCard";
import AddNewListCard from "./components/add-new-list-card/AddNewListCard";
import {
  Text,
  Title,
  Center,
  Select,
  Grid,
  Group,
  Input,
  ActionIcon,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { WordList } from "../lib/types/word-list";
import { SortOption } from "../lib/types/dictionary";
import { getUserWordLists } from "../lib/firebase/storage/wordLists";

const applyFilter = (wordLists: WordList[], query: string): WordList[] => {
  const queryLower = query.toLowerCase();
  return wordLists.filter(
    (wordList) =>
      wordList.title.toLowerCase().includes(queryLower) ||
      (wordList.description &&
        wordList.description.toLowerCase().includes(queryLower))
  );
};

interface FilteredWordListsProps {
  wordLists: WordList[];
  fetchWordLists: () => void;
  query: string;
}

const FilteredWordLists = memo(
  ({ wordLists, fetchWordLists, query }: FilteredWordListsProps) => {
    return (
      <>
        {wordLists.map((wordList, index) => (
          <Grid.Col
            key={wordList.id || index}
            span={{ base: 6, xs: 4, sm: 3, md: 2 }}
          >
            <WordListCard
              wordList={wordList}
              onListChange={fetchWordLists}
              query={query}
            />
          </Grid.Col>
        ))}
      </>
    );
  }
);

const AllLists = () => {
  const { currentUser, firestore } = useFirebaseContext();
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [filteredWordLists, setFilteredWordLists] = useState<WordList[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.Recent);
  const [query, setQuery] = useState<string>("");

  const fetchWordLists = useCallback(async () => {
    if (!currentUser) return;

    await getUserWordLists(firestore, currentUser.uid, sortOption)
      .then((fetchedWordLists: WordList[]) => {
        setWordLists(fetchedWordLists);
        setFilteredWordLists(applyFilter(fetchedWordLists, query));
      })
      .catch((error) => {
        console.error("Error fetching word lists: ", error);
      });
  }, [currentUser, firestore, sortOption]);

  useEffect(() => {
    fetchWordLists();
  }, [fetchWordLists]);

  useEffect(() => {
    setFilteredWordLists(applyFilter(wordLists, query));
  }, [query]);

  if (!currentUser) {
    return (
      <Center style={{ height: "100vh" }}>
        <Text>Please log in to view and manage your word lists.</Text>
      </Center>
    );
  }

  return (
    <div className="p-4">
      <Title className="font-bold text-gray-800 mb-6 text-center">
        My Word Lists
      </Title>
      <Group mb="md">
        <Select
          label="Sort by"
          value={sortOption}
          onChange={(value) => setSortOption(value as SortOption)}
          data={[
            { value: SortOption.Recent, label: "Most Recent" },
            { value: SortOption.Oldest, label: "Oldest" },
            { value: SortOption.Alphabetical, label: "Alphabetical" },
            {
              value: SortOption.ReverseAlphabetical,
              label: "Reverse Alphabetical",
            },
          ]}
        />
      </Group>
      <div className="sticky flex items-center mb-5">
        <Input
          className="flex-grow"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder="Search Word Lists..."
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
      </div>
      <Grid gutter="md">
        <Grid.Col span={{ base: 6, xs: 4, sm: 3, md: 2 }}>
          <AddNewListCard onListAdded={fetchWordLists} />
        </Grid.Col>
        <FilteredWordLists
          wordLists={filteredWordLists}
          fetchWordLists={fetchWordLists}
          query={query}
        />
      </Grid>
    </div>
  );
};

export default AllLists;
