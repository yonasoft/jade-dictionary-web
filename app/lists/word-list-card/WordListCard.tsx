import React, { useEffect, useState } from "react";
import {
  Card,
  Text,
  Menu,
  Button,
  Group,
  Divider,
  useMantineTheme,
  useMantineColorScheme,
  Highlight,
} from "@mantine/core";
import { Word, WordList } from "@/app/lib/definitions";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import { getWordsByIds } from "@/app/lib/firebase/storage/words-storage";
import {
  IconDeviceGamepad,
  IconDotsVertical,
  IconRun,
  IconTrash,
} from "@tabler/icons-react";
import { deleteWordList } from "@/app/lib/firebase/storage/wordLists-storage";
import { doc, query } from "firebase/firestore";
import classes from "./WordListCard.module.css";
import Link from "next/link";

type Props = {
  wordList: WordList;
  onListChange: () => void;
  query: string;
};

const WordListCard = ({ wordList, onListChange, query }: Props) => {
  query = query.toLowerCase();
  const { firestore } = useFirebaseContext();
  const { colorScheme } = useMantineColorScheme();
  const hoverClass =
    colorScheme === "dark" ? "card-hover-dark" : "card-hover-light";

  const handleRemoveWordList = async () => {
    try {
      await deleteWordList(firestore, wordList.id as string);
      onListChange(); // Refresh the word lists in the parent component
    } catch (error) {
      console.error("Failed to remove word list: ", error);
    }
  };

  const handlePractice = async () => {};

  return (
    <Card className="cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-6 focus-within:border focus-within:border-jade-color shadow-lg rounded-md overflow-hidden">
      <Link href={`/lists/${wordList.id}`}>
        <div className="p-4">
          <Text className="text-xl font-bold truncate">{wordList.title}</Text>
          <div className="my-2 border-b"></div>
          <Text className="text-sm text-gray-600 truncate">
            {wordList.description}
          </Text>
        </div>
      </Link>
      <div className="absolute top-2 right-2">
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
            {/* <Menu.Item
              leftSection={<IconDeviceGamepad />}
              onClick={handlePractice}
            >
              Practice
            </Menu.Item> */}
          </Menu.Dropdown>
        </Menu>
      </div>
    </Card>
  );
};

export default WordListCard;
