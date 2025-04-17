
export interface Building {
  id: string;
  name: string;
  units: number;
  network: string;
  manager: string;
  created_at: string;
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
}
