import type {
  ReadingSet,
  GrammarQuestion,
  VocabQuestion,
  AnswerHistoryRecord,
  ReadingQuestionHistoryRecord,
  ReadingSetHistoryRecord,
  ReviewItemRecord,
  ReadingReviewRecord,
} from '@/types'
import { normalizeVocabQuestions } from '@/lib/vocab'

const KEYS = {
  readingContent: 'jlpt_reading_content',
  grammarContent: 'jlpt_grammar_content',
  vocabContent: 'jlpt_vocab_content',
  answerHistory: 'jlpt_answer_history',
  readingQuestionHistory: 'jlpt_reading_question_history',
  readingSetHistory: 'jlpt_reading_set_history',
  grammarReview: 'jlpt_review_grammar',
  vocabReview: 'jlpt_review_vocab',
  readingReview: 'jlpt_review_reading',
}

function getTomorrowStartIso(): string {
  const now = new Date()
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  return tomorrow.toISOString()
}

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null
  try {
    const s = window.localStorage
    if (typeof s?.getItem !== 'function') return null
    return s
  } catch {
    return null
  }
}

function safeGet<T>(key: string, fallback: T): T {
  const s = getStorage()
  if (!s) return fallback
  try {
    const raw = s.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function safeSet<T>(key: string, value: T): boolean {
  const s = getStorage()
  if (!s) return false
  try {
    s.setItem(key, JSON.stringify(value))
    return true
  } catch {
    // storage full or unavailable
    return false
  }
}

// Content
export function getReadingContent(): ReadingSet[] {
  return safeGet<ReadingSet[]>(KEYS.readingContent, [])
}
export function setReadingContent(items: ReadingSet[]): boolean {
  return safeSet(KEYS.readingContent, items)
}

export function getGrammarContent(): GrammarQuestion[] {
  return safeGet<GrammarQuestion[]>(KEYS.grammarContent, [])
}
export function setGrammarContent(items: GrammarQuestion[]): boolean {
  return safeSet(KEYS.grammarContent, items)
}

export function getVocabContent(): VocabQuestion[] {
  return normalizeVocabQuestions(safeGet<VocabQuestion[]>(KEYS.vocabContent, []))
}
export function setVocabContent(items: VocabQuestion[]): boolean {
  return safeSet(KEYS.vocabContent, normalizeVocabQuestions(items))
}

// History
export function getAnswerHistory(): AnswerHistoryRecord[] {
  return safeGet<AnswerHistoryRecord[]>(KEYS.answerHistory, [])
}
export function addAnswerHistory(record: AnswerHistoryRecord): void {
  const history = getAnswerHistory()
  history.push(record)
  safeSet(KEYS.answerHistory, history)
}

export function getReadingQuestionHistory(): ReadingQuestionHistoryRecord[] {
  return safeGet<ReadingQuestionHistoryRecord[]>(KEYS.readingQuestionHistory, [])
}
export function addReadingQuestionHistory(record: ReadingQuestionHistoryRecord): void {
  const history = getReadingQuestionHistory()
  history.push(record)
  safeSet(KEYS.readingQuestionHistory, history)
}

export function getReadingSetHistory(): ReadingSetHistoryRecord[] {
  return safeGet<ReadingSetHistoryRecord[]>(KEYS.readingSetHistory, [])
}
export function upsertReadingSetHistory(record: ReadingSetHistoryRecord): void {
  const history = getReadingSetHistory()
  const idx = history.findIndex(h => h.readingSetId === record.readingSetId)
  if (idx >= 0) {
    history[idx] = record
  } else {
    history.push(record)
  }
  safeSet(KEYS.readingSetHistory, history)
}

// Review
export function getGrammarReview(): ReviewItemRecord[] {
  return safeGet<ReviewItemRecord[]>(KEYS.grammarReview, [])
}
export function addGrammarReview(itemId: string): void {
  const review = getGrammarReview()
  const idx = review.findIndex(r => r.itemId === itemId)
  const nextReviewAt = getTomorrowStartIso()

  if (idx >= 0) {
    review[idx] = { ...review[idx], nextReviewAt }
  } else {
    review.push({
      category: 'grammar',
      itemId,
      firstWrongAt: new Date().toISOString(),
      nextReviewAt,
    })
  }

  safeSet(KEYS.grammarReview, review)
}
export function removeGrammarReview(itemId: string): void {
  const review = getGrammarReview().filter(r => r.itemId !== itemId)
  safeSet(KEYS.grammarReview, review)
}

export function getVocabReview(): ReviewItemRecord[] {
  return safeGet<ReviewItemRecord[]>(KEYS.vocabReview, [])
}
export function addVocabReview(itemId: string): void {
  const review = getVocabReview()
  const idx = review.findIndex(r => r.itemId === itemId)
  const nextReviewAt = getTomorrowStartIso()

  if (idx >= 0) {
    review[idx] = { ...review[idx], nextReviewAt }
  } else {
    review.push({
      category: 'vocab',
      itemId,
      firstWrongAt: new Date().toISOString(),
      nextReviewAt,
    })
  }

  safeSet(KEYS.vocabReview, review)
}
export function removeVocabReview(itemId: string): void {
  const review = getVocabReview().filter(r => r.itemId !== itemId)
  safeSet(KEYS.vocabReview, review)
}

export function resetGrammarProgress(itemIds: string[]): void {
  if (itemIds.length === 0) return

  const targetIds = new Set(itemIds)

  safeSet(
    KEYS.answerHistory,
    getAnswerHistory().filter(
      h => !(h.category === 'grammar' && targetIds.has(h.itemId))
    )
  )

  safeSet(
    KEYS.grammarReview,
    getGrammarReview().filter(r => !targetIds.has(r.itemId))
  )
}

export function resetVocabProgress(itemIds: string[]): void {
  if (itemIds.length === 0) return

  const targetIds = new Set(itemIds)

  safeSet(
    KEYS.answerHistory,
    getAnswerHistory().filter(
      h => !(h.category === 'vocab' && targetIds.has(h.itemId))
    )
  )

  safeSet(
    KEYS.vocabReview,
    getVocabReview().filter(r => !targetIds.has(r.itemId))
  )
}

export function getReadingReview(): ReadingReviewRecord[] {
  return safeGet<ReadingReviewRecord[]>(KEYS.readingReview, [])
}
export function addReadingReview(readingSetId: string, wrongQuestionIds: string[]): void {
  const review = getReadingReview()
  const idx = review.findIndex(r => r.readingSetId === readingSetId)
  const nextReviewAt = getTomorrowStartIso()
  if (idx >= 0) {
    const existing = review[idx]
    const merged = Array.from(new Set([...existing.wrongQuestionIds, ...wrongQuestionIds]))
    review[idx] = { ...existing, wrongQuestionIds: merged, nextReviewAt }
  } else {
    review.push({
      category: 'reading',
      readingSetId,
      wrongQuestionIds,
      firstWrongAt: new Date().toISOString(),
      nextReviewAt,
    })
  }
  safeSet(KEYS.readingReview, review)
}
export function removeReadingReview(readingSetId: string): void {
  const review = getReadingReview().filter(r => r.readingSetId !== readingSetId)
  safeSet(KEYS.readingReview, review)
}

export function replaceReadingReviewWrongIds(readingSetId: string, wrongQuestionIds: string[]): void {
  const review = getReadingReview()
  const idx = review.findIndex(r => r.readingSetId === readingSetId)
  const nextReviewAt = getTomorrowStartIso()
  if (idx >= 0) {
    review[idx] = { ...review[idx], wrongQuestionIds, nextReviewAt }
  } else {
    review.push({
      category: 'reading',
      readingSetId,
      wrongQuestionIds,
      firstWrongAt: new Date().toISOString(),
      nextReviewAt,
    })
  }
  safeSet(KEYS.readingReview, review)
}

export function resetReadingProgress(items: ReadingSet[]): void {
  if (items.length === 0) return

  const targetSetIds = new Set(items.map(item => item.id))
  const targetQuestionIds = new Set(
    items.flatMap(item => item.questions.map(question => question.id))
  )

  safeSet(
    KEYS.answerHistory,
    getAnswerHistory().filter(
      h => !(h.category === 'reading' && targetQuestionIds.has(h.itemId))
    )
  )

  safeSet(
    KEYS.readingQuestionHistory,
    getReadingQuestionHistory().filter(h => !targetSetIds.has(h.readingSetId))
  )

  safeSet(
    KEYS.readingSetHistory,
    getReadingSetHistory().filter(h => !targetSetIds.has(h.readingSetId))
  )

  safeSet(
    KEYS.readingReview,
    getReadingReview().filter(r => !targetSetIds.has(r.readingSetId))
  )
}

// Storage usage helper
export function getStorageUsageKB(): number {
  const s = getStorage()
  if (!s) return 0
  let total = 0
  for (const key of Object.values(KEYS)) {
    const val = s.getItem(key)
    if (val) total += key.length + val.length
  }
  return Math.round((total * 2) / 1024) // UTF-16 = 2 bytes per char
}

// Delete helpers
export function deleteGrammarData(): void {
  const s = getStorage()
  if (!s) return
  s.removeItem(KEYS.grammarContent)
  safeSet(KEYS.answerHistory, getAnswerHistory().filter(h => h.category !== 'grammar'))
  s.removeItem(KEYS.grammarReview)
}

export function deleteVocabData(): void {
  const s = getStorage()
  if (!s) return
  s.removeItem(KEYS.vocabContent)
  safeSet(KEYS.answerHistory, getAnswerHistory().filter(h => h.category !== 'vocab'))
  s.removeItem(KEYS.vocabReview)
}

export function deleteReadingData(): void {
  const s = getStorage()
  if (!s) return
  s.removeItem(KEYS.readingContent)
  safeSet(KEYS.answerHistory, getAnswerHistory().filter(h => h.category !== 'reading'))
  s.removeItem(KEYS.readingQuestionHistory)
  s.removeItem(KEYS.readingSetHistory)
  s.removeItem(KEYS.readingReview)
}
