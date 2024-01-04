"use client";
import { useEffect, useState } from "react";
import { PracticeType } from "../lib/types/practice";
import { Word } from "../lib/types/word";

export const usePracticeSettings = () => {
  const [selectedMode, setSelectedMode] = useState("flash-cards");

  const [selectedPracticeTypes, setSelectedPracticeTypes] = useState<
    PracticeType[]
  >([]);
  const isPracticeTypeSelected = selectedPracticeTypes.length > 0;

  const [timer, setTimer] = useState("none");
  const [stopwatchEnabled, setStopwatchEnabled] = useState(false);

  const [wordIds, setWordIds] = useState<Set<number>>(new Set([]));
  const [words, setWords] = useState<Word[]>([]);

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
    const savedWordIds = new Set<number>(
      JSON.parse(sessionStorage.getItem("practiceWordIds") || "[]")
    );
    const savedWords = JSON.parse(
      sessionStorage.getItem("practiceWords") || "[]"
    );

    if (savedPracticeMode !== selectedMode) setSelectedMode(savedPracticeMode);

    if (savedWordIds.size > 0) {
      setWordIds(savedWordIds);
    }
    if (savedWords.length > 0) {
      setWords(savedWords);
    }

    if (savedPracticeTypes.length > 0) {
      setSelectedPracticeTypes(savedPracticeTypes);
    }

    if (savedTimer !== "none") setTimer(savedTimer);

    if (stopwatchEnabled !== savedStopwatchEnabled)
      setStopwatchEnabled(savedStopwatchEnabled);
  }, []);

  useEffect(() => {
    console.log("Saving words to session storage");
    sessionStorage.setItem("practiceMode", JSON.stringify(selectedMode));
  }, [selectedMode]);

  useEffect(() => {
    console.log("Saving selectedQuizTypes to session storage");
    sessionStorage.setItem(
      "practiceTypes",
      JSON.stringify(selectedPracticeTypes)
    );
  }, [selectedPracticeTypes]);

  useEffect(() => {
    console.log("Saving timer to session storage");
    sessionStorage.setItem("practiceTimer", JSON.stringify(timer));
  }, [timer]);

  useEffect(() => {
    console.log("Saving stopwatchEnabled to session storage");
    sessionStorage.setItem(
      "practiceStopwatch",
      JSON.stringify(stopwatchEnabled)
    );
  }, [stopwatchEnabled]);

  useEffect(() => {
    console.log("Saving wordIds to session storage");
    sessionStorage.setItem(
      "practiceWordIds",
      JSON.stringify(Array.from(wordIds))
    );
  }, [wordIds]);

  useEffect(() => {
    console.log("Saving words to session storage");
    sessionStorage.setItem("practiceWords", JSON.stringify(words));
  }, [words]);

  const onRemove = (word: Word) => {
    const newWordIds = new Set(wordIds);
    newWordIds.delete(word._id);
    setWordIds(newWordIds);
    setWords(words.filter((w) => w._id !== word._id));
  };

  const onClear = async () => {
    setWordIds(new Set([]));
    setWords([]);
  };

  const addWord = async (word: Word) => {
    if (wordIds.size > 0 && wordIds.has(word._id)) {
      return;
    } else {
      setWordIds(new Set([...Array.from(wordIds), word._id]));
      setWords([...words, word]);
    }
  };

  const addWords = async (wordsToAdd: Word[]) => {
    const newWordIds = new Set(wordIds);

    wordsToAdd.forEach((word) => {
      if (newWordIds.size === 0 || !newWordIds.has(word._id)) {
        newWordIds.add(word._id);
      }
    });

    setWordIds(newWordIds);
    setWords([
      ...words,
      ...wordsToAdd.filter((word) => !wordIds.has(word._id)),
    ]);
  };

  const handlePracticeTypeChange = (type: PracticeType) => {
    setSelectedPracticeTypes((current) =>
      current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type]
    );
  };

  return {
    wordIds,
    words,
    onRemove,
    onClear,
    addWord,
    addWords,
    handlePracticeTypeChange,
    selectedPracticeTypes,
    setSelectedPracticeTypes,
    selectedMode,
    setSelectedMode,
    timer,
    setTimer,
    stopwatchEnabled,
    setStopwatchEnabled,
    isPracticeTypeSelected,
  };
};
