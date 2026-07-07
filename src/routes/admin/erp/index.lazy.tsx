import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchERPDashboard, type ERPDashboardData } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  AlertTriangle,
  FileText,
  DollarSign,
  Scale,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const Route = createLazyFileRoute("/admin/erp/")({
  component: ERPDashboard,
});

const INVOICE_STATUS_COLORS = {
  paid: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  overdue: "bg-red-100 text-red-700 border-red-200",
  cancelled: "bg-gray-100 text-gray-700 border-gray-200",
};

const CHART_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", "#00c49f"];

function ERPDashboard() {
  const { session } = useAuth();
  const [data, setData] = useState<ERPDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.access_token) return;
    async function load() {
      try {
        const res = await fetchERPDashboard(session?.access_token);
        if (res.success) {
          setData(res.dashboard);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [session]);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[300px] lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-[300px] rounded-2xl" />
        </div>
      </div>
    );
  }

  const { revenue, low_stock_alerts, recent_transactions, monthly_trend, top_materials, invoice_summary } = data;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Revenue (This Month)</span>
            <DollarSign className="h-4.5 w-4.5 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            ₹{revenue.revenue_this_month.toLocaleString("en-IN")}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600">
            <TrendingUp className="h-3 w-3" />
            <span>Active transactions</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Collected</span>
            <Scale className="h-4.5 w-4.5 text-secondary" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {revenue.weight_this_month.toLocaleString("en-IN")} kg
          </p>
          <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>This calendar month</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Transactions Count</span>
            <FileText className="h-4.5 w-4.5 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {revenue.txn_count_this_month}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
            <span>B2B scale tickets logged</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Outstanding Invoices</span>
            <AlertTriangle className="h-4.5 w-4.5 text-red-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            ₹{invoice_summary.pending_amount.toLocaleString("en-IN")}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[10px] text-red-500 font-medium">
            <span>{invoice_summary.pending_count} pending invoices</span>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Bar Chart */}
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold text-foreground mb-4">6-Month Purchase Trend</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="total_revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Materials Pie Chart */}
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4">Top Materials (Revenue)</h2>
          <div className="h-[180px] w-full relative">
            {top_materials.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                No collection records this month
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={top_materials}
                    dataKey="revenue"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={({ name }) => name}
                  >
                    {top_materials.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color_hex || CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-3 space-y-1.5">
            {top_materials.map((m, i) => (
              <div key={m.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: m.color_hex || CHART_COLORS[i % CHART_COLORS.length] }} />
                  <span className="text-muted-foreground">{m.name}</span>
                </div>
                <span className="font-semibold text-foreground">₹{m.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Scale entries */}
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold text-foreground mb-4">Recent Scale Tickets</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 pr-2 font-medium">Txn No.</th>
                  <th className="pb-3 pr-2 font-medium">Supplier</th>
                  <th className="pb-3 pr-2 font-medium">Material</th>
                  <th className="pb-3 pr-2 font-medium">Weight</th>
                  <th className="pb-3 pr-2 font-medium text-right">Payout</th>
                  <th className="pb-3 text-right font-medium">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recent_transactions.slice(0, 5).map((t) => (
                  <tr key={t.id}>
                    <td className="py-3 pr-2 font-semibold text-foreground whitespace-nowrap">{t.txn_number}</td>
                    <td className="py-3 pr-2 text-muted-foreground whitespace-nowrap truncate max-w-[120px]">{t.supplier_name}</td>
                    <td className="py-3 pr-2 whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color_hex }} />
                        {t.material_name}
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-muted-foreground whitespace-nowrap">{t.weight} {t.unit}</td>
                    <td className="py-3 pr-2 text-right font-bold text-foreground">₹{t.total_amount.toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <Badge
                        variant="outline"
                        className={`rounded-full text-[10px] px-2 py-0.5 ${
                          INVOICE_STATUS_COLORS[t.invoice_status as keyof typeof INVOICE_STATUS_COLORS] || "bg-gray-100"
                        }`}
                      >
                        {t.invoice_status.toUpperCase()}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {recent_transactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No scale tickets registered.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4">Stock Threshold Alerts</h2>
          <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1">
            {low_stock_alerts.map((m) => (
              <div key={m.id} className="flex flex-col gap-1 border-b border-border/40 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">{m.name}</span>
                  <span className="rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-600">
                    LOW STOCK
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Current Stock: <strong className="text-red-500 font-bold">{m.stock_qty} {m.unit}</strong></span>
                  <span>Min Threshold: {m.min_threshold} {m.unit}</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${Math.min(100, (m.stock_qty / (m.min_threshold || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            {low_stock_alerts.length === 0 && (
              <div className="py-8 text-center text-xs text-muted-foreground">
                All materials are above minimum stock levels.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
