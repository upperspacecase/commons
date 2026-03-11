import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TopNav } from "@/components/TopNav";
import { BottomNav } from "@/components/BottomNav";
import { ItemCard } from "@/components/ItemCard";
import { CategoryFilter, type Category } from "@/components/CategoryFilter";
import { SearchBar } from "@/components/SearchBar";
import { ItemDetailModal } from "@/components/ItemDetailModal";
import { BorrowRequestModal } from "@/components/BorrowRequestModal";
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import type { Item } from "@shared/schema";

const CATEGORY_MAP: Record<string, string> = {
  "Camping & Outdoors": "outdoors",
  "Tools & Equipment": "tools",
  "Sports & Recreation": "sports",
  "Kitchen & Appliances": "home",
  "Electronics": "tech",
  "Books & Media": "media",
  "Clothing & Accessories": "fashion",
  "Transportation": "transport",
  "Party & Events": "events",
  "Other": "other",
};

const CATEGORIES: Category[] = [
  { id: "outdoors", name: "Camping & Outdoors" },
  { id: "tools", name: "Tools & Equipment" },
  { id: "sports", name: "Sports & Recreation" },
  { id: "home", name: "Kitchen & Appliances" },
  { id: "tech", name: "Electronics" },
  { id: "media", name: "Books & Media" },
  { id: "fashion", name: "Clothing & Accessories" },
  { id: "transport", name: "Transportation" },
  { id: "events", name: "Party & Events" },
  { id: "other", name: "Other" },
];

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showBorrowModal, setShowBorrowModal] = useState(false);

  // Fetch items from API
  const { data: items = [], isLoading } = useQuery<Item[]>({
    queryKey: ["/api/items"],
  });

  const filteredItems = items.filter((item) => {
    const categoryId = CATEGORY_MAP[item.category] || "other";
    
    const matchesSearch = 
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (selectedCategory && categoryId !== selectedCategory) return false;
    if (filterStatus === "yours" && item.ownerId !== user?.id) return false;
    if (filterStatus && filterStatus !== "yours" && item.status !== filterStatus) return false;
    return true;
  });

  const itemsWithOwnerInfo = filteredItems.map((item) => ({
    ...item,
    imageUrl: item.imageUrl || "", // Handle null imageUrl
    categoryId: CATEGORY_MAP[item.category] || "other",
    ownerName: item.ownerId === user?.id ? "You" : "Friend",
    status: item.ownerId === user?.id ? ("yours" as const) : (item.status as "available" | "borrowed"),
  }));

  const handleRequestBorrow = () => {
    setShowBorrowModal(true);
  };

  const handleBorrowSubmit = (data: { message: string; date: Date | undefined }) => {
    console.log("Borrow request submitted:", data);
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <TopNav
        userName={user ? `${user.firstName} ${user.lastName}` : "User"}
        notificationCount={0}
        onProfileClick={() => setLocation("/profile")}
        onNotificationsClick={() => console.log("Notifications clicked")}
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
                What's Available
              </h2>
              <p className="text-muted-foreground text-lg">
                Discover what your friends are sharing
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                className="gap-2"
                onClick={() => setLocation("/add")}
                data-testid="button-add-item"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {
                  const statuses = [null, "available", "borrowed", "yours"];
                  const currentIndex = statuses.indexOf(filterStatus);
                  const nextIndex = (currentIndex + 1) % statuses.length;
                  setFilterStatus(statuses[nextIndex]);
                }}
                data-testid="button-filter"
              >
                <Filter className="h-4 w-4" />
                {filterStatus === "available" && "Available"}
                {filterStatus === "borrowed" && "Borrowed"}
                {filterStatus === "yours" && "Your Items"}
                {!filterStatus && "All"}
              </Button>
            </div>
          </div>
          <div className="mb-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search items, owners, or categories..."
            />
          </div>
          <CategoryFilter
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {searchQuery && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Found {itemsWithOwnerInfo.length} {itemsWithOwnerInfo.length === 1 ? "item" : "items"}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itemsWithOwnerInfo.map((item) => (
              <ItemCard
                key={item.id}
                {...item}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>
        )}

        {!isLoading && itemsWithOwnerInfo.length === 0 && (
          <div className="text-center py-12">
            {items.length === 0 ? (
              <>
                <p className="text-muted-foreground mb-4">
                  No items shared yet. Be the first!
                </p>
                <Button onClick={() => setLocation("/add")} data-testid="button-add-first-item">
                  Add an Item
                </Button>
              </>
            ) : (
              <>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? `No items found for "${searchQuery}"` : "No items found. Try adjusting your filters."}
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                  setFilterStatus(null);
                }}>
                  Clear {searchQuery ? "Search and Filters" : "Filters"}
                </Button>
              </>
            )}
          </div>
        )}
      </main>

      <BottomNav />

      <ItemDetailModal
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
        item={selectedItem ? { 
          ...selectedItem, 
          imageUrl: selectedItem.imageUrl || "", 
          ownerName: selectedItem.ownerId === user?.id ? "You" : "Friend",
          status: (selectedItem.ownerId === user?.id ? "yours" : selectedItem.status) as "available" | "yours" | "borrowed"
        } : null}
        onRequestBorrow={handleRequestBorrow}
        onMessage={(id) => console.log("Message item:", id)}
        onViewProfile={(id) => console.log("View profile:", id)}
      />

      {selectedItem && (
        <BorrowRequestModal
          open={showBorrowModal}
          onOpenChange={setShowBorrowModal}
          itemName={selectedItem.name}
          onSubmit={handleBorrowSubmit}
        />
      )}
    </div>
  );
}
