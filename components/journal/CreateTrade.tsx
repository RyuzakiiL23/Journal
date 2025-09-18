'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { Trade } from '@/types/Models'

export default function CreateTrade() {
    const [trades, setTrades] = useState<Trade[]>([]);
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
            id: Date.now().toString(),
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

    return (
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
    )
}
