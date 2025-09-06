'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Strategy } from '@/types/Models';

interface StrategyTableProps {
  strategies: Strategy[];
  onEdit: (strategy: Strategy) => void;
  onDelete: (id: string) => void;
}

export default function StrategyTable({ strategies, onEdit, onDelete }: StrategyTableProps) {
  if (strategies.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Strategies</CardTitle>
          <CardDescription>No strategies found. Create your first strategy!</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Strategies</CardTitle>
        <CardDescription>Manage your trading strategies</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Instruments</TableHead>
              <TableHead>Timeframes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {strategies.map((strategy) => (
              <TableRow key={strategy.id}>
                <TableCell className="font-medium">
                  <div>{strategy.name}</div>
                  {strategy.description && (
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      {strategy.description}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{strategy.type}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {strategy.instruments.map((instrument, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {instrument}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {strategy.timeframes?.map((timeframe, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {timeframe}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
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
      </CardContent>
    </Card>
  );
}