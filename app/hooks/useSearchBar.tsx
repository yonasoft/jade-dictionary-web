import { useState } from "react";
import { performSearch } from "@/app/lib/utils/dictionary";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import { Word } from "../lib/types/word";

const useSearch = () => {
  const { firestore } = useFirebaseContext();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Word[]>([]);
  const [searched, setSearched] = useState(false);

  const onSearch = async () => {
    const searchResults = await performSearch(firestore, query);
    setResults(searchResults);
  };

  return { query, setQuery, results,onSearch, searched };
};

export default useSearch;
