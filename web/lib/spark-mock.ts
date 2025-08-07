/**
 * Mock implementation of Spark API for Next.js compatibility
 * Provides fallback functionality for spark.kv, spark.llm, and spark.llmPrompt
 */

// Simple key-value store using localStorage
class MockKV {
  async keys(): Promise<string[]> {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('therapy-engage-')) {
        keys.push(key.replace('therapy-engage-', ''))
      }
    }
    return keys
  }

  async get<T>(key: string): Promise<T | undefined> {
    try {
      const item = localStorage.getItem(`therapy-engage-${key}`)
      return item ? JSON.parse(item) : undefined
    } catch {
      return undefined
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(`therapy-engage-${key}`, JSON.stringify(value))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }

  async delete(key: string): Promise<void> {
    localStorage.removeItem(`therapy-engage-${key}`)
  }
}

// Mock LLM functions (returns placeholder responses for development)
function mockLlmPrompt(strings: TemplateStringsArray, ...values: any[]): string {
  return strings.reduce((result, string, i) => {
    return result + string + (values[i] || '')
  }, '')
}

async function mockLlm(prompt: string, model?: string, jsonMode?: boolean): Promise<string> {
  // For development, return mock responses based on prompt content
  if (prompt.includes('clinical session insights')) {
    return jsonMode ? JSON.stringify({
      mood: 'stable',
      engagement: 'high',
      riskFactors: ['none identified'],
      recommendations: ['Continue current approach']
    }) : 'Patient shows positive engagement with therapeutic process.'
  }

  if (prompt.includes('translate') || prompt.includes('translation')) {
    return 'Translated content (mock response for development)'
  }

  return 'Mock AI response for development environment'
}

// Global spark object for compatibility
declare global {
  interface Window {
    spark: {
      kv: MockKV
      llm: typeof mockLlm
      llmPrompt: typeof mockLlmPrompt
    }
  }
}

// Initialize mock spark API
if (typeof window !== 'undefined' && !window.spark) {
  window.spark = {
    kv: new MockKV(),
    llm: mockLlm,
    llmPrompt: mockLlmPrompt
  }
}

export const spark = {
  kv: new MockKV(),
  llm: mockLlm,
  llmPrompt: mockLlmPrompt
}
