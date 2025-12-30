import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [customMode, setCustomMode] = useState(false);
  const [customType, setCustomType] = useState<'minutes' | 'datetime'>('minutes');
  const [customMinutes, setCustomMinutes] = useState<number>(30);
  const [customDatetime, setCustomDatetime] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    setError(null);

    if (customMode) {
      if (customType === 'minutes') {
        if (!customMinutes || customMinutes <= 0) {
          setError('Please enter a positive number of minutes.');
          return;
        }
        onSelect(customMinutes);
        onClose();
        return;
      }

      if (customType === 'datetime') {
        if (!customDatetime) {
          setError('Please select a date and time.');
          return;
        }

        const target = new Date(customDatetime);
        const diffMs = target.getTime() - Date.now();
        const diffMinutes = Math.round(diffMs / 60000);
        if (diffMinutes <= 0) {
          setError('Please select a future date and time.');
          return;
        }

        onSelect(diffMinutes);
        onClose();
        return;
      }
    }

    // default preset option
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
              variant={!customMode && selectedMinutes === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setCustomMode(false);
                setSelectedMinutes(option.value);
              }}
              className="text-sm"
            >
              {option.label}
            </Button>
          ))}

          <Button
            key="custom"
            variant={customMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCustomMode((s) => !s)}
            className="text-sm col-span-4"
          >
            Custom…
          </Button>
        </div>

        {customMode && (
          <div className="space-y-3 pb-3">
            <div className="flex gap-2">
              <Button
                variant={customType === 'minutes' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCustomType('minutes')}
              >
                Minutes
              </Button>
              <Button
                variant={customType === 'datetime' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCustomType('datetime')}
              >
                Date & Time
              </Button>
            </div>

            {customType === 'minutes' ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  className="w-32"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(Number(e.target.value))}
                />
                <div className="text-sm text-muted-foreground">minutes</div>
              </div>
            ) : (
              <div>
                <Input
                  type="datetime-local"
                  value={customDatetime}
                  onChange={(e) => setCustomDatetime(e.target.value)}
                />
                <div className="text-xs text-muted-foreground mt-1">Select a future date/time</div>
              </div>
            )}

            {error && <div className="text-sm text-red-500">{error}</div>}
          </div>
        )}

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
