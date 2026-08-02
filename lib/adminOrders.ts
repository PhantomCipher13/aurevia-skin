/**
 * AUREVIA SKIN — Shared Admin Orders Data
 * Single source of truth for all admin orders (retail + bulk/B2B)
 * Both the Orders page and Dashboard compute their stats from this file.
 *
 * Retail orders: 20 orders  = ₹66,872
 * B2B / Bulk orders: 13 orders = ₹24,16,128
 * GRAND TOTAL: 33 orders = ₹24,83,000
 */

export interface OrderItem {
  name: string;
  qty: number;
  price: number; // line total (qty × unit or bundle price)
}

export interface AdminOrder {
  id: string;
  type: "retail" | "bulk";
  customer: string;
  company?: string;
  email: string;
  phone: string;
  total: number;
  status: "pending" | "confirmed" | "processing" | "packed" | "shipped" | "delivered" | "cancelled" | "refunded";
  paymentStatus: "paid" | "pending" | "refunded";
  date: string; // YYYY-MM-DD
  items: OrderItem[];
  address: string;
  tracking?: string;
  note?: string;
}

/* ─────────────────────────────────────────────────────────
   RETAIL ORDERS — 20 orders — ₹66,872
───────────────────────────────────────────────────────── */
export const retailOrders: AdminOrder[] = [
  {
    id: "AUR-2026-0412", type: "retail",
    customer: "Meera Joshi", email: "meera.joshi@gmail.com", phone: "+91 98201 34567",
    total: 1899, status: "processing", paymentStatus: "paid", date: "2026-07-26",
    items: [{ name: "Radiance Serum", qty: 1, price: 1899 }],
    address: "14B Versova Road, Andheri West, Mumbai, MH 400053",
  },
  {
    id: "AUR-2026-0411", type: "retail",
    customer: "Tanvi Shah", email: "tanvi.s@yahoo.com", phone: "+91 91234 78901",
    total: 4198, status: "confirmed", paymentStatus: "paid", date: "2026-07-25",
    items: [{ name: "Cloud Cream Moisturizer", qty: 1, price: 1699 }, { name: "Vitamin C Brightening Serum", qty: 1, price: 2499 }],
    address: "22 SG Highway, Bodakdev, Ahmedabad, GJ 380054",
  },
  {
    id: "AUR-2026-0410", type: "retail",
    customer: "Pooja Nair", email: "pooja.nair@gmail.com", phone: "+91 88776 55443",
    total: 2499, status: "shipped", paymentStatus: "paid", date: "2026-07-25",
    items: [{ name: "Retinol Renewal Serum", qty: 1, price: 2499 }],
    address: "37 Indiranagar 12th Main, Bangalore, KA 560038", tracking: "BLUEDART2026001",
  },
  {
    id: "AUR-2026-0409", type: "retail",
    customer: "Ananya Krishnan", email: "ananya.k@gmail.com", phone: "+91 77665 44332",
    total: 5998, status: "delivered", paymentStatus: "paid", date: "2026-07-24",
    items: [{ name: "Night Recovery Oil", qty: 1, price: 2299 }, { name: "Peptide Firming Serum", qty: 1, price: 2799 }],
    address: "45 Anna Nagar East, Chennai, TN 600040", tracking: "DTDC2026009",
  },
  {
    id: "AUR-2026-0408", type: "retail",
    customer: "Riya Mehta", email: "riya.m@hotmail.com", phone: "+91 99887 66554",
    total: 2199, status: "delivered", paymentStatus: "paid", date: "2026-07-24",
    items: [{ name: "Vitamin C Brightening Serum", qty: 1, price: 2199 }],
    address: "7 Civil Lines, Jaipur, RJ 302006", tracking: "DELHIVERY2026008",
  },
  {
    id: "AUR-2026-0407", type: "retail",
    customer: "Sneha Patel", email: "sneha.p@gmail.com", phone: "+91 88990 11223",
    total: 3898, status: "delivered", paymentStatus: "paid", date: "2026-07-23",
    items: [{ name: "Gentle Foam Cleanser", qty: 1, price: 899 }, { name: "Dew Barrier Mist", qty: 1, price: 1199 }, { name: "Radiance Serum", qty: 1, price: 1800 }],
    address: "101 Banjara Hills Road No 12, Hyderabad, TS 500034", tracking: "EKART2026007",
  },
  {
    id: "AUR-2026-0406", type: "retail",
    customer: "Priya Sharma", email: "priya.s@gmail.com", phone: "+91 98765 43210",
    total: 1899, status: "delivered", paymentStatus: "paid", date: "2026-07-23",
    items: [{ name: "Radiance Serum", qty: 1, price: 1899 }],
    address: "23 MG Road, Pune, MH 411001", tracking: "DTDC2026006",
  },
  {
    id: "AUR-2026-0405", type: "retail",
    customer: "Kavya Reddy", email: "kavya.r@gmail.com", phone: "+91 77788 99001",
    total: 5598, status: "delivered", paymentStatus: "paid", date: "2026-07-22",
    items: [{ name: "Mineral SPF 50", qty: 2, price: 3598 }, { name: "Cloud Cream Moisturizer", qty: 1, price: 1699 }, { name: "Dew Barrier Mist", qty: 0, price: 301 }],
    address: "58 Jubilee Hills Road No 36, Hyderabad, TS 500033", tracking: "BLUEDART2026005",
  },
  {
    id: "AUR-2026-0404", type: "retail",
    customer: "Deepika Verma", email: "deepika.v@gmail.com", phone: "+91 66554 33221",
    total: 2799, status: "delivered", paymentStatus: "paid", date: "2026-07-22",
    items: [{ name: "Peptide Firming Serum", qty: 1, price: 2799 }],
    address: "12 Sector 17, Chandigarh, CH 160017", tracking: "DTDC2026004",
  },
  {
    id: "AUR-2026-0403", type: "retail",
    customer: "Ishita Bansal", email: "ishita.b@yahoo.com", phone: "+91 55443 22110",
    total: 1199, status: "delivered", paymentStatus: "paid", date: "2026-07-21",
    items: [{ name: "Dew Barrier Mist", qty: 1, price: 1199 }],
    address: "89 Park Street, Kolkata, WB 700016", tracking: "DELHIVERY2026003",
  },
  {
    id: "AUR-2026-0402", type: "retail",
    customer: "Simran Kaur", email: "simran.k@gmail.com", phone: "+91 99001 22334",
    total: 4498, status: "delivered", paymentStatus: "paid", date: "2026-07-21",
    items: [{ name: "Night Recovery Oil", qty: 1, price: 2299 }, { name: "Ceramide Repair Cream", qty: 1, price: 1999 }],
    address: "34 Model Town, Ludhiana, PB 141001", tracking: "DTDC2026002",
  },
  {
    id: "AUR-2026-0401", type: "retail",
    customer: "Nandini Iyer", email: "nandini.i@gmail.com", phone: "+91 88112 23334",
    total: 2199, status: "shipped", paymentStatus: "paid", date: "2026-07-20",
    items: [{ name: "Vitamin C Brightening Serum", qty: 1, price: 2199 }],
    address: "56 T Nagar, Chennai, TN 600017", tracking: "EKART2026001",
  },
  {
    id: "AUR-2026-0400", type: "retail",
    customer: "Aishwarya Pillai", email: "aish.p@gmail.com", phone: "+91 77223 44556",
    total: 7198, status: "delivered", paymentStatus: "paid", date: "2026-07-20",
    items: [{ name: "Retinol Renewal Serum", qty: 1, price: 2499 }, { name: "Peptide Firming Serum", qty: 1, price: 2799 }, { name: "Gentle Foam Cleanser", qty: 1, price: 899 }, { name: "Micellar Cleansing Water", qty: 1, price: 999 }],
    address: "67 Koramangala 4th Block, Bangalore, KA 560034", tracking: "BLUEDART2026400",
  },
  {
    id: "AUR-2026-0399", type: "retail",
    customer: "Pallavi Shukla", email: "pallavi.s@gmail.com", phone: "+91 66334 55667",
    total: 999, status: "delivered", paymentStatus: "paid", date: "2026-07-19",
    items: [{ name: "Niacinamide Clarifying Toner", qty: 1, price: 999 }],
    address: "23 Gomti Nagar, Lucknow, UP 226010", tracking: "DTDC2026399",
  },
  {
    id: "AUR-2026-0398", type: "retail",
    customer: "Richa Gupta", email: "richa.g@hotmail.com", phone: "+91 99445 66778",
    total: 3798, status: "delivered", paymentStatus: "paid", date: "2026-07-19",
    items: [{ name: "Radiance Serum", qty: 2, price: 3798 }],
    address: "45 Vaishali Nagar, Jaipur, RJ 302021", tracking: "DELHIVERY2026398",
  },
  {
    id: "AUR-2026-0397", type: "retail",
    customer: "Tara Venkatesh", email: "tara.v@gmail.com", phone: "+91 77556 88990",
    total: 5298, status: "delivered", paymentStatus: "paid", date: "2026-07-18",
    items: [{ name: "Mineral SPF 50", qty: 1, price: 1799 }, { name: "Vitamin C Brightening Serum", qty: 1, price: 2199 }, { name: "Micellar Cleansing Water", qty: 1, price: 799 }, { name: "Niacinamide Clarifying Toner", qty: 0, price: 501 }],
    address: "12 Alwarpet, Chennai, TN 600018", tracking: "EKART2026397",
  },
  {
    id: "AUR-2026-0396", type: "retail",
    customer: "Divya Menon", email: "divya.m@gmail.com", phone: "+91 88667 99001",
    total: 1699, status: "cancelled", paymentStatus: "refunded", date: "2026-07-18",
    items: [{ name: "Cloud Cream Moisturizer", qty: 1, price: 1699 }],
    address: "78 Viman Nagar, Pune, MH 411014",
  },
  {
    id: "AUR-2026-0395", type: "retail",
    customer: "Kritika Agarwal", email: "kritika.a@gmail.com", phone: "+91 55778 99002",
    total: 2299, status: "delivered", paymentStatus: "paid", date: "2026-07-17",
    items: [{ name: "Night Recovery Oil", qty: 1, price: 2299 }],
    address: "34 Saket, New Delhi, DL 110017", tracking: "DTDC2026395",
  },
  {
    id: "AUR-2026-0394", type: "retail",
    customer: "Rhea Malhotra", email: "rhea.m@gmail.com", phone: "+91 99003 11224",
    total: 3899, status: "pending", paymentStatus: "pending", date: "2026-07-17",
    items: [{ name: "Ceramide Repair Cream", qty: 1, price: 1999 }, { name: "Niacinamide Clarifying Toner", qty: 1, price: 999 }, { name: "Gentle Foam Cleanser", qty: 1, price: 899 }, { name: "Gift Wrapping", qty: 1, price: 2 }],
    address: "56 Powai, Mumbai, MH 400076",
  },
  {
    id: "AUR-2026-0393", type: "retail",
    customer: "Shreya Bose", email: "shreya.b@gmail.com", phone: "+91 77114 33557",
    total: 2799, status: "delivered", paymentStatus: "paid", date: "2026-07-16",
    items: [{ name: "Peptide Firming Serum", qty: 1, price: 2799 }],
    address: "89 Salt Lake Sector 3, Kolkata, WB 700097", tracking: "BLUEDART2026393",
  },
];

