import { ItemCard } from "../ItemCard";
import tentImage from "@assets/generated_images/Camping_tent_product_photo_429e610e.png";

export default function ItemCardExample() {
  return (
    <div className="max-w-sm">
      <ItemCard
        id="1"
        imageUrl={tentImage}
        name="4-Person Camping Tent"
        description="Perfect for weekend camping trips. Waterproof and easy to set up."
        category="Outdoors"
        ownerName="Sarah Johnson"
        status="available"
        onClick={() => console.log("Item clicked")}
      />
    </div>
  );
}
