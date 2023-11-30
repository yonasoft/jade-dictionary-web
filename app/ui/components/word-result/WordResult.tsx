import { ScriptType, Word } from "@/app/lib/definitions";
import { Accordion, Card, Flex, Group, Text } from "@mantine/core";
import React from "react";

type Props = {
  query: string;
  word: Word;
};

const WordResult = ({ query, word }: Props) => {
  const traditional = `(${word.traditional})`;

  return (
    <Card shadow="md" withBorder>
      <Group align="start" grow>
        <Flex justify="center" align="center" direction="column">
          <Text size="xl" fw="500">{`${word.simplified} ${
            word.simplified != word.traditional ? traditional : ""
          }`}</Text>
          <Text size="md">{word.pinyin}</Text>
        </Flex>
        <Text className="h-auto align-middle">{word.definition}</Text>
      </Group>
    </Card>
  );
};

export default WordResult;
