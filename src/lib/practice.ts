import type {
  GrammarQuestion,
  VocabQuestion,
  ReadingSet,
  AnswerHistoryRecord,
  ReviewItemRecord,
  ReadingSetHistoryRecord,
  ReadingReviewRecord,
} from '@/types'

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function isReviewDue(record: { nextReviewAt?: string }): boolean {
  if (!record.nextReviewAt) return true
  return new Date(record.nextReviewAt) <= new Date()
}

function pickOldestReviewItem<T extends { id: string }>(
  items: T[],
  review: ReviewItemRecord[]
): T | null {
  const itemById = new Map(items.map(item => [item.id, item]))
  const orderedReview = [...review].sort((a, b) => a.firstWrongAt.localeCompare(b.firstWrongAt))

  for (const record of orderedReview) {
    const item = itemById.get(record.itemId)
    if (item) return item
  }

  return null
}

function pickOldestReadingReviewSet(
  sets: ReadingSet[],
  review: ReadingReviewRecord[]
): ReadingSet | null {
  const setById = new Map(sets.map(set => [set.id, set]))
  const orderedReview = [...review].sort((a, b) => a.firstWrongAt.localeCompare(b.firstWrongAt))

  for (const record of orderedReview) {
    const set = setById.get(record.readingSetId)
    if (set) return set
  }

  return null
}

export function selectNextGrammarItem(
  items: GrammarQuestion[],
  history: AnswerHistoryRecord[],
  review: ReviewItemRecord[]
): GrammarQuestion | null {
  if (items.length === 0) return null

  const allReviewIds = new Set(review.map(r => r.itemId))
  const dueReview = review.filter(r => isReviewDue(r))
  const reviewIds = new Set(dueReview.map(r => r.itemId))
  const correctIds = new Set(
    history.filter(h => h.isCorrect && h.category === 'grammar').map(h => h.itemId)
  )

  const reviewItems = items.filter(i => reviewIds.has(i.id) && !correctIds.has(i.id))
  const unseenItems = items.filter(i => !allReviewIds.has(i.id) && !correctIds.has(i.id))
  const oldestReviewItem = pickOldestReviewItem(reviewItems, dueReview)

  if (reviewItems.length > 0 && unseenItems.length > 0) {
    return Math.random() < 0.5 ? oldestReviewItem ?? pickRandom(reviewItems) : pickRandom(unseenItems)
  }
  if (reviewItems.length > 0) return oldestReviewItem ?? pickRandom(reviewItems)
  if (unseenItems.length > 0) return pickRandom(unseenItems)
  return null
}

export function selectNextVocabItem(
  items: VocabQuestion[],
  history: AnswerHistoryRecord[],
  review: ReviewItemRecord[]
): VocabQuestion | null {
  if (items.length === 0) return null

  const allReviewIds = new Set(review.map(r => r.itemId))
  const dueReview = review.filter(r => isReviewDue(r))
  const reviewIds = new Set(dueReview.map(r => r.itemId))
  const correctIds = new Set(
    history.filter(h => h.isCorrect && h.category === 'vocab').map(h => h.itemId)
  )

  const reviewItems = items.filter(i => reviewIds.has(i.id) && !correctIds.has(i.id))
  const unseenItems = items.filter(i => !allReviewIds.has(i.id) && !correctIds.has(i.id))
  const oldestReviewItem = pickOldestReviewItem(reviewItems, dueReview)

  if (reviewItems.length > 0 && unseenItems.length > 0) {
    return Math.random() < 0.5 ? oldestReviewItem ?? pickRandom(reviewItems) : pickRandom(unseenItems)
  }
  if (reviewItems.length > 0) return oldestReviewItem ?? pickRandom(reviewItems)
  if (unseenItems.length > 0) return pickRandom(unseenItems)
  return null
}

export function selectNextReadingSet(
  sets: ReadingSet[],
  setHistory: ReadingSetHistoryRecord[],
  review: ReadingReviewRecord[]
): ReadingSet | null {
  if (sets.length === 0) return null

  const allReviewIds = new Set(review.map(r => r.readingSetId))
  const dueReview = review.filter(r => isReviewDue(r))
  const reviewIds = new Set(dueReview.map(r => r.readingSetId))
  const fullyCorrectIds = new Set(
    setHistory.filter(h => h.fullyCorrectCompleted).map(h => h.readingSetId)
  )

  const reviewSets = sets.filter(s => reviewIds.has(s.id) && !fullyCorrectIds.has(s.id))
  const unseenSets = sets.filter(s => !allReviewIds.has(s.id) && !fullyCorrectIds.has(s.id))
  const oldestReviewSet = pickOldestReadingReviewSet(reviewSets, dueReview)

  if (reviewSets.length > 0 && unseenSets.length > 0) {
    return Math.random() < 0.5 ? oldestReviewSet ?? pickRandom(reviewSets) : pickRandom(unseenSets)
  }
  if (reviewSets.length > 0) return oldestReviewSet ?? pickRandom(reviewSets)
  if (unseenSets.length > 0) return pickRandom(unseenSets)
  return null
}

export function isReviewItem(itemId: string, review: ReviewItemRecord[]): boolean {
  return review.some(r => r.itemId === itemId)
}

export function isReadingSetInReview(setId: string, review: ReadingReviewRecord[]): boolean {
  return review.some(r => r.readingSetId === setId)
}

export function getWrongQuestionIds(setId: string, review: ReadingReviewRecord[]): string[] {
  return review.find(r => r.readingSetId === setId)?.wrongQuestionIds ?? []
}
