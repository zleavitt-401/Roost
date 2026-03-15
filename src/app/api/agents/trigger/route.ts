import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { runAgentPipeline } from '@/lib/agents/orchestrator';
import { sendNotificationEmail } from '@/lib/email/send-notification';
import type {
  AgentTriggerRequest,
  AgentTriggerResponse,
  UserProfile,
} from '@/types';

export async function POST(request: NextRequest) {
  // Verify Firebase Auth token
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, resultId: '', message: 'Missing authorization token' },
      { status: 401 }
    );
  }

  const token = authHeader.slice(7);
  let decodedToken: { uid: string };
  try {
    decodedToken = await getAdminAuth().verifyIdToken(token);
  } catch {
    return NextResponse.json(
      { success: false, resultId: '', message: 'Invalid authorization token' },
      { status: 401 }
    );
  }

  // Parse request body
  let body: AgentTriggerRequest;
  try {
    body = (await request.json()) as AgentTriggerRequest;
  } catch {
    return NextResponse.json(
      { success: false, resultId: '', message: 'Invalid request body' },
      { status: 400 }
    );
  }

  // Verify userId matches token
  if (body.userId !== decodedToken.uid) {
    return NextResponse.json(
      { success: false, resultId: '', message: 'User ID does not match authenticated user' },
      { status: 403 }
    );
  }

  const { userId } = body;

  // Read user profile from Firestore
  const userDocRef = getAdminDb().collection('users').doc(userId);
  const userDoc = await userDocRef.get();

  if (!userDoc.exists) {
    return NextResponse.json(
      { success: false, resultId: '', message: 'User profile not found' },
      { status: 404 }
    );
  }

  const profile = userDoc.data() as UserProfile;

  // Check if agents are already running or complete
  if (profile.agentStatus === 'processing' || profile.agentStatus === 'complete') {
    // Find existing result doc
    const resultsSnapshot = await getAdminDb()
      .collection('users')
      .doc(userId)
      .collection('results')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    const existingResultId = resultsSnapshot.empty
      ? ''
      : resultsSnapshot.docs[0].id;

    return NextResponse.json(
      {
        success: false,
        resultId: existingResultId,
        message:
          profile.agentStatus === 'processing'
            ? 'Agents are already processing your profile'
            : 'Results are already available',
      } satisfies AgentTriggerResponse,
      { status: 409 }
    );
  }

  // Create new result document
  const resultDocRef = getAdminDb()
    .collection('users')
    .doc(userId)
    .collection('results')
    .doc();
  const resultId = resultDocRef.id;

  await resultDocRef.set({
    resultId,
    userId,
    createdAt: FieldValue.serverTimestamp(),
    status: 'processing',
    locations: [],
  });

  // Update user status to processing
  await userDocRef.update({ agentStatus: 'processing' });

  // Run agent pipeline asynchronously after the response is sent
  after(async () => {
    try {
      const locations = await runAgentPipeline(profile, resultId);

      // Write results to Firestore
      await resultDocRef.update({
        locations,
        status: 'complete',
      });

      // Update user status
      await userDocRef.update({ agentStatus: 'complete' });

      // Send notification email
      await sendNotificationEmail(
        profile.email,
        profile.email.split('@')[0],
        locations.length
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      process.stderr.write(
        `[Roost] Agent pipeline failed for user ${userId}: ${message}\n`
      );

      // Update statuses to error
      await resultDocRef.update({ status: 'error' }).catch(() => {
        // Swallow nested error — already in error handling
      });
      await userDocRef.update({ agentStatus: 'error' }).catch(() => {
        // Swallow nested error — already in error handling
      });
    }
  });

  const response: AgentTriggerResponse = {
    success: true,
    resultId,
    message: 'Agent processing started',
  };

  return NextResponse.json(response, { status: 200 });
}
