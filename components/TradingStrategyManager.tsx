'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Edit, Plus, X } from 'lucide-react';

// Strategy interface
interface Strategy {
  id: string;
  name: string;
  description?: string;
  type: 'Trend' | 'Range' | 'Breakout' | 'Reversal' | 'Scalping' | 'Swing' | 'Other';
  instruments: string[];
  timeframes?: string[];
  session?: 'London' | 'NewYork' | 'Asian' | 'All';
  indicators?: string[];
  entryRules?: string[];
  exitRules?: string[];
  stopLossRules?: string[];
  takeProfitRules?: string[];
  riskManagement?: string;
  tags?: string[];
}

const defaultStrategy: Omit<Strategy, 'id'> = {
  name: '',
  description: '',
  type: 'Trend',
  instruments: [],
  timeframes: [],
  session: 'All',
  indicators: [],
  entryRules: [],
  exitRules: [],
  stopLossRules: [],
  takeProfitRules: [],
  riskManagement: '',
  tags: []
};

const strategyTypes = ['Trend', 'Range', 'Breakout', 'Reversal', 'Scalping', 'Swing', 'Other'];
const sessions = ['London', 'NewYork', 'Asian', 'All'];
const commonInstruments = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'XAU/USD', 'US30', 'SPX500'];
const commonTimeframes = ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'Daily', 'Weekly'];
const commonIndicators = ['RSI', 'MACD', 'EMA', 'SMA', 'Bollinger Bands', 'Stochastic', 'ATR', 'ADX'];

