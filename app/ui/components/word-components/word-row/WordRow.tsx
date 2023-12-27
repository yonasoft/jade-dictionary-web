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
  Flex,
} from "@mantine/core";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { removeWordFromList } from "@/app/lib/firebase/storage/wordLists";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import WordDetailModal from "../WordDetailModal";

type Props = {
  word: Word;
  onWordRemove: () => void;
  query?: string;
};

const WordRow = ({ word, onWordRemove, query }: Props) => {
  query = query ? query.toLowerCase() : "";
  const { firestore } = useFirebaseContext();
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <>
      <Card
        className={`overflow-hidden h-auto cursor-pointer bg-white text-black dark:bg-dark-6 dark:text-white p-4 `}
        shadow="sm"
        style={{
          backgroundColor:
            colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
          color: colorScheme === "dark" ? theme.white : theme.black,
        }}
        onClick={() => setModalOpened(true)}
      >
        <Flex justify="flex-end" align="flex-start">
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
        </Flex>

        <Flex direction="column">
          <Group justify="space-between">
            <Highlight highlight={query.toLowerCase()} fw={600} size="md">
              {`${word.simplified}(${word.traditional})`}
            </Highlight>

            <Highlight highlight={query.toLowerCase()} size="sm">
              {word.pinyin}
            </Highlight>
          </Group>

          <Highlight
            className="w-auto overflow-hidden"
            highlight={query.toLowerCase()}
            size="sm"
            fs="italic"
          >
            {word.definition}
          </Highlight>
        </Flex>
      </Card>
      <WordDetailModal
        word={word}
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
      />
    </>
  );
};

export default WordRow;
