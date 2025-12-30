import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WAIT_TIME_OPTIONS } from '@/types/task';
import { Clock } from 'lucide-react';

interface WaitTimePickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (minutes: number) => void;
  taskTitle: string;
}

export const WaitTimePicker = ({ open, onClose, onSelect, taskTitle }: WaitTimePickerProps) => {
  const [selectedMinutes, setSelectedMinutes] = useState(20);

  const handleConfirm = () => {
    onSelect(selectedMinutes);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Set Wait Time
          </DialogTitle>
          <DialogDescription>
            How long should "{taskTitle}" wait before returning to the running queue?
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-4 gap-2 py-4">
          {WAIT_TIME_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={selectedMinutes === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMinutes(option.value)}
              className="text-sm"
            >
              {option.label}
            </Button>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Move to Waiting
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
