import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Trade } from "@/types/Models"

// import data from "./data.json"

export default function Page() {
  const data: Trade[] = [
  {
    id: 1,
    strategy: "Breakout",
    date: "2025-09-05",
    holdingTime: 120,
    pair: "EUR/USD",
    lot: 0.5,
    type: "Long",
    entry: 1.0850,
    entryLogic: "Manual",
    timeFrame: "H1",
    stopLoss: 1.0820,
    exit: 1.0920,
    exitLogic: "TP",
    profitLoss: 70,
    takeProfit: 1.0920,
    notes: "Clean breakout from resistance with volume confirmation.",
    roi: "2%",
    rMultiple: 2.5,
    risk: "FULL",
    rules: "Yes"
  },
  {
    id: 2,
    strategy: "Reversal",
    date: "2025-09-03",
    holdingTime: 45,
    pair: "GBP/USD",
    lot: 0.25,
    type: "Short",
    entry: 1.2735,
    entryLogic: "Limit",
    timeFrame: "M30",
    stopLoss: 1.2760,
    exit: 1.2700,
    exitLogic: "SL",
    profitLoss: -35,
    takeProfit: 1.2650,
    notes: "Price rejected 200 EMA but failed to continue down.",
    roi: "-1%",
    rMultiple: -1.4,
    risk: "HALF",
    rules: "No"
  },
  {
    id: 3,
    strategy: "Trend Following",
    date: "2025-09-01",
    holdingTime: 300,
    pair: "USD/JPY",
    lot: 1.0,
    type: "Long",
    entry: 145.20,
    entryLogic: "Manual",
    timeFrame: "H4",
    stopLoss: 144.80,
    exit: 146.50,
    exitLogic: "TP",
    profitLoss: 130,
    takeProfit: 146.50,
    notes: "Strong uptrend continuation after pullback.",
    roi: "4%",
    rMultiple: 3.25,
    risk: "FULL",
    rules: "Yes"
  }
]
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
