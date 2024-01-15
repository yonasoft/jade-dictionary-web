import { Modal, Tabs, rem } from "@mantine/core";
import { IconList, IconSearch } from "@tabler/icons-react";
import React from "react";
import AddFromSearchTab from "./tabs/AddFromSearchTab";
import AddFromListsTab from "./tabs/AddFromListsTab";
import { Word } from "@/src/lib/types/word";

type Props = {
  opened: boolean;
  close: () => void;
  addWord: (word: Word) => Promise<void>;
  hasWord: (word: Word) => boolean;
  addWords: (words: Word[]) => Promise<void>;
};

const AddWordToPracticeModal = ({
  opened,
  close,
  addWord,
  addWords,
  hasWord,
}: Props) => {

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
            isWordInPractice={hasWord}
            addWordFromSearch={addWord}
          />
        </Tabs.Panel>

        <Tabs.Panel value="lists">
          <AddFromListsTab addWords={addWords} />
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
};

export default AddWordToPracticeModal;
