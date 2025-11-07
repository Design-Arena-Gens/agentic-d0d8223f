"use client";

import { useState } from "react";

interface RiskConfig {
  maxDrawdown: number;
  dailyLossLimit: number;
  positionSizeLimit: number;
  leverage: number;
  circuitBreaker: boolean;
  hedgingEnabled: boolean;
}

export default function RiskManagementPanel() {
  const [config, setConfig] = useState<RiskConfig>({
    maxDrawdown: 18,
    dailyLossLimit: 4,
    positionSizeLimit: 2.5,
    leverage: 3,
    circuitBreaker: true,
    hedgingEnabled: true
  });
  const [alert, setAlert] = useState<string | null>(null);

  const updateField = <K extends keyof RiskConfig>(key: K, value: RiskConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setAlert(`Risk profile updated: ${key}`);
    setTimeout(() => setAlert(null), 3500);
  };

  return (
    <section aria-labelledby="risk-heading" className="flex h-full flex-col">
      <div className="flex items-start justify-between">
        <div>
          <h2 id="risk-heading" className="text-lg font-semibold tracking-tight">
            Risk Controls
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Configure guardrails to align execution speed with treasury risk mandates.
          </p>
        </div>
        {alert && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-full bg-tealAccent/10 px-4 py-2 text-xs font-semibold text-tealAccent"
          >
            {alert}
          </div>
        )}
      </div>

      <form className="mt-4 grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2" aria-describedby="risk-heading">
        <fieldset className="rounded-2xl bg-panelBg/70 p-4 shadow-panel ring-1 ring-panelBorder">
          <legend className="text-xs font-semibold uppercase text-slate-400">Equity Protection</legend>
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="text-xs uppercase text-slate-400">Max Drawdown</span>
              <input
                type="range"
                min={5}
                max={40}
                value={config.maxDrawdown}
                onChange={(event) => updateField("maxDrawdown", Number(event.target.value))}
                className="mt-2 w-full accent-tealAccent"
                aria-valuemin={5}
                aria-valuemax={40}
                aria-valuenow={config.maxDrawdown}
              />
              <span className="mt-1 block text-sm text-slate-200">{config.maxDrawdown}%</span>
            </label>
            <label className="block">
              <span className="text-xs uppercase text-slate-400">Daily Loss Limit</span>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={10}
                  step={0.5}
                  value={config.dailyLossLimit}
                  onChange={(event) => updateField("dailyLossLimit", Number(event.target.value))}
                  className="w-24 rounded-lg border border-panelBorder bg-panelBg px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tealAccent"
                />
                <span className="text-sm text-slate-300">% of account equity</span>
              </div>
            </label>
          </div>
        </fieldset>

        <fieldset className="rounded-2xl bg-panelBg/70 p-4 shadow-panel ring-1 ring-panelBorder">
          <legend className="text-xs font-semibold uppercase text-slate-400">Positioning</legend>
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="text-xs uppercase text-slate-400">Position Size Cap</span>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="number"
                  min={0.1}
                  max={10}
                  step={0.1}
                  value={config.positionSizeLimit}
                  onChange={(event) => updateField("positionSizeLimit", Number(event.target.value))}
                  className="w-24 rounded-lg border border-panelBorder bg-panelBg px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tealAccent"
                />
                <span className="text-sm text-slate-300">BTC per order</span>
              </div>
            </label>
            <label className="block">
              <span className="text-xs uppercase text-slate-400">Max Leverage</span>
              <input
                type="range"
                min={1}
                max={10}
                value={config.leverage}
                onChange={(event) => updateField("leverage", Number(event.target.value))}
                className="mt-2 w-full accent-tealAccent"
              />
              <span className="mt-1 block text-sm text-slate-200">x{config.leverage.toFixed(1)}</span>
            </label>
          </div>
        </fieldset>

        <fieldset className="rounded-2xl bg-panelBg/70 p-4 shadow-panel ring-1 ring-panelBorder lg:col-span-2">
          <legend className="text-xs font-semibold uppercase text-slate-400">Fail-safes</legend>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="flex items-center justify-between rounded-xl border border-panelBorder bg-panelBg/60 px-4 py-3 text-sm">
              <div>
                <span className="font-semibold text-slate-200">Circuit Breaker</span>
                <p className="text-xs text-slate-400">Halt execution on cascading exchange outages.</p>
              </div>
              <button
                type="button"
                aria-pressed={config.circuitBreaker}
                onClick={() => updateField("circuitBreaker", !config.circuitBreaker)}
                className={`flex h-8 w-14 items-center rounded-full border border-panelBorder px-1 transition ${
                  config.circuitBreaker ? "bg-tealAccent/40 justify-end" : "justify-start"
                }`}
              >
                <span className="h-6 w-6 rounded-full bg-white" />
              </button>
            </label>
            <label className="flex items-center justify-between rounded-xl border border-panelBorder bg-panelBg/60 px-4 py-3 text-sm">
              <div>
                <span className="font-semibold text-slate-200">Dynamic Hedging</span>
                <p className="text-xs text-slate-400">Auto rebalance delta with correlated assets.</p>
              </div>
              <button
                type="button"
                aria-pressed={config.hedgingEnabled}
                onClick={() => updateField("hedgingEnabled", !config.hedgingEnabled)}
                className={`flex h-8 w-14 items-center rounded-full border border-panelBorder px-1 transition ${
                  config.hedgingEnabled ? "bg-tealAccent/40 justify-end" : "justify-start"
                }`}
              >
                <span className="h-6 w-6 rounded-full bg-white" />
              </button>
            </label>
          </div>
        </fieldset>
      </form>
    </section>
  );
}
