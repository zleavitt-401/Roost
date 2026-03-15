'use client';

import { useState } from 'react';
import type { ParsedResume } from '@/types';

interface ResumeReviewProps {
  initialData: ParsedResume;
  onConfirm: (data: ParsedResume) => void;
}

export function ResumeReview({ initialData, onConfirm }: ResumeReviewProps) {
  const [data, setData] = useState<ParsedResume>(initialData);

  const updateField = <K extends keyof ParsedResume>(key: K, value: ParsedResume[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleListAdd = (key: 'jobTitles' | 'skills' | 'industries', value: string) => {
    if (!value.trim()) return;
    updateField(key, [...data[key], value.trim()]);
  };

  const handleListRemove = (key: 'jobTitles' | 'skills' | 'industries', index: number) => {
    updateField(key, data[key].filter((_, i) => i !== index));
  };

  const handleEducationChange = (
    index: number,
    field: 'institution' | 'degree' | 'year',
    value: string | number
  ) => {
    const updated = [...data.education];
    updated[index] = { ...updated[index], [field]: value };
    setData((prev) => ({ ...prev, education: updated }));
  };

  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', year: 0 }],
    }));
  };

  const removeEducation = (index: number) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="font-display text-2xl font-semibold text-charcoal">
        Review your resume details
      </h2>
      <p className="mt-2 text-charcoal/60">
        Our AI extracted this information. Please review and correct anything that looks off.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {/* Job Titles */}
        <EditableList
          label="Job Titles"
          items={data.jobTitles}
          onAdd={(v) => handleListAdd('jobTitles', v)}
          onRemove={(i) => handleListRemove('jobTitles', i)}
        />

        {/* Skills */}
        <EditableList
          label="Skills"
          items={data.skills}
          onAdd={(v) => handleListAdd('skills', v)}
          onRemove={(i) => handleListRemove('skills', i)}
        />

        {/* Industries */}
        <EditableList
          label="Industries"
          items={data.industries}
          onAdd={(v) => handleListAdd('industries', v)}
          onRemove={(i) => handleListRemove('industries', i)}
        />

        {/* Years of Experience */}
        <div>
          <label className="block text-sm font-medium text-charcoal">
            Years of Experience
          </label>
          <input
            type="number"
            min={0}
            max={50}
            value={data.yearsExperience}
            onChange={(e) => updateField('yearsExperience', Number(e.target.value))}
            className="mt-1 w-32 rounded-lg border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
          />
        </div>

        {/* Salary Range */}
        <div>
          <label className="block text-sm font-medium text-charcoal">
            Estimated Salary Range
          </label>
          <div className="mt-1 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-charcoal/60">$</span>
              <input
                type="number"
                min={0}
                value={data.estimatedSalaryRange.min}
                onChange={(e) =>
                  updateField('estimatedSalaryRange', {
                    ...data.estimatedSalaryRange,
                    min: Number(e.target.value),
                  })
                }
                className="w-32 rounded-lg border border-charcoal/20 bg-white px-3 py-2.5 text-charcoal focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
              />
            </div>
            <span className="text-charcoal/40">to</span>
            <div className="flex items-center gap-1">
              <span className="text-charcoal/60">$</span>
              <input
                type="number"
                min={0}
                value={data.estimatedSalaryRange.max}
                onChange={(e) =>
                  updateField('estimatedSalaryRange', {
                    ...data.estimatedSalaryRange,
                    max: Number(e.target.value),
                  })
                }
                className="w-32 rounded-lg border border-charcoal/20 bg-white px-3 py-2.5 text-charcoal focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
              />
            </div>
          </div>
        </div>

        {/* Education */}
        <div>
          <label className="block text-sm font-medium text-charcoal">Education</label>
          <div className="mt-2 flex flex-col gap-3">
            {data.education.map((edu, index) => (
              <div
                key={index}
                className="flex flex-wrap items-start gap-2 rounded-lg border border-charcoal/10 bg-white p-3"
              >
                <input
                  type="text"
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                  className="flex-1 min-w-[140px] rounded border border-charcoal/20 px-3 py-2 text-sm text-charcoal focus:border-terracotta focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  className="flex-1 min-w-[140px] rounded border border-charcoal/20 px-3 py-2 text-sm text-charcoal focus:border-terracotta focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Year"
                  value={edu.year || ''}
                  onChange={(e) => handleEducationChange(index, 'year', Number(e.target.value))}
                  className="w-20 rounded border border-charcoal/20 px-3 py-2 text-sm text-charcoal focus:border-terracotta focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="rounded px-2 py-2 text-sm text-accent hover:bg-accent/10"
                  aria-label="Remove education entry"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addEducation}
              className="self-start rounded-lg border border-dashed border-charcoal/20 px-4 py-2 text-sm text-charcoal/60 hover:border-terracotta hover:text-terracotta"
            >
              + Add education
            </button>
          </div>
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium text-charcoal">Professional Summary</label>
          <textarea
            rows={3}
            value={data.summary}
            onChange={(e) => updateField('summary', e.target.value)}
            className="mt-1 w-full rounded-lg border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
          />
        </div>

        {/* Confirm */}
        <button
          type="button"
          onClick={() => onConfirm(data)}
          className="mt-4 self-end rounded-lg bg-accent px-8 py-3 font-semibold text-cream shadow-md transition-colors hover:bg-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 focus:ring-offset-cream"
        >
          Confirm and Continue
        </button>
      </div>
    </div>
  );
}

// ─── Internal Editable List Component ────────────────────────────────────────

interface EditableListProps {
  label: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
}

function EditableList({ label, items, onAdd, onRemove }: EditableListProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    onAdd(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-charcoal">{label}</label>
      <div className="mt-1 flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 rounded-full bg-sage/15 px-3 py-1 text-sm text-charcoal"
          >
            {item}
            <button
              type="button"
              onClick={() => onRemove(index)}
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
          onKeyDown={handleKeyDown}
          placeholder={`Add ${label.toLowerCase()}...`}
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
