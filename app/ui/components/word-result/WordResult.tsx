import { ScriptType, Word } from "@/app/lib/definitions";
import { Accordion, Group } from "@mantine/core";
import React from "react";

type Props = {
  query: string;
  word: Word;
  scriptType: ScriptType;
};

const WordResult = ({ query, word, scriptType }: Props) => {
  return (
    <Accordion.Item
      key={word.id}
      value={
        scriptType === ScriptType.Simplified
          ? word.simplified
          : word.traditional
      }
    >
      <Accordion.Control>
        {scriptType === ScriptType.Simplified
          ? word.simplified
          : word.traditional}
        {word.definition}
      </Accordion.Control>
      <Accordion.Panel>{}</Accordion.Panel>
    </Accordion.Item>
  );
};

export default WordResult;
