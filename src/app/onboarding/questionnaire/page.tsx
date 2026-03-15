'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/onboarding/AuthProvider';
import { CareerSection } from '@/components/onboarding/CareerSection';
import { LifestyleSection } from '@/components/onboarding/LifestyleSection';
import { PracticalSection } from '@/components/onboarding/PracticalSection';
import { ValuesSection } from '@/components/onboarding/ValuesSection';
import { ConfirmationScreen } from '@/components/onboarding/ConfirmationScreen';
import { assembleAndTrigger } from '@/lib/questionnaire/assembleProfile';
import type { QuestionnaireAnswers, ParsedResume } from '@/types';

const SECTIONS = ['Career', 'Lifestyle', 'Practical', 'Values'] as const;

function getDefaultAnswers(): QuestionnaireAnswers {
  return {
    career: {
      industryOpenness: '' as QuestionnaireAnswers['career']['industryOpenness'],
      minSalary: 0,
      workStyle: '' as QuestionnaireAnswers['career']['workStyle'],
      companySizePref: '' as QuestionnaireAnswers['career']['companySizePref'],
      excludedIndustries: [],
    },
    lifestyle: {
      climatePref: '' as QuestionnaireAnswers['lifestyle']['climatePref'],
      humidityTolerance: '' as QuestionnaireAnswers['lifestyle']['humidityTolerance'],
      hobbies: [],
      walkabilityImportance: '' as QuestionnaireAnswers['lifestyle']['walkabilityImportance'],
      foodPriorities: [],
      nightlifeImportance: '' as QuestionnaireAnswers['lifestyle']['nightlifeImportance'],
    },
    practical: {
      maxRent: 0,
      hasPartner: false,
      proximityTo: [],
      moveTimeline: '' as QuestionnaireAnswers['practical']['moveTimeline'],
      petFriendly: false,
    },
    values: {
      politicalLeaning: '' as QuestionnaireAnswers['values']['politicalLeaning'],
      gunLawPref: '' as QuestionnaireAnswers['values']['gunLawPref'],
      diversityImportance: '' as QuestionnaireAnswers['values']['diversityImportance'],
      settingPref: '' as QuestionnaireAnswers['values']['settingPref'],
    },
  };
}

function validateSection(section: typeof SECTIONS[number], answers: QuestionnaireAnswers): string | null {
  switch (section) {
    case 'Career':
      if (!answers.career.industryOpenness) return 'Please select your industry openness.';
      if (!answers.career.minSalary) return 'Please enter a minimum salary.';
      if (!answers.career.workStyle) return 'Please select a work style.';
      if (!answers.career.companySizePref) return 'Please select a company size preference.';
      return null;
    case 'Lifestyle':
      if (!answers.lifestyle.climatePref) return 'Please select a climate preference.';
      if (!answers.lifestyle.humidityTolerance) return 'Please select a humidity tolerance.';
      if (!answers.lifestyle.walkabilityImportance) return 'Please select a walkability preference.';
      if (!answers.lifestyle.nightlifeImportance) return 'Please select a nightlife preference.';
      return null;
    case 'Practical':
      if (!answers.practical.maxRent) return 'Please enter a maximum rent.';
      if (!answers.practical.moveTimeline) return 'Please select a move timeline.';
      return null;
    case 'Values':
      if (!answers.values.politicalLeaning) return 'Please select a political environment preference.';
      if (!answers.values.gunLawPref) return 'Please select a gun law preference.';
      if (!answers.values.diversityImportance) return 'Please select a diversity preference.';
      if (!answers.values.settingPref) return 'Please select a setting preference.';
      return null;
  }
}

