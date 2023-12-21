// WordCard.tsx
"use client";
import React, { useState } from "react";
import { Word, WordList } from "@/app/lib/definitions";
import {
  Button,
  Card,
  MantineThemeContext,
  Menu,
  useMantineColorScheme,
  useMantineTheme,
  Text,
  Highlight,
} from "@mantine/core";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { removeWordFromList } from "@/app/lib/firebase/storage/wordLists";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import WordDetailModal from "./WordDetailModal";

type Props = {
  word: Word;
  onWordRemove: () => void;
  query: string;
};

const WordCard = ({ word, onWordRemove, query }: Props) => {
  query = query.toLowerCase();
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <>
      <Card
        className="hover:bg-gray-100 dark:hover:bg-dark-5 h-30 cursor-pointer"
        shadow="sm"
        padding="lg"
        style={{
          backgroundColor:
            colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
          color: colorScheme === "dark" ? theme.white : theme.black,
        }}
      >
        <div onClick={() => setModalOpened(true)}>
          <Highlight
            className="line-clamp-1 text-ellipsis my-1"
            fw={600}
            size="md"
            highlight={query}
          >
            {`${word.simplified}(${word.traditional})`}
          </Highlight>
          <Highlight
            className="line-clamp-1 text-ellipsis my-1"
            size="sm"
            highlight={query}
          >
            {word.pinyin}
          </Highlight>
          <Highlight
            className="line-clamp-2 text-ellipsis my-1"
            size="sm"
            highlight={query}
            fs="italic"
          >
            {word.definition}
          </Highlight>
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
                onClick={() => {
                  console.log("Removing word", word._id);
                  onWordRemove();
                }}
              >
                Remove
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </Card>
      <WordDetailModal
        word={word}
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
      />
    </>
  );
};

export default WordCard;
