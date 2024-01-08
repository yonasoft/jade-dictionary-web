"use client";
import { Divider, Button, Group, Flex } from "@mantine/core";
import Link from "next/link";
import React, { useEffect } from "react";
import FlipCard from "../components/flash-card/flip-card/FlipCard";
import {
  IconArrowRight,
} from "@tabler/icons-react";
import FlashCardResults from "../components/flash-card/flash-card-results/FlashCardResults";
import { formatTime } from "@/app/lib/utils/practice";
import useFlashCards from "@/app/hooks/useFlashCards";
import AnswerButtons from "../components/flash-card/answer-buttons/AnswerButtons";

type Props = {};

const FlashCardsPage = () => {
  const {
    selectedPracticeTypes,
    words,
    timerValue,
    stopwatchEnabled,
    stopwatch,
    selectedAnswer,
    currentWordIndex,
    secondsLeft,
    setSecondsLeft,
    timeUp,
    setTimeUp,
    answerCounts,
    allAnswers,
    isPaused,
    handleAnswer,
    isAnswerSelected,
    handleNext,
    togglePause,
    loadPracticeSession,
  } = useFlashCards();

  useEffect(() => {
    loadPracticeSession();
  }, []);

  useEffect(() => {
    if (timerValue !== "none") {
      setSecondsLeft(parseInt(timerValue));
    }
  }, [timerValue]);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout | null = null;

    if (secondsLeft > 0 && !isPaused) {
      countdownInterval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && timerValue !== "none" && !selectedAnswer) {
      setTimeUp(true);
      handleAnswer("wrong");
      stopwatch.pause();
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [secondsLeft, isPaused]);

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
          <Button color="red" variant="filled">
            Exit
          </Button>
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
