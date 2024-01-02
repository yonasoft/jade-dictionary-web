"use client";
import { PracticeType } from "@/app/lib/types/practice";
import { Word, WordAspect } from "@/app/lib/types/word";
import {
  generateMultipleChoice,
  randomizePracticeType,
  randomizeQAWordAspects,
} from "@/app/lib/utils/practice";
import { extractWordAspect, textifyHanzi } from "@/app/lib/utils/words";
import { Center, Radio, Title } from "@mantine/core";
import React, { SetStateAction, useEffect, useState } from "react";

type Props = {
  words: Word[];
  currentWord: Word;
  practiceTypes: PracticeType[];
  selectedWord: Word | null;
  setSelectedWord: React.Dispatch<React.SetStateAction<Word | null>>;
};

const MultipleChoiceCard = ({
  words,
  currentWord,
  practiceTypes,
  selectedWord,
  setSelectedWord,
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
    <fieldset>
      <label>
        Match the {qaWordAspects.question} with the correct{" "}
        {qaWordAspects.answer}
      </label>
      <Center className="my-3">
        <Title>{extractWordAspect(currentWord, qaWordAspects.question)}</Title>
      </Center>
      {choices.map((choice) => {
        return (
          <Radio
            className="mb-3"
            label={extractWordAspect(choice, qaWordAspects.answer)}
            color="teal"
            variant="outline"
            checked={selectedWord === choice}
            onChange={(event) => setSelectedWord(choice)}
          />
        );
      })}
    </fieldset>
  );
};

export default MultipleChoiceCard;