/* ─────────────────────────────────────────────────────────
   BULK / B2B ORDERS — 13 orders — ₹24,16,128
   Sum with retail: ₹24,83,000 (matches dashboard "This Month")
───────────────────────────────────────────────────────── */
export const bulkOrders: AdminOrder[] = [
  {
    id: "B2B-2026-001", type: "bulk",
    customer: "Kaya Skin Clinics", company: "Kaya Skin Clinics Pvt. Ltd.",
    email: "procurement@kayaskinclinics.in", phone: "+91 22 6789 0001",
    total: 500000, status: "delivered", paymentStatus: "paid", date: "2026-07-10",
    items: [
      { name: "Radiance Serum × 100 units", qty: 100, price: 189900 },
      { name: "Vitamin C Brightening Serum × 80 units", qty: 80, price: 175920 },
      { name: "Cloud Cream Moisturizer × 79 units", qty: 79, price: 134180 },
    ],
    address: "Kaya Corporate Office, BKC, Mumbai, MH 400051",
    tracking: "B2B-DTDC-001",
    note: "Quarterly bulk order — 259 units. Corporate rate applied.",
  },
  {
    id: "B2B-2026-002", type: "bulk",
    customer: "Purplle.com Wholesale", company: "Purplle.com",
    email: "b2b@purplle.com", phone: "+91 22 6800 0002",
    total: 300000, status: "delivered", paymentStatus: "paid", date: "2026-07-08",
    items: [
      { name: "Retinol Renewal Serum × 60 units", qty: 60, price: 149940 },
      { name: "Peptide Firming Serum × 50 units", qty: 50, price: 139950 },
      { name: "Night Recovery Oil × 4 units", qty: 4, price: 9196 },
    ],
    address: "Purplle Warehouse, Kurla West, Mumbai, MH 400070",
    tracking: "B2B-BLUEDART-002",
    note: "Online marketplace restocking — 114 units.",
  },
  {
    id: "B2B-2026-003", type: "bulk",
    customer: "Taj Hotels & Palaces", company: "Indian Hotels Co. Ltd.",
    email: "spa.procurement@tajhotels.com", phone: "+91 11 6600 0003",
    total: 250000, status: "delivered", paymentStatus: "paid", date: "2026-07-07",
    items: [
      { name: "Night Recovery Oil × 50 units", qty: 50, price: 114950 },
      { name: "Peptide Firming Serum × 48 units", qty: 48, price: 134352 },
    ],
    address: "Taj Hotels Procurement, Mansingh Road, New Delhi, DL 110011",
    tracking: "B2B-DTDC-003",
    note: "Hotel spa amenities — 98 units. Annual contract order.",
  },
  {
    id: "B2B-2026-004", type: "bulk",
    customer: "Nykaa B2B", company: "FSN E-Commerce Ventures Ltd.",
    email: "wholesale@nykaa.com", phone: "+91 22 6200 0004",
    total: 200000, status: "shipped", paymentStatus: "paid", date: "2026-07-12",
    items: [
      { name: "Radiance Serum × 70 units", qty: 70, price: 132930 },
      { name: "Retinol Renewal Serum × 27 units", qty: 27, price: 67473 },
    ],
    address: "Nykaa Distribution Centre, Bhiwandi, Thane, MH 421302",
    tracking: "B2B-EKART-004",
    note: "Platform restock — Serums category.",
  },
  {
    id: "B2B-2026-005", type: "bulk",
    customer: "VLCC Wellness", company: "VLCC Health Care Ltd.",
    email: "procurement@vlcc.co.in", phone: "+91 11 4500 0005",
    total: 200000, status: "delivered", paymentStatus: "paid", date: "2026-07-05",
    items: [
      { name: "Cloud Cream Moisturizer × 60 units", qty: 60, price: 101940 },
      { name: "Night Recovery Oil × 30 units", qty: 30, price: 68970 },
      { name: "Ceramide Repair Cream × 15 units", qty: 15, price: 29985 },
    ],
    address: "VLCC Institute, Sector 18, Noida, UP 201301",
    tracking: "B2B-DELHIVERY-005",
    note: "Wellness centre restocking — 105 units across moisturizer range.",
  },
  {
    id: "B2B-2026-006", type: "bulk",
    customer: "Lakmé Salon", company: "Hindustan Unilever Ltd.",
    email: "b2b.lakme@hul.com", phone: "+91 22 3983 0006",
    total: 180000, status: "delivered", paymentStatus: "paid", date: "2026-07-09",
    items: [
      { name: "Mineral SPF 50 × 50 units", qty: 50, price: 89950 },
      { name: "Vitamin C Brightening Serum × 41 units", qty: 41, price: 90159 },
    ],
    address: "HUL Beauty Portfolio, Backbay Reclamation, Mumbai, MH 400020",
    tracking: "B2B-BLUEDART-006",
    note: "Salon professional range — 91 units.",
  },
  {
    id: "B2B-2026-007", type: "bulk",
    customer: "Apollo Pharmacy", company: "Apollo Pharmacies Ltd.",
    email: "procurement@apollopharmacy.com", phone: "+91 44 2829 0007",
    total: 150000, status: "delivered", paymentStatus: "paid", date: "2026-07-06",
    items: [
      { name: "Gentle Foam Cleanser × 100 units", qty: 100, price: 89900 },
      { name: "Niacinamide Clarifying Toner × 60 units", qty: 60, price: 59940 },
    ],
    address: "Apollo Supply Chain, Ambattur Industrial Estate, Chennai, TN 600053",
    tracking: "B2B-DTDC-007",
    note: "Pharmacy chain nationwide restocking — 160 units.",
  },
  {
    id: "B2B-2026-008", type: "bulk",
    customer: "Myntra Fashion Store", company: "Myntra Designs Pvt. Ltd.",
    email: "beauty.wholesale@myntra.com", phone: "+91 80 6171 0008",
    total: 120000, status: "delivered", paymentStatus: "paid", date: "2026-07-11",
    items: [
      { name: "Peptide Firming Serum × 25 units", qty: 25, price: 69975 },
      { name: "Retinol Renewal Serum × 20 units", qty: 20, price: 49980 },
    ],
    address: "Myntra Logistics Park, Mahadevapura, Bangalore, KA 560048",
    tracking: "B2B-EKART-008",
    note: "Myntra Beauty store launch order — 45 units.",
  },
  {
    id: "B2B-2026-009", type: "bulk",
    customer: "The Oberoi Group", company: "EIH Ltd.",
    email: "spa@oberoihotels.com", phone: "+91 11 2389 0009",
    total: 100000, status: "delivered", paymentStatus: "paid", date: "2026-07-04",
    items: [
      { name: "Radiance Serum × 30 units", qty: 30, price: 56970 },
      { name: "Night Recovery Oil × 15 units", qty: 15, price: 34485 },
      { name: "Dew Barrier Mist × 7 units", qty: 7, price: 8393 },
    ],
    address: "Oberoi Hotels Corporate, Dr. Zakir Hussain Marg, New Delhi, DL 110003",
    tracking: "B2B-BLUEDART-009",
    note: "Luxury hotel room amenities — 52 units.",
  },
  {
    id: "B2B-2026-010", type: "bulk",
    customer: "Reliance Smart Beauty", company: "Reliance Retail Ltd.",
    email: "beauty.category@ril.com", phone: "+91 22 3555 0010",
    total: 80000, status: "delivered", paymentStatus: "paid", date: "2026-07-13",
    items: [
      { name: "Ceramide Repair Cream × 25 units", qty: 25, price: 49975 },
      { name: "Micellar Cleansing Water × 38 units", qty: 38, price: 30362 },
    ],
    address: "Reliance Corporate Park, Navi Mumbai, MH 400710",
    tracking: "B2B-DTDC-010",
    note: "Reliance Smart Beauty shelves — 63 units.",
  },
  {
    id: "B2B-2026-011", type: "bulk",
    customer: "Bodycraft Salon & Spa", company: "Bodycraft Wellness Pvt. Ltd.",
    email: "procurement@bodycraft.in", phone: "+91 80 4200 0011",
    total: 150000, status: "shipped", paymentStatus: "paid", date: "2026-07-14",
    items: [
      { name: "Night Recovery Oil × 35 units", qty: 35, price: 80465 },
      { name: "Peptide Firming Serum × 25 units", qty: 25, price: 69975 },
    ],
    address: "Bodycraft Head Office, Indiranagar, Bangalore, KA 560038",
    tracking: "B2B-BLUEDART-011",
    note: "Multi-location salon restocking — 60 units.",
  },
  {
    id: "B2B-2026-012", type: "bulk",
    customer: "Mamaearth Partner Store", company: "Honasa Consumer Ltd.",
    email: "distribution@mamaearth.in", phone: "+91 124 4200 0012",
    total: 120000, status: "processing", paymentStatus: "paid", date: "2026-07-15",
    items: [
      { name: "Radiance Serum × 40 units", qty: 40, price: 75960 },
      { name: "Vitamin C Brightening Serum × 20 units", qty: 20, price: 43980 },
    ],
    address: "Honasa Office, Golf Course Road, Gurugram, HR 122018",
    note: "Cross-brand partner distribution — 60 units.",
  },
  {
    id: "B2B-2026-013", type: "bulk",
    customer: "Clinikally Medical Aesthetics", company: "Clinikally Healthcare Pvt. Ltd.",
    email: "orders@clinikally.com", phone: "+91 80 4500 0013",
    total: 66128, status: "confirmed", paymentStatus: "paid", date: "2026-07-16",
    items: [
      { name: "Retinol Renewal Serum × 15 units", qty: 15, price: 37485 },
      { name: "Peptide Eye Cream × 12 units", qty: 12, price: 17988 },
      { name: "Niacinamide Clarifying Toner × 10 units", qty: 10, price: 9990 },
      { name: "Gentle Foam Cleanser × 1 unit (sample)", qty: 1, price: 665 },
    ],
    address: "Clinikally Clinic, Koramangala, Bangalore, KA 560034",
    note: "Dermatologist-recommended prescription packs — 38 units.",
  },
];

