import { ScriptType, Word } from "@/app/lib/definitions";
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
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect } from "react";

type Props = {
  query: string;
  word: Word;
};

const WordResult = ({ query, word }: Props) => {
  const { firestore, wordLists, currentUser, updateWordLists } =
    useFirebaseContext();
  const traditional = `(${word.traditional})`;
  query = query.toLowerCase();

  const handleAddWordToList = async (wordListId: string) => {
    try {
      const wordListRef = doc(firestore, "wordLists", wordListId);
      // Update the word list document to add the word's ID to wordIds array
      await updateDoc(wordListRef, {
        wordIds: arrayUnion(word._id),
        lastUpdatedAt: serverTimestamp(), // Optional: Update lastUpdatedAt timestamp
      });
      updateWordLists();
      console.log(`Word ${word._id} added to word list ${wordListId}`);
    } catch (error) {
      console.error("Error adding word to word list: ", error);
    }
  };

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
        )}
      </div>
    </Card>
  );
};

export default WordResult;
