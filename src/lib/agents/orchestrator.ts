import type { UserProfile, LocationResult, LivingDetails } from '@/types';
import { runLocationProfiler } from './location-profiler';
import { runJobScout } from './job-scout';
import { runHousingAnalyst } from './housing-analyst';

const DEFAULT_LIVING_DETAILS: LivingDetails = {
  costOfLivingIndex: 0,
  medianRent1br: 0,
  medianRent2br: 0,
  housingListings: [],
  sampleBudget: {
    rent: 0,
    groceries: 0,
    utilities: 0,
    transportation: 0,
    discretionary: 0,
    total: 0,
    estimatedSalary: 0,
    savingsRate: 0,
  },
};

export async function runAgentPipeline(
  profile: UserProfile,
  _resultId: string
): Promise<LocationResult[]> {
  // Step 1: Run Location Profiler (fatal if it fails)
  const locationResults = await runLocationProfiler(profile);

  // Step 2: For each city, run Job Scout + Housing Analyst in parallel
  const locationPromises = locationResults.map(async (location) => {
    const [jobs, living] = await Promise.all([
      runJobScout(
        profile.parsedResume,
        profile.questionnaire.career,
        location.city,
        location.state
      ).catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        // Log error server-side but continue with empty jobs
        process.stderr.write(
          `[Roost] Job Scout failed for ${location.city}, ${location.state}: ${message}\n`
        );
        return [];
      }),
      runHousingAnalyst(
        location.city,
        location.state,
        profile.questionnaire.practical.maxRent,
        profile.parsedResume.estimatedSalaryRange
      ).catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        // Log error server-side but continue with default living details
        process.stderr.write(
          `[Roost] Housing Analyst failed for ${location.city}, ${location.state}: ${message}\n`
        );
        return DEFAULT_LIVING_DETAILS;
      }),
    ]);

    // Step 3: Merge into complete LocationResult
    const locationResult: LocationResult = {
      locationId: crypto.randomUUID(),
      city: location.city,
      state: location.state,
      overallFitScore: location.overallFitScore,
      highlightTags: location.highlightTags,
      userAction: 'none',
      jobs,
      living,
      lifestyle: location.lifestyle,
      context: location.context,
    };

    return locationResult;
  });

  return Promise.all(locationPromises);
}
