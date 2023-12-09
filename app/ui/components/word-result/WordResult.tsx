import { ScriptType, Word } from "@/app/lib/definitions";
import {
  DictionaryContext,
  useDictionaryContext,
} from "@/app/providers/DictionaryProvider";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import {
  Accordion,
  Button,
  Card,
  Flex,
  Group,
  Menu,
  Text,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React from "react";

type Props = {
  query: string;
  word: Word;
};

const WordResult = ({ query, word }: Props) => {
  const { firestore, wordLists } = useFirebaseContext();
  const traditional = `(${word.traditional})`;

  const handleAddWordToList = async (wordListId: string) => {
    try {
      const wordListRef = doc(firestore, "wordLists", wordListId);
      // Update the word list document to add the word's ID to wordIds array
      await updateDoc(wordListRef, {
        wordIds: arrayUnion(word._id),
        lastUpdatedAt: serverTimestamp(), // Optional: Update lastUpdatedAt timestamp
      });

      console.log(`Word ${word._id} added to word list ${wordListId}`);
    } catch (error) {
      console.error("Error adding word to word list: ", error);
    }
  };

  return (
    <Card className="mx-2 my-1" shadow="sm" withBorder>
      <div className="flex">
        <Group className="grow" align="start" wrap="wrap" grow>
          <Flex justify="center" align="center" direction="column">
            <Text
              size="xl"
              fw="500"
            >{`${word.simplified} ${traditional}`}</Text>
            <Text size="md">{word.pinyin}</Text>
          </Flex>
          <Text className="h-auto align-middle">{word.definition}</Text>
        </Group>
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
                  onClick={() => handleAddWordToList(list.id as string)}
                >
                  {list.title}
                </Menu.Item>
              ))
            ) : (
              <Menu.Item style={{ fontStyle: "italic" }}>No lists</Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      </div>
    </Card>
  );
};

export default WordResult;
