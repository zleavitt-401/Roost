import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile, ParsedResume, QuestionnaireAnswers } from '@/types';

interface AssembleResult {
  success: boolean;
  error?: string;
}

export async function assembleAndTrigger(
  userId: string,
  email: string,
  resumeUrl: string,
  coverLetterUrl: string | undefined,
  parsedResume: ParsedResume,
  questionnaire: QuestionnaireAnswers,
  idToken: string
): Promise<AssembleResult> {
  const profile: UserProfile = {
    userId,
    email,
    resumeUrl,
    ...(coverLetterUrl ? { coverLetterUrl } : {}),
    parsedResume,
    questionnaire,
    profileAssembledAt: Timestamp.now(),
    agentStatus: 'pending',
  };

  try {
    await setDoc(doc(db, 'users', userId), profile);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Failed to save profile: ${message}` };
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const response = await fetch(`${appUrl}/api/agents/trigger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ userId }),
    });

    if (response.status === 409) {
      // Already triggered — not an error, just proceed
      return { success: true };
    }

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: 'Unknown error' }));
      return { success: false, error: (data as { error?: string }).error || 'Failed to trigger agents' };
    }

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Failed to trigger agents: ${message}` };
  }
}
