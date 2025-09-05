'use client';

import { useState } from 'react';
import StrategyTable from './StrategyTable';
import { Strategy } from '@/types/Models';
import StrategyForm from './StrategyForm';
import { Button } from './ui/button';

export default function StrategyManager() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreateStrategy = (strategyData: Omit<Strategy, 'id'>) => {
    const newStrategy: Strategy = {
      ...strategyData,
      id: Date.now().toString(),
    };

    if (editingStrategy) {
      // Update existing strategy
      setStrategies(
        strategies.map((strategy) =>
          strategy.id === editingStrategy.id ? { ...newStrategy, id: editingStrategy.id } : strategy
        )
      );
      setEditingStrategy(null);
    } else {
      // Add new strategy
      setStrategies([...strategies, newStrategy]);
    }

    setShowForm(false);
  };

  const handleEditStrategy = (strategy: Strategy) => {
    setEditingStrategy(strategy);
    setShowForm(true);
  };

  const handleDeleteStrategy = (id: string) => {
    setStrategies(strategies.filter((strategy) => strategy.id !== id));
  };

  const handleCancelEdit = () => {
    setEditingStrategy(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Trading Strategy Manager</h1>
          <p className="mt-2 text-lg text-gray-600">Create and manage your trading strategies</p>
        </div>

        <div className="mb-6">
          {!showForm ? (
            <Button
              variant="secondary"
              onClick={() => setShowForm(true)}
            >
              Create New Strategy
            </Button>
          ) : (
            <StrategyForm
              onSubmit={handleCreateStrategy}
              editingStrategy={editingStrategy}
              onCancel={handleCancelEdit}
            />
          )}
        </div>

        <div className="mt-8">
          <StrategyTable
            strategies={strategies}
            onEdit={handleEditStrategy}
            onDelete={handleDeleteStrategy}
          />
        </div>
      </div>
    </div>
  );
}