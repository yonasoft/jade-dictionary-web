import React from "react";
import {
  Card,
  Menu,
  Group,
  useMantineColorScheme,
  Highlight,
  Flex,
} from "@mantine/core";
import { useFirebaseContext } from "@/src/providers/FirebaseProvider";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";

import Link from "next/link";
import { deleteWordList } from "@/src/lib/firebase/storage/wordLists";
import { WordList } from "@/src/lib/types/word-list";

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
      className="overflow-hidden"
      shadow="sm"
      style={{ height: "8em" }} // Set a fixed height
    >
      <Flex className="h-full w-full" direction="column">
        <Group justify="flex-end">
          <Menu position="bottom-end" withinPortal>
            <Menu.Target>
              <IconDotsVertical color="green" />
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
        </Group>
        <Link
          className="cursor-pointer h-full w-full"
          href={`/lists/${wordList.id}`}
        >
          <Flex
            className="h-full w-full"
            justify="flex-start"
            align="center"
            direction="column"
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
      </Flex>
    </Card>
  );
};

export default WordListCard;
