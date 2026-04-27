/* eslint-disable camelcase -- Workers AI request/response fields use snake_case */
import { describe, expect, it, vi } from 'vitest'

import { mirrorPostTranslation } from './postTranslation.js'

import type { Bindings } from '../types.js'

import { POST_MAX_LENGTH } from '@unsaid/shared'

const captureInsert = () => {
  const bind = vi.fn(() => ({
    run: vi.fn(() => Promise.resolve({ success: true, meta: {} }))
  }))

  const prepare = vi.fn((_sql: string) => ({ bind }))
  const db = { prepare } as unknown as Bindings['DB']

  return { db, prepare, bind }
}

describe('mirrorPostTranslation', () => {
  it('inserts a translated row when Workers AI returns text', async () => {
    const { db, prepare, bind } = captureInsert()
    const run = vi.fn(() => Promise.resolve({ translated_text: '  Hola mundo  ' }))
    const ai = { run } as unknown as Bindings['AI']

    await mirrorPostTranslation(ai, db, {
      sourceId: 'abc123',
      content: 'Hello world',
      sourceLocale: 'en'
    })

    expect(run).toHaveBeenCalledWith(
      '@cf/meta/m2m100-1.2b', expect.objectContaining({
        text: 'Hello world',
        source_lang: 'en',
        target_lang: 'es'
      })
    )

    expect(prepare).toHaveBeenCalledTimes(1)

    expect(bind).toHaveBeenCalledWith('Hola mundo', 'es', 'abc123')
  })

  it('does not insert when translation is empty', async () => {
    const { db, prepare } = captureInsert()

    const ai = {
      run: vi.fn(() => Promise.resolve({ translated_text: '   ' }))
    } as unknown as Bindings['AI']

    await mirrorPostTranslation(ai, db, {
      sourceId: 'id1',
      content: 'x',
      sourceLocale: 'es'
    })

    expect(prepare).not.toHaveBeenCalled()
  })

  it('does not insert when Workers AI throws', async () => {
    const { db, prepare } = captureInsert()

    const ai = {
      run: vi.fn(() => Promise.reject(new Error('model error')))
    } as unknown as Bindings['AI']

    await mirrorPostTranslation(ai, db, {
      sourceId: 'id1',
      content: 'x',
      sourceLocale: 'en'
    })

    expect(prepare).not.toHaveBeenCalled()
  })

  it('truncates translated text to POST_MAX_LENGTH graphemes', async () => {
    const long = `${'a'.repeat(POST_MAX_LENGTH)}ZZ`

    const bind = vi.fn(() => ({
      run: vi.fn(() => Promise.resolve({ success: true, meta: {} }))
    }))

    const prepare = vi.fn(() => ({ bind }))
    const db = { prepare } as unknown as Bindings['DB']

    const ai = {
      run: vi.fn(() => Promise.resolve({ translated_text: long }))
    } as unknown as Bindings['AI']

    await mirrorPostTranslation(ai, db, {
      sourceId: 'src',
      content: 'orig',
      sourceLocale: 'en'
    })

    const inserted = bind.mock.calls[0]?.[0] as string | undefined

    expect(inserted).toBeDefined()

    expect(inserted?.length).toBe(POST_MAX_LENGTH)
  })
})
