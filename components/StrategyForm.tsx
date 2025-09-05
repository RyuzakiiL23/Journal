'use client';

import { Strategy } from '@/types/Models';
import { useState } from 'react';

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
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Strategy Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            required
          />
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Strategy Type *
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as Strategy['type'])}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            required
          >
            {strategyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Session */}
        <div>
          <label htmlFor="session" className="block text-sm font-medium text-gray-700">
            Trading Session
          </label>
          <select
            id="session"
            value={session || ''}
            onChange={(e) => setSession(e.target.value as Strategy['session'])}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          >
            <option value="">Select Session</option>
            {sessions.map((session) => (
              <option key={session} value={session}>
                {session}
              </option>
            ))}
          </select>
        </div>

        {/* Instruments */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Instruments *</label>
          <div className="flex mt-1">
            <input
              type="text"
              value={instrumentInput}
              onChange={(e) => setInstrumentInput(e.target.value)}
              placeholder="e.g., EUR/USD"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            />
            <button
              type="button"
              onClick={handleAddInstrument}
              className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {instruments.map((instrument, index) => (
              <span
                key={index}
                className="inline-flex items-center py-1 pl-3 pr-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {instrument}
                <button
                  type="button"
                  onClick={() => handleRemoveInstrument(index)}
                  className="ml-1 inline-flex items-center justify-center h-5 w-5 rounded-full text-blue-600 hover:bg-blue-200 focus:outline-none focus:bg-blue-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Timeframes */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Timeframes</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {commonTimeframes.map((timeframe) => (
              <button
                key={timeframe}
                type="button"
                onClick={() => handleToggleTimeframe(timeframe)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  timeframes.includes(timeframe)
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>

        {/* Indicators */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Indicators</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {commonIndicators.map((indicator) => (
              <button
                key={indicator}
                type="button"
                onClick={() => handleToggleIndicator(indicator)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  indicators.includes(indicator)
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {indicator}
              </button>
            ))}
          </div>
        </div>

        {/* Entry Rules */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Entry Rules</label>
          {entryRules.map((rule, index) => (
            <div key={index} className="flex mt-2">
              <input
                type="text"
                value={rule}
                onChange={(e) => handleRuleChange(entryRules, setEntryRules, index, e.target.value)}
                placeholder="Describe entry condition"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
              <button
                type="button"
                onClick={() => handleRemoveRule(entryRules, setEntryRules, index)}
                className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddRule(entryRules, setEntryRules)}
            className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Entry Rule
          </button>
        </div>

        {/* Exit Rules */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Exit Rules</label>
          {exitRules.map((rule, index) => (
            <div key={index} className="flex mt-2">
              <input
                type="text"
                value={rule}
                onChange={(e) => handleRuleChange(exitRules, setExitRules, index, e.target.value)}
                placeholder="Describe exit condition"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
              <button
                type="button"
                onClick={() => handleRemoveRule(exitRules, setExitRules, index)}
                className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddRule(exitRules, setExitRules)}
            className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Exit Rule
          </button>
        </div>

        {/* Risk Management */}
        <div className="col-span-2">
          <label htmlFor="riskManagement" className="block text-sm font-medium text-gray-700">
            Risk Management
          </label>
          <input
            type="text"
            id="riskManagement"
            value={riskManagement}
            onChange={(e) => setRiskManagement(e.target.value)}
            placeholder="e.g., Risk 1R per trade, max 2% equity"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>

        {/* Tags */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Tags</label>
          <div className="flex mt-1">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="e.g., momentum, pullback"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center py-1 pl-3 pr-2 rounded-full text-sm font-medium bg-green-100 text-green-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="ml-1 inline-flex items-center justify-center h-5 w-5 rounded-full text-green-600 hover:bg-green-200 focus:outline-none focus:bg-green-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {editingStrategy ? 'Update Strategy' : 'Create Strategy'}
        </button>
      </div>
    </form>
  );
}