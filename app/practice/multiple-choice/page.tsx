"use client";
import { Button, Divider, Flex, Group } from "@mantine/core";
import Link from "next/link";
import React, { useEffect } from "react";
import {
  IconArrowRight,
} from "@tabler/icons-react";
import MultipleChoiceCard from "../components/multiple-choice/multiple-choice-card/MultipleChoiceCard";
import {
  formatTime,
  isMultipleChoiceAnswerCorrect,
} from "@/app/lib/utils/practice";
import MultipleChoiceResults from "../components/multiple-choice/multiple-choice-results/MultipleChoiceResults";
import useMultipleChoice from "@/app/hooks/useMultipleChoice";

type Props = {};

const MultipleChoicePage = () => {
  const {
    selectedPracticeTypes,
    words,
    timerValue,
    stopwatchEnabled,
    stopwatch,
    selectedAnswer,
    setSelectedAnswer,
    currentWordIndex,
    secondsLeft,
    setSecondsLeft,

    allAnswers,
    isPaused,
    handleNext,
    togglePause,
    loadPracticeSession,
    timeUp,
    setTimeUp,
  } = useMultipleChoice();

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

    if (timerValue !== "none" && secondsLeft > 0 && !isPaused) {
      countdownInterval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerValue !== "none" && secondsLeft === 0 && !selectedAnswer) {
      setTimeUp(true);
      isMultipleChoiceAnswerCorrect(words[currentWordIndex], selectedAnswer);
      stopwatch.pause();
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [secondsLeft, isPaused]);

  return currentWordIndex >= words.length ? (
    <MultipleChoiceResults
      words={words}
      rightWrongAnswers={allAnswers}
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
          <MultipleChoiceCard
            words={words}
            currentWord={words[currentWordIndex]}
            practiceTypes={selectedPracticeTypes}
            selectedWord={selectedAnswer}
            setSelectedWord={setSelectedAnswer}
            timeUp={timeUp}
            isPaused={isPaused}
          />
        )}
      </Flex>
    </div>
  );
};

export default MultipleChoicePage;
