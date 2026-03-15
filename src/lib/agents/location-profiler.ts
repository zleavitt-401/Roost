import type { UserProfile, LifestyleDetails, ContextDetails } from '@/types';
import { callClaude, parseJsonFromResponse } from './claude-client';

export interface LocationProfileResult {
  city: string;
  state: string;
  overallFitScore: number;
  highlightTags: string[];
  lifestyle: LifestyleDetails;
  context: ContextDetails;
}

interface RawLocationProfileResult {
  city: string;
  state: string;
  overallFitScore: number;
  highlightTags: string[];
  walkScore: number;
  transitScore: number;
  nearbyHobbies: { name: string; type: string; distance: string }[];
  foodScene: string;
  demographics: string;
  recentNews: { headline: string; source: string; url: string; date: string }[];
  politicalClimate: string;
  weatherOverview: string;
  crimeIndex: number;
}

const SYSTEM_PROMPT = `You are the Location Profiler agent for Roost, an AI-powered relocation assistant. Your job is to identify 3-5 US cities that best match a user's lifestyle preferences, values, and practical needs.

You have access to web search to find current, accurate data about cities. Use it to verify cost of living, walkability scores, political climate, recent news, crime statistics, and other relevant data points.

Return your results as a JSON array. Each element must have exactly these fields:
- city (string): city name
- state (string): two-letter state abbreviation
- overallFitScore (number): 0-100 score reflecting how well this city matches the user
- highlightTags (string[]): 3-5 short tags summarizing why this city fits (e.g., "Tech hub", "Low cost of living")
- walkScore (number): 0-100 walkability score
- transitScore (number): 0-100 transit score
- nearbyHobbies (array of {name, type, distance}): 3-5 relevant hobby/activity venues
- foodScene (string): 2-3 sentence description of the food scene
- demographics (string): brief demographic overview
- recentNews (array of {headline, source, url, date}): 2-3 recent relevant news items
- politicalClimate (string): brief political landscape description
- weatherOverview (string): climate and weather summary
- crimeIndex (number): crime index (national average = 100, higher = more crime)

Respond ONLY with a JSON array wrapped in \`\`\`json code fences. No other text.`;

function buildUserPrompt(profile: UserProfile): string {
  const { questionnaire } = profile;
  const { lifestyle, practical, values, career } = questionnaire;

  return `Find 3-5 US cities that best match this person's preferences:

**Career Context:**
- Industries: ${profile.parsedResume.industries.join(', ') || 'Not specified'}
- Job titles: ${profile.parsedResume.jobTitles.join(', ') || 'Not specified'}
- Salary range: $${career.minSalary.toLocaleString()}+
- Work style: ${career.workStyle}

**Lifestyle Preferences:**
- Climate: ${lifestyle.climatePref}
- Humidity tolerance: ${lifestyle.humidityTolerance}
- Walkability: ${lifestyle.walkabilityImportance}
- Food priorities: ${lifestyle.foodPriorities.join(', ') || 'None specified'}
- Nightlife importance: ${lifestyle.nightlifeImportance}
- Hobbies: ${lifestyle.hobbies.join(', ') || 'None specified'}

**Practical Requirements:**
- Max rent: $${practical.maxRent.toLocaleString()}/month
- Has partner: ${practical.hasPartner ? 'Yes' : 'No'}${practical.partnerJobNeeds ? ` (partner needs: ${practical.partnerJobNeeds})` : ''}
- Proximity needs: ${practical.proximityTo.join(', ') || 'None specified'}
- Move timeline: ${practical.moveTimeline}
- Pet friendly: ${practical.petFriendly ? 'Yes' : 'No'}

**Values:**
- Political leaning: ${values.politicalLeaning}
- Gun law preference: ${values.gunLawPref}
- Diversity importance: ${values.diversityImportance}
- Setting preference: ${values.settingPref}

Use web search to find current data. Return exactly 3-5 cities as a JSON array.`;
}

function transformResult(raw: RawLocationProfileResult): LocationProfileResult {
  return {
    city: raw.city,
    state: raw.state,
    overallFitScore: raw.overallFitScore,
    highlightTags: raw.highlightTags,
    lifestyle: {
      walkScore: raw.walkScore,
      transitScore: raw.transitScore,
      nearbyHobbies: raw.nearbyHobbies,
      foodScene: raw.foodScene,
      demographics: raw.demographics,
    },
    context: {
      recentNews: raw.recentNews,
      politicalClimate: raw.politicalClimate,
      weatherOverview: raw.weatherOverview,
      crimeIndex: raw.crimeIndex,
    },
  };
}

export async function runLocationProfiler(
  profile: UserProfile
): Promise<LocationProfileResult[]> {
  const userPrompt = buildUserPrompt(profile);

  const response = await callClaude(SYSTEM_PROMPT, userPrompt);

  const rawResults = parseJsonFromResponse<RawLocationProfileResult[]>(response);

  if (!Array.isArray(rawResults) || rawResults.length === 0) {
    throw new Error(
      'Location Profiler returned invalid results — expected a non-empty array of cities'
    );
  }

  return rawResults.map(transformResult);
}
