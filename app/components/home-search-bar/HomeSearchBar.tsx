import React, {  } from "react";


import { handleKeyPress } from "@/app/lib/utils/events";
import { SearchHoverCard } from "../../ui/components/hover-cards/SearchHoverCard";
import { SearchInput } from "../../ui/components/search-input/SearchInput";

type Props = {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
};

const HomeSearchBar = ({ query, setQuery, onSearch }: Props) => {
  const onKeyPressSearch = (event: React.KeyboardEvent) => {
    handleKeyPress(event, ["Enter", "Go", "Search", "ArrowRight"], () => {
      onSearch();
    });
  };

  return (
    <div className="flex-1 max-w-[20rem] w-full bg-transparent border-none">
      <SearchHoverCard
        searchBar={
          <SearchInput
            query={query}
            setQuery={setQuery}
            handleSearch={onSearch}
            handleKeyPress={onKeyPressSearch}
          />
        }
      />
    </div>
  );
};

export default HomeSearchBar;
