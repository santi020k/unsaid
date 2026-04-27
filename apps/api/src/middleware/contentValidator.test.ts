import { Hono } from 'hono'
import { describe, expect, it, vi } from 'vitest'

import { validateContent } from './contentValidator.js'

import type { Bindings } from '../types.js'

const createApp = (bindings: Partial<Bindings> & Pick<Bindings, 'AI'>) => {
  const app = new Hono<{ Bindings: Bindings }>()

  app.post('/t', validateContent, c => c.json({ ok: true }))

  return app.request('/t', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: 'A real sentence about the weather.' })
  }, bindings)
}

describe('validateContent', () => {
  it('calls next when ENABLE_AI_VALIDATION is not true', async () => {
    const run = vi.fn()

    const res = await createApp({
      AI: { run } as Bindings['AI'],
      ENABLE_AI_VALIDATION: undefined
    })

    expect(res.status).toBe(200)

    await expect(res.json()).resolves.toEqual({ ok: true })

    expect(run).not.toHaveBeenCalled()
  })

  it('returns 422 when the model answers no', async () => {
    const res = await createApp({
      AI: {
        run: () => Promise.resolve({ response: 'no' })
      } as Bindings['AI'],
      ENABLE_AI_VALIDATION: 'true'
    })

    expect(res.status).toBe(422)

    const body = await res.json()

    expect(body.error).toContain('meaningful')
  })

  it('calls next when the model answers yes', async () => {
    const res = await createApp({
      AI: {
        run: () => Promise.resolve({ response: 'yes' })
      } as Bindings['AI'],
      ENABLE_AI_VALIDATION: 'true'
    })

    expect(res.status).toBe(200)

    await expect(res.json()).resolves.toEqual({ ok: true })
  })

  it('skips the model when content is missing or blank', async () => {
    const run = vi.fn()
    const app = new Hono<{ Bindings: Bindings }>()

    app.post('/t', validateContent, c => c.json({ ok: true }))

    const res = await app.request('/t', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: '   ' })
    }, {
      AI: { run } as Bindings['AI'],
      ENABLE_AI_VALIDATION: 'true'
    })

    expect(res.status).toBe(200)

    expect(run).not.toHaveBeenCalled()
  })

  it('fails open when the model throws', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    try {
      const run = vi.fn().mockRejectedValue(new Error('Workers AI unavailable'))

      const res = await createApp({
        AI: { run } as Bindings['AI'],
        ENABLE_AI_VALIDATION: 'true'
      })

      expect(res.status).toBe(200)

      await expect(res.json()).resolves.toEqual({ ok: true })
    } finally {
      errSpy.mockRestore()
    }
  })
})
