"use client";
import { useCallback, useEffect, useState } from "react";
import { getUserWordLists } from "../lib/firebase/wordLists-storage";
import { WordList } from "@/app/lib/definitions";
import { useFirebaseContext } from "../providers/FirebaseProvider";
import WordListCard from "./word-list-card/WordListCard";
import AddNewListCard from "./add-new-list-card/AddNewListCard";
import { Text, Title, Center } from "@mantine/core";

const AllLists = () => {
  const { firestore, currentUser } = useFirebaseContext();
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWordLists = useCallback(async () => {
    if (currentUser) {
      try {
        const userWordLists = await getUserWordLists(
          firestore,
          currentUser.uid
        );
        setWordLists(userWordLists);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching word lists: ", error);
        setIsLoading(false);
      }
    }
  }, [firestore, currentUser]);

  useEffect(() => {
    fetchWordLists();
  }, [fetchWordLists]);

  const handleListAdded = () => {
    fetchWordLists();
  };

  if (!currentUser) {
    return (
      <Center style={{ height: "100vh" }}>
        <Text size="lg">Please log in to view and manage your word lists.</Text>
      </Center>
    );
  }

  return (
    <div className="p-4">
      <Title order={1} className="font-bold text-gray-800 mb-6 text-center">
        My Word Lists
      </Title>
      {isLoading ? (
        <Center>
          <Text size="lg" className="text-gray-600">
            Loading...
          </Text>
        </Center>
      ) : (
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          <div>
            <AddNewListCard onListAdded={handleListAdded} />
          </div>
          {wordLists.map((wordList, index) => (
            <div key={index}>
              <WordListCard wordList={wordList} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllLists;
