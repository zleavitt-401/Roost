'use client';

import { useState } from 'react';
import type { QuestionnaireAnswers } from '@/types';

type PracticalAnswers = QuestionnaireAnswers['practical'];

interface PracticalSectionProps {
  answers: PracticalAnswers;
  onChange: (answers: PracticalAnswers) => void;
}

export function PracticalSection({ answers, onChange }: PracticalSectionProps) {
  const [proximityInput, setProximityInput] = useState('');

  const update = <K extends keyof PracticalAnswers>(key: K, value: PracticalAnswers[K]) => {
    onChange({ ...answers, [key]: value });
  };

  const addProximity = () => {
    if (!proximityInput.trim()) return;
    update('proximityTo', [...answers.proximityTo, proximityInput.trim()]);
    setProximityInput('');
  };

  const removeProximity = (index: number) => {
    update('proximityTo', answers.proximityTo.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Max Rent */}
      <div>
        <label htmlFor="maxRent" className="block text-sm font-medium text-charcoal">
          Maximum monthly rent you can afford
        </label>
        <p className="mt-1 text-xs text-charcoal/50">
          This helps us filter housing options in each city.
        </p>
        <div className="mt-2 flex items-center gap-1">
          <span className="text-charcoal/60">$</span>
          <input
            id="maxRent"
            type="number"
            min={0}
            max={10000}
            step={100}
            value={answers.maxRent || ''}
            onChange={(e) => update('maxRent', Number(e.target.value))}
            placeholder="e.g. 2000"
            className="w-40 rounded-lg border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
          />
          <span className="text-sm text-charcoal/50">/ month</span>
        </div>
      </div>

      {/* Has Partner */}
      <div>
        <label className="block text-sm font-medium text-charcoal">
          Are you relocating with a partner?
        </label>
        <div className="mt-2 flex gap-4">
          <button
            type="button"
            onClick={() => update('hasPartner', true)}
            className={`rounded-lg border px-6 py-2.5 text-sm font-medium transition-colors ${
              answers.hasPartner
                ? 'border-terracotta bg-terracotta/10 text-terracotta'
                : 'border-charcoal/20 text-charcoal/60 hover:border-charcoal/40'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => {
              update('hasPartner', false);
              update('partnerJobNeeds', undefined);
            }}
            className={`rounded-lg border px-6 py-2.5 text-sm font-medium transition-colors ${
              !answers.hasPartner
                ? 'border-terracotta bg-terracotta/10 text-terracotta'
                : 'border-charcoal/20 text-charcoal/60 hover:border-charcoal/40'
            }`}
          >
            No
          </button>
        </div>
      </div>

      {/* Partner Job Needs — conditional */}
      {answers.hasPartner && (
        <div>
          <label htmlFor="partnerJobNeeds" className="block text-sm font-medium text-charcoal">
            What kind of work does your partner do or need?
          </label>
          <p className="mt-1 text-xs text-charcoal/50">
            We will consider partner employment opportunities in each city.
          </p>
          <input
            id="partnerJobNeeds"
            type="text"
            value={answers.partnerJobNeeds || ''}
            onChange={(e) => update('partnerJobNeeds', e.target.value)}
            placeholder="e.g. Nursing, remote software engineering"
            className="mt-2 w-full rounded-lg border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal placeholder:text-charcoal/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
          />
        </div>
      )}

      {/* Proximity To */}
      <div>
        <label className="block text-sm font-medium text-charcoal">
          Places you need to be close to
        </label>
        <p className="mt-1 text-xs text-charcoal/50">
          Examples: family in Chicago, aging parents in Florida.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {answers.proximityTo.map((place, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full bg-sage/15 px-3 py-1 text-sm text-charcoal"
            >
              {place}
              <button
                type="button"
                onClick={() => removeProximity(i)}
                className="ml-1 text-charcoal/40 hover:text-accent"
                aria-label={`Remove ${place}`}
              >
                x
              </button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={proximityInput}
            onChange={(e) => setProximityInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addProximity();
              }
            }}
            placeholder="e.g. Family in Boston"
            className="flex-1 rounded-lg border border-charcoal/20 bg-white px-3 py-2 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-terracotta focus:outline-none"
          />
          <button
            type="button"
            onClick={addProximity}
            className="rounded-lg border border-charcoal/20 px-3 py-2 text-sm text-charcoal/60 hover:border-terracotta hover:text-terracotta"
          >
            Add
          </button>
        </div>
      </div>

      {/* Move Timeline */}
      <div>
        <label htmlFor="moveTimeline" className="block text-sm font-medium text-charcoal">
          When are you looking to move?
        </label>
        <select
          id="moveTimeline"
          value={answers.moveTimeline}
          onChange={(e) => update('moveTimeline', e.target.value as PracticalAnswers['moveTimeline'])}
          className="mt-2 w-full rounded-lg border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
        >
          <option value="">Select...</option>
          <option value="asap">As soon as possible</option>
          <option value="3_months">Within 3 months</option>
          <option value="6_months">Within 6 months</option>
          <option value="1_year">Within a year</option>
          <option value="flexible">Flexible / just exploring</option>
        </select>
      </div>

      {/* Pet Friendly */}
      <div>
        <label className="block text-sm font-medium text-charcoal">
          Do you need pet-friendly housing?
        </label>
        <div className="mt-2 flex gap-4">
          <button
            type="button"
            onClick={() => update('petFriendly', true)}
            className={`rounded-lg border px-6 py-2.5 text-sm font-medium transition-colors ${
              answers.petFriendly
                ? 'border-terracotta bg-terracotta/10 text-terracotta'
                : 'border-charcoal/20 text-charcoal/60 hover:border-charcoal/40'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => update('petFriendly', false)}
            className={`rounded-lg border px-6 py-2.5 text-sm font-medium transition-colors ${
              !answers.petFriendly
                ? 'border-terracotta bg-terracotta/10 text-terracotta'
                : 'border-charcoal/20 text-charcoal/60 hover:border-charcoal/40'
            }`}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
