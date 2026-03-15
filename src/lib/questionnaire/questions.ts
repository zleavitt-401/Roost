export type QuestionType = 'select' | 'multiselect' | 'number' | 'text' | 'boolean';

export interface QuestionOption {
  value: string;
  label: string;
}

export interface QuestionConfig {
  id: string;
  label: string;
  helpText?: string;
  type: QuestionType;
  options?: QuestionOption[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
  };
}

export const careerQuestions: QuestionConfig[] = [
  {
    id: 'industryOpenness',
    label: 'How open are you to changing industries?',
    helpText: 'This helps us decide how broadly to search for job matches.',
    type: 'select',
    options: [
      { value: 'same', label: 'Same industry only' },
      { value: 'adjacent', label: 'Adjacent industries' },
      { value: 'open', label: 'Open to most industries' },
      { value: 'completely_open', label: 'Completely open' },
    ],
    validation: { required: true },
  },
  {
    id: 'minSalary',
    label: 'What is the minimum annual salary you would accept?',
    helpText: 'We will filter out roles below this number.',
    type: 'number',
    validation: { required: true, min: 0, max: 500000 },
  },
  {
    id: 'workStyle',
    label: 'What is your preferred work style?',
    type: 'select',
    options: [
      { value: 'remote', label: 'Fully remote' },
      { value: 'hybrid', label: 'Hybrid' },
      { value: 'in_person', label: 'In person' },
      { value: 'no_preference', label: 'No preference' },
    ],
    validation: { required: true },
  },
  {
    id: 'companySizePref',
    label: 'What size company do you prefer?',
    type: 'select',
    options: [
      { value: 'startup', label: 'Startup (under 50)' },
      { value: 'small', label: 'Small (50-200)' },
      { value: 'medium', label: 'Medium (200-1000)' },
      { value: 'large', label: 'Large (1000+)' },
      { value: 'no_preference', label: 'No preference' },
    ],
    validation: { required: true },
  },
  {
    id: 'excludedIndustries',
    label: 'Are there industries you want to exclude?',
    helpText: 'Add any industries you do not want to work in.',
    type: 'multiselect',
  },
];

export const lifestyleQuestions: QuestionConfig[] = [
  {
    id: 'climatePref',
    label: 'What climate do you prefer?',
    type: 'select',
    options: [
      { value: 'warm', label: 'Warm year-round' },
      { value: 'mild', label: 'Mild / four seasons' },
      { value: 'cold_ok', label: 'Cold winters are fine' },
      { value: 'no_preference', label: 'No preference' },
    ],
    validation: { required: true },
  },
  {
    id: 'humidityTolerance',
    label: 'How well do you handle humidity?',
    type: 'select',
    options: [
      { value: 'low', label: 'Prefer dry climates' },
      { value: 'medium', label: 'Some humidity is fine' },
      { value: 'high', label: 'Humidity does not bother me' },
    ],
    validation: { required: true },
  },
  {
    id: 'hobbies',
    label: 'What hobbies or activities matter most to you?',
    helpText: 'Add hobbies you want access to in your new city.',
    type: 'multiselect',
  },
  {
    id: 'walkabilityImportance',
    label: 'How important is walkability to you?',
    type: 'select',
    options: [
      { value: 'essential', label: 'Essential — I want to walk everywhere' },
      { value: 'preferred', label: 'Preferred but not a dealbreaker' },
      { value: 'not_important', label: 'Not important' },
    ],
    validation: { required: true },
  },
  {
    id: 'foodPriorities',
    label: 'What food scene aspects matter to you?',
    helpText: 'Examples: diverse cuisines, farm-to-table, vegan options, food trucks.',
    type: 'multiselect',
  },
  {
    id: 'nightlifeImportance',
    label: 'How important is nightlife and entertainment?',
    type: 'select',
    options: [
      { value: 'essential', label: 'Essential — active nightlife matters' },
      { value: 'preferred', label: 'Nice to have' },
      { value: 'not_important', label: 'Not important' },
    ],
    validation: { required: true },
  },
];

export const practicalQuestions: QuestionConfig[] = [
  {
    id: 'maxRent',
    label: 'What is the maximum monthly rent you can afford?',
    helpText: 'This helps us filter housing options in each city.',
    type: 'number',
    validation: { required: true, min: 0, max: 10000 },
  },
  {
    id: 'hasPartner',
    label: 'Are you relocating with a partner?',
    type: 'boolean',
  },
  {
    id: 'partnerJobNeeds',
    label: 'What kind of work does your partner do or need?',
    helpText: 'We will consider partner employment opportunities in each city.',
    type: 'text',
  },
  {
    id: 'proximityTo',
    label: 'Are there places you need to be close to?',
    helpText: 'Examples: family in Chicago, aging parents in Florida.',
    type: 'multiselect',
  },
  {
    id: 'moveTimeline',
    label: 'When are you looking to move?',
    type: 'select',
    options: [
      { value: 'asap', label: 'As soon as possible' },
      { value: '3_months', label: 'Within 3 months' },
      { value: '6_months', label: 'Within 6 months' },
      { value: '1_year', label: 'Within a year' },
      { value: 'flexible', label: 'Flexible / just exploring' },
    ],
    validation: { required: true },
  },
  {
    id: 'petFriendly',
    label: 'Do you need pet-friendly housing?',
    type: 'boolean',
  },
];

export const valuesQuestions: QuestionConfig[] = [
  {
    id: 'politicalLeaning',
    label: 'What political environment do you prefer?',
    helpText: 'This is used to match community fit, not to judge your views.',
    type: 'select',
    options: [
      { value: 'progressive', label: 'Progressive' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'conservative', label: 'Conservative' },
      { value: 'no_preference', label: 'No preference' },
    ],
    validation: { required: true },
  },
  {
    id: 'gunLawPref',
    label: 'What is your preference on local gun laws?',
    type: 'select',
    options: [
      { value: 'strict', label: 'Prefer stricter regulations' },
      { value: 'moderate', label: 'Moderate regulations' },
      { value: 'permissive', label: 'Prefer fewer restrictions' },
      { value: 'no_preference', label: 'No preference' },
    ],
    validation: { required: true },
  },
  {
    id: 'diversityImportance',
    label: 'How important is community diversity to you?',
    type: 'select',
    options: [
      { value: 'essential', label: 'Essential' },
      { value: 'preferred', label: 'Preferred' },
      { value: 'not_important', label: 'Not important' },
    ],
    validation: { required: true },
  },
  {
    id: 'settingPref',
    label: 'What type of setting do you prefer?',
    type: 'select',
    options: [
      { value: 'urban', label: 'Urban / city center' },
      { value: 'suburban', label: 'Suburban' },
      { value: 'rural', label: 'Rural' },
      { value: 'no_preference', label: 'No preference' },
    ],
    validation: { required: true },
  },
];
