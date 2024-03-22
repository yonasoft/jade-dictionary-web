import { PracticeType } from "@/src/lib/types/practice";
import { Word, WordAspect } from "@/src/lib/types/word";
import {
  randomizePracticeType,
  randomizeQAWordAspects,
  generateMultipleChoice,
} from "@/src/lib/utils/practice";
import { extractWordAspect } from "@/src/lib/utils/words";
import { Card, Center, Flex, Radio, Title, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";

type Props = {
  words: Word[];
  currentWord: Word;
  practiceTypes: PracticeType[];
  selectedWord: Word | null;
  setSelectedWord: React.Dispatch<React.SetStateAction<Word | null>>;
  timeUp: boolean;
  isPaused: boolean;
};

const MultipleChoiceCard = ({
  words,
  currentWord,
  practiceTypes,
  selectedWord,
  setSelectedWord,
  timeUp,
  isPaused,
}: Props) => {
  const [qaWordAspects, setQAWordAspects] = useState<{
    question: WordAspect | null;
    answer: WordAspect | null;
  }>({
    question: null,
    answer: null,
  });

  const [choices, setChoices] = useState<Word[]>([]);

  useEffect(() => {
    const practiceType = randomizePracticeType(practiceTypes);
    randomizeQAWordAspects(practiceType, setQAWordAspects);
    setChoices(generateMultipleChoice(words, currentWord));
  }, [currentWord, practiceTypes]);

  return (
    <Card className="w-full h-full">
      <Flex
        className="w-full h-full"
        align="center"
        justify="center"
        direction="column"
      >
        <fieldset>
          <Center>
            <label>
              <Text>
                Match the {qaWordAspects.question} with the correct{" "}
                {qaWordAspects.answer}
              </Text>
            </label>
          </Center>
          <Center className="my-3">
            <Title order={3} className="text-xl">
              {extractWordAspect(currentWord, qaWordAspects.question)}
            </Title>
          </Center>
          {choices.map((choice, index) => (
            <Center className="my-3">
              <Radio
                key={index}
                className="mb-3"
                label={extractWordAspect(choice, qaWordAspects.answer)}
                color="teal"
                variant="outline"
                checked={selectedWord === choice}
                onChange={() => setSelectedWord(choice)}
                disabled={timeUp || isPaused}
              />
            </Center>
          ))}
        </fieldset>
      </Flex>
    </Card>
  );
};

export default MultipleChoiceCard;
