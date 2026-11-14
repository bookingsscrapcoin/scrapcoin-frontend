// payment_method for a pickup the customer donated (nothing paid, every rate ₹0)
export const DONATION = "donation";

export const PICKUP_PAYMENT_MODES = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "bank_transfer", label: "Bank transfer" },
  { value: DONATION, label: "Donated" },
];

/** Text printed after "Payment Mode:" on receipts and invoices */
export function paymentModeLabel(method?: string | null): string {
  if (method === DONATION) return "DONATED - NO PAYMENT";
  return (method || "cash").replace(/_/g, " ").toUpperCase();
}
