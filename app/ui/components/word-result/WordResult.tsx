import { ScriptType, Word } from "@/app/lib/definitions";
import { Accordion, Group } from "@mantine/core";
import React from "react";

type Props = {
  query: string;
  word: Word;
};

const WordResult = ({ query, word }: Props) => {
  return (
    <Accordion.Item key={word.id} value={word.simplified || word.traditional}>
      <Accordion.Control>
        {word.simplified}
        {word.traditional == word.simplified && word.traditional}
        {word.definition}
      </Accordion.Control>
      <Accordion.Panel>{}</Accordion.Panel>
    </Accordion.Item>
  );
};

export default WordResult;
