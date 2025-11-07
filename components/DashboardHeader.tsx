"use client";

import { useState } from "react";
import { BellIcon, CommandLineIcon } from "@heroicons/react/24/solid";

export default function DashboardHeader() {
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  return (
    <header
      className="flex flex-col gap-4 rounded-3xl border border-panelBorder bg-panelBg/70 p-6 shadow-panel lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Trading Bot Control Center</h1>
        <p className="mt-1 text-sm text-slate-300">
          Personalized mission control for quant trading automation, observability, and risk.
        </p>
      </div>
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 rounded-full border border-panelBorder bg-panelBg/60 px-4 py-2 text-xs text-slate-400">
          <CommandLineIcon className="h-4 w-4 text-tealAccent" aria-hidden="true" />
          <span>Cmd + K for command palette</span>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-tealAccent px-4 py-2 text-sm font-semibold text-dashboardBg transition hover:bg-tealAccent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tealAccent"
          onClick={() => setIsCommandOpen((prev) => !prev)}
          aria-expanded={isCommandOpen}
        >
          Quick Automations
        </button>
        <button
          type="button"
          className="rounded-full border border-panelBorder p-2 text-slate-300 transition hover:border-tealAccent hover:text-tealAccent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tealAccent"
          aria-label="View notifications"
        >
          <BellIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      {isCommandOpen && (
        <div
          className="relative mt-4 w-full rounded-2xl border border-panelBorder bg-panelBg/90 p-4 text-sm text-slate-200 lg:absolute lg:right-6 lg:top-24 lg:w-80"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <p className="text-xs uppercase text-slate-400">Suggested automations</p>
          <ul className="mt-3 space-y-2">
            <li className="rounded-lg bg-slate-900/40 px-3 py-2">Route failed orders to secondary venue</li>
            <li className="rounded-lg bg-slate-900/40 px-3 py-2">Enable volatility dampening preset</li>
            <li className="rounded-lg bg-slate-900/40 px-3 py-2">Distribute equity across hedging pools</li>
          </ul>
        </div>
      )}
    </header>
  );
}
