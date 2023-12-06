"use client";
import { ScriptType, Word } from "@/app/lib/definitions";
import {
  DictionaryContext,
  useDictionaryContext,
} from "@/app/providers/DictionaryProvider";
import { Accordion, Button, Card, Flex, Group, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import React from "react";

type Props = {
  query: string;
  word: Word;
};

const WordResult = ({ query, word }: Props) => {
  const traditional = `(${word.traditional})`;
  const dictionary = useDictionaryContext();

  return (
    <Card className="mx-2 my-1" shadow="sm" withBorder>
      <div className="flex">
        <Group className="grow" align="start" wrap="wrap" grow>
          <Flex justify="center" align="center" direction="column">
            <Text size="xl" fw="500">{`${word.simplified} ${
              word.simplified != word.traditional ? traditional : ""
            }`}</Text>
            <Text size="md">{word.pinyin}</Text>
          </Flex>
          <Text className="h-auto align-middle">{word.definition}</Text>
        </Group>
        <Button className="grow-0 ">
          <IconPlus />
        </Button>
      </div>
    </Card>
  );
};

export default WordResult;
