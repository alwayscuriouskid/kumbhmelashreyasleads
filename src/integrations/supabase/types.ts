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
      activities: {
        Row: {
          assigned_to: string | null
          call_type: string | null
          contact_person: string | null
          created_at: string | null
          end_time: string | null
          hidden_by: string[] | null
          id: string
          is_completed: boolean | null
          is_followup: boolean | null
          lead_id: string | null
          location: string | null
          next_action: string | null
          next_action_date: string | null
          next_follow_up: string | null
          notes: string | null
          outcome: string | null
          start_time: string | null
          type: string
          update: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          call_type?: string | null
          contact_person?: string | null
          created_at?: string | null
          end_time?: string | null
          hidden_by?: string[] | null
          id?: string
          is_completed?: boolean | null
          is_followup?: boolean | null
          lead_id?: string | null
          location?: string | null
          next_action?: string | null
          next_action_date?: string | null
          next_follow_up?: string | null
          notes?: string | null
          outcome?: string | null
          start_time?: string | null
          type: string
          update?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          call_type?: string | null
          contact_person?: string | null
          created_at?: string | null
          end_time?: string | null
          hidden_by?: string[] | null
          id?: string
          is_completed?: boolean | null
          is_followup?: boolean | null
          lead_id?: string | null
          location?: string | null
          next_action?: string | null
          next_action_date?: string | null
          next_follow_up?: string | null
          notes?: string | null
          outcome?: string | null
          start_time?: string | null
          type?: string
          update?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      file_tag_relations: {
        Row: {
          file_id: string
          tag_id: string
        }
        Insert: {
          file_id: string
          tag_id: string
        }
        Update: {
          file_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_tag_relations_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_tag_relations_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "file_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      file_tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      files: {
        Row: {
          created_at: string | null
          folder_id: string
          id: string
          name: string
          path: string
          size: number | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          folder_id: string
          id?: string
          name: string
          path: string
          size?: number | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          folder_id?: string
          id?: string
          name?: string
          path?: string
          size?: number | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
        ]
      }
      folders: {
        Row: {
          created_at: string | null
          id: string
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          available_quantity: number
          created_at: string | null
          current_price: number
          dimensions: string | null
          id: string
          ltc: number | null
          min_price: number
          quantity: number
          reserved_quantity: number | null
          sector_id: string
          sku: string | null
          sold_quantity: number | null
          status: string
          type_id: string
          updated_at: string | null
        }
        Insert: {
          available_quantity?: number
          created_at?: string | null
          current_price: number
          dimensions?: string | null
          id?: string
          ltc?: number | null
          min_price: number
          quantity?: number
          reserved_quantity?: number | null
          sector_id: string
          sku?: string | null
          sold_quantity?: number | null
          status: string
          type_id: string
          updated_at?: string | null
        }
        Update: {
          available_quantity?: number
          created_at?: string | null
          current_price?: number
          dimensions?: string | null
          id?: string
          ltc?: number | null
          min_price?: number
          quantity?: number
          reserved_quantity?: number | null
          sector_id?: string
          sku?: string | null
          sold_quantity?: number | null
          status?: string
          type_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "inventory_types"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_types: {
        Row: {
          base_dimensions: string | null
          base_ltc: number | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          total_quantity: number
          unit_type: string
          updated_at: string | null
        }
        Insert: {
          base_dimensions?: string | null
          base_ltc?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          total_quantity?: number
          unit_type: string
          updated_at?: string | null
        }
        Update: {
          base_dimensions?: string | null
          base_ltc?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          total_quantity?: number
          unit_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          activity_next_action: string | null
          activity_next_action_date: string | null
          activity_outcome: string | null
          activity_type: string | null
          budget: string | null
          client_name: string
          contact_person: string
          conversion_date: string | null
          conversion_status: string | null
          conversion_type: string | null
          created_at: string | null
          date: string
          email: string
          id: string
          lead_ref: string | null
          lead_source: string | null
          location: string
          phone: string
          price_quoted: number | null
          remarks: string | null
          requirement: Json
          status: string
          team_member_id: string | null
          updated_at: string | null
        }
        Insert: {
          activity_next_action?: string | null
          activity_next_action_date?: string | null
          activity_outcome?: string | null
          activity_type?: string | null
          budget?: string | null
          client_name: string
          contact_person: string
          conversion_date?: string | null
          conversion_status?: string | null
          conversion_type?: string | null
          created_at?: string | null
          date?: string
          email: string
          id?: string
          lead_ref?: string | null
          lead_source?: string | null
          location: string
          phone: string
          price_quoted?: number | null
          remarks?: string | null
          requirement?: Json
          status?: string
          team_member_id?: string | null
          updated_at?: string | null
        }
        Update: {
          activity_next_action?: string | null
          activity_next_action_date?: string | null
          activity_outcome?: string | null
          activity_type?: string | null
          budget?: string | null
          client_name?: string
          contact_person?: string
          conversion_date?: string | null
          conversion_status?: string | null
          conversion_type?: string | null
          created_at?: string | null
          date?: string
          email?: string
          id?: string
          lead_ref?: string | null
          lead_source?: string | null
          location?: string
          phone?: string
          price_quoted?: number | null
          remarks?: string | null
          requirement?: Json
          status?: string
          team_member_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          deleted_at: string | null
          height: number | null
          id: string
          position: Json | null
          tags: string[] | null
          title: string
          updated_at: string | null
          width: number | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          deleted_at?: string | null
          height?: number | null
          id?: string
          position?: Json | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          width?: number | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          deleted_at?: string | null
          height?: number | null
          id?: string
          position?: Json | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          width?: number | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          inventory_item_id: string
          order_id: string
          price: number
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          inventory_item_id: string
          order_id: string
          price: number
          quantity?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          inventory_item_id?: string
          order_id?: string
          price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          additional_details: string | null
          commission_amount: number | null
          commission_percentage: number | null
          created_at: string | null
          customer_address: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          lead_id: string | null
          next_payment_date: string | null
          next_payment_details: string | null
          notes: string | null
          payment_confirmation: string | null
          payment_date: string | null
          payment_method: string | null
          payment_status: string | null
          status: string
          team_member_id: string | null
          team_member_name: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          additional_details?: string | null
          commission_amount?: number | null
          commission_percentage?: number | null
          created_at?: string | null
          customer_address?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          lead_id?: string | null
          next_payment_date?: string | null
          next_payment_details?: string | null
          notes?: string | null
          payment_confirmation?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          status: string
          team_member_id?: string | null
          team_member_name?: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          additional_details?: string | null
          commission_amount?: number | null
          commission_percentage?: number | null
          created_at?: string | null
          customer_address?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          lead_id?: string | null
          next_payment_date?: string | null
          next_payment_details?: string | null
          notes?: string | null
          payment_confirmation?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          status?: string
          team_member_id?: string | null
          team_member_name?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          role: string | null
        }
        Insert: {
          id: string
          role?: string | null
        }
        Update: {
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      sectors: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
          zone_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
          zone_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          zone_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sectors_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          commission_rate: number | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          role: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          commission_rate?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      zones: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      inventory_detailed_metrics: {
        Row: {
          avg_price: number | null
          completed_orders: number | null
          cumulative_sales: number | null
          date: string | null
          item_type: string | null
          items_sold: number | null
          revenue: number | null
          revenue_growth_percent: number | null
          team_member_id: string | null
          team_member_name: string | null
          total_orders: number | null
          type_id: string | null
          weekly_avg_revenue: number | null
          zone_id: string | null
          zone_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "inventory_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sectors_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
