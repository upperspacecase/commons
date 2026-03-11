import { useState } from "react";
import { CategoryFilter } from "../CategoryFilter";

export default function CategoryFilterExample() {
  const [selected, setSelected] = useState<string | null>(null);

  const categories = [
    { id: "outdoors", name: "Outdoors" },
    { id: "tools", name: "Tools" },
    { id: "sports", name: "Sports" },
    { id: "tech", name: "Tech" },
    { id: "home", name: "Home" },
  ];

  return (
    <CategoryFilter
      categories={categories}
      selectedCategory={selected}
      onSelectCategory={(id) => {
        console.log("Selected category:", id);
        setSelected(id);
      }}
    />
  );
}
