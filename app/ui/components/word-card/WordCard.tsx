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
import { removeWordFromList } from "@/app/lib/firebase/storage/wordLists-storage";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import WordDetailModal from "./WordDetailModal";

type Props = {
  word: Word;
  wordList: WordList;
  onWordRemove: (wordId: number) => void;
  query: string;
};

const WordCard = ({ word, wordList, onWordRemove, query }: Props) => {
  const { firestore } = useFirebaseContext();
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const [modalOpened, setModalOpened] = useState(false);

  const handleRemoveWord = async () => {
    await removeWordFromList(firestore, wordList.id as string, word._id);
    onWordRemove(word._id); // Notify parent component about the removal
  };

  return (
    <>
      <Card
        className="overflow-ellipsis h-28 cursor-pointer bg-white text-black dark:bg-dark-6 dark:text-white"
        shadow="sm"
        padding="lg"
        style={{
          backgroundColor:
            colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
          color: colorScheme === "dark" ? theme.white : theme.black,
        }}
      >
        <div
          onClick={() => {
            setModalOpened(true);
          }}
        >
          <Highlight highlight={query} size="sm">
            {word.pinyin}
          </Highlight>
          <Highlight highlight={query} fw={600} size="sm">
            {`${word.simplified}(${word.traditional})`}
          </Highlight>
          <Highlight highlight={query} size="sm">
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
              <Menu.Item leftSection={<IconTrash />} onClick={handleRemoveWord}>
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
