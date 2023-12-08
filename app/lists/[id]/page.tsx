"use client";
import { Word, WordList } from "@/app/lib/definitions";
import {
  editWordList,
  getWordListByDocId,
} from "@/app/lib/firebase/wordLists-storage";
import { getWordsByIds } from "@/app/lib/firebase/words-storage";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import WordCard from "@/app/ui/components/word-card/WordCard";
import { Button, Group, Input, Textarea, Text, Center } from "@mantine/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { doc } from "firebase/firestore";

const ListDetailPage = ({ params }: { params: { id: string } }) => {
  const firebase = useFirebaseContext();
  const [wordList, setWordList] = useState<WordList | null>({} as WordList);
  const [words, setWords] = useState<Word[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);

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
      getWordsByIds(firebase.firestore, wordList.wordIds).then(setWords);
    }
  }, [wordList, firebase.firestore]);

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
    setWords((currentWords) => currentWords.filter((w) => w._id !== wordId));
  };

  return (
    <div className="p-4">
      <Group justify="flex-end">
        <Button onClick={handleSave}>Save</Button>
      </Group>

      <div className="mb-4">
        <Input.Label htmlFor="title">Title</Input.Label>
        <Input
          className="shadow appearance-none  text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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

      {isEmpty && (
        <Center className="h-full">
        <Text color="dimmed" size="md" >
          Your word list is empty. Search for words using the search bar
          (Ctrl+K) and add them from there.
          </Text>
          </Center>
      )}

      <div className="flex flex-wrap justify-start">
        {words.map((word) => (
          <WordCard
            key={word._id}
            word={word}
            wordList={wordList as WordList}
            onWordRemove={handleWordRemove}
          />
        ))}
      </div>
    </div>
  );
};

export default ListDetailPage;
