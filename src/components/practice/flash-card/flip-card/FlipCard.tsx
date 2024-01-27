"use client";
import React, { useState, useEffect } from "react";
import { Card, Text } from "@mantine/core";
import { PracticeType } from "@/src/lib/types/practice";
import { Word } from "@/src/lib/types/word";

type Props = {
  word: Word;
  practiceTypes: PracticeType[];
};

const FlipCard = ({ word, practiceTypes }: Props) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");

  useEffect(() => {
    if (word && practiceTypes.length > 0) {
      const randomPracticeType =
        practiceTypes[Math.floor(Math.random() * practiceTypes.length)];
      let text1, text2;

      switch (randomPracticeType) {
        case PracticeType.HanziToDefinition:
          text1 = `${word.simplified}${
            word.traditional !== word.simplified ? ` (${word.traditional})` : ""
          }`;
          text2 = word.definition;
          break;
        case PracticeType.HanziToPinyin:
          text1 = `${word.simplified}${
            word.traditional !== word.simplified ? ` (${word.traditional})` : ""
          }`;
          text2 = word.pinyin;
          break;
        default:
          text1 = "";
          text2 = "";
      }

      // Randomize front and back text
      if (Math.random() > 0.5) {
        setFrontText(text1);
        setBackText(text2);
      } else {
        setFrontText(text2);
        setBackText(text1);
      }
    }
  }, [word, practiceTypes]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      onClick={handleFlip}
      className="w-full h-full cursor-pointer"
      style={{
        perspective: "1000px",
        backgroundColor: "transparent",
      }}
    >
      <Card
        className="w-full h-full relative transition-transform duration-200 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateX(180deg)" : "rotateX(0deg)",
        }}
        shadow="md"
        color="white"
      >
        <div
          className="absolute w-full h-full p-4 flex items-center justify-center "
          style={{
            WebkitBackfaceVisibility: isFlipped ? "visible" : "hidden",
            backfaceVisibility: isFlipped ? "visible" : "hidden",
            transform: isFlipped ? "rotateX(180deg)" : "rotateX(0deg)",
          }}
        >
          <Text size="xl" fw={700}>
            {isFlipped ? backText : frontText}
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default FlipCard;
