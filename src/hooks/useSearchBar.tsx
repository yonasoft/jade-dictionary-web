import { useState } from "react";
import { useFirebaseContext } from "@/src/providers/FirebaseProvider";
import { Word } from "../lib/types/word";
import { performSearch } from "../lib/utils/dictionary";

const useSearch = () => {
  const { firestore } = useFirebaseContext();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Word[]>([]);
  const [searched, setSearched] = useState(false);

  const onSearch = async () => {
    if (query.trim() === "") return;
    const searchResults = await performSearch(firestore, query);
    setResults(searchResults);
  };

  return { query, setQuery, results, onSearch, searched };
};

export default useSearch;
