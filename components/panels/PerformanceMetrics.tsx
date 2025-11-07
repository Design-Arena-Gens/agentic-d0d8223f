"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis
} from "recharts";

interface MetricSummary {
  label: string;
  value: string;
  delta: number;
  description: string;
}

interface StrategyPerformance {
  strategy: string;
  roi: number;
  winRate: number;
  trades: number;
}

const initialPerformance = [
  { strategy: "Momentum Surge", roi: 18.4, winRate: 62, trades: 124 },
  { strategy: "Mean Reversion", roi: 11.2, winRate: 57, trades: 89 },
  { strategy: "Arb Reactor", roi: 25.9, winRate: 71, trades: 64 },
  { strategy: "Micro Scalper", roi: 9.7, winRate: 54, trades: 143 }
];

const metrics: MetricSummary[] = [
  {
    label: "Net Profit",
    value: "$143,820",
    delta: 6.4,
    description: "Net P/L over the past 30 days"
  },
  {
    label: "Average ROI",
    value: "17.3%",
    delta: 2.1,
    description: "Weighted ROI across all active bots"
  },
  {
    label: "Win Rate",
    value: "64.8%",
    delta: -1.4,
    description: "Winning trades versus total trades"
  },
  {
    label: "Sharpe Ratio",
    value: "1.92",
    delta: 0.3,
    description: "Risk-adjusted performance index"
  }
];

export default function PerformanceMetricsPanel() {
  const [data, setData] = useState<StrategyPerformance[]>(initialPerformance);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) =>
        prev.map((entry) => ({
          ...entry,
          roi: Number((entry.roi + (Math.random() - 0.5) * 2.5).toFixed(1)),
          winRate: Math.max(40, Math.min(95, Number((entry.winRate + (Math.random() - 0.5) * 3).toFixed(1)))),
          trades: entry.trades + Math.floor(Math.random() * 4)
        }))
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const bestStrategy = useMemo(
    () => data.reduce((top, current) => (current.roi > top.roi ? current : top), data[0]),
    [data]
  );

  return (
    <section aria-labelledby="performance-heading" className="flex h-full flex-col">
      <div className="flex items-start justify-between">
        <div>
          <h2 id="performance-heading" className="text-lg font-semibold tracking-tight">
            Performance Intelligence
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Evaluate profitability, risk exposure, and execution quality across trading programs.
          </p>
        </div>
        <div className="rounded-lg bg-tealAccent/10 px-3 py-2 text-xs text-tealAccent" role="status">
          Top Strategy: {bestStrategy.strategy} ({bestStrategy.roi}% ROI)
        </div>
      </div>

      <div className="mt-4 grid flex-1 grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-1 space-y-3">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-2xl bg-panelBg/70 p-4 shadow-panel ring-1 ring-panelBorder"
            >
              <header className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold uppercase text-slate-400">{metric.label}</h3>
                  <p className="mt-1 text-2xl font-semibold text-slate-100">{metric.value}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    metric.delta >= 0 ? "bg-emerald-500/10 text-emerald-300" : "bg-rose-500/10 text-rose-300"
                  }`}
                  aria-label={`${metric.label} delta ${metric.delta}%`}
                >
                  {metric.delta >= 0 ? "▲" : "▼"} {Math.abs(metric.delta)}%
                </span>
              </header>
              <p className="mt-2 text-xs text-slate-400">{metric.description}</p>
            </article>
          ))}
        </div>
        <div className="col-span-1 rounded-2xl bg-panelBg/70 p-4 shadow-panel ring-1 ring-panelBorder lg:col-span-2">
          <h3 className="text-xs font-semibold uppercase text-slate-400">Strategy ROI Comparison</h3>
          <div className="mt-3 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="strategy" stroke="#6B7AA6" tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7AA6" tickLine={false} axisLine={false} unit="%" />
                <RechartsTooltip
                  contentStyle={{
                    background: "#101524",
                    border: "1px solid #1F2A44",
                    borderRadius: 12,
                    color: "#E2E8F0"
                  }}
                />
                <Bar dataKey="roi" fill="#00BFA5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-300">
            <div>
              <dt className="text-xs uppercase text-slate-400">Average Trades</dt>
              <dd>
                {Math.round(data.reduce((total, entry) => total + entry.trades, 0) / data.length).toLocaleString()} / month
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">Weighted Win Rate</dt>
              <dd>{
                (data.reduce((total, entry) => total + entry.winRate, 0) / data.length).toFixed(1)
              }%</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">Drawdown Guard</dt>
              <dd>Max equity drawdown capped at 14%</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">Overnight Exposure</dt>
              <dd>Risk parity balancing across two exchanges</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
