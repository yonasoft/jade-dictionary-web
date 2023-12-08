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
} from "@mantine/core";
import { Word, WordList } from "@/app/lib/definitions";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import { getWordsByIds } from "@/app/lib/firebase/words-storage";
import {
  IconDeviceGamepad,
  IconDotsVertical,
  IconRun,
  IconTrash,
} from "@tabler/icons-react";
import { deleteWordList } from "@/app/lib/firebase/wordLists-storage";
import { doc } from "firebase/firestore";
import classes from "./WordListCard.module.css";
import Link from "next/link";

type Props = {
  wordList: WordList;
  onListChange: () => void;
};

const WordListCard = ({ wordList, onListChange }: Props) => {
  const { firestore } = useFirebaseContext();
  const { colorScheme } = useMantineColorScheme();
  const hoverClass =
    colorScheme === "dark" ? "card-hover-dark" : "card-hover-light";

  const handleRemoveWordList = async () => {
    try {
      await deleteWordList(firestore, wordList.id as string);
      console.log("Word list removed successfully");
      onListChange(); // Call the callback function passed from parent
    } catch (error) {
      console.error("Failed to remove word list: ", error);
    }
  };

  const handlePractice = async () => {};

  return (
    <Card
      className={`mt-3 me-3 w-60 h-70 relative cursor-pointer rounded-lg ${hoverClass} ${classes.wordCard} focus-within:border focus-within:border-jade-color`}
      shadow="lg"
      radius="md"
      withBorder
    >
      <Link href={`/lists/${wordList.id}`}>
        <div className="p-3">
          <h3 className="text-xl font-bold line-clamp-1">{wordList.title}</h3>
          <Divider className="my-2" />
          <p className="text-sm text-gray-600 line-clamp-2">
            {wordList.description}
          </p>
        </div>
      </Link>
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
