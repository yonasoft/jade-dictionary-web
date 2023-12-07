"use client";
import React, { useEffect, useState } from "react";
import { Card, Text, Menu, Button, Group, Divider } from "@mantine/core";
import { Word, WordList } from "@/app/lib/definitions";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import { getWordsByIds } from "@/app/lib/firebase/words-storage";
import {
  IconDeviceGamepad,
  IconDotsVertical,
  IconRun,
  IconTrash,
} from "@tabler/icons-react";

type Props = {
  wordList: WordList;
};

const WordListCard = ({ wordList }: Props) => {
  const { firestore } = useFirebaseContext();

  const handleRemoveWordList = async () => {
    // Logic to remove the word list from Firestore
  };

  const handlePractice = async () => {};

  return (
    <Card
      className="mt-3 me-3 w-60 h-70 relative cursor-pointer bg-white rounded-lg hover:bg-gray-100 focus-within:border focus-within:border-jade-color"
      shadow="lg"
      radius="md"
      withBorder
    >
      <div className="p-3">
        <h3 className="text-xl font-bold line-clamp-1">{wordList.title}</h3>
        <Divider className="my-2" />
        <p className="text-sm text-gray-600 line-clamp-2">
          {wordList.description}
        </p>
      </div>
      <div className="absolute top-0 right-0 m-0">
        <Menu position="bottom-end" withinPortal>
          <Menu.Target>
            <Button variant="subtle" size="xs">
              <IconDotsVertical />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconTrash />}
              onClick={handleRemoveWordList}
            >
              Remove
            </Menu.Item>
            <Menu.Item
              leftSection={<IconDeviceGamepad />}
              onClick={handlePractice}
            >
              Practice
            </Menu.Item>
            {/* Additional menu items can be added here */}
          </Menu.Dropdown>
        </Menu>
      </div>
    </Card>
  );
};

export default WordListCard;
