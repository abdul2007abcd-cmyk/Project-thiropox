import { Garment, Address, Order } from './types';

export const LOCAL_GARMENTS: Garment[] = [
  {
    id: 'shirt',
    name: 'Shirts & T-Shirts',
    icon: '👔',
    prices: { ironing: 20, wash_iron: 55, dry_clean: 110 },
    popular: true
  },
  {
    id: 'trouser',
    name: 'Trousers & Jeans',
    icon: '👖',
    prices: { ironing: 20, wash_iron: 60, dry_clean: 120 },
    popular: true
  },
  {
    id: 'kurtis',
    name: 'Kurtas & Kurtis',
    icon: '👗',
    prices: { ironing: 20, wash_iron: 65, dry_clean: 130 }
  },
  {
    id: 'saree',
    name: 'Sarees & Dresses',
    icon: '🥻',
    prices: { ironing: 40, wash_iron: 99, dry_clean: 220 },
    popular: true
  },
  {
    id: 'bedsheet',
    name: 'Bedsheets',
    icon: '🛌',
    prices: { ironing: 50, wash_iron: 120, dry_clean: 250 }
  },
  {
    id: 'towel',
    name: 'Towels',
    icon: '🧼',
    prices: { ironing: 15, wash_iron: 40, dry_clean: 80 }
  },
  {
    id: 'kidswear',
    name: 'Kids Wear',
    icon: '👶',
    prices: { ironing: 15, wash_iron: 35, dry_clean: 70 }
  },
  {
    id: 'suit',
    name: 'Premium Suits & Blazers',
    icon: '🧥',
    prices: { ironing: 80, wash_iron: 180, dry_clean: 350 }
  }
];

export const PRESET_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    label: 'Home',
    details: 'Flat 3B, Temple View Apartments, 24 Car Street, Triplicane, Chennai',
    landmark: 'Opposite Parthasarathy Temple',
    phone: '9840123456'
  },
  {
    id: 'addr-2',
    label: 'Office',
    details: 'Loom Innovation Labs, Suite 501, Mount Road, Anna Salai, Chennai',
    landmark: 'Near LIC Metro Station',
    phone: '9840555777'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'FF-4289',
    items: [
      { id: 'shirt', quantity: 3, service: 'ironing' },
      { id: 'trouser', quantity: 2, service: 'wash_iron' }
    ],
    totalPrice: 110, // Let's say we had discount applied: 3 shirts iron free! 2 trousers wash+iron is 2*60 = 120. With some taxes/transport?
    itemsDescription: '3 Shirts (Iron Only) • 2 Trousers (Wash + Iron)',
    status: 'Delivered',
    pickupDate: 'Jun 12, 2026',
    pickupTimeSlot: '9:00 AM - 12:00 PM',
    address: PRESET_ADDRESSES[0],
    paymentMethod: 'cash_on_delivery',
    isFirstOrderPromoApplied: true,
    whatsappConfirmed: true,
    orderTime: 'June 12, 2026 at 10:15 AM'
  },
  {
    id: 'FF-7852',
    items: [
      { id: 'suit', quantity: 1, service: 'dry_clean' },
      { id: 'saree', quantity: 2, service: 'ironing' }
    ],
    totalPrice: 430, // 350 + 80 = 430
    itemsDescription: '1 Suit (Dry Clean) • 2 Sarees (Iron Only)',
    status: 'Ironing',
    pickupDate: 'Jun 14, 2026',
    pickupTimeSlot: '3:00 PM - 6:00 PM',
    address: PRESET_ADDRESSES[0],
    paymentMethod: 'whatsapp',
    isFirstOrderPromoApplied: false,
    whatsappConfirmed: true,
    orderTime: 'June 14, 2026 at 4:30 PM'
  }
];

export const TIME_SLOTS = [
  '9:00 AM - 12:00 PM (Morning Valet)',
  '12:00 PM - 3:00 PM (Afternoon Valet)',
  '3:00 PM - 6:00 PM (Evening Valet)',
  '6:00 PM - 9:00 PM (Night Valet)'
];

export const FAQ_ITEMS = [
  {
    question: 'How does the free doorstep pickup & delivery work?',
    answer: 'Simply choose your garments and preferred time slot in the app. Our scooter-riding valet will reach your doorstep in Triplicane & surrounding areas to pick up your laundry. Once cleaned to perfection, ironed, and folded, we deliver it back for free!'
  },
  {
    question: 'Is the "First 3 Shirts Free Ironing" offer really free?',
    answer: 'Absolutely! For all new customers, the price of ironing for your first 3 shirts/t-shirts is 100% free (saving ₹60 directly). The discount is auto-applied at your first order checkout.'
  },
  {
    question: 'Are there any hidden pickup, delivery, or processing charges?',
    answer: 'No hidden charges at all! As highlighted in our catalog, ironing is flat ₹20 per item with 100% free pickup and doorstep delivery. Transparency is our core value.'
  },
  {
    question: 'How fast can I get my clothes back?',
    answer: 'Our standard turnaround time is 24 to 48 hours. If you are in a rush, please notify our team via WhatsApp to request priority processing.'
  },
  {
    question: 'How do I pay for my order?',
    answer: 'You can pay using Cash on Delivery (COD), online UPI (GPay/PhonePe), or directly via our secure WhatsApp link after checking your digital laundry receipt.'
  }
];
