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
import { getWordsByIds } from "@/app/lib/firebase/words-storage";
import {
  IconDeviceGamepad,
  IconDotsVertical,
  IconRun,
  IconTrash,
} from "@tabler/icons-react";
import { deleteWordList } from "@/app/lib/firebase/wordLists-storage";
import { doc, query } from "firebase/firestore";
import classes from "./WordListCard.module.css";
import Link from "next/link";

type Props = {
  wordList: WordList;
  onListChange: () => void;
  query: string;
};

const WordListCard = ({ wordList, onListChange, query }: Props) => {
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
    <Card
      className={`cursor-pointer ${hoverClass}focus-within:border focus-within:border-jade-color h-36 overflow-ellipsis `}
      shadow="lg"
      radius="md"
      withBorder
    >
      <Link href={`/lists/${wordList.id}`}>
        <div className="p-3">
          <Highlight
            className="text-xl font-bold line-clamp-1"
            highlight={query}
            size="lg"
            fw={700}
          >
            {wordList.title}
          </Highlight>
          <Divider className="my-2" />
          <Highlight
            className="text-sm text-gray-600 line-clamp-2 high"
            highlight={query}
          >
            {wordList.description}
          </Highlight>
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
