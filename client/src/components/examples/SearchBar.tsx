import { useState } from "react";
import { SearchBar } from "../SearchBar";

export default function SearchBarExample() {
  const [search, setSearch] = useState("");

  return (
    <SearchBar
      value={search}
      onChange={(value) => {
        console.log("Search:", value);
        setSearch(value);
      }}
      placeholder="Search items..."
    />
  );
}
