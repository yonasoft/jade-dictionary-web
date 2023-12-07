"use client";
import { useEffect, useState } from "react";
import { getUserWordLists } from "../lib/firebase/wordLists-storage";
import {  WordList } from "@/app/lib/definitions";
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
    <div>
      <h1 className="text-3xl font-semibold">My Word Lists</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : wordLists.length === 0 ? (
        <p>No word lists found.</p>
      ) : (
        <Grid gutter={16}>
          {wordLists.map((wordList: WordList, index: number) => (
            <Grid.Col key={index}>
              <WordListCard wordList={wordList} />
            </Grid.Col>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default AllLists;
