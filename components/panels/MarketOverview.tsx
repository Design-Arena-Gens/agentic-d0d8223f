"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis
} from "recharts";
import clsx from "clsx";

interface PricePoint {
  time: string;
  price: number;
  volume: number;
}

interface OrderEntry {
  price: number;
  size: number;
}

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

const formatTime = (idx: number) => `${idx.toString().padStart(2, "0")}:00`;

function generateInitialSeries(): PricePoint[] {
  const base = 32500;
  return Array.from({ length: 24 }, (_, index) => {
    const variation = (Math.sin(index / 3) + Math.cos(index / 2)) * 180;
    const price = base + variation * (index % 5 === 0 ? 1.8 : 1);
    return {
      time: formatTime(index),
      price: Number(price.toFixed(2)),
      volume: Math.max(40, 60 + Math.sin(index) * 20)
    };
  });
}

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

const buildOrderBook = (mid: number): { bids: OrderEntry[]; asks: OrderEntry[] } => {
  const bids = Array.from({ length: 8 }, (_, i) => {
    const price = mid - i * randomBetween(3, 12);
    return {
      price: Number(price.toFixed(2)),
      size: Number(randomBetween(0.4, 2.5).toFixed(2))
    };
  });

  const asks = Array.from({ length: 8 }, (_, i) => {
    const price = mid + i * randomBetween(3, 12);
    return {
      price: Number(price.toFixed(2)),
      size: Number(randomBetween(0.4, 2.5).toFixed(2))
    };
  });

  return {
    bids,
    asks
  };
};

export default function MarketOverviewPanel() {
  const [series, setSeries] = useState<PricePoint[]>(() => generateInitialSeries());
  const [selectedPoint, setSelectedPoint] = useState<PricePoint | null>(null);
  const [orderBook, setOrderBook] = useState(() => buildOrderBook(series.at(-1)?.price ?? 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setSeries((prev) => {
        const last = prev.at(-1);
        const nextIdx = (prev.length + 1) % 24;
        const drift = randomBetween(-120, 130);
        const nextPrice = last ? last.price + drift : 32500;
        const normalized = Math.max(25000, Math.min(38000, nextPrice));
        const nextPoint: PricePoint = {
          time: formatTime(nextIdx),
          price: Number(normalized.toFixed(2)),
          volume: Number(randomBetween(35, 105).toFixed(2))
        };
        const updated = [...prev.slice(-23), nextPoint];
        setOrderBook(buildOrderBook(nextPoint.price));
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const change = useMemo(() => {
    const first = series[0]?.price ?? 0;
    const last = series.at(-1)?.price ?? 0;
    const diff = last - first;
    const percent = first === 0 ? 0 : (diff / first) * 100;
    return {
      diff: diff.toFixed(2),
      percent: percent.toFixed(2),
      direction: diff >= 0 ? "up" : "down"
    };
  }, [series]);

  return (
    <section aria-labelledby="market-overview-heading" className="flex h-full flex-col">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 id="market-overview-heading" className="text-lg font-semibold tracking-tight">
            Market Overview
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            BTC/USDT • Real-time price feed with drill-down trade analytics
          </p>
        </div>
        <div
          className={clsx(
            "rounded-lg border px-4 py-2 text-sm font-medium",
            change.direction === "up"
              ? "border-emerald-400 text-emerald-300"
              : "border-rose-400 text-rose-300"
          )}
          aria-live="polite"
        >
          {change.direction === "up" ? "▲" : "▼"} {change.diff} ({change.percent}%)
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="col-span-1 rounded-2xl bg-panelBg/70 p-4 shadow-panel ring-1 ring-panelBorder lg:col-span-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Price Action
            </h3>
            {selectedPoint && (
              <div className="text-xs text-slate-400" role="status">
                {selectedPoint.time} · {priceFormatter.format(selectedPoint.price)} · Vol:
                {" "}
                {selectedPoint.volume}
              </div>
            )}
          </div>
          <div className="mt-2 h-64" role="img" aria-label="Price chart for BTC/USDT over the last 24 hours">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={series}
                onClick={(data) => {
                  if (data && Array.isArray(data.activePayload) && data.activePayload[0]) {
                    const point = data.activePayload[0].payload as PricePoint;
                    setSelectedPoint(point);
                  }
                }}
              >
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00BFA5" stopOpacity={0.75} />
                    <stop offset="95%" stopColor="#00BFA5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#16213C" />
                <XAxis dataKey="time" stroke="#6B7AA6" tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#6B7AA6"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <RechartsTooltip
                  contentStyle={{
                    background: "#101524",
                    borderRadius: 12,
                    border: "1px solid #1F2A44",
                    color: "#E2E8F0"
                  }}
                  cursor={{ stroke: "#00BFA5", strokeDasharray: "4 4" }}
                  labelStyle={{ color: "#94A3B8" }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#00BFA5"
                  strokeWidth={2.5}
                  fill="url(#priceGradient)"
                  activeDot={{ r: 6, fill: "#00BFA5", stroke: "#0B0F1A", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Tip: Click any point on the chart to surface drill-down analytics highlighting volume
            and execution quality for the selected interval.
          </p>
        </div>

        <div className="col-span-1 rounded-2xl bg-panelBg/70 p-4 shadow-panel ring-1 ring-panelBorder lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Order Book Depth
            </h3>
            <span className="text-xs text-slate-400" aria-live="polite">
              Mid: {priceFormatter.format(series.at(-1)?.price ?? 0)}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4" role="list">
            <div>
              <h4 className="text-xs font-semibold uppercase text-emerald-300">Bids</h4>
              <ul className="mt-3 space-y-2" aria-label="Bid levels">
                {orderBook.bids.map((entry, index) => (
                  <li
                    key={`bid-${entry.price}`}
                    className="flex items-center justify-between rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100"
                    role="listitem"
                  >
                    <span>{priceFormatter.format(entry.price)}</span>
                    <span>{entry.size.toFixed(2)} BTC</span>
                    <span className="sr-only">Bid level {index + 1}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase text-rose-300">Asks</h4>
              <ul className="mt-3 space-y-2" aria-label="Ask levels">
                {orderBook.asks.map((entry, index) => (
                  <li
                    key={`ask-${entry.price}`}
                    className="flex items-center justify-between rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-100"
                    role="listitem"
                  >
                    <span>{priceFormatter.format(entry.price)}</span>
                    <span>{entry.size.toFixed(2)} BTC</span>
                    <span className="sr-only">Ask level {index + 1}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
