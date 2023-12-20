import { Word } from "@/app/lib/definitions";
import { Modal, Tabs, rem } from "@mantine/core";
import { IconList, IconSearch } from "@tabler/icons-react";
import React from "react";

type Props = {
  opened: boolean;
  close: () => void;
  words: Word[];
  wordIds: number[];
};

const AddWordToPracticeModal = ({ opened, close, words, wordIds }: Props) => {
  return (
    <Modal
      size="xl"
      opened={opened}
      onClose={close}
      title="Add words to practice"
      centered
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
            Lists
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="search">Gallery tab content</Tabs.Panel>

        <Tabs.Panel value="lists">Messages tab content</Tabs.Panel>
      </Tabs>
    </Modal>
  );
};

export default AddWordToPracticeModal;
