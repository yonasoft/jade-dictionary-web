"use client";
import { Divider, Button, Card, Group, Center, Flex } from "@mantine/core";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useStopwatch } from "react-timer-hook";
import FlipCard from "./flip-card/FlipCard";
import {
  IconArrowRight,
  IconCheck,
  IconCircle,
  IconX,
} from "@tabler/icons-react";
import FlashCardResults from "./results/FlashCardResults";
import { shuffleArray } from "@/app/lib/utils/practice";
import { Word } from "@/app/lib/types/word";

type Props = {};

const FlashCardsPage = (props: Props) => {
  let finalTime = 0;

  const [selectedPracticeTypes, setSelectedPracticeTypes] = useState([]);
  const [words, setWords] = useState<Word[]>([]);
  const [timerValue, setTimerValue] = useState("none");
  const [stopwatchEnabled, setStopwatchEnabled] = useState(false);
  const stopwatch = useStopwatch({ autoStart: true });
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [answerCounts, setAnswerCounts] = useState({
    wrong: 0,
    neutral: 0,
    correct: 0,
  });
  const [allAnswers, setAllAnswers] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);

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
      handleAnswer("wrong");
      stopwatch.pause();
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [secondsLeft, isPaused]);

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      stopwatch.start();
    } else {
      stopwatch.pause();
    }
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);

    setAllAnswers((prev) => [...prev, answer]);

    if (answer === "wrong" || answer === "neutral" || answer === "correct") {
      setAnswerCounts((prev) => ({
        ...prev,
        [answer]: prev[answer] + 1,
      }));
    }
  };

  const handleNext = () => {
    //Reason for checking if currentWordIndex >= words.length - 1 instead of checking if icurrentWordIndex >= words.length:
    //Set State is asynchronous, so the currentWordIndex will not be updated immediately.
    //So the code relating to the timer/stopwatch will not work properly if we set state first.
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

  const isAnswerSelected = (answer: string) => {
    return selectedAnswer === answer;
  };


  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

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
        <Group align="center" mt="md">
          <Button
            variant={isAnswerSelected("wrong") ? "filled" : "default"}
            onClick={() => {
              handleAnswer("wrong");
            }}
            disabled={isPaused}
          >
            <IconX color={isAnswerSelected("wrong") ? "white" : "red"} />
          </Button>
          <Button
            variant={isAnswerSelected("neutral") ? "filled" : "default"}
            onClick={() => {
              handleAnswer("neutral");
            }}
            disabled={timeUp || isPaused}
          >
            <IconCircle
              color={isAnswerSelected("neutral") ? "white" : "yellow"}
            />
          </Button>
          <Button
            variant={isAnswerSelected("correct") ? "filled" : "default"}
            onClick={() => {
              handleAnswer("correct");
            }}
            disabled={timeUp || isPaused}
          >
            <IconCheck
              color={isAnswerSelected("correct") ? "white" : "green"}
            />
          </Button>
        </Group>
      </Flex>
    </div>
  );
};

export default FlashCardsPage;
