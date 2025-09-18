'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useEffect, useState } from 'react';
import { Trade } from '@/types/Models';


export default function TradesHistory() {

 const [trades, setTrades] = useState<Trade[]>([]);

    // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("trades")
    if (saved) {
      try {
        setTrades(JSON.parse(saved))
      } catch (e) {
        console.error("Error parsing trades from localStorage", e)
      }
    }
  }, [])

  // Save to localStorage whenever trades changes
  useEffect(() => {
    localStorage.setItem("trades", JSON.stringify(trades))
  }, [trades])

  return (
     <Card className="">
              <CardHeader>
                <CardTitle>Trade History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Pair</TableHead>
                      <TableHead>Lot</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Entry</TableHead>
                      <TableHead>Entry Type</TableHead>
                      <TableHead>strategy</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Stop</TableHead>
                      <TableHead>Exit</TableHead>
                      <TableHead>Exit Type</TableHead>
                      <TableHead>P/L</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>ROI</TableHead>
                      <TableHead>R Multiple</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>Rules</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell>{trade.date}</TableCell>
                        <TableCell>{trade.pair || '-'}</TableCell>
                        <TableCell>{trade.lot || '-'}</TableCell>
                        <TableCell >
                          <span className={` font-semibold p-1 rounded ${trade.type === 'Long' ? 'bg-[#00bc7d]' : 'bg-[#FF8042]'}`}>{trade.type}</span></TableCell>
                        <TableCell>${trade.entry.toFixed(2)}</TableCell>
                        <TableCell><span className={` font-semibold p-1 rounded ${trade.entryLogic === 'Limit' ? 'bg-[#89b4fa]' : trade.entryLogic === 'Manual' ? 'bg-[#FF8042]' : ''}`}>{trade.entryLogic || '-'}</span></TableCell>
                        <TableCell className='max-w-3xs truncate'>{trade.strategy || '-'}</TableCell>
                        <TableCell>{trade.timeFrame || '-'}</TableCell>
                        <TableCell>${trade.stopLoss.toFixed(2)}</TableCell>
                        <TableCell>${trade.exit.toFixed(2)}</TableCell>
                        <TableCell> <span className={` font-semibold p-1 rounded ${trade.exitLogic === 'TP' ? 'bg-[#00bc7d]' : trade.exitLogic === 'SL' ? 'bg-destructive' : trade.exitLogic === 'Manual' ? 'bg-[#FF8042]' : !trade.exitLogic ? '' : 'bg-[#8884d8]'}`}>{trade.exitLogic === 'Manual' ? 'ML' : trade.exitLogic || '-'}</span></TableCell>
                        <TableCell className={trade.profitLoss && trade.profitLoss > 0 ? 'text-[#00C49F]' : 'text-destructive'}>
                          ${trade.profitLoss?.toFixed(2)}
                        </TableCell>
                        <TableCell>${trade.takeProfit.toFixed(2)}</TableCell>
                        <TableCell>{trade.roi || '-'}</TableCell>
                        <TableCell>{trade.rMultiple?.toFixed(2) || '-'}</TableCell>
                        <TableCell> <span className={` font-semibold p-1 rounded ${trade.risk === 'FULL' ? 'bg-[#89b4fa]' : trade.risk === 'HALF' ? 'bg-[#f9e2af]' : ''}`}>{trade.risk || '-'}</span></TableCell>
                        <TableCell><span className={` font-semibold p-1 rounded ${trade.rules === 'Yes' ? 'bg-[#00bc7d]' : trade.rules === 'No' ? 'bg-destructive' : ''}`}>{trade.rules || '-'}</span></TableCell>
                        <TableCell className="max-w-xs truncate">
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <span className="truncate block cursor-pointer">
                                {trade.notes}
                              </span>
                            </HoverCardTrigger>
                            <HoverCardContent className="">
                              <p>{trade.notes}</p>
                            </HoverCardContent>
                          </HoverCard>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
  )
}
