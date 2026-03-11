import { useState } from "react";
import { TopNav } from "@/components/TopNav";
import { BottomNav } from "@/components/BottomNav";
import { ActivityCard } from "@/components/ActivityCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// TODO: remove mock functionality
import bikeImage from "@assets/generated_images/Mountain_bike_product_photo_dbcb47ff.png";
import drillImage from "@assets/generated_images/Power_drill_product_photo_d5bc3111.png";
import tentImage from "@assets/generated_images/Camping_tent_product_photo_429e610e.png";
import cameraImage from "@assets/generated_images/Digital_camera_product_photo_a8bd4a58.png";

// TODO: remove mock functionality
const mockBorrowed = [
  {
    id: "b1",
    itemName: "Mountain Bike",
    itemImageUrl: bikeImage,
    otherPersonName: "Alex Chen",
    type: "borrowed" as const,
    status: "active" as const,
    date: new Date(2025, 9, 10),
  },
  {
    id: "b2",
    itemName: "Camping Tent",
    itemImageUrl: tentImage,
    otherPersonName: "Sarah Johnson",
    type: "borrowed" as const,
    status: "pending" as const,
    date: new Date(2025, 9, 18),
  },
];

// TODO: remove mock functionality
const mockLent = [
  {
    id: "l1",
    itemName: "DSLR Camera",
    itemImageUrl: cameraImage,
    otherPersonName: "Emma Wilson",
    type: "lent" as const,
    status: "active" as const,
    date: new Date(2025, 9, 12),
  },
  {
    id: "l2",
    itemName: "Power Drill",
    itemImageUrl: drillImage,
    otherPersonName: "Mike Rodriguez",
    type: "lent" as const,
    status: "pending" as const,
    date: new Date(2025, 9, 17),
  },
];

// TODO: remove mock functionality
const mockHistory = [
  {
    id: "h1",
    itemName: "Hiking Backpack",
    itemImageUrl: bikeImage,
    otherPersonName: "David Park",
    type: "borrowed" as const,
    status: "returned" as const,
    date: new Date(2025, 8, 5),
  },
  {
    id: "h2",
    itemName: "Electric Drill",
    itemImageUrl: drillImage,
    otherPersonName: "Lisa Anderson",
    type: "lent" as const,
    status: "returned" as const,
    date: new Date(2025, 8, 20),
  },
];

export default function ActivityPage() {
  const [borrowed, setBorrowed] = useState(mockBorrowed);
  const [lent, setLent] = useState(mockLent);
  const [history] = useState(mockHistory);

  const handleApprove = (id: string) => {
    console.log("Approve:", id);
    setLent(lent.map(item => 
      item.id === id ? { ...item, status: "active" as const } : item
    ));
  };

  const handleDecline = (id: string) => {
    console.log("Decline:", id);
    setLent(lent.filter(item => item.id !== id));
  };

  const handleMarkReturned = (id: string) => {
    console.log("Mark returned:", id);
    setBorrowed(borrowed.filter(item => item.id !== id));
    setLent(lent.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <TopNav
        userName="John Doe"
        notificationCount={2}
        onProfileClick={() => console.log("Profile clicked")}
        onNotificationsClick={() => console.log("Notifications clicked")}
      />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <h2 className="text-3xl font-bold font-sans mb-6" style={{ fontFamily: "DM Sans, sans-serif" }}>
          Activity
        </h2>

        <Tabs defaultValue="borrowed" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="borrowed" data-testid="tab-borrowed">
              Borrowed ({borrowed.length})
            </TabsTrigger>
            <TabsTrigger value="lent" data-testid="tab-lent">
              Lent ({lent.length})
            </TabsTrigger>
            <TabsTrigger value="history" data-testid="tab-history">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="borrowed" className="space-y-4">
            {borrowed.length > 0 ? (
              borrowed.map((item) => (
                <ActivityCard
                  key={item.id}
                  {...item}
                  onViewDetails={(id) => console.log("View details:", id)}
                  onMarkReturned={handleMarkReturned}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  You haven't borrowed anything yet
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="lent" className="space-y-4">
            {lent.length > 0 ? (
              lent.map((item) => (
                <ActivityCard
                  key={item.id}
                  {...item}
                  onViewDetails={(id) => console.log("View details:", id)}
                  onMarkReturned={handleMarkReturned}
                  onApprove={handleApprove}
                  onDecline={handleDecline}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  You haven't lent anything yet
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {history.length > 0 ? (
              history.map((item) => (
                <ActivityCard
                  key={item.id}
                  {...item}
                  onViewDetails={(id) => console.log("View details:", id)}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No history yet
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
}
