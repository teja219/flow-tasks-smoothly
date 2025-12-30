import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, X, ArrowDown } from 'lucide-react';
import { Task, QueueType } from '@/types/task';
import { useState } from 'react';

interface SwipeableTaskProps {
  task: Task;
  queue: QueueType;
  onClose: () => void;
  onMove: () => void;
  onPushToBack: () => void;
}

export const SwipeableTask = ({
  task,
  queue,
  onClose,
  onMove,
  onPushToBack,
}: SwipeableTaskProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);

  const leftBgOpacity = useTransform(x, [-150, -50, 0], [1, 0.5, 0]);
  const rightBgOpacity = useTransform(x, [0, 50, 150], [0, 0.5, 1]);
  const pullDownOpacity = useTransform(y, [0, 30, 60], [0, 0.5, 1]);
  
  const scale = useTransform(
    x,
    [-150, 0, 150],
    [0.95, 1, 0.95]
  );

  const handleDragEnd = (_: any, info: PanInfo) => {
    const { offset, velocity } = info;
    
    // Horizontal swipe threshold
    const swipeThreshold = 100;
    const velocityThreshold = 500;
    
    // Pull down threshold
    const pullThreshold = 50;

    if (offset.y > pullThreshold && Math.abs(offset.x) < 50) {
      onPushToBack();
    } else if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
      // Left swipe - close
      onClose();
    } else if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
      // Right swipe - move
      onMove();
    }
    
    setIsDragging(false);
  };

  const leftSwipeLabel = 'Close';
  const rightSwipeLabel = queue === 'running' ? 'Wait' : 'Run';
  const LeftIcon = X;
  const RightIcon = queue === 'running' ? ArrowRight : ArrowLeft;

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Left swipe background (Close) */}
      <motion.div
        className="absolute inset-0 bg-swipe-close flex items-center justify-start px-4 rounded-lg"
        style={{ opacity: leftBgOpacity }}
      >
        <div className="flex items-center gap-2 text-destructive-foreground font-medium">
          <LeftIcon className="w-5 h-5" />
          <span>{leftSwipeLabel}</span>
        </div>
      </motion.div>

      {/* Right swipe background (Move) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-end px-4 rounded-lg"
        style={{ 
          opacity: rightBgOpacity,
          backgroundColor: queue === 'running' ? 'hsl(var(--secondary))' : 'hsl(var(--primary))'
        }}
      >
        <div className="flex items-center gap-2 text-primary-foreground font-medium">
          <span>{rightSwipeLabel}</span>
          <RightIcon className="w-5 h-5" />
        </div>
      </motion.div>

      {/* Pull down indicator */}
      <motion.div
        className="absolute inset-x-0 -top-8 flex items-center justify-center py-2"
        style={{ opacity: pullDownOpacity }}
      >
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <ArrowDown className="w-4 h-4" />
          <span>Push to back</span>
        </div>
      </motion.div>

      {/* Task card */}
      <motion.div
        className={`task-item relative z-10 ${
          queue === 'running' 
            ? 'border-running-border bg-running-bg' 
            : 'border-waiting-border bg-waiting-bg'
        }`}
        style={{ x, y, scale }}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.5}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: 'grabbing' }}
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${
            queue === 'running' ? 'bg-running-accent animate-pulse-soft' : 'bg-waiting-accent'
          }`} />
          <span className="font-medium text-foreground">{task.title}</span>
        </div>
        
        {!isDragging && (
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Close
            </span>
            <span className="flex items-center gap-1">
              {queue === 'running' ? 'Wait' : 'Run'} <ArrowRight className="w-3 h-3" />
            </span>
            <span className="flex items-center gap-1">
              <ArrowDown className="w-3 h-3" /> Back
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
};
