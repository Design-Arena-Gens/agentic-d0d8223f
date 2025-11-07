"use client";

import { useEffect, useState } from "react";
import { BellAlertIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface AlertItem {
  id: string;
  title: string;
  description: string;
  severity: "info" | "warning" | "critical";
  acknowledged: boolean;
}

const severityStyles: Record<AlertItem["severity"], string> = {
  info: "border-slate-500/60 bg-slate-500/10 text-slate-200",
  warning: "border-amber-400/70 bg-amber-400/10 text-amber-200",
  critical: "border-rose-400/70 bg-rose-400/10 text-rose-200"
};

export default function AlertsCenterPanel() {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: "1",
      title: "Latency Spike",
      description: "Binance futures API latency exceeded 120ms threshold",
      severity: "warning",
      acknowledged: false
    },
    {
      id: "2",
      title: "Position Limit",
      description: "Arb Reactor approaching position cap on Bybit",
      severity: "info",
      acknowledged: false
    }
  ]);
  const [newAlert, setNewAlert] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setAlerts((prev) => {
        const id = crypto.randomUUID();
        const event: AlertItem = {
          id,
          title: "Exchange Maintenance",
          description: "Deribit scheduled downtime in 45 minutes",
          severity: "critical",
          acknowledged: false
        };
        setNewAlert(event.title);
        setTimeout(() => setNewAlert(null), 4000);
        return [event, ...prev.slice(0, 7)];
      });
    }, 18000);

    return () => clearInterval(timer);
  }, []);

  const toggleAcknowledge = (id: string, ack: boolean) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, acknowledged: ack } : alert)));
  };

  const dismiss = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <section aria-labelledby="alerts-heading" className="flex h-full flex-col">
      <div className="flex items-start justify-between">
        <div>
          <h2 id="alerts-heading" className="text-lg font-semibold tracking-tight">
            Alerting &amp; Automation
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Configure notification rules, escalation policies, and audit trail visibility.
          </p>
        </div>
        <BellAlertIcon className="h-6 w-6 text-tealAccent" aria-hidden="true" />
      </div>

      {newAlert && (
        <div
          role="status"
          aria-live="assertive"
          className="mt-4 rounded-full border border-rose-400/70 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-200"
        >
          {newAlert}
        </div>
      )}

      <ul className="mt-4 space-y-3" role="list">
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className={`rounded-2xl border px-4 py-4 shadow-panel ring-1 ring-panelBorder transition focus-within:ring-2 focus-within:ring-tealAccent ${
              severityStyles[alert.severity]
            }`}
            tabIndex={-1}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">{alert.title}</p>
                <p className="mt-2 text-xs text-slate-300">{alert.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleAcknowledge(alert.id, !alert.acknowledged)}
                  className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tealAccent ${
                    alert.acknowledged
                      ? "border-emerald-400/70 text-emerald-200"
                      : "border-tealAccent/60 text-tealAccent"
                  }`}
                  aria-pressed={alert.acknowledged}
                >
                  <CheckIcon className="h-4 w-4" />
                  {alert.acknowledged ? "Acknowledged" : "Acknowledge"}
                </button>
                <button
                  onClick={() => dismiss(alert.id)}
                  className="rounded-full border border-panelBorder p-1 text-xs text-slate-300 transition hover:border-rose-400/60 hover:text-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tealAccent"
                  aria-label={`Dismiss ${alert.title}`}
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
