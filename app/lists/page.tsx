"use client";
import { useCallback, useEffect, useState } from "react";
import { getUserWordLists } from "../lib/firebase/wordLists-storage";
import { SortOption, WordList } from "@/app/lib/definitions";
import { useFirebaseContext } from "../providers/FirebaseProvider";
import WordListCard from "./word-list-card/WordListCard";
import AddNewListCard from "./add-new-list-card/AddNewListCard";
import { Text, Title, Center, Select } from "@mantine/core";

const AllLists = () => {
  const { firestore, currentUser } = useFirebaseContext();
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState(SortOption.Recent);

  const fetchWordLists = useCallback(async () => {
    if (currentUser) {
      setIsLoading(true); // Set loading before fetching
      try {
        const userWordLists = await getUserWordLists(
          firestore,
          currentUser.uid,
          sortOption
        );
        setWordLists(userWordLists);
      } catch (error) {
        console.error("Error fetching word lists: ", error);
      }
      setIsLoading(false); // Reset loading after fetching or if an error occurs
    }
  }, [firestore, currentUser, sortOption]);

  useEffect(() => {
    fetchWordLists();
  }, [fetchWordLists]);

  useEffect(() => {
    if (currentUser === undefined) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [currentUser]);

  const handleListChange = () => {
    fetchWordLists(); // Re-fetch the lists or modify the state directly
  };

  if (isLoading) {
    return (
      <Center className="h-full">
        <Text size="lg" className="text-gray-600">
          Loading...
        </Text>
      </Center>
    );
  }

  if (!currentUser) {
    return (
      <Center className="h-full">
        <Text size="lg">Please log in to view and manage your word lists.</Text>
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
        onChange={(value) => {
          setSortOption(value as SortOption);
          fetchWordLists();
        }}
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

      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
        <div>
          <AddNewListCard onListAdded={handleListChange} />
        </div>
        {wordLists.map((wordList, index) => (
          <div key={index}>
            <WordListCard wordList={wordList} onListChange={handleListChange} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllLists;
