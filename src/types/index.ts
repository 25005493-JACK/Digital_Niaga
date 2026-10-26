export type StallCategory =
  | "All"
  | "Malaysian Local"
  | "Noodles & Soups"
  | "Rice Dishes"
  | "Snacks & Desserts"
  | "Beverages"
  | "Halal / Muslim-Friendly"
  | "Vegetarian";

export interface MenuItem {
  id: string;
  stall_id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
  is_signature?: boolean;
  spicy_level?: number; // 0 to 3
}

export interface Stall {
  id: string;
  hawker_centre_id: string;
  stall_number: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: StallCategory;
  cuisines: string[];
  contact_phone: string;
  operating_hours: string;
  logo_url: string;
  banner_url: string;
  duitnow_qr_url: string;
  is_halal: boolean;
  rating: number;
  // 3D booth coordinates in 1Main Food District model
  coord_3d: {
    x: number;
    y: number;
    z: number;
    rotationY?: number;
    boothWidth?: number;
    boothDepth?: number;
    color?: string;
  };
  menu: MenuItem[];
}

export type OrderType = "dine_in" | "takeaway";
export type PaymentMethod = "cash" | "duitnow_qr";
export type PaymentStatus = "unpaid" | "verified";
export type OrderStatus = "pending" | "preparing" | "ready" | "completed" | "cancelled";

export interface OrderItem {
  id: string;
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  stall_id: string;
  order_number: string;
  order_type: OrderType;
  table_number?: string;
  items: OrderItem[];
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  cashier_id: string;
  cashier_name: string;
  created_at: string;
  updated_at: string;
}
