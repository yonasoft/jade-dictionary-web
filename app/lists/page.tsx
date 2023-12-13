"use client";
import React, { useEffect, useState } from "react";
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
  Highlight,
} from "@mantine/core";
import { getUserWordLists } from "../lib/firebase/wordLists-storage";
import { IconSearch, IconX } from "@tabler/icons-react";

const AllLists = () => {
  const { currentUser, firestore } = useFirebaseContext();
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [filteredWordLists, setFilteredWordLists] = useState<WordList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState(SortOption.Recent);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);
      getUserWordLists(firestore, currentUser.uid, sortOption)
        .then((fetchedWordLists) => {
          setWordLists(fetchedWordLists);
          setFilteredWordLists(fetchedWordLists);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching word lists: ", error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [currentUser, firestore, sortOption]);

  const onSearch = () => {
    if (query) {
      const filtered = wordLists.filter((wordList) => {
        return (
          wordList.title.toLowerCase().includes(query.toLowerCase()) ||
          wordList.description.toLowerCase().includes(query.toLowerCase())
        );
      });
      setFilteredWordLists(filtered);
    } else {
      setFilteredWordLists(wordLists);
    }
  };

  const fetchWordLists = () => {
    setIsLoading(true);
    getUserWordLists(firestore, currentUser?.uid as string, sortOption)
      .then((fetchedWordLists) => {
        setWordLists(fetchedWordLists);
        setFilteredWordLists(fetchedWordLists); // Update filtered lists as well
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching word lists: ", error);
        setIsLoading(false);
      });
  };

  const handleEnterKeyPress = (event: React.KeyboardEvent) => {
    const keysToTriggerSearch = ["Enter", "Go", "Search", "ArrowRight"]; // Add other keys as needed
    if (keysToTriggerSearch.includes(event.key)) {
      onSearch();
    }
  };

  const showFilteredWordLists = () => {
    return filteredWordLists.map((wordList, index) => (
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
    ));
  };

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
      <Group className="stickyflex w-full items-center my-3">
        <Input
          className="flex-grow"
          value={query}
          onChange={(event) => {
            setQuery(event.currentTarget.value);
          }}
          placeholder="Search Word Lists..."
          onKeyDown={handleEnterKeyPress}
        />
        <ActionIcon
          variant="outline"
          size="lg" // Ensure sufficient size for the clickable area
          onClick={() => {
            console.log("Clearing search");
            setQuery("");
            setFilteredWordLists(wordLists);
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
      <Grid gutter={{ base: 4, sm: 6, lg: 8 }} className="mt-5">
        <Grid.Col span={{ base: 6, xs: 4, sm: 3, md: 2 }}>
          <AddNewListCard onListAdded={fetchWordLists} />
        </Grid.Col>
        {showFilteredWordLists()}
      </Grid>
    </div>
  );
};

export default AllLists;
