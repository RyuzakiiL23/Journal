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
import { Strategy } from "@/types/Models"

export const StrategyCol: ColumnDef<Strategy>[] = [
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
    accessorFn: (row) => row.name,
    id: "name",
    header: () => <div className="">Name</div>,
    cell: ({ row }) => <div className="">{row.getValue("name")}</div>,
  },
  {
    accessorFn: (row) => row.description,
    id: "description",
    header: () => <div className="">Description</div>,
    cell: ({ row }) => <div className="">{row.getValue("description")}</div>,
  },
  {
    accessorFn: (row) => row.type,
    id: "type",
    header: () => <div className="">Type</div>,
    cell: ({ row }) => <div className="">{row.getValue("type")}</div>,
  },
  {
    accessorFn: (row) => row.instruments,
    id: "instruments",
    header: () => <div className="">Instruments</div>,
    cell: ({ row }) => <div className="">{row.getValue("instruments")}</div>,
  },
  {    accessorFn: (row) => row.timeframes,
    id: "timeframes",
    header: () => <div className="">Timeframes</div>,
    cell: ({ row }) => <div className="">{row.getValue("timeframes")}</div>,
  },
  {
    accessorFn: (row) => row.session,
    id: "session",
    header: () => <div className="">Session</div>,
    cell: ({ row }) => <div className="">{row.getValue("session")}</div>,
  },
  { accessorFn: (row) => row.indicators,
    id: "indicators",
    header: () => <div className="">Indicators</div>,
    cell: ({ row }) => <div className="">{row.getValue("indicators")}</div>,
  },
  {
    accessorFn: (row) => row.entryRules,
    id: "entryRules",
    header: () => <div className="">Entry Rules</div>,
    cell: ({ row }) => <div className="">{row.getValue("entryRules")}</div>,
  },
  {
    accessorFn: (row) => row.exitRules,
    id: "exitRules",
    header: () => <div className="">Exit Rules</div>,
    cell: ({ row }) => <div className="">{row.getValue("exitRules")}</div>,
  },
  {
    accessorFn: (row) => row.stopLossRules,
    id: "stopLossRules",
    header: () => <div className="">Stop Loss Rules</div>,
    cell: ({ row }) => <div className="">{row.getValue("stopLossRules")}</div>,
  },
  {
    accessorFn: (row) => row.takeProfitRules,
    id: "takeProfitRules",
    header: () => <div className="">Take Profit Rules</div>,
    cell: ({ row }) => <div className="">{row.getValue("takeProfitRules")}</div>,
  },
  {
    accessorFn: (row) => row.riskManagement,
    id: "riskManagement",
    header: () => <div className="">Risk Management</div>,
    cell: ({ row }) => <div className="">{row.getValue("riskManagement")}</div>,
  },
  {
    accessorFn: (row) => row.tags,
    id: "tags",
    header: () => <div className="">Tags</div>,
    cell: ({ row }) => <div className="">{row.getValue("tags")}</div>,
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