import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type ERPPurchaseReceipt } from "./api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface GroupedERPPurchaseReceipt {
  id: string;
  receipt_number: string;
  customer_id?: string | null;
  customer_name: string;
  customer_phone?: string;
  payment_method: string;
  notes?: string | null;
  created_at: string;
  materials: Array<{
    material_id: string;
    material_name: string;
    weight: number;
    unit: string;
    price_per_unit: number;
    total_amount: number;
  }>;
  total_amount: number;
  material_name: string;
  weight: number;
  unit: string;
  price_per_unit: number;
}

export function groupReceipts(rawReceipts: ERPPurchaseReceipt[]): GroupedERPPurchaseReceipt[] {
  const groups: { [baseNumber: string]: ERPPurchaseReceipt[] } = {};

  rawReceipts.forEach((r) => {
    const baseNumber = r.receipt_number.split("/")[0];
    if (!groups[baseNumber]) {
      groups[baseNumber] = [];
    }
    groups[baseNumber].push(r);
  });

  const grouped: GroupedERPPurchaseReceipt[] = [];

  for (const baseNumber of Object.keys(groups)) {
    const items = groups[baseNumber];
    items.sort((a, b) => a.receipt_number.localeCompare(b.receipt_number));

    const baseItem = items[0];
    const total_amount = items.reduce((sum, item) => sum + Number(item.total_amount), 0);
    const material_name = items.map((item) => item.material_name).join(", ");
    const total_weight = items.reduce((sum, item) => sum + Number(item.weight), 0);

    grouped.push({
      id: baseItem.id,
      receipt_number: baseNumber,
      customer_id: baseItem.customer_id,
      customer_name: baseItem.customer_name,
      customer_phone: baseItem.customer_phone,
      payment_method: baseItem.payment_method,
      notes: baseItem.notes,
      created_at: baseItem.created_at,
      materials: items.map((item) => ({
        material_id: item.material_id,
        material_name: item.material_name,
        weight: Number(item.weight),
        unit: item.unit || "kg",
        price_per_unit: Number(item.price_per_unit),
        total_amount: Number(item.total_amount),
      })),
      total_amount,
      material_name,
      weight: total_weight,
      unit: baseItem.unit || "kg",
      price_per_unit: baseItem.price_per_unit,
    });
  }

  const orderedGrouped: GroupedERPPurchaseReceipt[] = [];
  const seen = new Set<string>();
  rawReceipts.forEach((r) => {
    const baseNumber = r.receipt_number.split("/")[0];
    if (!seen.has(baseNumber)) {
      seen.add(baseNumber);
      const group = grouped.find((g) => g.receipt_number === baseNumber);
      if (group) {
        orderedGrouped.push(group);
      }
    }
  });

  return orderedGrouped;
}
