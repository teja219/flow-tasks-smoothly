import { motion, AnimatePresence } from 'framer-motion';
import { Task, QueueType } from '@/types/task';
import { SwipeableTask } from './SwipeableTask';
import { Play, Pause } from 'lucide-react';

interface TaskQueueProps {
  title: string;
  queue: QueueType;
  tasks: Task[];
  onClose: (taskId: string) => void;
  onMove: (taskId: string) => void;
  onPushToBack: (taskId: string) => void;
}

export const TaskQueue = ({
  title,
  queue,
  tasks,
  onClose,
  onMove,
  onPushToBack,
}: TaskQueueProps) => {
  const Icon = queue === 'running' ? Play : Pause;
  const accentColor = queue === 'running' ? 'text-running-accent' : 'text-waiting-accent';
  const bgColor = queue === 'running' ? 'bg-running-bg/50' : 'bg-waiting-bg/50';
  const borderColor = queue === 'running' ? 'border-running-border' : 'border-waiting-border';

  return (
    <div className={`queue-card ${bgColor} ${borderColor} p-4 md:p-6`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${queue === 'running' ? 'bg-running-accent/10' : 'bg-waiting-accent/10'}`}>
          <Icon className={`w-5 h-5 ${accentColor}`} />
        </div>
        <div>
          <h2 className="font-semibold text-lg text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -200, transition: { duration: 0.2 } }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <SwipeableTask
                task={task}
                queue={queue}
                onClose={() => onClose(task.id)}
                onMove={() => onMove(task.id)}
                onPushToBack={() => onPushToBack(task.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-muted-foreground"
          >
            <p className="text-sm">No tasks in queue</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
