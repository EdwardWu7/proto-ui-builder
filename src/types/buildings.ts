
export interface Building {
  id: string;
  name: string;
  units: number;
  network: string;
  manager: string;
  created_at: string;
  selected?: boolean;
}

export interface Tenant {
  id: string;
  building_id: string;
  name: string;
  unit_number: string;
  debt_amount: number;
  debt_period: number;
  call_count: number;
  display_type: string;
  status: string;
  action_type: 'call' | 'work' | 'bill' | 'suggestion';
  action_text: string | null;
  created_at: string;
  selected?: boolean;
}

export interface CallRecord {
  id: string;
  task_id: string;
  creator: string;
  status: 'in_progress' | 'stopped' | 'completed';
  created_at: string;
  total_calls: number;
  connected_calls: number;
  rejected_calls: number;
  busy_calls: number;
  no_answer_calls: number;
  intercept_count: number;
  empty_count: number;
  debt_count: number;
  hangup_count: number;
  mute_count: number;
}

export interface CallDetail {
  id: string;
  record_id: string;
  tenant_name: string;
  unit_info: string;
  debt_amount: number;
  debt_period: number;
  call_status: 'connected' | 'rejected' | 'no_answer';
  call_duration?: number;
  has_recording: boolean;
}

export interface CreateCallRecordPayload {
  task_id: string;
  creator: string;
  total_calls: number;
}
