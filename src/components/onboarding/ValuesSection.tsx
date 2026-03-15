'use client';

import type { QuestionnaireAnswers } from '@/types';

type ValuesAnswers = QuestionnaireAnswers['values'];

interface ValuesSectionProps {
  answers: ValuesAnswers;
  onChange: (answers: ValuesAnswers) => void;
}

export function ValuesSection({ answers, onChange }: ValuesSectionProps) {
  const update = <K extends keyof ValuesAnswers>(key: K, value: ValuesAnswers[K]) => {
    onChange({ ...answers, [key]: value });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Political Leaning */}
      <div>
        <label htmlFor="politicalLeaning" className="block text-sm font-medium text-charcoal">
          What political environment do you prefer?
        </label>
        <p className="mt-1 text-xs text-charcoal/50">
          This is used to match community fit, not to judge your views.
        </p>
        <select
          id="politicalLeaning"
          value={answers.politicalLeaning}
          onChange={(e) => update('politicalLeaning', e.target.value as ValuesAnswers['politicalLeaning'])}
          className="mt-2 w-full rounded-lg border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
        >
          <option value="">Select...</option>
          <option value="progressive">Progressive</option>
          <option value="moderate">Moderate</option>
          <option value="conservative">Conservative</option>
          <option value="no_preference">No preference</option>
        </select>
      </div>

      {/* Gun Law Preference */}
      <div>
        <label htmlFor="gunLawPref" className="block text-sm font-medium text-charcoal">
          What is your preference on local gun laws?
        </label>
        <select
          id="gunLawPref"
          value={answers.gunLawPref}
          onChange={(e) => update('gunLawPref', e.target.value as ValuesAnswers['gunLawPref'])}
          className="mt-2 w-full rounded-lg border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
        >
          <option value="">Select...</option>
          <option value="strict">Prefer stricter regulations</option>
          <option value="moderate">Moderate regulations</option>
          <option value="permissive">Prefer fewer restrictions</option>
          <option value="no_preference">No preference</option>
        </select>
      </div>

      {/* Diversity Importance */}
      <div>
        <label htmlFor="diversityImportance" className="block text-sm font-medium text-charcoal">
          How important is community diversity to you?
        </label>
        <select
          id="diversityImportance"
          value={answers.diversityImportance}
          onChange={(e) => update('diversityImportance', e.target.value as ValuesAnswers['diversityImportance'])}
          className="mt-2 w-full rounded-lg border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
        >
          <option value="">Select...</option>
          <option value="essential">Essential</option>
          <option value="preferred">Preferred</option>
          <option value="not_important">Not important</option>
        </select>
      </div>

      {/* Setting Preference */}
      <div>
        <label htmlFor="settingPref" className="block text-sm font-medium text-charcoal">
          What type of setting do you prefer?
        </label>
        <select
          id="settingPref"
          value={answers.settingPref}
          onChange={(e) => update('settingPref', e.target.value as ValuesAnswers['settingPref'])}
          className="mt-2 w-full rounded-lg border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
        >
          <option value="">Select...</option>
          <option value="urban">Urban / city center</option>
          <option value="suburban">Suburban</option>
          <option value="rural">Rural</option>
          <option value="no_preference">No preference</option>
        </select>
      </div>
    </div>
  );
}