export default function QuestionnairePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(getDefaultAnswers);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Retrieve resume data from session storage
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetterUrl, setCoverLetterUrl] = useState<string | undefined>();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
      return;
    }

    const stored = sessionStorage.getItem('roost_parsedResume');
    const storedUrl = sessionStorage.getItem('roost_resumeUrl');
    const storedCl = sessionStorage.getItem('roost_coverLetterUrl');

    if (!stored || !storedUrl) {
      // No resume data — send back to upload
      router.replace('/onboarding/resume');
      return;
    }

    try {
      setParsedResume(JSON.parse(stored) as ParsedResume);
      setResumeUrl(storedUrl);
      if (storedCl) setCoverLetterUrl(storedCl);
    } catch {
      router.replace('/onboarding/resume');
    }
  }, [user, authLoading, router]);

  if (authLoading || !parsedResume) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-charcoal/60">Loading...</p>
      </div>
    );
  }

  if (done) {
    return <ConfirmationScreen />;
  }

  const currentSection = SECTIONS[sectionIndex];

  const handleNext = async () => {
    setError('');

    const validationError = validateSection(currentSection, answers);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Last section — submit
    if (sectionIndex === SECTIONS.length - 1) {
      if (!user) return;
      setSubmitting(true);
      try {
        const idToken = await user.getIdToken();
        const result = await assembleAndTrigger(
          user.uid,
          user.email || '',
          resumeUrl,
          coverLetterUrl,
          parsedResume,
          answers,
          idToken
        );

        if (!result.success) {
          setError(result.error || 'Something went wrong. Please try again.');
          return;
        }

        // Clean up session storage
        sessionStorage.removeItem('roost_parsedResume');
        sessionStorage.removeItem('roost_resumeUrl');
        sessionStorage.removeItem('roost_coverLetterUrl');

        setDone(true);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Submission failed';
        setError(`Failed to submit: ${message}`);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setSectionIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    setError('');
    if (sectionIndex === 0) {
      router.push('/onboarding/resume');
      return;
    }
    setSectionIndex((prev) => prev - 1);
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-charcoal">
            {currentSection} preferences
          </h1>
          <span className="text-sm text-charcoal/50">
            Step {sectionIndex + 1} of {SECTIONS.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-charcoal/10">
          <div
            className="h-full rounded-full bg-terracotta transition-all duration-300"
            style={{ width: `${((sectionIndex + 1) / SECTIONS.length) * 100}%` }}
          />
        </div>

        {/* Section tabs */}
        <div className="mt-4 flex gap-2">
          {SECTIONS.map((section, i) => (
            <span
              key={section}
              className={`text-xs font-medium ${
                i === sectionIndex
                  ? 'text-terracotta'
                  : i < sectionIndex
                    ? 'text-sage'
                    : 'text-charcoal/30'
              }`}
            >
              {section}
            </span>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-accent">
          {error}
        </div>
      )}

      {/* Section content */}
      <div className="rounded-xl border border-charcoal/10 bg-white p-6 shadow-sm">
        {currentSection === 'Career' && (
          <CareerSection
            answers={answers.career}
            onChange={(career) => setAnswers((prev) => ({ ...prev, career }))}
          />
        )}
        {currentSection === 'Lifestyle' && (
          <LifestyleSection
            answers={answers.lifestyle}
            onChange={(lifestyle) => setAnswers((prev) => ({ ...prev, lifestyle }))}
          />
        )}
        {currentSection === 'Practical' && (
          <PracticalSection
            answers={answers.practical}
            onChange={(practical) => setAnswers((prev) => ({ ...prev, practical }))}
          />
        )}
        {currentSection === 'Values' && (
          <ValuesSection
            answers={answers.values}
            onChange={(values) => setAnswers((prev) => ({ ...prev, values }))}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="rounded-lg border border-charcoal/20 px-6 py-2.5 text-sm font-medium text-charcoal/70 transition-colors hover:border-charcoal/40 hover:text-charcoal"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={submitting}
          className="rounded-lg bg-accent px-8 py-2.5 font-semibold text-cream shadow-md transition-colors hover:bg-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 focus:ring-offset-cream disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? 'Submitting...'
            : sectionIndex === SECTIONS.length - 1
              ? 'Submit and Find My Cities'
              : 'Next'}
        </button>
      </div>
    </div>
  );
}
