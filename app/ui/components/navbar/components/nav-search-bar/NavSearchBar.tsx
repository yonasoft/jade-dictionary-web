import React, {  } from "react";
import { spotlight } from "@mantine/spotlight";

import SearchSpotlight from "./SearchSpotlight";
import { handleKeyPress } from "@/app/lib/utils/events";
import { SearchInput } from "../../../search-input/SearchInput";
import useSearch from "@/app/hooks/useSearchBar";
import { SearchHoverCard } from "../../../hover-cards/SearchHoverCard";

const NavSearchBar = () => {
  const { query, setQuery, results, onSearch, searched } = useSearch();

  const onInitialSearch = () => {
    onSearch();
    spotlight.open();
  };

  const onKeyPressSearch = (event: React.KeyboardEvent) => {
    handleKeyPress(event, ["Enter", "Go", "Search", "ArrowRight"], () => {
      onInitialSearch();
    });
  };

  return (
    <>
      <div className="flex-1 max-w-[20rem] w-full bg-transparent border-none">
        {
          <SearchHoverCard
            searchBar={
              <div className="flex w-full max-w-md mx-auto">
                <SearchInput
                  query={query}
                  setQuery={setQuery}
                  handleSearch={onInitialSearch}
                  handleKeyPress={(e) => {
                    onKeyPressSearch(e);
                  }}
                />
              </div>
            }
          />
        }
      </div>
      <SearchSpotlight
        query={query}
        setQuery={setQuery}
        results={results}
        onSearch={onSearch}
        searched={searched}
      />
    </>
  );
};

export default NavSearchBar;
