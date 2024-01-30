import { Word } from "@/src/lib/types/word";
import { WordList } from "@/src/lib/types/word-list";
import { useFirebaseContext } from "@/src/providers/FirebaseProvider";
import {
  ActionIcon,
  Button,
  Card,
  Flex,
  Group,
  Highlight,
  Menu,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { Firestore } from "firebase/firestore";
import React, { useState } from "react";
import WordDetailModal from "../WordDetailModal";

type Props = {
  query: string;
  word: Word;
  onAddToWordList?: (
    firestore: Firestore,
    wordList: WordList,
    word: Word
  ) => Promise<void>;
  onAddToPracticeList?: (word: Word) => Promise<void>;
  isWordUsed?: (word: Word) => boolean;
};

const WordResult = ({
  query,
  word,
  onAddToWordList,
  onAddToPracticeList,
  isWordUsed,
}: Props) => {
  const wordUsed = isWordUsed?.(word);
  const { firestore, wordLists, currentUser } = useFirebaseContext();
  const traditional = `(${word.traditional})`;
  const [showModal, setShowModal] = useState(false);
  query = query.toLowerCase();

  const cardStyles = {
    opacity: wordUsed ? 0.5 : 1,
  };

  const renderWordInformation = () => {
    return (
      <Group
        className="cursor-pointer"
        align="start"
        wrap="wrap"
        grow
        onClick={() => {
          setShowModal(true);
        }}
      >
        <Flex
          className="flex-1"
          justify="center"
          align="center"
          direction="column"
        >
          <Highlight
            size="sm"
            fw="700"
            highlight={query}
          >{`${word.simplified} ${traditional}`}</Highlight>
          <Highlight size="sm" highlight={query}>
            {word.pinyin}
          </Highlight>
        </Flex>
        <Highlight
          className="h-auto align-middle flex-2"
          size="xs"
          highlight={query}
          fs="italic"
        >
          {word.definition}
        </Highlight>
      </Group>
    );
  };

  const renderAddToPracticeList = () => {
    if (!currentUser) return null;

    return (
      <ActionIcon
        variant="subtle"
        size="md"
        onClick={() => {
          onAddToPracticeList!(word);
        }}
      >
        <IconPlus />
      </ActionIcon>
    );
  };

  const renderWordLists = () => {
    return (
      <Menu zIndex={30} disabled={wordUsed} withinPortal>
        <Menu.Target>
          <ActionIcon variant="subtle" size="md">
            <IconPlus />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {wordLists && wordLists.length > 0 ? (
            wordLists.map((list) => (
              <Menu.Item
                key={list.id}
                onClick={() => {
                  onAddToWordList?.(firestore, list, word);
                }}
              >
                {list.title}
              </Menu.Item>
            ))
          ) : (
            <Menu.Item fs="italic">No lists</Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>
    );
  };

  return (
    <>
      <Card className="mx-2" style={cardStyles} shadow="sm" h="120">
        <div className="w-full flex justify-end">
          {!wordUsed &&
            (onAddToWordList ? renderWordLists() : renderAddToPracticeList())}
        </div>
        {renderWordInformation()}
      </Card>
      <WordDetailModal
        word={word}
        opened={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      />
    </>
  );
};

export default WordResult;
