import { ScriptType, Word, WordList } from "@/app/lib/definitions";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import {
  Accordion,
  Button,
  Card,
  Flex,
  Group,
  Highlight,
  Menu,
  Text,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import {
  Firestore,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect } from "react";

type Props = {
  query: string;
  word: Word;
  onAdd: (
    firestore: Firestore,
    wordList: WordList,
    word: Word
  ) => Promise<void>;
};

const WordResult = ({ query, word, onAdd }: Props) => {
  const { firestore, wordLists, currentUser } = useFirebaseContext();
  const traditional = `(${word.traditional})`;
  query = query.toLowerCase();

  return (
    <Card className="mx-2 my-1" shadow="sm" withBorder>
      <div className="flex">
        <Group className="grow p-4" align="start" wrap="wrap" grow>
          <Flex justify="center" align="center" direction="column">
            <Highlight
              size="xl"
              fw="500"
              highlight={query}
            >{`${word.simplified} ${traditional}`}</Highlight>
            <Highlight size="md" highlight={query}>
              {word.pinyin}
            </Highlight>
          </Flex>
          <Highlight className="h-auto align-middle" highlight={query}>
            {word.definition}
          </Highlight>
        </Group>
        {currentUser && ( // Only show if a user is logged in
          <Menu zIndex={3000} withinPortal>
            <Menu.Target>
              <Button variant="outline">
                <IconPlus />
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {wordLists && wordLists.length > 0 ? (
                wordLists.map((list) => (
                  <Menu.Item
                    key={list.id}
                    onClick={() => {
                      onAdd(firestore, list, word);
                    }}
                  >
                    {list.title}
                  </Menu.Item>
                ))
              ) : (
                <Menu.Item style={{ fontStyle: "italic" }}>No lists</Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        )}
      </div>
    </Card>
  );
};

export default WordResult;
