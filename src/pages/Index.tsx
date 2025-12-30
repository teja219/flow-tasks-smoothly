import { useState } from 'react';
import { motion } from 'framer-motion';
import { TaskQueue } from '@/components/TaskQueue';
import { AddTaskForm } from '@/components/AddTaskForm';
import { WaitTimePicker } from '@/components/WaitTimePicker';
import { useTaskQueue } from '@/hooks/useTaskQueue';
import { Layers } from 'lucide-react';
import { Task } from '@/types/task';

const Index = () => {
  const {
    runningQueue,
    waitingQueue,
    addTask,
    closeTask,
    moveToWaiting,
    moveToRunning,
    pushToBack,
  } = useTaskQueue();

  const [pendingMoveTask, setPendingMoveTask] = useState<Task | null>(null);

  const handleMoveToWaiting = (taskId: string) => {
    const task = runningQueue.find(t => t.id === taskId);
    if (task) {
      setPendingMoveTask(task);
    }
  };

  const handleConfirmWait = (minutes: number) => {
    if (pendingMoveTask) {
      moveToWaiting(pendingMoveTask.id, minutes);
      setPendingMoveTask(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-primary/10">
              <Layers className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Queue Tasks
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Swipe left to close, right to move between queues. Pull down to push to back.
          </p>
        </motion.header>

        {/* Add Task Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <AddTaskForm onAdd={addTask} />
        </motion.div>

        {/* Queues */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TaskQueue
              title="Running"
              queue="running"
              tasks={runningQueue}
              onClose={(id) => closeTask(id, 'running')}
              onMove={handleMoveToWaiting}
              onPushToBack={(id) => pushToBack(id, 'running')}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TaskQueue
              title="Waiting"
              queue="waiting"
              tasks={waitingQueue}
              onClose={(id) => closeTask(id, 'waiting')}
              onMove={moveToRunning}
              onPushToBack={(id) => pushToBack(id, 'waiting')}
            />
          </motion.div>
        </div>

        {/* Footer hint */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-sm text-muted-foreground"
        >
          <p>Tip: Use gestures to manage your tasks efficiently</p>
        </motion.footer>
      </div>

      {/* Wait Time Picker Dialog */}
      <WaitTimePicker
        open={!!pendingMoveTask}
        onClose={() => setPendingMoveTask(null)}
        onSelect={handleConfirmWait}
        taskTitle={pendingMoveTask?.title || ''}
      />
    </div>
  );
};

export default Index;
