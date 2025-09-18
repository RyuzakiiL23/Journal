"use client"

import * as React from "react"
import {
  ColumnDef,
} from "@tanstack/react-table"
import { ArrowUpDown,  MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Trade } from "@/types/Models"

export const JournalCol: ColumnDef<Trade>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (row) => row.date,
    id: "date",
    header: ({column}) => {
      return(
          <div
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span>
            Date
          </span>
          <ArrowUpDown className="h-4" />
        </div>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"))
      return <div className="">{date.toLocaleDateString()}</div>
    },
  },
  {
    accessorFn: (row) => row.strategy,
    id: "strategy",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span>
            Strategy
          </span>
          <ArrowUpDown className="h-4" />
        </div>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("strategy")}</div>,
  },
  {
    accessorFn: (row) => row.pair,
    id: "pair",
    header: () => <div className="">Pair</div>,
    cell: ({ row }) => <div className="">{row.getValue("pair")}</div>,
  },
  {
    accessorFn: (row) => row.lot,
    id: "lot",
    header: () => <div className="">Lot</div>,
    cell: ({ row }) => <div className="">{row.getValue("lot")}</div>,
  },
  {
    accessorFn: (row) => row.type,
    id: "type",
    header: () => <div className="">Type</div>,
    cell: ({ row }) => <div className={` font-semibold p-1 rounded ${row.getValue("type") === 'Long' ? 'bg-[#00bc7d]' : 'bg-[#FF8042]'}`}>{row.getValue("type")}</div>,
  },
  {
    accessorFn: (row) => row.entry,
    id: "entry",
    header: () => <div className="">Entry</div>,
    cell: ({ row }) => {
      const entry = parseFloat(row.getValue("entry"))
      return <div className="">{entry.toFixed(2)}</div>
    },
  },
  {
    accessorFn: (row) => row.entryLogic,
    id: "entryLogic",
    header: () => <div className="">Entry Logic</div>,
    cell: ({ row }) => <div className={` font-semibold p-1 rounded ${row.getValue("entryLogic") === 'Limit' ? 'bg-[#89b4fa]' : row.getValue("entryLogic") === 'Manual' ? 'bg-[#FF8042]' : ''}`}>{row.getValue("entryLogic")}</div>,
  },
  {
    accessorFn: (row) => row.timeFrame,
    id: "timeFrame",
    header: () => <div className="">Time Frame</div>,
    cell: ({ row }) => <div className="">{row.getValue("timeFrame")}</div>,
  },
  {
    accessorFn: (row) => row.stopLoss,
    id: "stopLoss",
    header: () => <div className="">Stop Loss</div>,
    cell: ({ row }) => {
      const stopLoss = parseFloat(row.getValue("stopLoss"))
      return <div className="text-[#f9e2af]">{stopLoss.toFixed(2)}</div>
    },
  },
  {
    accessorFn: (row) => row.takeProfit,
    id: "takeProfit",
    header: () => <div className="">Take Profit</div>,
    cell: ({ row }) => {
      const takeProfit = parseFloat(row.getValue("takeProfit"))
      return <div className="text-[#89b4fa]">{takeProfit.toFixed(2)}</div>
    },
  },
  {
    accessorFn: (row) => row.exit,
    id: "exit",
    header: () => <div className="">Exit</div>,
    cell: ({ row }) => {
      const profitLoss = parseFloat(row.getValue("profitLoss"))
      const exit = parseFloat(row.getValue("exit"))
      return <div className={profitLoss && profitLoss > 0 ? 'text-[#00C49F]' : 'text-destructive'}>{exit.toFixed(2)}</div>
    },
  },
  {
    accessorFn: (row) => row.exitLogic,
    id: "exitLogic",
    header: () => <div className="">Exit Logic</div>,
    cell: ({ row }) => <div className={` font-semibold p-1 rounded ${row.getValue("exitLogic") === 'TP' ? 'bg-[#00bc7d]' : row.getValue("exitLogic") === 'SL' ? 'bg-destructive' : row.getValue("exitLogic") === 'Manual' ? 'bg-[#FF8042]' : !row.getValue("exitLogic") ? '' : 'bg-[#8884d8]'}`}>{row.getValue("exitLogic")}</div>,
  },
  {
    accessorFn: (row) => row.holdingTime,
    id: "holdingTime",
    header: () => <div className="">Holding Time</div>,
    cell: ({ row }) => {
      const holdingTime = parseFloat(row.getValue("holdingTime"))
      return <div className="">{holdingTime} mins</div>
    },
  },
  {
    accessorFn: (row) => row.profitLoss,
    id: "profitLoss",
    header: () => <div className="">P/L</div>,
    cell: ({ row }) => {
      const profitLoss = parseFloat(row.getValue("profitLoss"))
      return <div className={profitLoss && profitLoss > 0 ? 'text-[#00C49F]' : 'text-destructive'}>{profitLoss.toFixed(2)}</div>
    },
  },
  {
    accessorFn: (row) => row.roi,
    id: "roi",
    header: () => <div className="">ROI</div>,
    cell: ({ row }) => <div className="">{row.getValue("roi")}</div>,
  },
  {
    accessorFn: (row) => row.risk,
    id: "risk",
    header: () => <div className="">Risk</div>,
    cell: ({ row }) => <div className={` font-semibold p-1 rounded ${row.getValue("risk") === 'FULL' ? 'bg-[#89b4fa]' : row.getValue("risk") === 'HALF' ? 'bg-[#f9e2af]' : ''}`}>{row.getValue("risk")}</div>,
  },
  {
    accessorFn: (row) => row.rules,
    id: "rules",
    header: () => <div className="">Rules</div>,
    cell: ({ row }) => <div className={` font-semibold p-1 rounded ${row.getValue("rules") === 'Yes' ? 'bg-[#00bc7d]' : row.getValue("rules") === 'No' ? 'bg-destructive' : ''}`}>{row.getValue("rules")}</div>,
  },
  {
    accessorFn: (row) => row.notes,
    id: "notes",
    header: () => <div className="">Notes</div>,
    cell: ({ row }) => <div className="">{row.getValue("notes")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText('hello')}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]