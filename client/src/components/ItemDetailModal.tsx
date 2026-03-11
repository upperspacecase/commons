import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, User } from "lucide-react";

export type ItemDetailModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    id: string;
    imageUrl: string;
    name: string;
    description: string;
    category: string;
    ownerName: string;
    ownerAvatar?: string;
    status: "available" | "borrowed" | "yours";
  } | null;
  onRequestBorrow?: (itemId: string) => void;
  onMessage?: (itemId: string) => void;
  onViewProfile?: (ownerId: string) => void;
};

export function ItemDetailModal({
  open,
  onOpenChange,
  item,
  onRequestBorrow,
  onMessage,
  onViewProfile,
}: ItemDetailModalProps) {
  if (!item) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = () => {
    switch (item.status) {
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
    switch (item.status) {
      case "available":
        return "Available to Borrow";
      case "borrowed":
        return "Currently Borrowed";
      case "yours":
        return "Your Item";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-item-detail">
        <DialogHeader>
          <DialogTitle className="text-2xl">{item.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar
                className="w-12 h-12 cursor-pointer hover-elevate"
                onClick={() => onViewProfile?.(item.id)}
                data-testid="avatar-owner"
              >
                <AvatarImage src={item.ownerAvatar} alt={item.ownerName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(item.ownerName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{item.ownerName}</p>
                <p className="text-sm text-muted-foreground">Owner</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
              <span className="text-sm font-medium">{getStatusText()}</span>
            </div>
          </div>

          <div>
            <Badge variant="secondary" data-testid="badge-category">
              {item.category}
            </Badge>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{item.description}</p>
          </div>

          <div className="flex gap-2 pt-4">
            {item.status === "available" && (
              <Button
                className="flex-1"
                onClick={() => onRequestBorrow?.(item.id)}
                data-testid="button-request-borrow"
              >
                Request to Borrow
              </Button>
            )}
            {item.status !== "yours" && (
              <Button
                variant="outline"
                onClick={() => onMessage?.(item.id)}
                data-testid="button-message"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
            )}
            {item.status !== "yours" && (
              <Button
                variant="outline"
                onClick={() => onViewProfile?.(item.id)}
                data-testid="button-view-profile"
              >
                <User className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
