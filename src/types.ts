export type ServiceType = 'ironing' | 'wash_iron' | 'dry_clean';

export interface Garment {
  id: string;
  name: string;
  icon: string;
  prices: {
    ironing: number;
    wash_iron: number;
    dry_clean: number;
  };
  popular?: boolean;
}

export interface SelectedItem {
  id: string; // garment ID
  quantity: number;
  service: ServiceType;
}

export interface Address {
  id: string;
  label: 'Home' | 'Office' | 'PG/Hostel' | 'Other';
  details: string;
  landmark?: string;
  phone: string;
}

export interface Order {
  id: string;
  items: SelectedItem[];
  totalPrice: number;
  itemsDescription: string;
  status: 'Scheduled' | 'Picked Up' | 'Cleaning' | 'Ironing' | 'Folded' | 'Delivered';
  pickupDate: string;
  pickupTimeSlot: string;
  address: Address;
  paymentMethod: 'cash_on_delivery' | 'online_payment' | 'whatsapp';
  whatsappConfirmed?: boolean;
  isFirstOrderPromoApplied?: boolean;
  isIroningPromoApplied?: boolean;
  orderTime: string;
}

export interface Testimonial {
  id: string;
  author: string;
  rating: number;
  text: string;
  location: string;
}
