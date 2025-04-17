export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      buildings: {
        Row: {
          created_at: string
          id: string
          manager: string
          name: string
          network: string
          units: number
        }
        Insert: {
          created_at?: string
          id?: string
          manager: string
          name: string
          network: string
          units: number
        }
        Update: {
          created_at?: string
          id?: string
          manager?: string
          name?: string
          network?: string
          units?: number
        }
        Relationships: []
      }
      call_details: {
        Row: {
          call_duration: number | null
          call_status: string
          created_at: string
          debt_amount: number
          debt_period: number
          has_recording: boolean
          id: string
          record_id: string
          tenant_name: string
          unit_info: string
        }
        Insert: {
          call_duration?: number | null
          call_status: string
          created_at?: string
          debt_amount: number
          debt_period: number
          has_recording?: boolean
          id?: string
          record_id: string
          tenant_name: string
          unit_info: string
        }
        Update: {
          call_duration?: number | null
          call_status?: string
          created_at?: string
          debt_amount?: number
          debt_period?: number
          has_recording?: boolean
          id?: string
          record_id?: string
          tenant_name?: string
          unit_info?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_details_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "call_records"
            referencedColumns: ["id"]
          },
        ]
      }
      call_records: {
        Row: {
          busy_calls: number
          connected_calls: number
          created_at: string
          creator: string
          debt_count: number
          empty_count: number
          hangup_count: number
          id: string
          intercept_count: number
          mute_count: number
          no_answer_calls: number
          rejected_calls: number
          status: string
          task_id: string
          total_calls: number
        }
        Insert: {
          busy_calls?: number
          connected_calls?: number
          created_at?: string
          creator: string
          debt_count?: number
          empty_count?: number
          hangup_count?: number
          id?: string
          intercept_count?: number
          mute_count?: number
          no_answer_calls?: number
          rejected_calls?: number
          status: string
          task_id: string
          total_calls?: number
        }
        Update: {
          busy_calls?: number
          connected_calls?: number
          created_at?: string
          creator?: string
          debt_count?: number
          empty_count?: number
          hangup_count?: number
          id?: string
          intercept_count?: number
          mute_count?: number
          no_answer_calls?: number
          rejected_calls?: number
          status?: string
          task_id?: string
          total_calls?: number
        }
        Relationships: []
      }
      tenants: {
        Row: {
          action_text: string | null
          action_type: string
          building_id: string
          call_count: number
          created_at: string
          debt_amount: number
          debt_period: number
          display_type: string
          id: string
          name: string
          status: string
          unit_number: string
        }
        Insert: {
          action_text?: string | null
          action_type?: string
          building_id: string
          call_count?: number
          created_at?: string
          debt_amount?: number
          debt_period?: number
          display_type?: string
          id?: string
          name: string
          status?: string
          unit_number: string
        }
        Update: {
          action_text?: string | null
          action_type?: string
          building_id?: string
          call_count?: number
          created_at?: string
          debt_amount?: number
          debt_period?: number
          display_type?: string
          id?: string
          name?: string
          status?: string
          unit_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenants_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
