'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { useAuth } from '@/components/onboarding/AuthProvider';
import { ResumeReview } from '@/components/onboarding/ResumeReview';
import type { ParsedResume } from '@/types';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

type Step = 'upload' | 'parsing' | 'review';

export default function ResumeUploadPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverLetterInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>('upload');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [resumeStoragePath, setResumeStoragePath] = useState('');
  const [coverLetterStoragePath, setCoverLetterStoragePath] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Please upload a PDF or DOCX file.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be under 10MB.';
    }
    return null;
  };

  const handleResumeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setResumeFile(file);
  };

  const handleCoverLetterSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setCoverLetterFile(file);
  };

  const getFileExtension = (file: File): string => {
    const name = file.name;
    const dotIndex = name.lastIndexOf('.');
    return dotIndex >= 0 ? name.slice(dotIndex) : '';
  };

  const handleUploadAndParse = useCallback(async () => {
    if (!user || !resumeFile) return;

    setError('');
    setUploading(true);
    setStep('parsing');

    try {
      // Upload resume
      const resumeExt = getFileExtension(resumeFile);
      const resumePath = `resumes/${user.uid}/resume${resumeExt}`;
      const resumeRef = ref(storage, resumePath);
      await uploadBytes(resumeRef, resumeFile, { contentType: resumeFile.type });
      setResumeStoragePath(resumePath);

      // Upload cover letter if present
      let coverLetterPath: string | undefined;
      if (coverLetterFile) {
        const clExt = getFileExtension(coverLetterFile);
        coverLetterPath = `resumes/${user.uid}/cover-letter${clExt}`;
        const clRef = ref(storage, coverLetterPath);
        await uploadBytes(clRef, coverLetterFile, { contentType: coverLetterFile.type });
        setCoverLetterStoragePath(coverLetterPath);
      }

      // Get ID token for API auth
      const idToken = await user.getIdToken();

      // Call parse API
      const response = await fetch('/api/resume/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          resumeUrl: resumePath,
          ...(coverLetterPath ? { coverLetterUrl: coverLetterPath } : {}),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as { error?: string }).error || 'Failed to parse resume');
      }

      setParsedResume((data as { parsedResume: ParsedResume }).parsedResume);
      setStep('review');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setError(message);
      setStep('upload');
    } finally {
      setUploading(false);
    }
  }, [user, resumeFile, coverLetterFile]);

  const handleReviewConfirm = (confirmedResume: ParsedResume) => {
    // Store in sessionStorage for the questionnaire page to retrieve
    sessionStorage.setItem('roost_parsedResume', JSON.stringify(confirmedResume));
    sessionStorage.setItem('roost_resumeUrl', resumeStoragePath);
    if (coverLetterStoragePath) {
      sessionStorage.setItem('roost_coverLetterUrl', coverLetterStoragePath);
    }
    router.push('/onboarding/questionnaire');
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-charcoal/60">Loading...</p>
      </div>
    );
  }

  // Step indicator
  const stepLabels = ['Upload', 'Review', 'Questionnaire', 'Done'];
  const currentStepIndex = step === 'upload' || step === 'parsing' ? 0 : 1;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* Progress indicator */}
      <div className="mb-8 flex items-center gap-2">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  i <= currentStepIndex
                    ? 'bg-terracotta text-cream'
                    : 'bg-charcoal/10 text-charcoal/50'
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-sm ${
                  i <= currentStepIndex ? 'font-medium text-charcoal' : 'text-charcoal/50'
                }`}
              >
                {label}
              </span>
            </div>
            {i < stepLabels.length - 1 && (
              <div
                className={`h-px w-8 ${
                  i < currentStepIndex ? 'bg-terracotta' : 'bg-charcoal/15'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {step === 'review' && parsedResume ? (
        <ResumeReview initialData={parsedResume} onConfirm={handleReviewConfirm} />
      ) : (
        <>
          <h1 className="font-display text-3xl font-semibold text-charcoal">
            Upload your resume
          </h1>
          <p className="mt-2 text-charcoal/60">
            We will use AI to extract your skills, experience, and career details.
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-accent">
              {error}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-6">
            {/* Resume upload area */}
            <div>
              <label className="block text-sm font-medium text-charcoal">
                Resume (required)
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
                }}
                role="button"
                tabIndex={0}
                className="mt-2 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-charcoal/20 bg-white px-6 py-10 transition-colors hover:border-terracotta hover:bg-terracotta/5"
              >
                <svg
                  className="h-10 w-10 text-charcoal/30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                {resumeFile ? (
                  <p className="mt-3 text-sm font-medium text-terracotta">{resumeFile.name}</p>
                ) : (
                  <>
                    <p className="mt-3 text-sm text-charcoal/60">
                      Click to upload or drag and drop
                    </p>
                    <p className="mt-1 text-xs text-charcoal/40">PDF or DOCX, up to 10MB</p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleResumeSelect}
                className="hidden"
                aria-label="Upload resume file"
              />
            </div>

            {/* Cover letter upload area */}
            <div>
              <label className="block text-sm font-medium text-charcoal">
                Cover letter (optional)
              </label>
              <div
                onClick={() => coverLetterInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') coverLetterInputRef.current?.click();
                }}
                role="button"
                tabIndex={0}
                className="mt-2 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-charcoal/20 bg-white px-6 py-6 transition-colors hover:border-sage hover:bg-sage/5"
              >
                {coverLetterFile ? (
                  <p className="text-sm font-medium text-sage">{coverLetterFile.name}</p>
                ) : (
                  <p className="text-sm text-charcoal/50">Click to add a cover letter (optional)</p>
                )}
              </div>
              <input
                ref={coverLetterInputRef}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleCoverLetterSelect}
                className="hidden"
                aria-label="Upload cover letter file"
              />
            </div>

            {/* Upload button */}
            <button
              type="button"
              disabled={!resumeFile || uploading}
              onClick={handleUploadAndParse}
              className="self-end rounded-lg bg-accent px-8 py-3 font-semibold text-cream shadow-md transition-colors hover:bg-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 focus:ring-offset-cream disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? 'Uploading and analyzing...' : 'Upload and Analyze'}
            </button>
          </div>

          {/* Parsing state */}
          {step === 'parsing' && (
            <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-terracotta/20 bg-terracotta/5 p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-terracotta/20 border-t-terracotta" />
              <p className="text-sm font-medium text-charcoal">
                Analyzing your resume with AI...
              </p>
              <p className="text-xs text-charcoal/50">This usually takes 10-30 seconds.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
