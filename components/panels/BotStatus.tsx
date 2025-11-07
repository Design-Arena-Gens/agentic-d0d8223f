"use client";

import { useState } from "react";
import { CheckCircleIcon, ExclamationTriangleIcon, PauseCircleIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

interface BotStatusCardProps {
  name: string;
  status: "active" | "paused" | "error";
  latency: number;
  uptime: string;
  pnl: number;
}

const statusCopy: Record<BotStatusCardProps["status"], { label: string; color: string; icon: typeof CheckCircleIcon }> = {
  active: {
    label: "Active",
    color: "text-emerald-300",
    icon: CheckCircleIcon
  },
  paused: {
    label: "Paused",
    color: "text-amber-300",
    icon: PauseCircleIcon
  },
  error: {
    label: "Error",
    color: "text-rose-300",
    icon: ExclamationTriangleIcon
  }
};

const initialBots: BotStatusCardProps[] = [
  {
    name: "Alpha Momentum",
    status: "active",
    latency: 38,
    uptime: "99.98%",
    pnl: 12400
  },
  {
    name: "Liquidity Seeker",
    status: "paused",
    latency: 52,
    uptime: "97.45%",
    pnl: -1200
  },
  {
    name: "Arb Reactor",
    status: "error",
    latency: 88,
    uptime: "94.13%",
    pnl: 3200
  }
];

export default function BotStatusPanel() {
  const [bots, setBots] = useState(initialBots);

  const toggleBot = (idx: number) => {
    setBots((prev) =>
      prev.map((bot, i) => {
        if (i !== idx) return bot;
        if (bot.status === "active") return { ...bot, status: "paused" };
        if (bot.status === "paused") return { ...bot, status: "active" };
        return { ...bot, status: "active" };
      })
    );
  };

  return (
    <section aria-labelledby="bot-status-heading" className="flex h-full flex-col">
      <div className="flex items-start justify-between">
        <div>
          <h2 id="bot-status-heading" className="text-lg font-semibold tracking-tight">
            Bot Health &amp; Status
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Monitor execution engines, latency envelopes, and operational safety nets.
          </p>
        </div>
        <span className="rounded-full bg-tealAccent/10 px-3 py-1 text-xs font-semibold text-tealAccent" aria-live="polite">
          {bots.filter((bot) => bot.status === "active").length} / {bots.length} active
        </span>
      </div>

      <ul className="mt-5 grid flex-1 grid-cols-1 gap-4" role="list">
        {bots.map((bot, index) => {
          const Icon = statusCopy[bot.status].icon;
          return (
            <li
              key={bot.name}
              className="group flex flex-col rounded-2xl bg-panelBg/70 p-4 ring-1 ring-panelBorder transition focus-within:ring-2 focus-within:ring-tealAccent"
              tabIndex={-1}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className={clsx("h-6 w-6", statusCopy[bot.status].color)} aria-hidden="true" />
                  <div>
                    <h3 className="text-base font-semibold text-slate-100">{bot.name}</h3>
                    <span className={clsx("text-sm", statusCopy[bot.status].color)}>{statusCopy[bot.status].label}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleBot(index)}
                  className="rounded-full border border-tealAccent/50 px-3 py-1 text-xs font-semibold text-tealAccent transition hover:bg-tealAccent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-dashboardBg focus-visible:ring-tealAccent"
                  aria-pressed={bot.status === "active"}
                >
                  {bot.status === "active" ? "Pause" : "Activate"}
                </button>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-300" aria-label={`${bot.name} telemetry`}>
                <div>
                  <dt className="text-xs uppercase text-slate-400">Latency</dt>
                  <dd>{bot.latency} ms</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-slate-400">Uptime</dt>
                  <dd>{bot.uptime}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-slate-400">Profit/Loss</dt>
                  <dd className={bot.pnl >= 0 ? "text-emerald-300" : "text-rose-300"}>${bot.pnl.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-slate-400">Failover Actions</dt>
                  <dd>{bot.status === "error" ? "Auto-Restart Pending" : "Healthy"}</dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
