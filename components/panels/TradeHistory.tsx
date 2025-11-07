"use client";

import { useMemo, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table";
import clsx from "clsx";

interface TradeRow {
  id: string;
  timestamp: string;
  symbol: string;
  side: "Buy" | "Sell";
  size: number;
  price: number;
  pnl: number;
  strategy: string;
}

const tradeData: TradeRow[] = Array.from({ length: 28 }, (_, index) => {
  const side = Math.random() > 0.5 ? "Buy" : "Sell";
  const price = 32000 + index * 35 + (Math.random() - 0.5) * 450;
  const size = 0.5 + Math.random() * 2;
  const pnl = (Math.random() - 0.45) * 260;
  return {
    id: `trade-${index}`,
    timestamp: new Date(Date.now() - index * 3600 * 1000).toISOString(),
    symbol: "BTC/USDT",
    side,
    size: Number(size.toFixed(2)),
    price: Number(price.toFixed(2)),
    pnl: Number(pnl.toFixed(2)),
    strategy: ["Momentum", "Reversion", "Scalper", "Arb"][index % 4]
  };
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit"
});

export default function TradeHistoryPanel() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [filtering, setFiltering] = useState<ColumnFiltersState>([]);

  const columns = useMemo<ColumnDef<TradeRow>[]>(
    () => [
      {
        accessorKey: "timestamp",
        header: "Timestamp",
        cell: ({ getValue }) => (
          <time dateTime={getValue<string>()}>{dateFormatter.format(new Date(getValue<string>()))}</time>
        )
      },
      {
        accessorKey: "symbol",
        header: "Pair"
      },
      {
        accessorKey: "strategy",
        header: "Strategy"
      },
      {
        accessorKey: "side",
        header: "Side",
        cell: ({ getValue }) => {
          const side = getValue<TradeRow["side"]>();
          return (
            <span
              className={clsx("rounded-full px-2 py-1 text-xs font-semibold", {
                "bg-emerald-500/10 text-emerald-300": side === "Buy",
                "bg-rose-500/10 text-rose-300": side === "Sell"
              })}
            >
              {side}
            </span>
          );
        }
      },
      {
        accessorKey: "size",
        header: "Size (BTC)",
        cell: ({ getValue }) => getValue<number>().toFixed(2)
      },
      {
        accessorKey: "price",
        header: "Fill Price",
        cell: ({ getValue }) => currencyFormatter.format(getValue<number>())
      },
      {
        accessorKey: "pnl",
        header: "P/L",
        cell: ({ getValue }) => {
          const value = getValue<number>();
          return (
            <span className={value >= 0 ? "text-emerald-300" : "text-rose-300"}>
              {currencyFormatter.format(value)}
            </span>
          );
        }
      }
    ],
    []
  );

  const table = useReactTable({
    data: tradeData,
    columns,
    state: {
      globalFilter,
      columnFilters: filtering
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setFiltering,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <section aria-labelledby="trade-history-heading" className="flex h-full flex-col">
      <div className="flex items-start justify-between">
        <div>
          <h2 id="trade-history-heading" className="text-lg font-semibold tracking-tight">
            Trade Ledger
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Drill into executed positions with fill prices, execution venues, and realized P/L.
          </p>
        </div>
        <div className="relative">
          <label htmlFor="trade-search" className="sr-only">
            Search trades
          </label>
          <input
            id="trade-search"
            type="search"
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder="Filter trades…"
            className="rounded-full border border-panelBorder bg-panelBg px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tealAccent"
          />
        </div>
      </div>

      <div className="mt-4 flex-1 overflow-hidden rounded-2xl bg-panelBg/70 shadow-panel ring-1 ring-panelBorder">
        <div className="max-h-72 overflow-auto" role="region" aria-labelledby="trade-history-heading">
          <table className="min-w-full divide-y divide-panelBorder text-left text-sm">
            <thead className="sticky top-0 bg-panelBg">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      scope="col"
                      className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-panelBorder text-slate-300">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="focus-within:bg-panelBg/60">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 align-middle"
                      tabIndex={0}
                      role="cell"
                      aria-label={`${cell.column.columnDef.header}: ${cell.getValue<string>()}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-panelBorder px-4 py-3 text-xs text-slate-400">
          <div>
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} -
            {" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )} of {table.getFilteredRowModel().rows.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded-full border border-panelBorder px-3 py-1 transition hover:border-tealAccent hover:text-tealAccent disabled:opacity-30"
            >
              Prev
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-full border border-panelBorder px-3 py-1 transition hover:border-tealAccent hover:text-tealAccent disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
