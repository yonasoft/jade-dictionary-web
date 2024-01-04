import { useState } from "react";
import { Word } from "../lib/types/word";
import { useStopwatch } from "react-timer-hook";
import { shuffleArray } from "../lib/utils/practice";

type Props = {};

export const useFlashCards = () => {
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

  const isAnswerSelected = (answer: string) => {
    return selectedAnswer === answer;
  };

  const handleNext = () => {
    //Reason for checking if currentWordIndex >= words.length - 1 instead of checking if icurrentWordIndex >= words.length:
    //Set State is asynchronous, so the currentWordIndex will not be updated immediately.
    //So the code relating to the timer/stopwatch will not work properly if we set state first.
    if (currentWordIndex >= words.length - 1) {
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

  const loadPracticeWords = () => {
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
    handleAnswer,
    isAnswerSelected,
    handleNext,
    loadPracticeWords,
    togglePause,
  };
};

export default useFlashCards;
