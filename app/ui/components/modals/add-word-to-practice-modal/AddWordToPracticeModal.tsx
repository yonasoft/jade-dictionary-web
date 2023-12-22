import { Word } from "@/app/lib/definitions";
import { Modal, Tabs, rem } from "@mantine/core";
import { IconList, IconSearch } from "@tabler/icons-react";
import React from "react";
import AddFromSearchTab from "./tabs/AddFromSearchTab";

type Props = {
  opened: boolean;
  close: () => void;
  words: Word[];
  addWord: (word: Word) => void;
  wordIds: number[];
  addWordIds: (wordId: number) => void;
};

const AddWordToPracticeModal = ({
  opened,
  close,
  words,
  addWord,
  wordIds,
  addWordIds,
}: Props) => {
  const addWordFromSearch = async (word: Word) => {
    addWord(word);
    addWordIds(word._id);
  };

  const isWordInPractice = (word: Word) => {
    return wordIds.includes(word._id);
  };
  return (
    <Modal
      size="xl"
      opened={opened}
      onClose={close}
      title="Add words to practice"
    >
      <Tabs defaultValue="search">
        <Tabs.List>
          <Tabs.Tab
            value="search"
            leftSection={
              <IconSearch style={{ width: rem(12), height: rem(12) }} />
            }
          >
            Search
          </Tabs.Tab>
          <Tabs.Tab
            value="lists"
            leftSection={
              <IconList style={{ width: rem(12), height: rem(12) }} />
            }
          >
            My Lists
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="search">
          <AddFromSearchTab
            isWordInPractice={isWordInPractice}
            addWordFromSearch={addWordFromSearch}
          />
        </Tabs.Panel>

        <Tabs.Panel value="lists">Messages tab content</Tabs.Panel>
      </Tabs>
    </Modal>
  );
};

export default AddWordToPracticeModal;
