import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchERPWhatsAppLogs, type ERPWhatsAppLog } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  RotateCw,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

export const Route = createLazyFileRoute("/admin/erp/whatsapp")({
  component: ERPWhatsAppLogsPage,
});

const LOG_STATUS_CONFIG = {
  sent: { label: "Sent", className: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle2 },
  failed: { label: "Failed", className: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
  skipped: { label: "Skipped", className: "bg-amber-50 text-amber-700 border-amber-200", icon: AlertCircle },
};

function ERPWhatsAppLogsPage() {
  const { session } = useAuth();
  const [logs, setLogs] = useState<ERPWhatsAppLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, [session]);

  async function loadLogs() {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const res = await fetchERPWhatsAppLogs(session.access_token);
      if (res.success) {
        setLogs(res.logs);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load WhatsApp dispatch history");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Filtering Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Twilio & Meta dispatch ledger</h2>
          <p className="text-[10px] text-muted-foreground mt-0.5">Logs of PDF receipt alerts sent to suppliers.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadLogs}
          disabled={loading}
          className="rounded-xl cursor-pointer font-semibold gap-1.5"
        >
          <RotateCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Log
        </Button>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
              <Skeleton className="h-5 w-48 animate-pulse" />
              <Skeleton className="h-5 w-24 animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {/* Logs Table */}
      {!loading && (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
                  <th className="px-6 py-4">Receipt Ref</th>
                  <th className="px-6 py-4">Supplier Partner</th>
                  <th className="px-6 py-4">Recipient Phone</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Provider</th>
                  <th className="px-6 py-4">Message ID</th>
                  <th className="px-6 py-4 text-right">PDF Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => {
                  const cfg = LOG_STATUS_CONFIG[log.status as keyof typeof LOG_STATUS_CONFIG] || LOG_STATUS_CONFIG.skipped;
                  return (
                    <tr key={log.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground whitespace-nowrap">
                        <div className="flex flex-col">
                          <span>{log.txn_number}</span>
                          <span className="text-[10px] text-muted-foreground font-normal">
                            {new Date(log.sent_at).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                        {log.supplier_name}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        {log.supplier_phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className={`rounded-full text-[10px] px-2.5 py-0.5 gap-1 ${cfg.className}`}>
                          <cfg.icon className="h-3 w-3" />
                          {cfg.label.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground capitalize">{log.provider}</td>
                      <td className="px-6 py-4 text-muted-foreground font-mono text-[10px] truncate max-w-[120px]" title={log.message_id || ""}>
                        {log.message_id || "—"}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {log.pdf_url ? (
                          <a
                            href={log.pdf_url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                          >
                            PDF Document
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">
                      No WhatsApp receipt dispatches recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
