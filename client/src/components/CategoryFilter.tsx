import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export type Category = {
  id: string;
  name: string;
};

export type CategoryFilterProps = {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
};

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <ScrollArea className="w-full">
      <div className="flex gap-2 pb-2">
        <Badge
          variant={selectedCategory === null ? "default" : "secondary"}
          className={`cursor-pointer rounded-full whitespace-nowrap ${
            selectedCategory === null ? "" : "hover-elevate"
          }`}
          onClick={() => onSelectCategory(null)}
          data-testid="badge-category-all"
        >
          All Items
        </Badge>
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "secondary"}
            className={`cursor-pointer rounded-full whitespace-nowrap ${
              selectedCategory === category.id ? "" : "hover-elevate"
            }`}
            onClick={() => onSelectCategory(category.id)}
            data-testid={`badge-category-${category.id}`}
          >
            {category.name}
          </Badge>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
