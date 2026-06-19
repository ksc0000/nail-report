import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  MAX_NAIL_TAG_LENGTH,
  MAX_NAIL_TAGS,
  MAX_NAIL_TITLE_LENGTH,
  parseNailTags,
  validateNailTitle,
} from '../src/lib/nailTags.ts'

test('parseNailTags trims, removes hash prefixes, and drops duplicates', () => {
  assert.deepEqual(parseNailTags(' pink, #gel, Pink, , art ').tags, ['pink', 'gel', 'art'])
})

test('parseNailTags rejects too many tags', () => {
  const value = Array.from({ length: MAX_NAIL_TAGS + 1 }, (_, i) => `tag${i}`).join(',')
  const result = parseNailTags(value)
  assert.deepEqual(result.tags, [])
  assert.match(result.error, /最大/)
})

test('parseNailTags rejects tags that are too long', () => {
  const value = 'a'.repeat(MAX_NAIL_TAG_LENGTH + 1)
  const result = parseNailTags(value)
  assert.deepEqual(result.tags, [])
  assert.match(result.error, /文字以内/)
})

test('validateNailTitle accepts valid title', () => {
  assert.equal(validateNailTitle('Valid Title'), '')
})

test('validateNailTitle rejects too long title', () => {
  const value = 'a'.repeat(MAX_NAIL_TITLE_LENGTH + 1)
  const result = validateNailTitle(value)
  assert.match(result, /文字以内/)
})
