"use client";
import { PracticeType } from "@/app/lib/types/practice";
import { Word, WordAspect } from "@/app/lib/types/word";
import {
  generateMultipleChoice,
  randomizePracticeType,
  randomizeQAWordAspects,
} from "@/app/lib/utils/practice";
import { extractWordAspect } from "@/app/lib/utils/words";
import { Center, Radio, Title } from "@mantine/core";
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
    <fieldset className="p-4 border border-gray-200 rounded-md">
      <label className="block text-lg font-bold mb-3">
        Match the {qaWordAspects.question} with the correct{" "}
        {qaWordAspects.answer}
      </label>
      <Center className="my-3">
        <Title order={3} className="text-xl">
          {extractWordAspect(currentWord, qaWordAspects.question)}
        </Title>
      </Center>
      {choices.map((choice, index) => (
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
      ))}
    </fieldset>
  );
};

export default MultipleChoiceCard;
