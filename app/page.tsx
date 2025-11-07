"use client";

import DashboardGrid from "../components/DashboardGrid";
import DashboardHeader from "../components/DashboardHeader";
import AlertsCenterPanel from "../components/panels/AlertsCenter";
import BotStatusPanel from "../components/panels/BotStatus";
import MarketOverviewPanel from "../components/panels/MarketOverview";
import PerformanceMetricsPanel from "../components/panels/PerformanceMetrics";
import RiskManagementPanel from "../components/panels/RiskManagement";
import TradeHistoryPanel from "../components/panels/TradeHistory";
import UserProfilePanel from "../components/panels/UserProfile";

export default function Page() {
  const panels = [
    {
      id: "market-overview",
      title: "Market Intelligence",
      description: "Real-time price action, liquidity distribution, and contextual drill-downs.",
      element: <MarketOverviewPanel />,
      layout: {
        lg: { x: 0, y: 0, w: 8, h: 20, minW: 6, minH: 16 },
        md: { x: 0, y: 0, w: 10, h: 20 },
        sm: { x: 0, y: 0, w: 6, h: 20 },
        xs: { x: 0, y: 0, w: 4, h: 22 },
        xxs: { x: 0, y: 0, w: 2, h: 24 }
      }
    },
    {
      id: "bot-status",
      title: "Bot Operations",
      description: "Status telemetry, uptime guarantees, and latency envelopes.",
      element: <BotStatusPanel />,
      layout: {
        lg: { x: 8, y: 0, w: 4, h: 18, minW: 4, minH: 12 },
        md: { x: 0, y: 20, w: 5, h: 18 },
        sm: { x: 0, y: 20, w: 6, h: 18 },
        xs: { x: 0, y: 44, w: 4, h: 18 },
        xxs: { x: 0, y: 44, w: 2, h: 20 }
      }
    },
    {
      id: "performance",
      title: "Performance Analytics",
      description: "Profitability trends, ROI benchmarks, and win-rate diagnostics.",
      element: <PerformanceMetricsPanel />,
      layout: {
        lg: { x: 0, y: 20, w: 7, h: 19, minW: 6, minH: 16 },
        md: { x: 0, y: 38, w: 10, h: 20 },
        sm: { x: 0, y: 38, w: 6, h: 20 },
        xs: { x: 0, y: 62, w: 4, h: 22 },
        xxs: { x: 0, y: 66, w: 2, h: 24 }
      }
    },
    {
      id: "trade-history",
      title: "Execution Logs",
      description: "Auditable trade history with filters and pagination.",
      element: <TradeHistoryPanel />,
      layout: {
        lg: { x: 7, y: 20, w: 5, h: 19, minW: 4, minH: 16 },
        md: { x: 0, y: 58, w: 10, h: 18 },
        sm: { x: 0, y: 58, w: 6, h: 18 },
        xs: { x: 0, y: 88, w: 4, h: 20 },
        xxs: { x: 0, y: 90, w: 2, h: 22 }
      }
    },
    {
      id: "risk-management",
      title: "Risk Management",
      description: "Dynamic guardrails, hedging controls, and exposure governance.",
      element: <RiskManagementPanel />,
      layout: {
        lg: { x: 0, y: 39, w: 6, h: 20, minW: 5, minH: 18 },
        md: { x: 0, y: 76, w: 10, h: 22 },
        sm: { x: 0, y: 76, w: 6, h: 22 },
        xs: { x: 0, y: 112, w: 4, h: 24 },
        xxs: { x: 0, y: 112, w: 2, h: 24 }
      }
    },
    {
      id: "alerts-center",
      title: "Alert Center",
      description: "Notification rules, escalation routing, and acknowledgements.",
      element: <AlertsCenterPanel />,
      layout: {
        lg: { x: 6, y: 39, w: 3, h: 20, minW: 3, minH: 16 },
        md: { x: 0, y: 98, w: 5, h: 18 },
        sm: { x: 0, y: 98, w: 6, h: 18 },
        xs: { x: 0, y: 136, w: 4, h: 20 },
        xxs: { x: 0, y: 136, w: 2, h: 20 }
      }
    },
    {
      id: "profile",
      title: "User Profile",
      description: "Identity, session policies, and API key lifecycle management.",
      element: <UserProfilePanel />,
      layout: {
        lg: { x: 9, y: 39, w: 3, h: 20, minW: 3, minH: 18 },
        md: { x: 5, y: 98, w: 5, h: 20 },
        sm: { x: 0, y: 118, w: 6, h: 22 },
        xs: { x: 0, y: 156, w: 4, h: 24 },
        xxs: { x: 0, y: 158, w: 2, h: 24 }
      }
    }
  ];

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-dashboardBg pb-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(0,191,165,0.18),_transparent_55%)]" />
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <DashboardHeader />
        <DashboardGrid panels={panels} />
      </div>
    </main>
  );
}
