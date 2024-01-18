import { useState } from "react";
import { useFirebaseContext } from "../providers/FirebaseProvider";
import { useMantineColorScheme } from "@mantine/core";
import { Word } from "../lib/types/word";
import { performSearch } from "../lib/utils/dictionary";

const useHome = () => {
  const { firestore } = useFirebaseContext();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Word[]>([]);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { colorScheme } = useMantineColorScheme();
  const [titleColor, setTitleColor] = useState("black");

  const loadHomeSessionStorage = async () => {
    const loadedQuery = JSON.parse(sessionStorage.getItem("homeQuery") || '""');
    const loadedResults = JSON.parse(
      sessionStorage.getItem("homeResults") || "[]"
    );
    console.log("loadedQuery", loadedQuery);
    console.log("loadedResults", loadedResults);
    if (loadedQuery !== "") setQuery(loadedQuery);
    if (loadedResults.length > 0) setResults(loadedResults);
    if (loadedQuery) setSearched(true);
  };

  const saveQuery = async () => {
    sessionStorage.setItem("homeQuery", JSON.stringify(query));
    console.log("saved query", query);
  };

  const saveResults = async () => {
    sessionStorage.setItem("homeResults", JSON.stringify(results));
    console.log("saved results", results);
  };

  const onSearch = async (query: string) => {
    if (query.trim() === "") return;
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
    titleColor,
    colorScheme,
    setTitleColor,
    setResults,
    setSearched,
    saveQuery,
    saveResults,
    loadHomeSessionStorage,
  };
};

export default useHome;
