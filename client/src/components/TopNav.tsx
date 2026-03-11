import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./ThemeToggle";
import { Badge } from "@/components/ui/badge";

export type TopNavProps = {
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
  onProfileClick?: () => void;
  onNotificationsClick?: () => void;
};

export function TopNav({
  userName = "User",
  userAvatar,
  notificationCount = 0,
  onProfileClick,
  onNotificationsClick,
}: TopNavProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold font-sans" style={{ fontFamily: "DM Sans, sans-serif" }}>
            Commons
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={onNotificationsClick}
              data-testid="button-notifications"
            >
              <Bell className="h-5 w-5" />
            </Button>
            {notificationCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full"
              >
                {notificationCount > 9 ? "9+" : notificationCount}
              </Badge>
            )}
          </div>
          <Avatar
            className="w-9 h-9 cursor-pointer hover-elevate"
            onClick={onProfileClick}
            data-testid="avatar-user"
          >
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
