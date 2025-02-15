import { useState } from 'react'
import { Analytics } from '../components/Analytics'
import { Settings } from '../components/Settings'

type Tab = 'analytics' | 'settings'

export function Dashboard(): JSX.Element {
  const [activeTab, setActiveTab] = useState<Tab>('analytics')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' }
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="border-b">
        <nav className="flex" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-2 text-sm font-medium
                ${
                  activeTab === tab.id
                    ? 'border-b-2 border-gray-800 text-gray-900'
                    : 'text-gray-800 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'settings' && <Settings />}
      </div>
    </div>
  )
}
