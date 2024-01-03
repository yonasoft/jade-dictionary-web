"use client";
import { useState } from "react";
import { useFirebaseContext } from "../providers/FirebaseProvider";
import { performSearch } from "../lib/utils/dictionary";
import { Word } from "../lib/types/word";

const useHome = () => {
  const { firestore } = useFirebaseContext();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Word[]>([]);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSessions = async () => {
    const loadedQuery = JSON.parse(sessionStorage.getItem("homeQuery") || '""');
    const loadedResults = JSON.parse(
      sessionStorage.getItem("homeResults") || "[]"
    );
    setQuery(loadedQuery);
    setResults(loadedResults);
    if (loadedQuery) setSearched(true);
  };

  const saveQuerySession = async () => {
    sessionStorage.setItem("homeQuery", JSON.stringify(query));
  };
  const saveResultSession = async () => {
    sessionStorage.setItem("homeResults", JSON.stringify(results));
  };

  const onSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const searchResults = await performSearch(firestore, query);
      setResults(searchResults);
    } catch (e: any) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    query,
    setQuery,
    results,
    onSearch,
    searched,
    loadSessions,
    saveQuerySession,
    saveResultSession,
  };
};

export default useHome;
