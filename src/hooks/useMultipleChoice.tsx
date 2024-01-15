"use client";
import { useState } from "react";
import { useStopwatch } from "react-timer-hook";
import { Word } from "../lib/types/word";
import { shuffleArray, isMultipleChoiceAnswerCorrect } from "../lib/utils/practice";

const useMultipleChoice = () => {
  const [selectedPracticeTypes, setSelectedPracticeTypes] = useState([]);
  const [words, setWords] = useState<Word[]>([]);
  const [timerValue, setTimerValue] = useState("none");
  const [stopwatchEnabled, setStopwatchEnabled] = useState(false);
  const stopwatch = useStopwatch({ autoStart: true });
  const [selectedAnswer, setSelectedAnswer] = useState<Word | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [answerCounts, setAnswerCounts] = useState({ wrong: 0, correct: 0 });
  const [allAnswers, setAllAnswers] = useState<boolean[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const loadPracticeSession = () => {
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
  };

  const handleNext = () => {
    if (currentWordIndex >= words.length - 1) {
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
  return {
    selectedPracticeTypes,
    setSelectedPracticeTypes,
    words,
    setWords,
    timerValue,
    setTimerValue,
    stopwatchEnabled,
    setStopwatchEnabled,
    stopwatch,
    selectedAnswer,
    setSelectedAnswer,
    currentWordIndex,
    setCurrentWordIndex,
    secondsLeft,
    setSecondsLeft,
    timeUp,
    setTimeUp,
    answerCounts,
    setAnswerCounts,
    allAnswers,
    setAllAnswers,
    isPaused,
    setIsPaused,
    handleNext,
    togglePause,
    loadPracticeSession,
  };
};

export default useMultipleChoice;
