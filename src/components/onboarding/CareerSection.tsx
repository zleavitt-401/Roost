'use client';

import { useState } from 'react';
import type { QuestionnaireAnswers } from '@/types';

type CareerAnswers = QuestionnaireAnswers['career'];

interface CareerSectionProps {
  answers: CareerAnswers;
  onChange: (answers: CareerAnswers) => void;
}

export function CareerSection({ answers, onChange }: CareerSectionProps) {
  const [excludeInput, setExcludeInput] = useState('');

  const update = <K extends keyof CareerAnswers>(key: K, value: CareerAnswers[K]) => {
    onChange({ ...answers, [key]: value });
  };

  const addExcluded = () => {
    if (!excludeInput.trim()) return;
    update('excludedIndustries', [...answers.excludedIndustries, excludeInput.trim()]);
    setExcludeInput('');
  };

  const removeExcluded = (index: number) => {
    update(
      'excludedIndustries',
      answers.excludedIndustries.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Industry Openness */}
      <div>
        <label htmlFor="industryOpenness" className="block text-sm font-medium text-charcoal">
          How open are you to changing industries?
        </label>
        <p className="mt-1 text-xs text-charcoal/50">
          This helps us decide how broadly to search for job matches.
        </p>
        <select
          id="industryOpenness"
          value={answers.industryOpenness}
          onChange={(e) => update('industryOpenness', e.target.value as CareerAnswers['industryOpenness'])}
          className="mt-2 w-full rounded-lg border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
        >
          <option value="">Select...</option>
          <option value="same">Same industry only</option>
          <option value="adjacent">Adjacent industries</option>
          <option value="open">Open to most industries</option>
          <option value="completely_open">Completely open</option>
        </select>
      </div>

      {/* Min Salary */}
      <div>
        <label htmlFor="minSalary" className="block text-sm font-medium text-charcoal">
          Minimum annual salary you would accept
        </label>
        <p className="mt-1 text-xs text-charcoal/50">
          We will filter out roles below this number.
        </p>
        <div className="mt-2 flex items-center gap-1">
          <span className="text-charcoal/60">$</span>
          <input
            id="minSalary"
            type="number"
            min={0}
            max={500000}
            step={5000}
            value={answers.minSalary || ''}
            onChange={(e) => update('minSalary', Number(e.target.value))}
            placeholder="e.g. 60000"
            className="w-40 rounded-lg border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
          />
        </div>
      </div>

      {/* Work Style */}
      <div>
        <label htmlFor="workStyle" className="block text-sm font-medium text-charcoal">
          Preferred work style
        </label>
        <select
          id="workStyle"
          value={answers.workStyle}
          onChange={(e) => update('workStyle', e.target.value as CareerAnswers['workStyle'])}
          className="mt-2 w-full rounded-lg border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
        >
          <option value="">Select...</option>
          <option value="remote">Fully remote</option>
          <option value="hybrid">Hybrid</option>
          <option value="in_person">In person</option>
          <option value="no_preference">No preference</option>
        </select>
      </div>

      {/* Company Size */}
      <div>
        <label htmlFor="companySizePref" className="block text-sm font-medium text-charcoal">
          Preferred company size
        </label>
        <select
          id="companySizePref"
          value={answers.companySizePref}
          onChange={(e) => update('companySizePref', e.target.value as CareerAnswers['companySizePref'])}
          className="mt-2 w-full rounded-lg border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
        >
          <option value="">Select...</option>
          <option value="startup">Startup (under 50)</option>
          <option value="small">Small (50-200)</option>
          <option value="medium">Medium (200-1000)</option>
          <option value="large">Large (1000+)</option>
          <option value="no_preference">No preference</option>
        </select>
      </div>

      {/* Excluded Industries */}
      <div>
        <label className="block text-sm font-medium text-charcoal">
          Industries to exclude
        </label>
        <p className="mt-1 text-xs text-charcoal/50">
          Add any industries you do not want to work in.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {answers.excludedIndustries.map((ind, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-sm text-charcoal"
            >
              {ind}
              <button
                type="button"
                onClick={() => removeExcluded(i)}
                className="ml-1 text-charcoal/40 hover:text-accent"
                aria-label={`Remove ${ind}`}
              >
                x
              </button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={excludeInput}
            onChange={(e) => setExcludeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addExcluded();
              }
            }}
            placeholder="e.g. Oil and Gas"
            className="flex-1 rounded-lg border border-charcoal/20 bg-white px-3 py-2 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-terracotta focus:outline-none"
          />
          <button
            type="button"
            onClick={addExcluded}
            className="rounded-lg border border-charcoal/20 px-3 py-2 text-sm text-charcoal/60 hover:border-terracotta hover:text-terracotta"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
