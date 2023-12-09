"use client";
import React, { useEffect, useState } from "react";
import { SortOption, WordList } from "@/app/lib/definitions";
import { useFirebaseContext } from "../providers/FirebaseProvider";
import WordListCard from "./word-list-card/WordListCard";
import AddNewListCard from "./add-new-list-card/AddNewListCard";
import { Text, Title, Center, Select, Grid } from "@mantine/core";
import { getUserWordLists } from "../lib/firebase/wordLists-storage";

const AllLists = () => {
  const { currentUser, firestore } = useFirebaseContext();
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState(SortOption.Recent);

  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);
      getUserWordLists(firestore, currentUser.uid, sortOption)
        .then((fetchedWordLists) => {
          setWordLists(fetchedWordLists);
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
      <Grid gutter={{ base: 4, sm: 6, lg: 8 }} className="mt-5">
        <Grid.Col span={{ base: 6, xs: 4, sm: 3, md: 2 }}>
          <AddNewListCard onListAdded={() => {}} />
        </Grid.Col>
        {wordLists.map((wordList, index) => (
          <Grid.Col span={{ base: 6, xs: 4, sm: 3, md: 2 }}>
            <WordListCard
              key={index}
              wordList={wordList}
              onListChange={() => {}}
            />
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
};

export default AllLists;
