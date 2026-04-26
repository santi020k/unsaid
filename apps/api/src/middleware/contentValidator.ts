import { createMiddleware } from 'hono/factory'

import type { Bindings } from '../types.js'

interface LlamaInput {
  messages: { role: string, content: string }[]
  max_tokens: number
}

interface LlamaOutput {
  response?: string
}

type RunLlama = (model: string, input: LlamaInput) => Promise<LlamaOutput>

const SYSTEM_PROMPT = 'You are a spam detector. Respond only with "yes" or "no". No explanations.'

const buildUserPrompt = (content: string): string => [
  'Is the following text coherent, meaningful human writing?',
  'It must not be random characters, keyboard mashing, repeated patterns, or nonsensical gibberish.',
  'Answer only "yes" or "no".',
  '',
  'Text:',
  '---',
  content,
  '---'
].join('\n')

export const validateContent = createMiddleware<{ Bindings: Bindings }>(async (c, next) => {
  if (c.env.ENABLE_AI_VALIDATION !== 'true') {
    await next()

    return
  }

  const body = await c.req.json<{ content?: string }>().catch(() => null)
  const content = body?.content?.trim()

  if (!content) {
    await next()

    return
  }

  try {
    const input: LlamaInput = {
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(content) }
      ],
      max_tokens: 5 // eslint-disable-line camelcase
    }

    const result = await (c.env.AI.run as unknown as RunLlama)('@cf/meta/llama-3.2-1b-instruct', input)
    const answer = result.response?.trim().toLowerCase() ?? ''

    if (answer.startsWith('no')) {
      return c.json({ error: 'Your post does not appear to be meaningful content.' }, 422)
    }
  } catch (err: unknown) {
    console.error('contentValidator', err)
  }

  await next()
})
