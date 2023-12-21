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
  Flex,
} from "@mantine/core";
import { Word, WordList } from "@/app/lib/definitions";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import { getWordsByIds } from "@/app/lib/firebase/storage/words";
import {
  IconDeviceGamepad,
  IconDotsVertical,
  IconRun,
  IconTrash,
} from "@tabler/icons-react";
import { deleteWordList } from "@/app/lib/firebase/storage/wordLists";
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
    height: "8em",
  };

  return (
    <Card
      className="cursor-pointer overflow-hidden"
      shadow="sm"
      p="lg"
      style={{ height: "8em" }} // Set a fixed height
    >
      <Link href={`/lists/${wordList.id}`}>
        <Flex
          justify="center"
          align="center"
          direction="column"
          style={{ height: "100%" }}
        >
          <Highlight className="line-clamp-1" highlight={query} fw={700}>
            {wordList.title.charAt(0).toUpperCase() + wordList.title.slice(1)}
          </Highlight>
          <Highlight
            highlight={query}
            size="sm"
            className={`text-sm truncate mt-2 ${
              colorScheme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {wordList.description.charAt(0).toUpperCase() +
              wordList.description.slice(1)}
          </Highlight>
        </Flex>
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
