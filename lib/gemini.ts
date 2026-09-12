// Gemini / Google Generative Language API wrapper

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  console.warn('[Gemini] GEMINI_API_KEY environment variable is not set')
}

const GEMINI_ENDPOINT = (apiKey: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`

export interface SupportReplyResult {
  response: string
  category: string | null
  urgency: 'low' | 'medium' | 'high' | null
}

async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const url = GEMINI_ENDPOINT(GEMINI_API_KEY)
  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errorBody = await res.text()
    console.error(`[Gemini API] Request failed with status ${res.status}:`, errorBody)
    throw new Error(`Gemini API error: ${res.status} ${errorBody}`)
  }

  const json = await res.json()
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    console.error('[Gemini API] Unexpected response format:', JSON.stringify(json))
    throw new Error('No content returned from Gemini API')
  }

  return text.trim()
}

function tryParseJson(text: string): SupportReplyResult | null {
  try {
    const cleaned = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()
    const parsed = JSON.parse(cleaned)
    if (parsed && typeof parsed.response === 'string') {
      return {
        response: parsed.response,
        category: typeof parsed.category === 'string' ? parsed.category : null,
        urgency: ['low', 'medium', 'high'].includes(parsed.urgency?.toLowerCase())
          ? parsed.urgency.toLowerCase()
          : null,
      }
    }
  } catch (err) {
    const match = text.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        const parsed = JSON.parse(match[0])
        if (parsed && typeof parsed.response === 'string') {
          return {
            response: parsed.response,
            category: typeof parsed.category === 'string' ? parsed.category : null,
            urgency: ['low', 'medium', 'high'].includes(parsed.urgency?.toLowerCase())
              ? parsed.urgency.toLowerCase()
              : null,
          }
        }
      } catch {
        // parsing failed
      }
    }
    console.warn('[Gemini] Failed to parse JSON response:', text)
  }
  return null
}

export async function generateSupportReply(message: string): Promise<SupportReplyResult> {
  const systemPrompt = `You are a helpful customer support agent. Given the user's support message, respond professionally, helpfully, and concisely. Return a JSON object with keys: "response" (string), "category" (short string, e.g. "Billing", "Technical", "Account", "General"), "urgency" (one of "low", "medium", "high"). Respond ONLY with valid JSON.`
  const prompt = `${systemPrompt}\n\nUser message:\n${message}\n\nRespond in JSON.`

  let lastError: any = null
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`[Gemini] Calling Gemini API (attempt ${attempt}/2)...`)
      const rawText = await callGemini(prompt)
      const parsed = tryParseJson(rawText)
      if (parsed) {
        console.log(`[Gemini] Successfully generated reply. Category: ${parsed.category}, Urgency: ${parsed.urgency}`)
        return parsed
      }
      throw new Error(`Failed to extract valid JSON response: ${rawText}`)
    } catch (err: any) {
      lastError = err
      console.error(`[Gemini] Attempt ${attempt} failed:`, err.message || err)
    }
  }

  throw lastError || new Error('Failed to generate support reply')
}

