import { TopNav } from "../TopNav";
import { ThemeProvider } from "../ThemeProvider";

export default function TopNavExample() {
  return (
    <ThemeProvider>
      <TopNav
        userName="John Doe"
        notificationCount={3}
        onProfileClick={() => console.log("Profile clicked")}
        onNotificationsClick={() => console.log("Notifications clicked")}
      />
    </ThemeProvider>
  );
}
