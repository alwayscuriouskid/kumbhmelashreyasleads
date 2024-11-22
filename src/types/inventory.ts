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
  status: 'available' | 'booked' | 'sold';
  created_at: string;
  ltc?: number;
  dimensions?: string;
  quantity: number;
  sku?: string;
  inventory_types?: { 
    id: string;
    name: string 
  };
  sectors?: { 
    id: string;
    name: string;
    zones?: { 
      id: string;
      name: string 
    };
  };
}

export interface Order {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  inventory_item_id: string;
  price: number;
  created_at: string;
}

export interface Booking {
  id: string;
  inventory_item_id: string;
  start_date: string;
  end_date: string;
  status: 'tentative' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}