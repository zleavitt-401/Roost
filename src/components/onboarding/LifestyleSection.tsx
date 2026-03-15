'use client';

import { useState } from 'react';
import type { QuestionnaireAnswers } from '@/types';

type LifestyleAnswers = QuestionnaireAnswers['lifestyle'];

interface LifestyleSectionProps {
  answers: LifestyleAnswers;
  onChange: (answers: LifestyleAnswers) => void;
}

function MultiInput({
  label,
  helpText,
  items,
  placeholder,
  onAdd,
  onRemove,
}: {
  label: string;
  helpText?: string;
  items: string[];
  placeholder: string;
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
}) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    onAdd(inputValue.trim());
    setInputValue('');
  };

  return (
    <div>
      <label className="block text-sm font-medium text-charcoal">{label}</label>
      {helpText && <p className="mt-1 text-xs text-charcoal/50">{helpText}</p>}
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-full bg-sage/15 px-3 py-1 text-sm text-charcoal"
          >
            {item}
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="ml-1 text-charcoal/40 hover:text-accent"
              aria-label={`Remove ${item}`}
            >
              x
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-charcoal/20 bg-white px-3 py-2 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-terracotta focus:outline-none"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg border border-charcoal/20 px-3 py-2 text-sm text-charcoal/60 hover:border-terracotta hover:text-terracotta"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export function LifestyleSection({ answers, onChange }: LifestyleSectionProps) {
  const update = <K extends keyof LifestyleAnswers>(key: K, value: LifestyleAnswers[K]) => {
    onChange({ ...answers, [key]: value });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Climate */}
      <div>
        <label htmlFor="climatePref" className="block text-sm font-medium text-charcoal">
          What climate do you prefer?
        </label>
        <select
          id="climatePref"
          value={answers.climatePref}
          onChange={(e) => update('climatePref', e.target.value as LifestyleAnswers['climatePref'])}
          className="mt-2 w-full rounded-lg border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
        >
          <option value="">Select...</option>
          <option value="warm">Warm year-round</option>
          <option value="mild">Mild / four seasons</option>
          <option value="cold_ok">Cold winters are fine</option>
          <option value="no_preference">No preference</option>
        </select>
      </div>

      {/* Humidity */}
      <div>
        <label htmlFor="humidityTolerance" className="block text-sm font-medium text-charcoal">
          How well do you handle humidity?
        </label>
        <select
          id="humidityTolerance"
          value={answers.humidityTolerance}
          onChange={(e) => update('humidityTolerance', e.target.value as LifestyleAnswers['humidityTolerance'])}
          className="mt-2 w-full rounded-lg border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
        >
          <option value="">Select...</option>
          <option value="low">Prefer dry climates</option>
          <option value="medium">Some humidity is fine</option>
          <option value="high">Humidity does not bother me</option>
        </select>
      </div>

      {/* Hobbies */}
      <MultiInput
        label="What hobbies or activities matter most to you?"
        helpText="Add hobbies you want access to in your new city."
        items={answers.hobbies}
        placeholder="e.g. Hiking, Live music"
        onAdd={(v) => update('hobbies', [...answers.hobbies, v])}
        onRemove={(i) => update('hobbies', answers.hobbies.filter((_, idx) => idx !== i))}
      />

      {/* Walkability */}
      <div>
        <label htmlFor="walkabilityImportance" className="block text-sm font-medium text-charcoal">
          How important is walkability?
        </label>
        <select
          id="walkabilityImportance"
          value={answers.walkabilityImportance}
          onChange={(e) => update('walkabilityImportance', e.target.value as LifestyleAnswers['walkabilityImportance'])}
          className="mt-2 w-full rounded-lg border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
        >
          <option value="">Select...</option>
          <option value="essential">Essential -- I want to walk everywhere</option>
          <option value="preferred">Preferred but not a dealbreaker</option>
          <option value="not_important">Not important</option>
        </select>
      </div>

      {/* Food Priorities */}
      <MultiInput
        label="What food scene aspects matter to you?"
        helpText="Examples: diverse cuisines, farm-to-table, vegan options, food trucks."
        items={answers.foodPriorities}
        placeholder="e.g. Diverse cuisines"
        onAdd={(v) => update('foodPriorities', [...answers.foodPriorities, v])}
        onRemove={(i) => update('foodPriorities', answers.foodPriorities.filter((_, idx) => idx !== i))}
      />

      {/* Nightlife */}
      <div>
        <label htmlFor="nightlifeImportance" className="block text-sm font-medium text-charcoal">
          How important is nightlife and entertainment?
        </label>
        <select
          id="nightlifeImportance"
          value={answers.nightlifeImportance}
          onChange={(e) => update('nightlifeImportance', e.target.value as LifestyleAnswers['nightlifeImportance'])}
          className="mt-2 w-full rounded-lg border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
        >
          <option value="">Select...</option>
          <option value="essential">Essential -- active nightlife matters</option>
          <option value="preferred">Nice to have</option>
          <option value="not_important">Not important</option>
        </select>
      </div>
    </div>
  );
}
