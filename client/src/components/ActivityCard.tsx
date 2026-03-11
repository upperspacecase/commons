import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export type ActivityCardProps = {
  id: string;
  itemName: string;
  itemImageUrl: string;
  otherPersonName: string;
  otherPersonAvatar?: string;
  type: "borrowed" | "lent";
  status: "pending" | "approved" | "active" | "returned";
  date: Date;
  onViewDetails?: (id: string) => void;
  onMarkReturned?: (id: string) => void;
  onApprove?: (id: string) => void;
  onDecline?: (id: string) => void;
};

export function ActivityCard({
  id,
  itemName,
  itemImageUrl,
  otherPersonName,
  otherPersonAvatar,
  type,
  status,
  date,
  onViewDetails,
  onMarkReturned,
  onApprove,
  onDecline,
}: ActivityCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadgeVariant = () => {
    switch (status) {
      case "pending":
        return "secondary";
      case "approved":
        return "default";
      case "active":
        return "default";
      case "returned":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "pending":
        return "Pending";
      case "approved":
        return "Approved";
      case "active":
        return "Active";
      case "returned":
        return "Returned";
      default:
        return "";
    }
  };

  return (
    <Card className="p-4" data-testid={`card-activity-${id}`}>
      <div className="flex gap-4">
        <div className="relative w-20 h-20 flex-shrink-0">
          <img
            src={itemImageUrl}
            alt={itemName}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate" data-testid={`text-item-name-${id}`}>
                {itemName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={otherPersonAvatar} alt={otherPersonName} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getInitials(otherPersonName)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm text-muted-foreground">
                  {type === "borrowed" ? `from ${otherPersonName}` : `to ${otherPersonName}`}
                </p>
              </div>
            </div>
            <Badge variant={getStatusBadgeVariant()} data-testid={`badge-status-${id}`}>
              {getStatusText()}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            {format(date, "MMM d, yyyy")}
          </p>
          <div className="flex gap-2 flex-wrap">
            {status === "pending" && type === "lent" && (
              <>
                <Button
                  size="sm"
                  onClick={() => onApprove?.(id)}
                  data-testid={`button-approve-${id}`}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDecline?.(id)}
                  data-testid={`button-decline-${id}`}
                >
                  Decline
                </Button>
              </>
            )}
            {status === "active" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMarkReturned?.(id)}
                data-testid={`button-mark-returned-${id}`}
              >
                Mark Returned
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onViewDetails?.(id)}
              data-testid={`button-view-details-${id}`}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
