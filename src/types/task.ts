export interface Task {
  id: string;
  title: string;
  createdAt: Date;
  returnAt?: Date; // When the task should auto-return to running queue
}

export type QueueType = 'running' | 'waiting';

export const WAIT_TIME_OPTIONS = [
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '15 min', value: 15 },
  { label: '20 min', value: 20 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
] as const;
