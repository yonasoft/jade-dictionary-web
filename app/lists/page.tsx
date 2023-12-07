"use client";
import { useEffect, useState } from "react";
import { getUserWordLists } from "../lib/firebase/wordLists-storage";
import { WordList } from "@/app/lib/definitions";
import { useFirebaseContext } from "../providers/FirebaseProvider";
import WordListCard from "./word-list-card/WordListCard";
import { Grid } from "@mantine/core";

const AllLists = () => {
  const { firestore, currentUser } = useFirebaseContext();
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWordLists = async () => {
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
    };

    fetchWordLists();
  }, [firestore, currentUser]);

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">My Word Lists</h1>
      {isLoading ? (
        <p className="text-lg text-gray-600">Loading...</p>
      ) : wordLists.length === 0 ? (
        <p className="text-lg text-gray-600">No word lists found.</p>
      ) : (
        <Grid gutter="lg">
          {wordLists.map((wordList, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <WordListCard wordList={wordList} />
            </Grid.Col>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default AllLists;
