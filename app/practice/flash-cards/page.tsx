"use client";
import React, { useEffect, useState } from "react";

type Props = {};

const page = (props: Props) => {
  const [selectedQuizTypes, setSelectedQuizTypes] = useState([]);
  const [timer, setTimer] = useState("");
  const [stopwatchEnabled, setStopwatchEnabled] = useState(false);
  const [selectedPracticeTypes, setSelectedPracticeTypes] = useState([]);
  const [words, setWords] = useState([]);

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

  return <div>page</div>;
};

export default page;
