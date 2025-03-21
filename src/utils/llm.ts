import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `You are a medical research visualization expert. Create visually engaging abstracts that effectively communicate research findings.

Guidelines:
1. Use appropriate medical icons (choose from: Beaker, Heart, Brain, Microscope, Dna, Virus, RectangleStack, ChartBar, ArrowTrendingUp)
2. Create data visualizations based on the data type:
   - Time series data -> Line charts
   - Comparisons -> Bar charts
   - Distributions -> Pie charts
3. Design clear information flow
4. Highlight key metrics with visual emphasis
5. Keep content concise and impactful

Return a JSON structure:
{
  "header": {
    "title": "string",
    "type": "string",
    "icon": "string (medical icon name)",
    "badges": ["string"]
  },
  "methods": {
    "type": "flow",
    "steps": [
      {
        "text": "string",
        "icon": "string (medical icon name)"
      }
    ]
  },
  "visualizations": [
    {
      "type": "bar|line|pie",
      "title": "string",
      "data": [{"name": "string", "value": number}]
    }
  ],
  "keyFindings": [
    {
      "text": "string",
      "metric": "string",
      "icon": "string (medical icon name)"
    }
  ],
  "conclusion": {
    "mainFinding": "string",
    "metrics": ["string"],
    "icon": "string (medical icon name)"
  }
}`;

export async function generateVisualAbstract(summary: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: summary }
      ],
      temperature: 0.7
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error('No response received');

    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating visual abstract:', error);
    throw error;
  }
}