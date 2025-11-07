"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import type { Layout, Layouts } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = dynamic(
  () => import("react-grid-layout").then((mod) => mod.WidthProvider(mod.Responsive)),
  {
    ssr: false
  }
);

type ResponsiveLayout = Omit<Layout, "i">;

export interface DashboardPanel {
  id: string;
  title: string;
  description: string;
  element: React.ReactNode;
  layout: Record<string, ResponsiveLayout>;
}

const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

export default function DashboardGrid({ panels }: { panels: DashboardPanel[] }) {
  const defaultLayouts = useMemo(() => {
    const layouts: Layouts = { lg: [], md: [], sm: [], xs: [], xxs: [] };
    panels.forEach((panel) => {
      Object.entries(panel.layout).forEach(([breakpoint, layout]) => {
        if (!layouts[breakpoint]) {
          layouts[breakpoint] = [];
        }
        layouts[breakpoint]!.push({ ...layout, i: panel.id });
      });
    });
    return layouts;
  }, [panels]);

  const [layouts, setLayouts] = useState<Layouts>(defaultLayouts);

  return (
    <div className="flex-1">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        cols={cols}
        rowHeight={34}
        margin={[18, 18]}
        isResizable
        isDraggable
        onLayoutChange={(_, updatedLayouts) => setLayouts(updatedLayouts)}
        draggableHandle=".drag-handle"
      >
        {panels.map((panel) => (
          <div key={panel.id} className="h-full">
            <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-panelBorder bg-panelBg/90 p-6 shadow-panel transition focus-within:ring-2 focus-within:ring-tealAccent">
              <header className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-300">
                    <span className="drag-handle cursor-move select-none rounded bg-slate-800/70 px-2 py-1 text-xs text-slate-400" aria-hidden="true">
                      ↕
                    </span>
                    {panel.title}
                  </h2>
                  <p className="mt-2 text-xs text-slate-400">{panel.description}</p>
                </div>
              </header>
              <div className="flex-1 overflow-hidden">{panel.element}</div>
            </article>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
