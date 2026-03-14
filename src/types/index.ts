// ─── Core User & Profile ─────────────────────────────────────────────────────

export interface UserProfile {
  userId: string;
  email: string;
  createdAt: Date;
  resumeUrl?: string;
  parsedResume?: ParsedResume;
  questionnaireAnswers?: QuestionnaireAnswers;
  status: 'incomplete' | 'processing' | 'complete' | 'error';
}

export interface ParsedResume {
  fullName: string;
  currentTitle: string;
  yearsOfExperience: number;
  skills: string[];
  education: EducationEntry[];
  workHistory: WorkEntry[];
  targetRoles: string[];
  industries: string[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  graduationYear?: number;
}

export interface WorkEntry {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  description: string;
}

// ─── Questionnaire ───────────────────────────────────────────────────────────

export interface QuestionnaireAnswers {
  // Career preferences
  remotePreference: 'fully-remote' | 'hybrid' | 'in-office' | 'no-preference';
  salaryMin: number;
  salaryTarget: number;
  careerPriorities: string[];

  // Lifestyle preferences
  climatePreference: string[];
  urbanDensity: 'urban' | 'suburban' | 'rural' | 'no-preference';
  outdoorActivities: string[];
  communityValues: string[];

  // Practical constraints
  budgetMax: number;
  hasCar: boolean;
  hasPets: boolean;
  hasChildren: boolean;
  currentCity: string;
  openToRelocate: boolean;

  // Free text
  dealbreakers?: string;
  additionalContext?: string;
}

// ─── Agent Results ───────────────────────────────────────────────────────────

export interface AgentResults {
  resultId: string;
  userId: string;
  createdAt: Date;
  status: 'pending' | 'processing' | 'complete' | 'error';
  locations: LocationResult[];
  errorMessage?: string;
}

export interface LocationResult {
  locationId: string;
  city: string;
  state: string;
  overallScore: number;
  summary: string;
  jobMatches: JobMatch[];
  living: LivingDetails;
  housing: HousingListing[];
  budget: MonthlyBudget;
  lifestyle: LifestyleDetails;
  context: ContextDetails;
}

// ─── Job Scout ───────────────────────────────────────────────────────────────

export interface JobMatch {
  jobId: string;
  title: string;
  company: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  remote: boolean;
  url: string;
  matchScore: number;
  matchReasons: string[];
  postedDate?: string;
}

// ─── Housing & Budget Analyst ─────────────────────────────────────────────────

export interface HousingListing {
  listingId: string;
  address: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  monthlyRent: number;
  squareFeet?: number;
  url?: string;
  highlights: string[];
}

export interface MonthlyBudget {
  rent: number;
  utilities: number;
  groceries: number;
  transportation: number;
  entertainment: number;
  healthcare: number;
  miscellaneous: number;
  total: number;
  salaryNeeded: number;
  notes: string;
}

// ─── Location Profiler ────────────────────────────────────────────────────────

export interface LivingDetails {
  costOfLivingIndex: number;
  walkScore?: number;
  transitScore?: number;
  bikeScore?: number;
  safetyRating?: number;
  climate: string;
  population: number;
  growthRate?: number;
}

export interface LifestyleDetails {
  outdoorActivities: string[];
  culturalHighlights: string[];
  neighborhoods: string[];
  topRestaurants: string[];
  communityVibe: string;
  diversity?: string;
}

export interface ContextDetails {
  whyThisCity: string;
  tradeoffs: string[];
  localInsiderTip: string;
  bestFitPersona: string;
}
