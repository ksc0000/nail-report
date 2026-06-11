export const formatDate = (ts: { toDate(): Date } | null | undefined): string | null => {
  if (!ts) return null
  try {
    return ts.toDate().toLocaleDateString('ja-JP', {
      year: 'numeric', month: 'numeric', day: 'numeric',
    })
  } catch {
    return null
  }
}
