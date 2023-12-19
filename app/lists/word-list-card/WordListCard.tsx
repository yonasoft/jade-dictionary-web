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

  const cardStyles = {
    backgroundColor: colorScheme === "dark" ? "#1A1B1E" : "#FFF",
    color: colorScheme === "dark" ? "#FFF" : "#000",
    "&:hover": {
      transform: "scale(1.02)",
      backgroundColor: colorScheme === "dark" ? "#292A2D" : "#F7FAFC",
    },
    height: "8em", // Increased height
  };

  return (
    <Card
      style={cardStyles}
      className="cursor-pointer rounded-md overflow-hidden relative focus:outline-none focus:border-jade-color"
      shadow="sm"
      p="lg"
      
    >
      <Link href={`/lists/${wordList.id}`}>
        <div className="p-4">
          <Highlight
            className="text-xl font-bold line-clamp-1"
            highlight={query}
            size="lg"
            fw={700}
          >
            {wordList.title}
          </Highlight>
          <Text
            className={`text-sm truncate mt-2 ${
              colorScheme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
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
          </Menu.Dropdown>
        </Menu>
      </div>
    </Card>
  );
};

export default WordListCard;
