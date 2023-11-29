"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ScriptType, Word } from "../lib/definitions";
import { FirebaseContext, useFirebaseContext } from "./FirebaseProvider";
import { searchSimplified } from "../lib/firebase/words-storage";

type Props = {
  children: React.ReactNode;
};

type DictionaryContextType = {
  query: string;
  setQuery: (query: string) => void;
  results: Word[];
  setResults: (results: Word[]) => void;
  scriptType: ScriptType;
  setScriptType: (scriptType: ScriptType) => void;
  performSearch: () => void;
};

export const DictionaryContext = createContext<
  DictionaryContextType | undefined
>(undefined);

export const DictionaryContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Word[]>([]);
  const [scriptType, setScriptType] = useState<ScriptType>(
    ScriptType.Simplified
  );

  const firebase = useFirebaseContext();

  const performSearch = async () => {
    await searchSimplified(firebase.db, query).then((results) => {
      setResults(results);
    });
  };

  return (
    <DictionaryContext.Provider
      value={{
        query,
        setQuery,
        results,
        setResults,
        scriptType,
        setScriptType,
        performSearch,
      }}
    >
      {children}
    </DictionaryContext.Provider>
  );
};

export const useDictionaryContext = () => {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error(
      "useDictionaryContext must be used within a DictionaryContextProvider"
    );
  }
  return context;
};
