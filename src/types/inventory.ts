export interface Zone {
  id: string;
  name: string;
  description?: string;
}

export interface Sector {
  id: string;
  zone_id: string;
  name: string;
  description?: string;
  zones?: Zone;
}

export interface InventoryType {
  id: string;
  name: string;
  description?: string;
  total_quantity: number;
  unit_type: string;
  base_ltc?: number;
  base_dimensions?: string;
}

export interface InventoryItem {
  id: string;
  type_id: string;
  sector_id: string;
  current_price: number;
  min_price: number;
  status: string;
  created_at: string | null;
  ltc?: number;
  dimensions?: string;
  quantity: number;
  available_quantity: number;
  reserved_quantity: number;
  sold_quantity: number;
  sku?: string;
  inventory_types?: InventoryType;
  sectors?: { 
    id: string;
    name: string;
    zones?: { 
      id: string;
      name: string 
    };
  };
  bookings?: {
    id: string;
    status: string;
  }[];
}

export interface Order {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  total_amount: number;
  created_at: string;
  updated_at: string;
  team_member_id?: string;
  team_member_name: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  notes?: string;
  payment_status?: string;
  payment_method?: string;
  payment_date?: string;
  commission_amount?: number;
  commission_percentage?: number;
  payment_confirmation?: string;
  next_payment_date?: string;
  next_payment_details?: string;
  additional_details?: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  inventory_item_id: string;
  quantity: number;
  price: number;
  created_at?: string;
  inventory_items?: {
    id: string;
    sku?: string;
    inventory_types?: {
      id: string;
      name: string;
    };
  };
}

export interface Booking {
  id: string;
  inventory_item_id: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  team_member_name: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  notes?: string;
  payment_status?: string;
  payment_amount?: number;
  inventory_items?: {
    id: string;
    inventory_types?: InventoryType;
  };
}

export interface InventoryStatusMetric {
  type_id: string;
  type_name: string;
  sector_id: string;
  sector_name: string;
  zone_id: string;
  zone_name: string;
  status: string;
  item_count: number;
  total_value: number;
  percentage_of_type: number;
  percentage_of_zone: number;
}
