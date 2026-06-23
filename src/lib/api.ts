import { SyncEngine } from './sync';

export const api = {
  async submitTrial(payload: any) {
    return this.submitWithSync('TRIAL', payload);
  },

  async submitMembership(payload: any) {
    return this.submitWithSync('MEMBERSHIP', payload);
  },

  async submitConsultation(payload: any) {
    return this.submitWithSync('CONSULTATION', payload);
  },

  async submitWithSync(type: string, payload: any) {
    // Normalize fields for backend validation and database RPC schema
    const normalizedPayload = {
      ...payload,
      full_name: payload.name || payload.full_name,
      phone_number: payload.whatsapp_number || payload.phone_number,
      goal: payload.fitness_goal || payload.goal,
    };

    // 1. Add to offline queue to get a client_submission_id and ensure durability
    const submission = SyncEngine.addToQueue(type, normalizedPayload);

    if (!navigator.onLine) {
      return { success: true, status: 'queued_offline', message: 'You are offline. We will submit your request automatically when you reconnect.' };
    }

    try {
      SyncEngine.updateStatus(submission.id, { status: 'processing' });
      
      const response = await fetch('/api/leads/process-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...normalizedPayload, client_submission_id: submission.id, type })
      });

      const result = await response.json();

      if (result.success || result.status === 'duplicate_success_shielded') {
        SyncEngine.updateStatus(submission.id, { status: 'completed' });
        SyncEngine.removeFromQueue(submission.id);
        return result;
      } else {
        throw new Error(result.message || 'Server error');
      }
    } catch (err) {
      console.error(`API Call failed for ${type}:`, err);
      SyncEngine.updateStatus(submission.id, { status: 'failed', retry_count: 1 });
      // We still return true to the user, as the background sync engine will keep trying
      return { success: true, status: 'queued_failed', message: 'Network unstable. Your request is saved and will auto-sync.' };
    }
  },

  async sendOtp(phoneNumber: string) {
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phoneNumber })
    });
    return res.json();
  },

  async verifyOtp(phoneNumber: string, token: string) {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phoneNumber, token })
    });
    return res.json();
  }
};
