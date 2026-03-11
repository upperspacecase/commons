import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";

export type BorrowRequestModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  onSubmit: (data: { message: string; date: Date | undefined }) => void;
};

export function BorrowRequestModal({
  open,
  onOpenChange,
  itemName,
  onSubmit,
}: BorrowRequestModalProps) {
  const [message, setMessage] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleSubmit = () => {
    onSubmit({ message, date });
    setMessage("");
    setDate(new Date());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" data-testid="modal-borrow-request">
        <DialogHeader>
          <DialogTitle>Request to Borrow</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Send a request to borrow <span className="font-semibold">{itemName}</span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="borrow-date">When do you need it?</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-lg border"
              disabled={(date) => date < new Date()}
            />
            {date && (
              <p className="text-sm text-muted-foreground">
                Selected: {format(date, "PPP")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message to owner (optional)</Label>
            <Textarea
              id="message"
              placeholder="Let them know why you need it..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              data-testid="textarea-message"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              data-testid="button-send-request"
            >
              Send Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
