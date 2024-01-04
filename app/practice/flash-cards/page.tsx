"use client";
import { Divider, Button, Card, Group, Center, Flex } from "@mantine/core";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useStopwatch } from "react-timer-hook";
import FlipCard from "../components/flash-card/flip-card/FlipCard";
import {
  IconArrowRight,
  IconCheck,
  IconCircle,
  IconX,
} from "@tabler/icons-react";
import FlashCardResults from "../components/flash-card/flash-card-results/FlashCardResults";
import { formatTime, shuffleArray } from "@/app/lib/utils/practice";
import { Word } from "@/app/lib/types/word";
import useFlashCards from "@/app/hooks/useFlashCards";
import AnswerButtons from "../components/flash-card/answer-buttons/AnswerButtons";

type Props = {};

const FlashCardsPage = (props: Props) => {
  const {
    selectedPracticeTypes,
    words,
    timerValue,
    stopwatchEnabled,
    stopwatch,
    selectedAnswer,
    currentWordIndex,
    secondsLeft,
    timeUp,
    answerCounts,
    allAnswers,
    isPaused,
    togglePause,
    handleAnswer,
    isAnswerSelected,
    handleNext,
  } = useFlashCards();

  return currentWordIndex >= words.length ? (
    <FlashCardResults
      words={words}
      answerCounts={answerCounts}
      allAnswers={allAnswers}
      totalTime={stopwatch.seconds}
    />
  ) : (
    <div className="flex flex-col h-screen">
      <Group justify="space-between" className="p-4">
        {stopwatchEnabled && (
          <div>
            <strong>Stopwatch:</strong> {formatTime(stopwatch.seconds)}
          </div>
        )}
        <Link href="/practice" passHref>
          <Button color="red">Exit</Button>
        </Link>
      </Group>
      <Divider my="sm" />
      <Group className="px-1 mb-1" justify="space-between" wrap="nowrap">
        {timerValue && (
          <span>
            <strong>Timer:</strong> {formatTime(secondsLeft)}
          </span>
        )}
        {secondsLeft > 0 && (
          <Button
            className="mr-4"
            onClick={togglePause}
            variant="filled"
            color="gray"
            size="sm"
          >
            {isPaused ? "Unpause" : "Pause"}
          </Button>
        )}
        <Button
          onClick={handleNext}
          variant="filled"
          size="sm"
          className="my-4"
          disabled={!selectedAnswer && secondsLeft > 0}
        >
          Next <IconArrowRight />
        </Button>
      </Group>
      <div className="px-1 mb-1">
        <strong>Word:</strong> {currentWordIndex + 1}/{words.length}
      </div>
      <Flex className="flex-grow" direction="column" align="center">
        {words.length > 0 && (
          <div className="w-full h-3/4 md:w-3/4 md:h-1/2">
            <FlipCard
              word={words[currentWordIndex]}
              practiceTypes={selectedPracticeTypes}
            />
          </div>
        )}
        <AnswerButtons
          handleAnswer={handleAnswer}
          isAnswerSelected={isAnswerSelected}
          isPaused={isPaused}
          timeUp={timeUp}
        />
      </Flex>
    </div>
  );
};

export default FlashCardsPage;
