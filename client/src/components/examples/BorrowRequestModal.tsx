import { useState } from "react";
import { BorrowRequestModal } from "../BorrowRequestModal";
import { Button } from "@/components/ui/button";

export default function BorrowRequestModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Borrow Request</Button>
      <BorrowRequestModal
        open={open}
        onOpenChange={setOpen}
        itemName="4-Person Camping Tent"
        onSubmit={(data) => {
          console.log("Borrow request submitted:", data);
        }}
      />
    </>
  );
}
