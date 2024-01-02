"use client";
import { Word } from "@/app/lib/definitions";
import { Button, Divider, Flex, Group } from "@mantine/core";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useStopwatch } from "react-timer-hook";
import FlipCard from "../flash-cards/flip-card/FlipCard";
import {
  IconArrowRight,
  IconCheck,
  IconCircle,
  IconX,
} from "@tabler/icons-react";
import MultipleChoiceCard from "./multiple-choice-card/MultipleChoiceCard";
import { handleMultipleChoiceAnswer, shuffleArray } from "@/app/lib/utils/practice";

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
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  useEffect(() => {
    const savedPracticeMode = JSON.parse(
      sessionStorage.getItem("practiceMode") || '"flash-cards"'
    );
    const savedPracticeTypes = JSON.parse(
      sessionStorage.getItem("practiceTypes") || "[]"
    );
    const savedTimer = JSON.parse(
      sessionStorage.getItem("practiceTimer") || '"none"'
    );
    const savedStopwatchEnabled = JSON.parse(
      sessionStorage.getItem("practiceStopwatch") || "false"
    );

    const savedWords = JSON.parse(
      sessionStorage.getItem("practiceWords") || "[]"
    );
    if (savedWords.length > 0) {
      setWords(shuffleArray(savedWords));
    }

    if (savedPracticeTypes.length > 0) {
      setSelectedPracticeTypes(savedPracticeTypes);
    }

    if (savedTimer !== "none") setTimerValue(savedTimer);

    if (stopwatchEnabled !== savedStopwatchEnabled)
      setStopwatchEnabled(savedStopwatchEnabled);

  }, []);

  useEffect(() => {
    if (timerValue !== "none") {
      setSecondsLeft(parseInt(timerValue));
    }
  }, [timerValue]);

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
      //   handleAnswer(false);
      stopwatch.pause();
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [secondsLeft, isPaused]);

  const handleNext = () => {
    handleMultipleChoiceAnswer(
      selectedWord,
      words[currentWordIndex],
      setAnswerCounts,
      setAllAnswers
    );

    if (currentWordIndex >= words.length - 1) {
      finalTime = stopwatch.seconds;
      stopwatch.pause();
      setIsPaused(true);
      setCurrentWordIndex((prev) => prev + 1);
    } else {
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

  return (
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
      <Group className="px-1 mb-1" justify="space-between">
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
            size="md"
          >
            {isPaused ? "Unpause" : "Pause"}
          </Button>
        )}
        <Button
          onClick={handleNext}
          variant="filled"
          size="md"
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
          />
        )}
      </Flex>
    </div>
  );
};

export default MultipleChoicePage;
