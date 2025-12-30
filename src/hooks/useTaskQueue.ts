import { useState, useCallback, useEffect } from 'react';
import { Task, QueueType } from '@/types/task';

const generateId = () => Math.random().toString(36).substring(2, 9);

const STORAGE_KEY_RUNNING = 'queue-tasks-running';
const STORAGE_KEY_WAITING = 'queue-tasks-waiting';

const loadTasksFromStorage = (key: string, defaultTasks: Task[]): Task[] => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultTasks;

    const parsed = JSON.parse(stored);
    return parsed.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      returnAt: task.returnAt ? new Date(task.returnAt) : undefined,
    }));
  } catch (error) {
    console.error('Failed to load tasks from storage:', error);
    return defaultTasks;
  }
};

const saveTasksToStorage = (key: string, tasks: Task[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to storage:', error);
  }
};

const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }

  return false;
};

const sendNotification = (title: string, options?: NotificationOptions) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, options);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }
};

export const useTaskQueue = () => {
  const [runningQueue, setRunningQueue] = useState<Task[]>(() =>
    loadTasksFromStorage(STORAGE_KEY_RUNNING, [
      { id: generateId(), title: 'Review pull request', createdAt: new Date() },
      { id: generateId(), title: 'Fix bug in authentication', createdAt: new Date() },
    ])
  );

  const [waitingQueue, setWaitingQueue] = useState<Task[]>(() =>
    loadTasksFromStorage(STORAGE_KEY_WAITING, [
      { id: generateId(), title: 'Write documentation', createdAt: new Date() },
      { id: generateId(), title: 'Update dependencies', createdAt: new Date() },
    ])
  );

  const [notifiedTasks, setNotifiedTasks] = useState<Set<string>>(new Set());

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Save running queue to localStorage whenever it changes
  useEffect(() => {
    saveTasksToStorage(STORAGE_KEY_RUNNING, runningQueue);
  }, [runningQueue]);

  // Save waiting queue to localStorage whenever it changes
  useEffect(() => {
    saveTasksToStorage(STORAGE_KEY_WAITING, waitingQueue);
  }, [waitingQueue]);

  // Check for tasks that should return to running queue
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setWaitingQueue(prev => {
        const tasksToMove = prev.filter(t => t.returnAt && t.returnAt <= now);
        const tasksToKeep = prev.filter(t => !t.returnAt || t.returnAt > now);

        if (tasksToMove.length > 0) {
          tasksToMove.forEach(task => {
            if (!notifiedTasks.has(task.id)) {
              sendNotification('Task Ready', {
                body: `${task.title} is ready to run`,
                tag: `task-${task.id}`,
                requireInteraction: false,
              });
              setNotifiedTasks(prev => new Set([...prev, task.id]));
            }
          });

          setRunningQueue(running => [
            ...tasksToMove.map(t => ({ ...t, returnAt: undefined })),
            ...running
          ]);
        }

        return tasksToKeep;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [notifiedTasks]);

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

  const moveToWaiting = useCallback((taskId: string, waitMinutes: number) => {
    const task = runningQueue.find(t => t.id === taskId);
    if (task) {
      const returnAt = new Date(Date.now() + waitMinutes * 60 * 1000);
      setRunningQueue(prev => prev.filter(t => t.id !== taskId));
      setWaitingQueue(prev => [...prev, { ...task, returnAt }]);
    }
  }, [runningQueue]);

  const moveToRunning = useCallback((taskId: string) => {
    const task = waitingQueue.find(t => t.id === taskId);
    if (task) {
      setWaitingQueue(prev => prev.filter(t => t.id !== taskId));
      setRunningQueue(prev => [...prev, { ...task, returnAt: undefined }]);
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
