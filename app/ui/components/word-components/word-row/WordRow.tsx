// WordRow.tsx
"use client";
import React, { useState } from "react";
import { Word, WordList } from "@/app/lib/definitions";
import {
  Button,
  Group,
  useMantineColorScheme,
  useMantineTheme,
  Text,
  Highlight,
  Menu,
  Card,
} from "@mantine/core";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { removeWordFromList } from "@/app/lib/firebase/storage/wordLists-storage";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import WordDetailModal from "../word-card/WordDetailModal";

type Props = {
  word: Word;
  onWordRemove: () => void;
  query: string;
};

const WordRow = ({ word, onWordRemove, query }: Props) => {
  query = query.toLowerCase();
  const { firestore } = useFirebaseContext();
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <Card
      className={`overflow-hidden h-auto cursor-pointer bg-white text-black dark:bg-dark-6 dark:text-white p-4`}
      shadow="sm"
      style={{
        backgroundColor:
          colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
        color: colorScheme === "dark" ? theme.white : theme.black,
      }}
      onClick={() => setModalOpened(true)}
    >
      <Group>
        <Highlight highlight={query} size="sm">
          {word.pinyin}
        </Highlight>
        <Highlight highlight={query} fw={600} size="sm">
          {`${word.simplified}(${word.traditional})`}
        </Highlight>
        <Highlight highlight={query} size="sm">
          {word.definition}
        </Highlight>

        <Menu position="bottom-end" withinPortal>
          <Menu.Target>
            <Button variant="subtle" size="xs">
              <IconDotsVertical />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconTrash />} onClick={onWordRemove}>
              Remove
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <WordDetailModal
        word={word}
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
      />
    </Card>
  );
};

export default WordRow;
