import { useState } from "react";
import { ItemDetailModal } from "../ItemDetailModal";
import { Button } from "@/components/ui/button";
import tentImage from "@assets/generated_images/Camping_tent_product_photo_429e610e.png";

export default function ItemDetailModalExample() {
  const [open, setOpen] = useState(false);

  const item = {
    id: "1",
    imageUrl: tentImage,
    name: "4-Person Camping Tent",
    description: "Perfect for weekend camping trips. Waterproof and easy to set up. Used only a handful of times and in great condition.",
    category: "Outdoors",
    ownerName: "Sarah Johnson",
    status: "available" as const,
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Item Detail</Button>
      <ItemDetailModal
        open={open}
        onOpenChange={setOpen}
        item={item}
        onRequestBorrow={(id) => console.log("Request borrow:", id)}
        onMessage={(id) => console.log("Message:", id)}
        onViewProfile={(id) => console.log("View profile:", id)}
      />
    </>
  );
}
