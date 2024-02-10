"use client";
import { Divider, Button, Group, Flex, Text, Center } from "@mantine/core";
import Link from "next/link";
import React, { useEffect } from "react";
import { IconArrowRight } from "@tabler/icons-react";
import useFlashCards from "@/src/hooks/useFlashCards";
import AnswerButtons from "@/src/components/practice/flash-card/answer-buttons/AnswerButtons";
import FlashCardResults from "@/src/components/practice/flash-card/flash-card-results/FlashCardResults";
import FlipCard from "@/src/components/practice/flash-card/flip-card/FlipCard";
import { formatTime } from "@/src/lib/utils/practice";

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

      <Text className="px-1 mb-1">
        <strong>Word:</strong> {currentWordIndex + 1}/{words.length}
      </Text>

      <br className="mb-1" />

      <Center className="w-full h-full flex flex-col">
        {words.length > 0 && (
          <FlipCard
            className="w-full h-full min-h-64"
            word={words[currentWordIndex]}
            practiceTypes={selectedPracticeTypes}
          />
        )}
        <br />
        <AnswerButtons
          handleAnswer={handleAnswer}
          isAnswerSelected={isAnswerSelected}
          isPaused={isPaused}
          timeUp={timeUp}
        />
      </Center>
    </div>
  );
};

export default FlashCardsPage;
