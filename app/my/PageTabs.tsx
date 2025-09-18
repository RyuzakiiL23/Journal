import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'
import { DataTableJournal } from './DataTableJournal'
import { DataTableStrategy } from './DataTableStrategy'
import AddTrade from './AddTrade'
import StrategyManager from '@/components/StrategyManager'

export default function PageTabs() {
  return (
        <Tabs defaultValue="journal" className="w-full">
          <TabsList>
            <TabsTrigger value="journal">Trade Journal</TabsTrigger>
            <TabsTrigger value="strategies">Edge Strategies</TabsTrigger>
            <TabsTrigger value="newTrade">New Trade</TabsTrigger>
            <TabsTrigger value="newStrategy">New Strategy</TabsTrigger>
          </TabsList>

          <TabsContent value="journal" className="">
            <DataTableJournal />
          </TabsContent>
          <TabsContent value="strategies" className="">
            <DataTableStrategy />
          </TabsContent>
          <TabsContent value="newTrade" className="">
            <AddTrade />
          </TabsContent>
          <TabsContent value="newStrategy" className="">
            {/* <AddStrategy /> */}
            <StrategyManager/>
          </TabsContent>
        </Tabs>
  )
}
