export const MAX_NAIL_TAGS = 10
export const MAX_NAIL_TAG_LENGTH = 20
export const MAX_NAIL_TITLE_LENGTH = 50

export interface NailTagParseResult {
  tags: string[]
  error: string
}

export const validateNailTitle = (title: string): string => {
  if (title.length > MAX_NAIL_TITLE_LENGTH) {
    return `タイトルは${MAX_NAIL_TITLE_LENGTH}文字以内にしてください。`
  }
  return ''
}

export const parseNailTags = (value: string): NailTagParseResult => {
  const tags: string[] = []
  const seen = new Set<string>()
  const rawTags = value
    .split(',')
    .map(tag => tag.trim().replace(/^#+/, '').trim())
    .filter(Boolean)

  for (const tag of rawTags) {
    if (tag.length > MAX_NAIL_TAG_LENGTH) {
      return {
        tags: [],
        error: `タグは1つ${MAX_NAIL_TAG_LENGTH}文字以内にしてください。`,
      }
    }

    const key = tag.toLocaleLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      tags.push(tag)
    }
  }

  if (tags.length > MAX_NAIL_TAGS) {
    return {
      tags: [],
      error: `タグは最大${MAX_NAIL_TAGS}個までです。`,
    }
  }

  return { tags, error: '' }
}
