import { Timestamp } from 'firebase/firestore';

// ─── Core User & Profile ─────────────────────────────────────────────────────

export interface UserProfile {
  userId: string;
  email: string;
  resumeUrl: string;
  coverLetterUrl?: string;
  parsedResume: ParsedResume;
  questionnaire: QuestionnaireAnswers;
  profileAssembledAt: Timestamp;
  agentStatus: 'pending' | 'processing' | 'complete' | 'error';
}

export interface ParsedResume {
  jobTitles: string[];
  skills: string[];
  yearsExperience: number;
  education: { institution: string; degree: string; year: number }[];
  estimatedSalaryRange: { min: number; max: number };
  industries: string[];
  summary: string;
}

// ─── Questionnaire ───────────────────────────────────────────────────────────

export interface QuestionnaireAnswers {
  career: {
    industryOpenness: 'same' | 'adjacent' | 'open' | 'completely_open';
    minSalary: number;
    workStyle: 'remote' | 'hybrid' | 'in_person' | 'no_preference';
    companySizePref: 'startup' | 'small' | 'medium' | 'large' | 'no_preference';
    excludedIndustries: string[];
  };
  lifestyle: {
    climatePref: 'warm' | 'mild' | 'cold_ok' | 'no_preference';
    humidityTolerance: 'low' | 'medium' | 'high';
    hobbies: string[];
    walkabilityImportance: 'essential' | 'preferred' | 'not_important';
    foodPriorities: string[];
    nightlifeImportance: 'essential' | 'preferred' | 'not_important';
  };
  practical: {
    maxRent: number;
    hasPartner: boolean;
    partnerJobNeeds?: string;
    proximityTo: string[];
    moveTimeline: 'asap' | '3_months' | '6_months' | '1_year' | 'flexible';
    petFriendly: boolean;
  };
  values: {
    politicalLeaning: 'progressive' | 'moderate' | 'conservative' | 'no_preference';
    gunLawPref: 'strict' | 'moderate' | 'permissive' | 'no_preference';
    diversityImportance: 'essential' | 'preferred' | 'not_important';
    settingPref: 'urban' | 'suburban' | 'rural' | 'no_preference';
  };
}

// ─── Agent Results ───────────────────────────────────────────────────────────

export interface AgentResults {
  resultId: string;
  userId: string;
  createdAt: Timestamp;
  status: 'processing' | 'complete' | 'error';
  locations: LocationResult[];
}

export interface LocationResult {
  locationId: string;
  city: string;
  state: string;
  overallFitScore: number;
  highlightTags: string[];
  userAction: 'none' | 'saved' | 'dismissed';
  jobs: JobMatch[];
  living: LivingDetails;
  lifestyle: LifestyleDetails;
  context: ContextDetails;
}

// ─── Job Scout ───────────────────────────────────────────────────────────────

export interface JobMatch {
  title: string;
  company: string;
  salaryRange: { min: number; max: number };
  fitScore: number;
  fitExplanation: string;
  applicationUrl: string;
  workStyle: 'remote' | 'hybrid' | 'in_person';
}

// ─── Housing & Budget Analyst ─────────────────────────────────────────────────

export interface LivingDetails {
  costOfLivingIndex: number;
  medianRent1br: number;
  medianRent2br: number;
  housingListings: HousingListing[];
  sampleBudget: MonthlyBudget;
}

export interface HousingListing {
  title: string;
  price: number;
  bedrooms: number;
  url: string;
  neighborhood: string;
}

export interface MonthlyBudget {
  rent: number;
  groceries: number;
  utilities: number;
  transportation: number;
  discretionary: number;
  total: number;
  estimatedSalary: number;
  savingsRate: number;
}

// ─── Location Profiler ────────────────────────────────────────────────────────

export interface LifestyleDetails {
  walkScore: number;
  transitScore: number;
  nearbyHobbies: { name: string; type: string; distance: string }[];
  foodScene: string;
  demographics: string;
}

export interface ContextDetails {
  recentNews: { headline: string; source: string; url: string; date: string }[];
  politicalClimate: string;
  weatherOverview: string;
  crimeIndex: number;
}

// ─── API Contracts ────────────────────────────────────────────────────────────

export interface AgentTriggerRequest {
  userId: string;
}

export interface AgentTriggerResponse {
  success: boolean;
  resultId: string;
  message: string;
}
