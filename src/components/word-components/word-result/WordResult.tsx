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
import React from "react";

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
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const { firestore, wordLists, currentUser } = useFirebaseContext();
  const traditional = `(${word.traditional})`;
  query = query.toLowerCase();

  const cardStyles = {
    opacity: wordUsed ? 0.5 : 1,
  };

  return (
    <Card style={cardStyles} className="mx-2 my-1" shadow="sm" withBorder>
      <div className="flex-col">
        <div className="w-full flex justify-end">
          {wordUsed
            ? null
            : (currentUser &&
                onAddToWordList && ( // Only show if a user is logged in
                  <Menu zIndex={30} disabled={wordUsed} withinPortal>
                    <Menu.Target>
                      <ActionIcon variant="outline" size="lg">
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
                        <Menu.Item style={{ fontStyle: "italic" }}>
                          No lists
                        </Menu.Item>
                      )}
                    </Menu.Dropdown>
                  </Menu>
                )) ||
              (onAddToPracticeList && (
                <ActionIcon
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    onAddToPracticeList(word);
                  }}
                >
                  <IconPlus size={24} />
                </ActionIcon>
              ))}
        </div>
        <Group className="grow" align="start" wrap="wrap" grow>
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
      </div>
    </Card>
  );
};

export default WordResult;
