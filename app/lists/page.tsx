"use client";
import React, { useEffect, useState, useCallback, memo } from "react";
import { SortOption, WordList } from "@/app/lib/definitions";
import { useFirebaseContext } from "../providers/FirebaseProvider";
import WordListCard from "./word-list-card/WordListCard";
import AddNewListCard from "./add-new-list-card/AddNewListCard";
import {
  Text,
  Title,
  Center,
  Select,
  Grid,
  Button,
  Group,
  Input,
  ActionIcon,
} from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { getUserWordLists } from "../lib/firebase/storage/wordLists-storage";

const applyFilter = (wordLists: WordList[], query: string): WordList[] => {
  return wordLists.filter(
    (wordList) =>
      wordList.title.toLowerCase().includes(query.toLowerCase()) ||
      (wordList.description &&
        wordList.description.toLowerCase().includes(query.toLowerCase()))
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

  const fetchWordLists = useCallback(() => {
    if (!currentUser) return;

    getUserWordLists(firestore, currentUser.uid, sortOption)
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
      <Title order={1} className="font-bold text-gray-800 mb-6 text-center">
        My Word Lists
      </Title>
      <Select
        label="Sort by"
        placeholder="Select sort option"
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
      <Group className="sticky flex w-full items-center my-3">
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
      </Group>
      <Grid gutter={{ base: 4, sm: 6, lg: 8 }} className="mt-5">
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
