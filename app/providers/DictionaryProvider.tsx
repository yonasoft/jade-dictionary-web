"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ScriptType, Word } from "../lib/definitions";
import { FirebaseContext, useFirebaseContext } from "./FirebaseProvider";
import { searchWords } from "../lib/firebase/firestore/words-storage";

type Props = {
  children: React.ReactNode;
};

type DictionaryContextType = {
  query: string;
  setQuery: (query: string) => void;
  results: Word[];
  setResults: (results: Word[]) => void;
  loading: boolean;
  scriptType: ScriptType;
  setScriptType: (scriptType: ScriptType) => void;
  performSearch: (input: string) => void;
};

export const DictionaryContext = createContext<
  DictionaryContextType | undefined
>(undefined);

export const DictionaryContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Word[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [scriptType, setScriptType] = useState<ScriptType>(
    ScriptType.Simplified
  );

  const firebase = useFirebaseContext();

  const performSearch = async (input: string = query) => {
    setSearchLoading(true);
    return await searchWords(firebase.firestore, input)
      .then((words) => {
        console.log(words);
        setResults(words);
        setSearchLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setSearchLoading(false);
      });
  };

  return (
    <DictionaryContext.Provider
      value={{
        query,
        setQuery,
        results,
        setResults,
        loading: searchLoading,
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
