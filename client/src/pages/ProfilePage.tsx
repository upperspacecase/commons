import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { TopNav } from "@/components/TopNav";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { LogOut, Package, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Item } from "@shared/schema";

export default function ProfilePage() {
  const { user, isLoading: isUserLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: items = [], isLoading: isItemsLoading } = useQuery<Item[]>({
    queryKey: ["/api/items"],
  });

  const userItems = items.filter((item) => item.ownerId === user?.id);

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ itemId, status }: { itemId: string; status: string }) => {
      const newStatus = status === "available" ? "borrowed" : "available";
      return apiRequest("PATCH", `/api/items/${itemId}/status`, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      toast({
        title: "Status updated",
        description: "Item status has been changed",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update status",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      queryClient.setQueryData(["/api/auth/user"], null);
      setLocation("/auth");
    } catch (error: any) {
      toast({
        title: "Failed to logout",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  // Redirect to auth if not logged in (must be in useEffect to avoid setState during render)
  // Only redirect after loading is complete to avoid race conditions with React Query cache
  useEffect(() => {
    if (!isUserLoading && !user) {
      setLocation("/auth");
    }
  }, [isUserLoading, user, setLocation]);

  // Show loading state while user data is being fetched
  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-background pb-20 lg:pb-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  // If no user, show nothing (useEffect will handle redirect)
  if (!user) {
    return null;
  }
  
  // Handle missing user data gracefully
  const firstName = user.firstName || "User";
  const lastName = user.lastName || "";

  const initials = `${firstName[0] || 'U'}${lastName[0] || 'U'}`.toUpperCase();

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <TopNav
        userName={`${firstName} ${lastName}`}
        notificationCount={0}
        onProfileClick={() => setLocation("/profile")}
        onNotificationsClick={() => console.log("Notifications clicked")}
      />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.profileImageUrl || undefined} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold" style={{ fontFamily: "DM Sans, sans-serif" }} data-testid="text-user-name">
                    {firstName} {lastName}
                  </h1>
                </div>
                <p className="text-xl text-primary mb-4" data-testid="text-username">
                  @{user.username}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="gap-2"
                    data-testid="button-logout"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User's Items */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Your Items
              </h2>
              <p className="text-muted-foreground">
                {userItems.length} {userItems.length === 1 ? "item" : "items"} shared
              </p>
            </div>
            <Button
              onClick={() => setLocation("/add")}
              className="gap-2"
              data-testid="button-add-item"
            >
              <Package className="h-4 w-4" />
              Add Item
            </Button>
          </div>

          {isItemsLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : userItems.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  You haven't shared any items yet
                </p>
                <Button onClick={() => setLocation("/add")} data-testid="button-add-first-item">
                  Share Your First Item
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {userItems.map((item) => (
                <Card key={item.id} data-testid={`card-item-${item.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {item.imageUrl ? (
                        <img
                          src={`/objects/${item.imageUrl}`}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                          data-testid={`img-item-${item.id}`}
                        />
                      ) : (
                        <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate" data-testid={`text-item-name-${item.id}`}>
                              {item.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {item.category}
                            </p>
                          </div>
                          <Badge
                            variant={item.status === "available" ? "default" : "secondary"}
                            className="shrink-0"
                            data-testid={`badge-status-${item.id}`}
                          >
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleStatusMutation.mutate({ itemId: item.id, status: item.status })}
                            disabled={toggleStatusMutation.isPending}
                            className="gap-2"
                            data-testid={`button-toggle-status-${item.id}`}
                          >
                            <Edit className="h-3 w-3" />
                            Mark as {item.status === "available" ? "Borrowed" : "Available"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
