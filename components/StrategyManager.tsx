'use client';

import { useEffect, useState } from 'react';
import StrategyTable from './StrategyTable';
import { Strategy } from '@/types/Models';
import StrategyForm from './StrategyForm';
import { Button } from './ui/button';

export default function StrategyManager() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("strategies")
    if (saved) {
      try {
        setStrategies(JSON.parse(saved))
      } catch (e) {
        console.error("Error parsing strategies from localStorage", e)
      }
    }
  }, [])

  // // Save to localStorage whenever strategies changes
  // useEffect(() => {
  //   localStorage.setItem("strategies", JSON.stringify(strategies))
  // }, [strategies])

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


     localStorage.setItem("strategies", JSON.stringify(strategies))

  };

  const handleEditStrategy = (strategy: Strategy) => {
    setEditingStrategy(strategy);
  };

  const handleDeleteStrategy = (id: string) => {
    setStrategies(strategies.filter((strategy) => strategy.id !== id));
  };

  const handleCancelEdit = () => {
    setEditingStrategy(null);
  };

  return (
      <div className="max-w-7xl  ">
        <div className="mb-6">
            <StrategyForm
              onSubmit={handleCreateStrategy}
              editingStrategy={editingStrategy}
              onCancel={handleCancelEdit}
            />
        </div>

        {/* <div className="mt-8">
          <StrategyTable
            strategies={strategies}
            onEdit={handleEditStrategy}
            onDelete={handleDeleteStrategy}
          />
        </div> */}
      </div>
  );
}