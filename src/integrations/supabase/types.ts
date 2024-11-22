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
      bookings: {
        Row: {
          booking_reference: string | null
          cancellation_reason: string | null
          created_at: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          end_date: string
          id: string
          inventory_item_id: string
          notes: string | null
          payment_amount: number | null
          payment_date: string | null
          payment_method: string | null
          payment_status: string | null
          start_date: string
          status: string
          team_member_id: string | null
          team_member_name: string
          updated_at: string | null
        }
        Insert: {
          booking_reference?: string | null
          cancellation_reason?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          end_date: string
          id?: string
          inventory_item_id: string
          notes?: string | null
          payment_amount?: number | null
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          start_date: string
          status: string
          team_member_id?: string | null
          team_member_name?: string
          updated_at?: string | null
        }
        Update: {
          booking_reference?: string | null
          cancellation_reason?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          end_date?: string
          id?: string
          inventory_item_id?: string
          notes?: string | null
          payment_amount?: number | null
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          start_date?: string
          status?: string
          team_member_id?: string | null
          team_member_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          created_at: string | null
          current_price: number
          dimensions: string | null
          id: string
          ltc: number | null
          min_price: number
          quantity: number
          sector_id: string
          sku: string | null
          status: string
          type_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_price: number
          dimensions?: string | null
          id?: string
          ltc?: number | null
          min_price: number
          quantity?: number
          sector_id: string
          sku?: string | null
          status: string
          type_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_price?: number
          dimensions?: string | null
          id?: string
          ltc?: number | null
          min_price?: number
          quantity?: number
          sector_id?: string
          sku?: string | null
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
      order_items: {
        Row: {
          created_at: string | null
          id: string
          inventory_item_id: string
          order_id: string
          price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          inventory_item_id: string
          order_id: string
          price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          inventory_item_id?: string
          order_id?: string
          price?: number
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
          commission_amount: number | null
          commission_percentage: number | null
          created_at: string | null
          customer_address: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          notes: string | null
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
          commission_amount?: number | null
          commission_percentage?: number | null
          created_at?: string | null
          customer_address?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          notes?: string | null
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
          commission_amount?: number | null
          commission_percentage?: number | null
          created_at?: string | null
          customer_address?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          notes?: string | null
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
      detailed_sales_metrics: {
        Row: {
          avg_commission_rate: number | null
          cancelled_bookings: number | null
          confirmed_bookings: number | null
          month: string | null
          paid_orders: number | null
          pending_orders: number | null
          team_member_name: string | null
          total_booking_revenue: number | null
          total_bookings: number | null
          total_commission: number | null
          total_orders: number | null
          total_revenue: number | null
        }
        Relationships: []
      }
      sales_metrics: {
        Row: {
          cancelled_bookings: number | null
          confirmed_bookings: number | null
          month: string | null
          team_member_name: string | null
          total_booking_revenue: number | null
          total_bookings: number | null
          total_orders: number | null
          total_revenue: number | null
        }
        Relationships: []
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