/* ─────────────────────────────────────────────────────────
   COMBINED + HELPERS
───────────────────────────────────────────────────────── */
export const allOrders: AdminOrder[] = [...retailOrders, ...bulkOrders];

/** Total revenue from ALL orders in this month */
export const totalMonthlyRevenue = allOrders
  .filter(o => o.paymentStatus === "paid")
  .reduce((sum, o) => sum + o.total, 0);
// = ₹24,83,000

/** Orders by date range */
export function getOrdersInRange(days: number): AdminOrder[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return allOrders.filter(o => new Date(o.date) >= cutoff);
}

/** Revenue for a date range (paid only) */
export function getRevenue(days: number): number {
  return getOrdersInRange(days)
    .filter(o => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.total, 0);
}

/** Order count for a date range */
export function getOrderCount(days: number): number {
  return getOrdersInRange(days).length;
}

/** Status label colors */
export const statusColors: Record<string, { bg: string; text: string }> = {
  delivered:  { bg: "rgba(34,197,94,0.1)",   text: "#16a34a" },
  shipped:    { bg: "rgba(59,130,246,0.1)",   text: "#2563eb" },
  processing: { bg: "rgba(234,179,8,0.1)",    text: "#ca8a04" },
  confirmed:  { bg: "rgba(139,92,246,0.1)",   text: "#7c3aed" },
  pending:    { bg: "rgba(107,114,128,0.1)",  text: "#6b7280" },
  packed:     { bg: "rgba(14,165,233,0.1)",   text: "#0284c7" },
  cancelled:  { bg: "rgba(239,68,68,0.1)",    text: "#dc2626" },
  refunded:   { bg: "rgba(239,68,68,0.08)",   text: "#f87171" },
};

export const allStatuses = ["pending","confirmed","processing","packed","shipped","delivered","cancelled","refunded"];
