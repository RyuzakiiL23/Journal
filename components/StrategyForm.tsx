'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Strategy } from '@/types/Models';

interface StrategyFormProps {
  onSubmit: (strategy: Omit<Strategy, 'id'>) => void;
  editingStrategy?: Strategy | null;
  onCancel?: () => void;
}

const strategyTypes = ['Trend', 'Range', 'Breakout', 'Reversal', 'Scalping', 'Swing', 'Other'];
const sessions = ['London', 'NewYork', 'Asian', 'All'];
const commonIndicators = ['RSI', 'MACD', 'EMA50', 'Bollinger Bands', 'Stochastic', 'ADX', 'VWAP'];
const commonTimeframes = ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'Daily', 'Weekly', 'Monthly'];

export default function StrategyForm({ onSubmit, editingStrategy, onCancel }: StrategyFormProps) {
  const [name, setName] = useState(editingStrategy?.name || '');
  const [description, setDescription] = useState(editingStrategy?.description || '');
  const [type, setType] = useState<Strategy['type']>(editingStrategy?.type || 'Trend');
  const [instruments, setInstruments] = useState<string[]>(editingStrategy?.instruments || []);
  const [instrumentInput, setInstrumentInput] = useState('');
  const [timeframes, setTimeframes] = useState<string[]>(editingStrategy?.timeframes || []);
  const [session, setSession] = useState<Strategy['session']>(editingStrategy?.session || 'All');
  const [indicators, setIndicators] = useState<string[]>(editingStrategy?.indicators || []);
  const [entryRules, setEntryRules] = useState<string[]>(editingStrategy?.entryRules || ['']);
  const [exitRules, setExitRules] = useState<string[]>(editingStrategy?.exitRules || ['']);
  const [stopLossRules, setStopLossRules] = useState<string[]>(editingStrategy?.stopLossRules || ['']);
  const [takeProfitRules, setTakeProfitRules] = useState<string[]>(editingStrategy?.takeProfitRules || ['']);
  const [riskManagement, setRiskManagement] = useState(editingStrategy?.riskManagement || '');
  const [tags, setTags] = useState<string[]>(editingStrategy?.tags || []);
  const [tagInput, setTagInput] = useState('');

  const handleAddInstrument = () => {
    if (instrumentInput.trim() && !instruments.includes(instrumentInput.trim())) {
      setInstruments([...instruments, instrumentInput.trim()]);
      setInstrumentInput('');
    }
  };

  const handleRemoveInstrument = (index: number) => {
    setInstruments(instruments.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleAddRule = (rules: string[], setRules: React.Dispatch<React.SetStateAction<string[]>>) => {
    setRules([...rules, '']);
  };

  const handleRemoveRule = (rules: string[], setRules: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleRuleChange = (rules: string[], setRules: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
    const newRules = [...rules];
    newRules[index] = value;
    setRules(newRules);
  };

  const handleToggleIndicator = (indicator: string) => {
    if (indicators.includes(indicator)) {
      setIndicators(indicators.filter(i => i !== indicator));
    } else {
      setIndicators([...indicators, indicator]);
    }
  };

  const handleToggleTimeframe = (timeframe: string) => {
    if (timeframes.includes(timeframe)) {
      setTimeframes(timeframes.filter(t => t !== timeframe));
    } else {
      setTimeframes([...timeframes, timeframe]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const strategyData: Omit<Strategy, 'id'> = {
      name,
      description,
      type,
      instruments,
      timeframes: timeframes.length > 0 ? timeframes : undefined,
      session: session || undefined,
      indicators: indicators.length > 0 ? indicators : undefined,
      entryRules: entryRules.filter(rule => rule.trim() !== ''),
      exitRules: exitRules.filter(rule => rule.trim() !== ''),
      stopLossRules: stopLossRules.filter(rule => rule.trim() !== ''),
      takeProfitRules: takeProfitRules.filter(rule => rule.trim() !== ''),
      riskManagement,
      tags: tags.length > 0 ? tags : undefined,
    };

    onSubmit(strategyData);
    
    // Reset form if not editing
    if (!editingStrategy) {
      setName('');
      setDescription('');
      setType('Trend');
      setInstruments([]);
      setTimeframes([]);
      setSession('All');
      setIndicators([]);
      setEntryRules(['']);
      setExitRules(['']);
      setStopLossRules(['']);
      setTakeProfitRules(['']);
      setRiskManagement('');
      setTags([]);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{editingStrategy ? 'Edit Strategy' : 'Create New Strategy'}</CardTitle>
        <CardDescription>
          {editingStrategy 
            ? 'Update your trading strategy details' 
            : 'Define a new trading strategy with all necessary parameters'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="market">Market Context</TabsTrigger>
              <TabsTrigger value="rules">Rules & Conditions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Strategy Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g., London Breakout"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your strategy..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Strategy Type *</Label>
                  <Select value={type} onValueChange={(value) => setType(value as Strategy['type'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select strategy type" />
                    </SelectTrigger>
                    <SelectContent>
                      {strategyTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="market">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Instruments *</Label>
                  <div className="flex gap-2">
                    <Input
                      value={instrumentInput}
                      onChange={(e) => setInstrumentInput(e.target.value)}
                      placeholder="e.g., EUR/USD"
                    />
                    <Button type="button" onClick={handleAddInstrument}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {instruments.map((instrument, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {instrument}
                        <button
                          type="button"
                          onClick={() => handleRemoveInstrument(index)}
                          className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Timeframes</Label>
                  <div className="flex flex-wrap gap-2">
                    {commonTimeframes.map((timeframe) => (
                      <Button
                        key={timeframe}
                        type="button"
                        variant={timeframes.includes(timeframe) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleToggleTimeframe(timeframe)}
                      >
                        {timeframe}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="session">Trading Session</Label>
                  <Select value={session} onValueChange={(value) => setSession(value as Strategy['session'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trading session" />
                    </SelectTrigger>
                    <SelectContent>
                      {sessions.map((session) => (
                        <SelectItem key={session} value={session}>{session}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rules">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Indicators</Label>
                  <div className="flex flex-wrap gap-2">
                    {commonIndicators.map((indicator) => (
                      <Button
                        key={indicator}
                        type="button"
                        variant={indicators.includes(indicator) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleToggleIndicator(indicator)}
                      >
                        {indicator}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Entry Rules</Label>
                  {entryRules.map((rule, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={rule}
                        onChange={(e) => handleRuleChange(entryRules, setEntryRules, index, e.target.value)}
                        placeholder="Describe entry condition"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleRemoveRule(entryRules, setEntryRules, index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddRule(entryRules, setEntryRules)}
                  >
                    Add Entry Rule
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Exit Rules</Label>
                  {exitRules.map((rule, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={rule}
                        onChange={(e) => handleRuleChange(exitRules, setExitRules, index, e.target.value)}
                        placeholder="Describe exit condition"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleRemoveRule(exitRules, setExitRules, index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddRule(exitRules, setExitRules)}
                  >
                    Add Exit Rule
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="riskManagement">Risk Management</Label>
                  <Input
                    id="riskManagement"
                    value={riskManagement}
                    onChange={(e) => setRiskManagement(e.target.value)}
                    placeholder="e.g., Risk 1R per trade, max 2% equity"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="e.g., momentum, pullback"
                    />
                    <Button type="button" onClick={handleAddTag}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(index)}
                          className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit">
              {editingStrategy ? 'Update Strategy' : 'Create Strategy'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}