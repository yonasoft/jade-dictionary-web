// WordCard.tsx

import React from "react";
import { Word, WordList } from "@/app/lib/definitions";
import {
  Button,
  Card,
  MantineThemeContext,
  Menu,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { removeWordFromList } from "@/app/lib/firebase/wordLists-storage";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";

type Props = {
  word: Word;
  wordList: WordList;
  onWordRemove: (wordId: number) => void;
};

const WordCard = ({ word, wordList, onWordRemove }: Props) => {
  const { firestore } = useFirebaseContext();
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const handleRemoveWord = async () => {
    await removeWordFromList(firestore, wordList.id as string, word._id);
    onWordRemove(word._id); // Notify parent component about the removal
  };

  return (
    <Card
      className="mx-2 my-1"
      shadow="sm"
      padding="lg"
      style={{
        backgroundColor:
          colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
        color: colorScheme === "dark" ? theme.white : theme.black,
      }}
    >
      <p className="text-sm">{word.pinyin}</p>
      <p className="font-semibold text-sm">
        {word.simplified} ({word.traditional})
      </p>
      <p className="text-sm">{word.definition}</p>

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
  );
};

export default WordCard;
