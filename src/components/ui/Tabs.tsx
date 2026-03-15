'use client';

import { type KeyboardEvent, type ReactNode, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    let nextIndex: number | null = null;

    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      tabRefs.current[nextIndex]?.focus();
      onTabChange(tabs[nextIndex].id);
    }
  };

  return (
    <div
      role="tablist"
      className="flex gap-1 overflow-x-auto border-b border-charcoal/10"
      aria-label="Content tabs"
    >
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={(el) => { tabRefs.current[index] = el; }}
          role="tab"
          id={`tab-${tab.id}`}
          aria-selected={activeTab === tab.id}
          aria-controls={`tabpanel-${tab.id}`}
          tabIndex={activeTab === tab.id ? 0 : -1}
          onClick={() => onTabChange(tab.id)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={cn(
            'shrink-0 whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta',
            activeTab === tab.id
              ? 'border-b-2 border-terracotta text-terracotta'
              : 'text-charcoal/50 hover:text-charcoal/80'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

interface TabPanelProps {
  id: string;
  activeTab: string;
  children: ReactNode;
}

export function TabPanel({ id, activeTab, children }: TabPanelProps) {
  if (activeTab !== id) return null;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
      tabIndex={0}
      className="py-4"
    >
      {children}
    </div>
  );
}
