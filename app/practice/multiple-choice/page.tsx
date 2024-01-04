"use client";
import { Button, Divider, Flex, Group } from "@mantine/core";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useStopwatch } from "react-timer-hook";
import FlipCard from "../components/flash-card/flip-card/FlipCard";
import {
  IconArrowRight,
  IconCheck,
  IconCircle,
  IconX,
} from "@tabler/icons-react";
import MultipleChoiceCard from "../components/multiple-choice/multiple-choice-card/MultipleChoiceCard";
import {
  isMultipleChoiceAnswerCorrect,
  shuffleArray,
} from "@/app/lib/utils/practice";
import { Word } from "@/app/lib/types/word";
import MultipleChoiceResults from "../components/multiple-choice/multiple-choice-results/MultipleChoiceResults";

type Props = {};

const MultipleChoicePage = (props: Props) => {
  let finalTime = 0;

  const [selectedPracticeTypes, setSelectedPracticeTypes] = useState([]);
  const [words, setWords] = useState<Word[]>([]);
  const [timerValue, setTimerValue] = useState("none");
  const [stopwatchEnabled, setStopwatchEnabled] = useState(false);
  const stopwatch = useStopwatch({ autoStart: true });
  const [selectedAnswer, setSelectedAnswer] = useState<Word | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [answerCounts, setAnswerCounts] = useState({
    wrong: 0,
    correct: 0,
  });
  const [allAnswers, setAllAnswers] = useState<boolean[]>([]);
  const [isPaused, setIsPaused] = useState(false);

 

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

  const handleNext = () => {
    if (currentWordIndex >= words.length - 1) {
      finalTime = stopwatch.seconds;
      stopwatch.pause();
      setIsPaused(true);
      const isAnswerCorrect = isMultipleChoiceAnswerCorrect(
        words[currentWordIndex],
        selectedAnswer
      );
      setAllAnswers((prev) => [...prev, isAnswerCorrect]);
      setCurrentWordIndex((prev) => prev + 1);
    } else {
      const isAnswerCorrect = isMultipleChoiceAnswerCorrect(
        words[currentWordIndex],
        selectedAnswer
      );
      setAllAnswers((prev) => [...prev, isAnswerCorrect]);
      setTimeUp(false);
      setCurrentWordIndex((prev) => prev + 1);
      if (timerValue !== "none") {
        setSecondsLeft(parseInt(timerValue));
      }
      setSelectedAnswer(null);

      if (currentWordIndex < words.length - 1 && !stopwatch.isRunning) {
        stopwatch.start();
      }
      setIsPaused(false);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      stopwatch.start();
    } else {
      stopwatch.pause();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

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
