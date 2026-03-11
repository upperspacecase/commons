import { ActivityCard } from "../ActivityCard";
import bikeImage from "@assets/generated_images/Mountain_bike_product_photo_dbcb47ff.png";

export default function ActivityCardExample() {
  return (
    <div className="max-w-2xl space-y-4">
      <ActivityCard
        id="1"
        itemName="Mountain Bike"
        itemImageUrl={bikeImage}
        otherPersonName="Alex Chen"
        type="borrowed"
        status="active"
        date={new Date(2025, 9, 10)}
        onViewDetails={(id) => console.log("View details:", id)}
        onMarkReturned={(id) => console.log("Mark returned:", id)}
      />
      <ActivityCard
        id="2"
        itemName="Power Drill"
        itemImageUrl={bikeImage}
        otherPersonName="Maria Garcia"
        type="lent"
        status="pending"
        date={new Date(2025, 9, 15)}
        onApprove={(id) => console.log("Approve:", id)}
        onDecline={(id) => console.log("Decline:", id)}
      />
    </div>
  );
}
