import { NextResponse, type NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getAdminAuth, getAdminStorage } from '@/lib/firebase-admin';
import type { ParsedResume } from '@/types';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

async function extractTextFromFile(buffer: Buffer, contentType: string): Promise<string> {
  if (contentType === 'application/pdf') {
    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const result = await parser.getText();
    return result.text;
  }

  if (contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error(`Unsupported file type: ${contentType}`);
}

function validateParsedResume(data: unknown): data is ParsedResume {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;

  return (
    Array.isArray(obj.jobTitles) &&
    Array.isArray(obj.skills) &&
    typeof obj.yearsExperience === 'number' &&
    Array.isArray(obj.education) &&
    typeof obj.estimatedSalaryRange === 'object' &&
    obj.estimatedSalaryRange !== null &&
    Array.isArray(obj.industries) &&
    typeof obj.summary === 'string'
  );
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
  }

  const token = authHeader.slice(7);
  let uid: string;
  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: 'Invalid authorization token' }, { status: 401 });
  }

  let body: { resumeUrl?: string; coverLetterUrl?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { resumeUrl } = body;
  if (!resumeUrl || typeof resumeUrl !== 'string') {
    return NextResponse.json({ error: 'resumeUrl is required' }, { status: 400 });
  }

  // Verify the file path belongs to this user
  if (!resumeUrl.includes(`resumes/${uid}/`)) {
    return NextResponse.json({ error: 'Access denied to this file' }, { status: 403 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    // Download file from Firebase Storage
    const bucket = getAdminStorage().bucket();
    const file = bucket.file(resumeUrl);

    const [metadata] = await file.getMetadata();
    const contentType = (metadata.contentType as string) || '';

    if (!ALLOWED_MIME_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: 'Unsupported file format. Please upload a PDF or DOCX file.' },
        { status: 400 }
      );
    }

    const [fileBuffer] = await file.download();
    const resumeText = await extractTextFromFile(fileBuffer, contentType);

    if (!resumeText.trim()) {
      return NextResponse.json(
        { error: 'Could not extract text from the uploaded file. Please ensure the file is not empty or image-only.' },
        { status: 400 }
      );
    }

    // Call Claude API for structured extraction
    const anthropic = new Anthropic({ apiKey: anthropicKey });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `You are analyzing a resume to extract structured information. Respond ONLY with a valid JSON object matching this exact schema — no markdown, no explanation, just the JSON:

{
  "jobTitles": string[],       // Job titles the person has held or is qualified for
  "skills": string[],          // Technical and soft skills mentioned
  "yearsExperience": number,   // Total estimated years of professional experience
  "education": [               // Educational background
    { "institution": string, "degree": string, "year": number }
  ],
  "estimatedSalaryRange": {    // Estimated annual salary range in USD based on their experience
    "min": number,
    "max": number
  },
  "industries": string[],      // Industries they have worked in or are suited for
  "summary": string            // 2-3 sentence professional summary
}

Important:
- For yearsExperience, calculate from the earliest work date to the present (2026).
- For estimatedSalaryRange, base it on their most senior role, skills, and industry.
- Include ALL job titles found, not just the most recent.
- Include ALL relevant skills, both technical and interpersonal.
- If education year is unknown, estimate based on context or use 0.

Resume text:
---
${resumeText.slice(0, 15000)}
---`,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract JSON from the response (handle possible markdown wrapping)
    let jsonString = responseText.trim();
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'Failed to parse resume data from AI response' },
        { status: 500 }
      );
    }
    jsonString = jsonMatch[0];

    let parsedResume: unknown;
    try {
      parsedResume = JSON.parse(jsonString);
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse resume data from AI response' },
        { status: 500 }
      );
    }

    if (!validateParsedResume(parsedResume)) {
      return NextResponse.json(
        { error: 'AI response did not match expected resume format' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, parsedResume });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to parse resume: ${message}` },
      { status: 500 }
    );
  }
}
