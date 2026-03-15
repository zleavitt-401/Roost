import type { ParsedResume, QuestionnaireAnswers, JobMatch } from '@/types';
import { callClaude, parseJsonFromResponse } from './claude-client';

const SYSTEM_PROMPT = `You are the Job Scout agent for Roost, an AI-powered relocation assistant. Your job is to find 3-5 real, current job postings in a specific US city that match the user's resume and career preferences.

You have access to web search. Use it to find actual job listings on job boards and company career pages.

Return your results as a JSON array. Each element must have exactly these fields:
- title (string): job title
- company (string): company name
- salaryRange (object with min and max as numbers): estimated annual salary range in USD
- fitScore (number): 0-100 score reflecting how well this job matches the user
- fitExplanation (string): 1-2 sentence explanation of why this job is a good match
- applicationUrl (string): URL to apply or view the job posting
- workStyle (string): one of "remote", "hybrid", or "in_person"

If you cannot find enough real listings, fill in with realistic listings based on market data for that area, but always prefer real listings.

Respond ONLY with a JSON array wrapped in \`\`\`json code fences. No other text.`;

function buildUserPrompt(
  resume: ParsedResume,
  careerPrefs: QuestionnaireAnswers['career'],
  city: string,
  state: string
): string {
  return `Find 3-5 current job postings in ${city}, ${state} for this candidate:

**Resume Summary:**
- Job titles: ${resume.jobTitles.join(', ') || 'Not specified'}
- Skills: ${resume.skills.join(', ') || 'Not specified'}
- Industries: ${resume.industries.join(', ') || 'Not specified'}
- Years of experience: ${resume.yearsExperience}
- Education: ${resume.education.map((e) => `${e.degree} from ${e.institution} (${e.year})`).join('; ') || 'Not specified'}
- Estimated salary range: $${resume.estimatedSalaryRange.min.toLocaleString()} - $${resume.estimatedSalaryRange.max.toLocaleString()}

**Career Preferences:**
- Minimum salary: $${careerPrefs.minSalary.toLocaleString()}
- Work style: ${careerPrefs.workStyle}
- Company size: ${careerPrefs.companySizePref}
- Industry openness: ${careerPrefs.industryOpenness}
- Excluded industries: ${careerPrefs.excludedIndustries.join(', ') || 'None'}

Use web search to find real, current job postings. Return 3-5 results as a JSON array.`;
}

export async function runJobScout(
  resume: ParsedResume,
  careerPrefs: QuestionnaireAnswers['career'],
  city: string,
  state: string
): Promise<JobMatch[]> {
  const userPrompt = buildUserPrompt(resume, careerPrefs, city, state);

  const response = await callClaude(SYSTEM_PROMPT, userPrompt);

  const results = parseJsonFromResponse<JobMatch[]>(response);

  if (!Array.isArray(results)) {
    throw new Error(
      `Job Scout returned invalid results for ${city}, ${state} — expected an array`
    );
  }

  return results;
}
