import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddTaskFormProps {
  onAdd: (title: string) => void;
}

export const AddTaskForm = ({ onAdd }: AddTaskFormProps) => {
  const [title, setTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
      setIsExpanded(false);
    }
  };

  return (
    <motion.div
      className="queue-card bg-card p-4"
      layout
    >
      {!isExpanded ? (
        <motion.button
          className="w-full flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors py-2"
          onClick={() => setIsExpanded(true)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="p-2 rounded-lg bg-primary/10">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <span className="font-medium">Add new task</span>
        </motion.button>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <Input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="bg-background border-border"
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={!title.trim()}
              className="flex-1"
            >
              Add to Running
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsExpanded(false);
                setTitle('');
              }}
            >
              Cancel
            </Button>
          </div>
        </motion.form>
      )}
    </motion.div>
  );
};