const TradingStrategyManager: React.FC = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);
  const [formData, setFormData] = useState<Omit<Strategy, 'id'>>(defaultStrategy);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentInput, setCurrentInput] = useState('');

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    if (editingStrategy) {
      setStrategies(strategies.map(s => 
        s.id === editingStrategy.id 
          ? { ...formData, id: editingStrategy.id }
          : s
      ));
      setEditingStrategy(null);
    } else {
      const newStrategy: Strategy = {
        ...formData,
        id: generateId()
      };
      setStrategies([...strategies, newStrategy]);
    }

    setFormData(defaultStrategy);
    setIsDialogOpen(false);
  };

  const handleEdit = (strategy: Strategy) => {
    setEditingStrategy(strategy);
    setFormData({
      name: strategy.name,
      description: strategy.description || '',
      type: strategy.type,
      instruments: strategy.instruments,
      timeframes: strategy.timeframes || [],
      session: strategy.session,
      indicators: strategy.indicators || [],
      entryRules: strategy.entryRules || [],
      exitRules: strategy.exitRules || [],
      stopLossRules: strategy.stopLossRules || [],
      takeProfitRules: strategy.takeProfitRules || [],
      riskManagement: strategy.riskManagement || '',
      tags: strategy.tags || []
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setStrategies(strategies.filter(s => s.id !== id));
  };

  const handleCancel = () => {
    setFormData(defaultStrategy);
    setEditingStrategy(null);
    setIsDialogOpen(false);
  };

  const addArrayItem = (field: keyof Strategy, value: string) => {
    if (!value.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[] || []), value.trim()]
    }));
    setCurrentInput('');
  };

  const removeArrayItem = (field: keyof Strategy, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const ArrayInput: React.FC<{
    label: string;
    field: keyof Strategy;
    suggestions?: string[];
    placeholder?: string;
  }> = ({ label, field, suggestions, placeholder }) => (
    <div className="space-y-2">
      <Label htmlFor={field as string}>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          placeholder={placeholder}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addArrayItem(field, currentInput);
            }
          }}
        />
        <Button
          type="button"
          size="sm"
          onClick={() => addArrayItem(field, currentInput)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {suggestions && (
        <div className="flex flex-wrap gap-1">
          {suggestions.map(item => (
            <Button
              key={item}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem(field, item)}
              className="h-6 text-xs"
            >
              {item}
            </Button>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-1 min-h-[24px]">
        {(formData[field] as string[] || []).map((item, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {item}
            <button
              type="button"
              onClick={() => removeArrayItem(field, index)}
              className="ml-1 hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );

  const StrategyTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-3 font-medium">Name</th>
            <th className="text-left py-2 px-3 font-medium">Type</th>
            <th className="text-left py-2 px-3 font-medium">Instruments</th>
            <th className="text-left py-2 px-3 font-medium">Session</th>
            <th className="text-left py-2 px-3 font-medium">Tags</th>
            <th className="text-left py-2 px-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {strategies.map((strategy) => (
            <tr key={strategy.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-3">
                <div>
                  <div className="font-semibold">{strategy.name}</div>
                  {strategy.description && (
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {strategy.description}
                    </div>
                  )}
                </div>
              </td>
              <td className="py-3 px-3">
                <Badge variant="outline">{strategy.type}</Badge>
              </td>
              <td className="py-3 px-3">
                <div className="flex flex-wrap gap-1">
                  {strategy.instruments.slice(0, 2).map((instrument, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {instrument}
                    </Badge>
                  ))}
                  {strategy.instruments.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{strategy.instruments.length - 2}
                    </Badge>
                  )}
                </div>
              </td>
              <td className="py-3 px-3">
                <Badge variant="outline">{strategy.session}</Badge>
              </td>
              <td className="py-3 px-3">
                <div className="flex flex-wrap gap-1">
                  {(strategy.tags || []).slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {(strategy.tags || []).length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{(strategy.tags || []).length - 2}
                    </Badge>
                  )}
                </div>
              </td>
              <td className="py-3 px-3">
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(strategy)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Strategy</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{strategy.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(strategy.id!)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Trading Strategy Manager</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setFormData(defaultStrategy);
              setEditingStrategy(null);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Strategy
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingStrategy ? 'Edit Strategy' : 'Create New Strategy'}
              </DialogTitle>
              <DialogDescription>
                {editingStrategy ? 'Update your trading strategy details.' : 'Add a new trading strategy to your collection.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Strategy Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., London Breakout"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Strategy Type</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {strategyTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your trading strategy..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ArrayInput
                  label="Instruments"
                  field="instruments"
                  suggestions={commonInstruments}
                  placeholder="e.g., EUR/USD"
                />

                <ArrayInput
                  label="Timeframes"
                  field="timeframes"
                  suggestions={commonTimeframes}
                  placeholder="e.g., H1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="session">Trading Session</Label>
                  <Select value={formData.session} onValueChange={(value: any) => setFormData({...formData, session: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sessions.map(session => (
                        <SelectItem key={session} value={session}>{session}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <ArrayInput
                  label="Indicators"
                  field="indicators"
                  suggestions={commonIndicators}
                  placeholder="e.g., RSI"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ArrayInput
                  label="Entry Rules"
                  field="entryRules"
                  placeholder="e.g., RSI above 70"
                />

                <ArrayInput
                  label="Exit Rules"
                  field="exitRules"
                  placeholder="e.g., Take profit at 50 pips"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ArrayInput
                  label="Stop Loss Rules"
                  field="stopLossRules"
                  placeholder="e.g., 20 pips below entry"
                />

                <ArrayInput
                  label="Take Profit Rules"
                  field="takeProfitRules"
                  placeholder="e.g., 2:1 risk reward"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="riskManagement">Risk Management</Label>
                  <Textarea
                    id="riskManagement"
                    value={formData.riskManagement}
                    onChange={(e) => setFormData({...formData, riskManagement: e.target.value})}
                    placeholder="e.g., Risk 1R per trade, max 2% equity"
                    rows={2}
                  />
                </div>

                <ArrayInput
                  label="Tags"
                  field="tags"
                  placeholder="e.g., momentum"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSubmit}>
                  {editingStrategy ? 'Update Strategy' : 'Create Strategy'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Trading Strategies</CardTitle>
          <CardDescription>
            Manage and organize your trading strategies. Click on a strategy to edit it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {strategies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No strategies added yet. Click "Add Strategy" to get started.
            </div>
          ) : (
            <StrategyTable />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingStrategyManager