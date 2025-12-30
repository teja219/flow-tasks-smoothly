import { useState, useCallback } from 'react';
import { Task, QueueType } from '@/types/task';

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useTaskQueue = () => {
  const [runningQueue, setRunningQueue] = useState<Task[]>([
    { id: generateId(), title: 'Review pull request', createdAt: new Date() },
    { id: generateId(), title: 'Fix bug in authentication', createdAt: new Date() },
  ]);
  
  const [waitingQueue, setWaitingQueue] = useState<Task[]>([
    { id: generateId(), title: 'Write documentation', createdAt: new Date() },
    { id: generateId(), title: 'Update dependencies', createdAt: new Date() },
  ]);

  const addTask = useCallback((title: string) => {
    const newTask: Task = {
      id: generateId(),
      title,
      createdAt: new Date(),
    };
    setRunningQueue(prev => [newTask, ...prev]);
  }, []);

  const closeTask = useCallback((taskId: string, queue: QueueType) => {
    if (queue === 'running') {
      setRunningQueue(prev => prev.filter(t => t.id !== taskId));
    } else {
      setWaitingQueue(prev => prev.filter(t => t.id !== taskId));
    }
  }, []);

  const moveToWaiting = useCallback((taskId: string) => {
    const task = runningQueue.find(t => t.id === taskId);
    if (task) {
      setRunningQueue(prev => prev.filter(t => t.id !== taskId));
      setWaitingQueue(prev => [...prev, task]);
    }
  }, [runningQueue]);

  const moveToRunning = useCallback((taskId: string) => {
    const task = waitingQueue.find(t => t.id === taskId);
    if (task) {
      setWaitingQueue(prev => prev.filter(t => t.id !== taskId));
      setRunningQueue(prev => [...prev, task]);
    }
  }, [waitingQueue]);

  const pushToBack = useCallback((taskId: string, queue: QueueType) => {
    if (queue === 'running') {
      setRunningQueue(prev => {
        const task = prev.find(t => t.id === taskId);
        if (!task) return prev;
        return [...prev.filter(t => t.id !== taskId), task];
      });
    } else {
      setWaitingQueue(prev => {
        const task = prev.find(t => t.id === taskId);
        if (!task) return prev;
        return [...prev.filter(t => t.id !== taskId), task];
      });
    }
  }, []);

  return {
    runningQueue,
    waitingQueue,
    addTask,
    closeTask,
    moveToWaiting,
    moveToRunning,
    pushToBack,
  };
};
