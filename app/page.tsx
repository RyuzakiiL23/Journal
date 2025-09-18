'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Statistics, Trade } from '@/types/Models'
import StrategyManager from '@/components/StrategyManager'

// Initial data for demonstration
const initialTrades: Trade[] = [
  {
    id: 1,
    date: '2023-05-15',
    entry: 150.25,
    exit: 152.75,
    stopLoss: 148.50,
    takeProfit: 155.00,
    type: 'Long',
    notes: 'Strong breakout above resistance',
    profitLoss: 2.50,
    rMultiple: 1.43,
    holdingTime: 120,
    pair: 'EUR/USD',
    lot: 1.0,
    entryLogic: 'Manual',
    strategy: 'Breakout',
    timeFrame: '1H',
    exitLogic: 'TP',
    roi: '1.67%',
    risk: 'FULL',
    rules: 'Yes'
  },
  {
    id: 2,
    date: '2023-05-16',
    entry: 153.00,
    exit: 151.50,
    stopLoss: 154.50,
    takeProfit: 149.00,
    type: 'Short',
    notes: 'False breakout, quick reversal',
    profitLoss: -1.50,
    rMultiple: -0.6,
    holdingTime: 45,
    pair: 'GBP/USD',
    lot: 0.5,
    entryLogic: 'Limit',
    strategy: 'Reversal',
    timeFrame: '30M',
    exitLogic: 'SL',
    roi: '-0.98%',
    risk: 'HALF',
    rules: 'No'
  }
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function TradingJournal() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    totalTrades: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    avgRMultiple: 0,
    profitFactor: 0,
    avgHoldingTime: 0,
    maxDrawdown: 0,
    netProfit: 0
  })
  const [newTrade, setNewTrade] = useState<Omit<Trade, 'id' | 'profitLoss' | 'rMultiple' | 'holdingTime' | 'roi'>>({
    date: new Date().toISOString().split('T')[0],
    entry: 0,
    exit: 0,
    stopLoss: 0,
    takeProfit: 0,
    type: 'Long',
    notes: '',
    pair: '',
    lot: 0,
    entryLogic: 'Limit',
    strategy: '',
    timeFrame: '',
    exitLogic: 'Manual',
    risk: undefined,
    rules: undefined
  })
  const [sessionNotes, setSessionNotes] = useState('')

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

  // Calculate statistics when trades change
  useEffect(() => {
    if (trades.length === 0) {
      setStatistics({
        totalTrades: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        avgRMultiple: 0,
        profitFactor: 0,
        avgHoldingTime: 0,
        maxDrawdown: 0,
        netProfit: 0
      })
      return
    }

    const wins = trades.filter(trade => (trade.profitLoss || 0) > 0).length
    const losses = trades.filter(trade => (trade.profitLoss || 0) < 0).length
    const winRate = (wins / trades.length) * 100

    const netProfit = trades.reduce((sum, trade) => sum + (trade.profitLoss || 0), 0)

    const rMultiples = trades.map(trade => trade.rMultiple || 0)
    const avgRMultiple = rMultiples.reduce((sum, r) => sum + r, 0) / trades.length

    const profits = trades.filter(trade => (trade.profitLoss || 0) > 0).map(trade => trade.profitLoss || 0)
    const lossesAmount = trades.filter(trade => (trade.profitLoss || 0) < 0).map(trade => Math.abs(trade.profitLoss || 0))
    const profitFactor = lossesAmount.reduce((sum, loss) => sum + loss, 0) > 0
      ? profits.reduce((sum, profit) => sum + profit, 0) / lossesAmount.reduce((sum, loss) => sum + loss, 0)
      : profits.reduce((sum, profit) => sum + profit, 0)

    const holdingTimes = trades.map(trade => trade.holdingTime || 0)
    const avgHoldingTime = holdingTimes.reduce((sum, time) => sum + time, 0) / trades.length

    // Simple max drawdown calculation (in reality, this would be more complex)
    let maxDrawdown = 0
    let peak = trades[0].profitLoss || 0
    let currentDrawdown = 0

    for (let i = 1; i < trades.length; i++) {
      const currentProfit = (trades[i].profitLoss || 0) + (trades[i - 1].profitLoss || 0)
      if (currentProfit > peak) {
        peak = currentProfit
      } else {
        currentDrawdown = peak - currentProfit
        if (currentDrawdown > maxDrawdown) {
          maxDrawdown = currentDrawdown
        }
      }
    }

    setStatistics({
      totalTrades: trades.length,
      wins,
      losses,
      winRate,
      avgRMultiple,
      profitFactor,
      avgHoldingTime,
      maxDrawdown,
      netProfit
    })
  }, [trades])

  // Handle adding a new trade
  const handleAddTrade = () => {
    const risk = newTrade.type === 'Long'
      ? newTrade.entry - newTrade.stopLoss
      : newTrade.stopLoss - newTrade.entry

    const profitLoss = newTrade.type === 'Long'
      ? newTrade.exit - newTrade.entry
      : newTrade.entry - newTrade.exit

    const rMultiple = risk !== 0 ? profitLoss / risk : 0
    const roi = risk !== 0 ? `${((profitLoss / newTrade.entry) * 100).toFixed(2)}%` : '0%'

    const trade: Trade = {
      id: Date.now(),
      ...newTrade,
      profitLoss,
      rMultiple,
      roi,
      holdingTime: Math.floor(Math.random() * 240) + 15 // Random holding time for demo
    }

    setTrades([...trades, trade])

    // Reset form
    setNewTrade({
      date: new Date().toISOString().split('T')[0],
      entry: 0,
      exit: 0,
      stopLoss: 0,
      takeProfit: 0,
      type: 'Long',
      notes: '',
      pair: '',
      lot: 0,
      entryLogic: 'Limit',
      strategy: '',
      timeFrame: '',
      exitLogic: 'Manual',
      risk: undefined,
      rules: undefined
    })
  }

  // Data for charts
  const equityData = trades.map((trade, index) => ({
    name: `Trade ${index + 1}`,
    equity: trades.slice(0, index + 1).reduce((sum, t) => sum + (t.profitLoss || 0), 0)
  }))

  const rMultipleData = trades.map(trade => ({
    name: `Trade ${trade.id}`,
    value: trade.rMultiple || 0
  }))

  const winLossData = [
    { name: 'Wins', value: statistics.wins },
    { name: 'Losses', value: statistics.losses }
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Tabs defaultValue="journal" className="w-full">
          <TabsList>
            <TabsTrigger value="journal">Trade Journal</TabsTrigger>
            <TabsTrigger value="strategies">Edge Strategies</TabsTrigger>
            {/* <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="charts">Performance Charts</TabsTrigger>
            <TabsTrigger value="notes">Session Notes</TabsTrigger> */}
          </TabsList>

              {/* <TabsContent value="strategies">
            <Card>
              <CardHeader>
                <CardTitle>Trading Strategies</CardTitle>
                <CardDescription>Record your thoughts and reflections after trading sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="What did you learn today? What went well? What could be improved?"
                  className="min-h-[200px]"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                />
                <Button className="mt-4">Save Notes</Button>
              </CardContent>
            </Card>
          </TabsContent> */}

           <TabsContent value="strategies">
             <StrategyManager/>
          </TabsContent>

          {/* Trade Journal Tab */}
          <TabsContent value="journal">

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


            <Card className='mt-6'>
              <CardHeader>
                <CardTitle>Add New Trade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newTrade.date}
                      onChange={(e) => setNewTrade({ ...newTrade, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pair">Pair</Label>
                    <Input
                      id="pair"
                      type="text"
                      value={newTrade.pair || ''}
                      onChange={(e) => setNewTrade({ ...newTrade, pair: e.target.value })}
                      placeholder="EUR/USD"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lot">Lot Size</Label>
                    <Input
                      id="lot"
                      type="number"
                      step="0.01"
                      value={newTrade.lot || ''}
                      onChange={(e) => setNewTrade({ ...newTrade, lot: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={newTrade.type}
                      onValueChange={(value: 'Long' | 'Short') => setNewTrade({ ...newTrade, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Long">Long</SelectItem>
                        <SelectItem value="Short">Short</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entry">Entry Price</Label>
                    <Input
                      id="entry"
                      type="number"
                      step="0.01"
                      value={newTrade.entry || ''}
                      onChange={(e) => setNewTrade({ ...newTrade, entry: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entryLogic">Entry Logic</Label>
                    <Select
                      value={newTrade.entryLogic || ''}
                      onValueChange={(value: 'Manual' | 'Limit') => setNewTrade({ ...newTrade, entryLogic: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select entry logic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="Limit">Limit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="strategy">strategy</Label>
                    <Input
                      id="strategy"
                      type="text"
                      value={newTrade.strategy || ''}
                      onChange={(e) => setNewTrade({ ...newTrade, strategy: e.target.value })}
                      placeholder="Breakout, Reversal, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeFrame">Time Frame</Label>
                    <Input
                      id="timeFrame"
                      type="text"
                      value={newTrade.timeFrame || ''}
                      onChange={(e) => setNewTrade({ ...newTrade, timeFrame: e.target.value })}
                      placeholder="1H, 4H, Daily, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stopLoss">Stop Loss</Label>
                    <Input
                      id="stopLoss"
                      type="number"
                      step="0.01"
                      value={newTrade.stopLoss || ''}
                      onChange={(e) => setNewTrade({ ...newTrade, stopLoss: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="takeProfit">Take Profit</Label>
                    <Input
                      id="takeProfit"
                      type="number"
                      step="0.01"
                      value={newTrade.takeProfit || ''}
                      onChange={(e) => setNewTrade({ ...newTrade, takeProfit: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exit">Exit Price</Label>
                    <Input
                      id="exit"
                      type="number"
                      step="0.01"
                      value={newTrade.exit || ''}
                      onChange={(e) => setNewTrade({ ...newTrade, exit: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exitLogic">Exit Logic</Label>
                    <Select
                      value={newTrade.exitLogic || ''}
                      onValueChange={(value: 'Manual' | 'SL' | 'TP' | 'BR' | 'SP') => setNewTrade({ ...newTrade, exitLogic: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select exit logic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="SL">Stop Loss</SelectItem>
                        <SelectItem value="TP">Take Profit</SelectItem>
                        <SelectItem value="BR">Break Even</SelectItem>
                        <SelectItem value="SP">Stop Pulled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="risk">Risk Management</Label>
                    <Select
                      value={newTrade.risk || ''}
                      onValueChange={(value: 'FULL' | 'HALF') => setNewTrade({ ...newTrade, risk: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FULL">Full Risk</SelectItem>
                        <SelectItem value="HALF">Half Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rules">Followed Rules</Label>
                    <Select
                      value={newTrade.rules || ''}
                      onValueChange={(value: 'Yes' | 'No') => setNewTrade({ ...newTrade, rules: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Did you follow rules?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Trade Notes</Label>
                  <Textarea
                    id="notes"
                    value={newTrade.notes}
                    onChange={(e) => setNewTrade({ ...newTrade, notes: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddTrade}>Add Trade</Button>
              </CardContent>
            </Card>

           
          </TabsContent>

          {/* Statistics Tab */}
          {/* <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Performance Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Trades:</span>
                      <span className="font-medium">{statistics.totalTrades}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Winning Trades:</span>
                      <span className="font-medium">{statistics.wins}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Losing Trades:</span>
                      <span className="font-medium">{statistics.losses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Win Rate:</span>
                      <span className="font-medium">{statistics.winRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Net Profit:</span>
                      <span className="font-medium">${statistics.netProfit.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Average R Multiple:</span>
                      <span className="font-medium">{statistics.avgRMultiple.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Profit Factor:</span>
                      <span className="font-medium">{statistics.profitFactor.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Holding Time:</span>
                      <span className="font-medium">{statistics.avgHoldingTime.toFixed(0)} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Drawdown:</span>
                      <span className="font-medium">${statistics.maxDrawdown.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}

          {/* Charts Tab */}
          {/* <TabsContent value="charts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Equity Curve</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={equityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Line type="monotone" dataKey="equity" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>R Multiple Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={rMultipleData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Win/Loss Ratio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={winLossData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {winLossData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent> */}

          {/* Notes Tab */}
          {/* <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Trading Session Notes</CardTitle>
                <CardDescription>Record your thoughts and reflections after trading sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="What did you learn today? What went well? What could be improved?"
                  className="min-h-[200px]"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                />
                <Button className="mt-4">Save Notes</Button>
              </CardContent>
            </Card>
          </TabsContent> */}

      
        </Tabs>
      </div>
    </div>
  )
}