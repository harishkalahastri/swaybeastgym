import { v4 as uuidv4 } from 'uuid';

export type SyncStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface PendingSubmission {
  id: string; // client_submission_id
  type: string;
  payload: any;
  status: SyncStatus;
  retry_count: number;
  created_at: string;
}

const SYNC_QUEUE_KEY = 'swaybeast_pending_submissions';

export class SyncEngine {
  static getQueue(): PendingSubmission[] {
    try {
      const data = localStorage.getItem(SYNC_QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveQueue(queue: PendingSubmission[]) {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  }

  static addToQueue(type: string, payload: any): PendingSubmission {
    const queue = this.getQueue();
    const newSubmission: PendingSubmission = {
      id: uuidv4(),
      type,
      payload,
      status: 'pending',
      retry_count: 0,
      created_at: new Date().toISOString()
    };
    queue.push(newSubmission);
    this.saveQueue(queue);
    return newSubmission;
  }

  static updateStatus(id: string, updates: Partial<PendingSubmission>) {
    const queue = this.getQueue();
    const index = queue.findIndex(s => s.id === id);
    if (index !== -1) {
      queue[index] = { ...queue[index], ...updates };
      this.saveQueue(queue);
    }
  }

  static removeFromQueue(id: string) {
    const queue = this.getQueue();
    this.saveQueue(queue.filter(s => s.id !== id));
  }

  static async processQueue() {
    if (!navigator.onLine) return;

    const queue = this.getQueue();
    for (const submission of queue) {
      if (submission.status === 'processing' || submission.status === 'completed') continue;

      this.updateStatus(submission.id, { status: 'processing' });

      try {
        const response = await fetch('/api/leads/process-submission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...submission.payload, client_submission_id: submission.id, type: submission.type })
        });

        const result = await response.json();

        if (result.success || result.status === 'duplicate_success_shielded') {
          this.updateStatus(submission.id, { status: 'completed' });
          this.removeFromQueue(submission.id);
        } else {
          throw new Error(result.message || 'Server rejected submission');
        }
      } catch (err) {
        console.error(`Failed to sync submission ${submission.id}:`, err);
        this.updateStatus(submission.id, {
          status: 'failed',
          retry_count: submission.retry_count + 1
        });
      }
    }
  }

  static initAutoSync() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('[SyncEngine] Network restored. Processing queue...');
        this.processQueue();
      });
    }
  }
}
