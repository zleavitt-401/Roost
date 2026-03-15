'use client';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { LocationResult, AgentResults } from '@/types';

type UserAction = LocationResult['userAction'];

export async function updateLocationAction(
  userId: string,
  resultId: string,
  locationId: string,
  action: UserAction
): Promise<void> {
  const resultRef = doc(db, 'users', userId, 'results', resultId);

  const snapshot = await getDoc(resultRef);
  if (!snapshot.exists()) {
    throw new Error(`Failed to update location action: result ${resultId} not found`);
  }

  const data = snapshot.data() as AgentResults;
  const updatedLocations = data.locations.map((loc) =>
    loc.locationId === locationId ? { ...loc, userAction: action } : loc
  );

  await updateDoc(resultRef, { locations: updatedLocations });
}
