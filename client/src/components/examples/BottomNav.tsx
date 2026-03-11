import { BottomNav } from "../BottomNav";
import { Route, Switch } from "wouter";

export default function BottomNavExample() {
  return (
    <div className="pb-20">
      <Switch>
        <Route path="/" component={() => <div className="p-4">Home Page</div>} />
        <Route path="/search" component={() => <div className="p-4">Search Page</div>} />
        <Route path="/add-item" component={() => <div className="p-4">Add Item Page</div>} />
        <Route path="/activity" component={() => <div className="p-4">Activity Page</div>} />
        <Route path="/profile" component={() => <div className="p-4">Profile Page</div>} />
      </Switch>
      <BottomNav />
    </div>
  );
}
