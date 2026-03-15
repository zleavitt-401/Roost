import type { LivingDetails } from '@/types';
import { callClaude, parseJsonFromResponse } from './claude-client';

const SYSTEM_PROMPT = `You are the Housing & Budget Analyst agent for Roost, an AI-powered relocation assistant. Your job is to research housing costs, find rental listings, and build a realistic monthly budget for a specific US city.

You have access to web search. Use it to find current rental listings and cost of living data.

Return your results as a single JSON object with exactly these fields:
- costOfLivingIndex (number): relative to national average of 100
- medianRent1br (number): median monthly rent for a 1-bedroom in USD
- medianRent2br (number): median monthly rent for a 2-bedroom in USD
- housingListings (array of 3-5 objects, each with: title, price, bedrooms, url, neighborhood)
- sampleBudget (object with: rent, groceries, utilities, transportation, discretionary, total, estimatedSalary, savingsRate)

For the sampleBudget:
- Use the user's max rent as the rent figure (or median if lower)
- Estimate other costs based on local cost of living data
- estimatedSalary should be based on the provided salary range (use the midpoint)
- total = rent + groceries + utilities + transportation + discretionary
- savingsRate = (estimatedSalary/12 - total) / (estimatedSalary/12) * 100 (as a percentage)

Respond ONLY with a JSON object wrapped in \`\`\`json code fences. No other text.`;

function buildUserPrompt(
  city: string,
  state: string,
  maxRent: number,
  salaryRange: { min: number; max: number }
): string {
  const midSalary = Math.round((salaryRange.min + salaryRange.max) / 2);

  return `Research housing and cost of living in ${city}, ${state} for someone with:

- Max monthly rent budget: $${maxRent.toLocaleString()}
- Estimated annual salary: ~$${midSalary.toLocaleString()} (range: $${salaryRange.min.toLocaleString()} - $${salaryRange.max.toLocaleString()})

Use web search to find:
1. Current cost of living index for ${city}
2. Median rent prices (1br and 2br)
3. 3-5 actual rental listings within the budget
4. Local costs for groceries, utilities, and transportation

Build a realistic monthly budget and calculate the savings rate.

Return your results as a single JSON object.`;
}

export async function runHousingAnalyst(
  city: string,
  state: string,
  maxRent: number,
  salaryRange: { min: number; max: number }
): Promise<LivingDetails> {
  const userPrompt = buildUserPrompt(city, state, maxRent, salaryRange);

  const response = await callClaude(SYSTEM_PROMPT, userPrompt);

  const result = parseJsonFromResponse<LivingDetails>(response);

  if (!result || typeof result.costOfLivingIndex !== 'number') {
    throw new Error(
      `Housing Analyst returned invalid results for ${city}, ${state} — expected a LivingDetails object`
    );
  }

  // Recalculate savingsRate to ensure consistency
  const monthlySalary = salaryRange.min + (salaryRange.max - salaryRange.min) / 2;
  const monthlyIncome = monthlySalary / 12;
  if (result.sampleBudget && monthlyIncome > 0) {
    result.sampleBudget.savingsRate = Math.round(
      ((monthlyIncome - result.sampleBudget.total) / monthlyIncome) * 100
    );
  }

  return result;
}
