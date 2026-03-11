import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type ItemCardProps = {
  id: string;
  imageUrl: string;
  name: string;
  description: string;
  category: string;
  ownerName: string;
  ownerAvatar?: string;
  status: "available" | "borrowed" | "yours";
  onClick?: () => void;
};

export function ItemCard({
  id,
  imageUrl,
  name,
  description,
  category,
  ownerName,
  ownerAvatar,
  status,
  onClick,
}: ItemCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "borrowed":
        return "bg-orange-500";
      case "yours":
        return "bg-primary";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "available":
        return "Available";
      case "borrowed":
        return "Borrowed";
      case "yours":
        return "Your Item";
      default:
        return "";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-shadow"
      onClick={onClick}
      data-testid={`card-item-${id}`}
    >
      <div className="relative aspect-[4/3]">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="w-10 h-10 -mt-8 border-2 border-background">
            <AvatarImage src={ownerAvatar} alt={ownerName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {getInitials(ownerName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate" data-testid={`text-item-name-${id}`}>
              {name}
            </h3>
            <p className="text-sm text-muted-foreground">by {ownerName}</p>
          </div>
        </div>
        <Badge variant="secondary" className="mb-2" data-testid={`badge-category-${id}`}>
          {category}
        </Badge>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {description}
        </p>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">{getStatusText()}</span>
          <Button size="sm" variant="default" data-testid={`button-view-${id}`}>
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}
