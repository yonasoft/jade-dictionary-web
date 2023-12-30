"use client";
import React, { useState, useEffect } from "react";
import { Card, Text } from "@mantine/core";
import { PracticeType, Word } from "@/app/lib/definitions";

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
    <Card
      onClick={handleFlip}
      className="relative w-full h-full bg-white shadow-md cursor-pointer"
      style={{ perspective: "1000px" }}
      shadow="md"
    >
      <div
        className="w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateX(180deg)" : "rotateX(0deg)",
        }}
      >
        <div
          className="absolute w-full h-full p-4 flex items-center justify-center text-2xl font-bold"
          style={{ backfaceVisibility: "hidden", transform: "rotateX(0)" }}
        >
          <Text>{frontText}</Text>
        </div>
        <div
          className="absolute w-full h-full p-4 flex items-center justify-center text-xl"
          style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
        >
          <Text>{backText}</Text>
        </div>
      </div>
    </Card>
  );
};

export default FlipCard;
