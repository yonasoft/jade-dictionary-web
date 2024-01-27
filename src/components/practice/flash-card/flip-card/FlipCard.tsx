"use client";
import React, { useState, useEffect } from "react";
import { Card, Text } from "@mantine/core";
import { PracticeType } from "@/src/lib/types/practice";
import { Word } from "@/src/lib/types/word";
import { randomizeFlashCard } from "@/src/lib/utils/practice";

type Props = {
  className: string;
  word: Word;
  practiceTypes: PracticeType[];
};

const FlipCard = ({ className, word, practiceTypes }: Props) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");

  useEffect(() => {
    const { front, back } = randomizeFlashCard(word, practiceTypes);
    setFrontText(front);
    setBackText(back);
  }, [word, practiceTypes]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      onClick={handleFlip}
      className={`${className} cursor-pointer`}
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
