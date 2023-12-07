"use client";
import React, { useEffect, useState } from "react";
import { Card, Text, Menu, Button, Group, Divider } from "@mantine/core";
import { Word, WordList } from "@/app/lib/definitions";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import { getWordsByIds } from "@/app/lib/firebase/words-storage";
import {
  IconDeviceGamepad,
  IconDotsVertical,
  IconRun,
  IconTrash,
} from "@tabler/icons-react";

type Props = {
  wordList: WordList;
};

const WordListCard = ({ wordList }: Props) => {
  const { firestore } = useFirebaseContext();
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    const fetchWords = async () => {
      const fetchedWords = await getWordsByIds(firestore, wordList.wordIds);
      setWords(fetchedWords);
    };

    fetchWords();
  }, [firestore, wordList.wordIds]);

  const handleRemoveWordList = async () => {
    // Logic to remove the word list from Firestore
  };

  const handlePractice = () => {
    // Logic for practicing words in the list
  };

  return (
    <Card
      className="mt-3 me-3 px-3 w-60 h-70 relative cursor-pointer bg-white rounded-lg hover:border hover:border-gray-300"
      shadow="lg"
      radius="md"
      withBorder
    >
      <div className="p-3">
        <h3 className="text-xl font-bold mb-1">{wordList.title}</h3>
        <p className="text-sm text-gray-600">{wordList.description}</p>
      </div>

      <Divider className="mb-2" />
      <div className="overflow-auto max-h-36 p-3">
        {words.length > 0 ? (
          words.map((word) => (
            <div key={word._id} className="mb-2">
              <strong>{word.simplified}</strong>
              {word.simplified !== word.traditional && (
                <span className="text-gray-500"> ({word.traditional})</span>
              )}
              <br />
              <small className="text-gray-600">{word.pinyin}</small>
            </div>
          ))
        ) : (
          <p className="text-sm text-center text-gray-500">List is empty</p>
        )}
      </div>
      <div className="absolute top-0 right-0 m-0">
        <Menu position="bottom-end" withinPortal>
          <Menu.Target>
            <Button variant="subtle" size="xs">
              <IconDotsVertical />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconTrash />}
              onClick={handleRemoveWordList}
            >
              Remove
            </Menu.Item>
            <Menu.Item
              leftSection={<IconDeviceGamepad />}
              onClick={handlePractice}
            >
              Practice
            </Menu.Item>
            {/* Add more menu items here if needed */}
          </Menu.Dropdown>
        </Menu>
      </div>
    </Card>
  );
};

export default WordListCard;
