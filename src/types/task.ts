export interface Task {
  id: string;
  title: string;
  createdAt: Date;
}

export type QueueType = 'running' | 'waiting';
