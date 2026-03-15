import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function callClaude(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Missing ANTHROPIC_API_KEY environment variable');
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    tools: [
      {
        type: 'web_search_20250305',
        name: 'web_search',
        max_uses: 5,
      },
    ],
    messages: [{ role: 'user', content: userPrompt }],
  });

  const textBlocks = response.content.filter(
    (block): block is Anthropic.TextBlock => block.type === 'text'
  );

  if (textBlocks.length === 0) {
    throw new Error('Claude returned no text content in response');
  }

  return textBlocks.map((block) => block.text).join('\n');
}

export function parseJsonFromResponse<T>(text: string): T {
  // Try to extract JSON from markdown code fence first
  const fenceMatch = text.match(/```json\s*([\s\S]*?)```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim()) as T;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to parse JSON from code fence: ${message}`);
    }
  }

  // Try to find a raw JSON array or object
  const jsonMatch = text.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1].trim()) as T;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to parse raw JSON from response: ${message}`);
    }
  }

  throw new Error(
    'No JSON found in Claude response — expected a JSON array or object'
  );
}
