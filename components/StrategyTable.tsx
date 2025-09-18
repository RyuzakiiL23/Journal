'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Strategy } from '@/types/Models';

interface StrategyTableProps {
  strategies: Strategy[];
  onEdit: (strategy: Strategy) => void;
  onDelete: (id: string) => void;
}

// Color mapping for strategy types
const strategyTypeColors: Record<string, string> = {
  'Trend': 'bg-[#00bc7d]',
  'Range': 'bg-[#89b4fa]',
  'Breakout': 'bg-[#8884d8]',
  'Reversal': 'bg-[#FF8042]',
  'Scalping': 'bg-[#f9e2af]',
  'Swing': 'bg-[#cba6f7]',
  'Other': 'bg-[#d4d4d8]'
};

// Color mapping for sessions
const sessionColors: Record<string, string> = {
  'London': 'bg-[#00bc7d]',
  'NewYork': 'bg-[#89b4fa]',
  'Asian': 'bg-[#8884d8]',
  'All': 'bg-[#d4d4d8]'
};

export default function StrategyTable({ strategies, onEdit, onDelete }: StrategyTableProps) {
  if (strategies.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Strategies</CardTitle>
          <CardDescription>No strategies found. Create your first strategy!</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Strategy Library</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                {/* <TableHead>Description</TableHead> */}
                <TableHead>Instruments</TableHead>
                {/* <TableHead>Timeframes</TableHead> */}
                <TableHead>Session</TableHead>
                {/* <TableHead>Indicators</TableHead>
                <TableHead>Entry Rules</TableHead>
                <TableHead>Exit Rules</TableHead>
                <TableHead>Stop Loss</TableHead>
                <TableHead>Take Profit</TableHead>
                <TableHead>Risk Management</TableHead>
                <TableHead>Tags</TableHead> */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {strategies.map((strategy) => (
                <TableRow key={strategy.id}>
                  <TableCell className="font-medium">{strategy.name}</TableCell>
                  <TableCell>
                    <span className={`font-semibold p-1 rounded ${strategyTypeColors[strategy.type]}`}>
                      {strategy.type}
                    </span>
                  </TableCell>
                  {/* <TableCell className="  truncate">
                    {strategy.description ? (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <span className="truncate block cursor-pointer">
                            {strategy.description}
                          </span>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <p>{strategy.description}</p>
                        </HoverCardContent>
                      </HoverCard>
                    ) : '-'}
                  </TableCell> */}
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {strategy.instruments.map((instrument, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {instrument}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  {/* <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {strategy.timeframes?.map((timeframe, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {timeframe}
                        </Badge>
                      )) || '-'}
                    </div>
                  </TableCell> */}
                  <TableCell>
                    {strategy.session ? (
                      <span className={`font-semibold p-1 rounded ${sessionColors[strategy.session]}`}>
                        {strategy.session}
                      </span>
                    ) : '-'}
                  </TableCell>
                  {/* <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {strategy.indicators?.map((indicator, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {indicator}
                        </Badge>
                      )) || '-'}
                    </div>
                  </TableCell>
                  <TableCell className="  truncate">
                    {strategy.entryRules && strategy.entryRules.length > 0 ? (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <span className="truncate block cursor-pointer">
                            {strategy.entryRules.length} rule{strategy.entryRules.length !== 1 ? 's' : ''}
                          </span>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            {strategy.entryRules.map((rule, index) => (
                              <p key={index} className="text-sm">
                                • {rule}
                              </p>
                            ))}
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="  truncate">
                    {strategy.exitRules && strategy.exitRules.length > 0 ? (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <span className="truncate block cursor-pointer">
                            {strategy.exitRules.length} rule{strategy.exitRules.length !== 1 ? 's' : ''}
                          </span>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            {strategy.exitRules.map((rule, index) => (
                              <p key={index} className="text-sm">
                                • {rule}
                              </p>
                            ))}
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="  truncate">
                    {strategy.stopLossRules && strategy.stopLossRules.length > 0 ? (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <span className="truncate block cursor-pointer">
                            {strategy.stopLossRules.length} rule{strategy.stopLossRules.length !== 1 ? 's' : ''}
                          </span>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            {strategy.stopLossRules.map((rule, index) => (
                              <p key={index} className="text-sm">
                                • {rule}
                              </p>
                            ))}
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="  truncate">
                    {strategy.takeProfitRules && strategy.takeProfitRules.length > 0 ? (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <span className="truncate block cursor-pointer">
                            {strategy.takeProfitRules.length} rule{strategy.takeProfitRules.length !== 1 ? 's' : ''}
                          </span>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            {strategy.takeProfitRules.map((rule, index) => (
                              <p key={index} className="text-sm">
                                • {rule}
                              </p>
                            ))}
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="  truncate">
                    {strategy.riskManagement ? (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <span className="truncate block cursor-pointer">
                            {strategy.riskManagement}
                          </span>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <p>{strategy.riskManagement}</p>
                        </HoverCardContent>
                      </HoverCard>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {strategy.tags?.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      )) || '-'}
                    </div>
                  </TableCell> */}
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(strategy)}
                      className="mr-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => strategy.id && onDelete(strategy.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}