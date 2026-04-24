import type {
  AnswerHistoryRecord,
  CategoryType,
  SummaryStatLine,
  OverviewSummary,
  ReviewItemRecord,
  ReadingReviewRecord,
} from '@/types'

function buildLine(records: AnswerHistoryRecord[], reviewNeeded: number): SummaryStatLine {
  const answered = records.length
  const correct = records.filter(r => r.isCorrect).length
  const wrong = answered - correct
  const accuracyRate = answered > 0 ? Math.round((correct / answered) * 100) : 0
  return { answered, correct, wrong, reviewNeeded, accuracyRate }
}

function filterByCategory(records: AnswerHistoryRecord[], category: CategoryType) {
  return records.filter(r => r.category === category)
}

function filterLast7Days(records: AnswerHistoryRecord[]) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 7)
  return records.filter(r => new Date(r.answeredAt) >= cutoff)
}

export function computeOverviewSummary(
  history: AnswerHistoryRecord[],
  grammarReview: ReviewItemRecord[],
  vocabReview: ReviewItemRecord[],
  readingReview: ReadingReviewRecord[]
): OverviewSummary {
  const last7 = filterLast7Days(history)

  const gReviewCount = grammarReview.length
  const vReviewCount = vocabReview.length
  const rReviewCount = readingReview.length

  const allTimeTotal = buildLine(history, gReviewCount + vReviewCount + rReviewCount)
  const allTimeReading = buildLine(filterByCategory(history, 'reading'), rReviewCount)
  const allTimeGrammar = buildLine(filterByCategory(history, 'grammar'), gReviewCount)
  const allTimeVocab = buildLine(filterByCategory(history, 'vocab'), vReviewCount)

  const last7Total = buildLine(last7, gReviewCount + vReviewCount + rReviewCount)
  const last7Reading = buildLine(filterByCategory(last7, 'reading'), rReviewCount)
  const last7Grammar = buildLine(filterByCategory(last7, 'grammar'), gReviewCount)
  const last7Vocab = buildLine(filterByCategory(last7, 'vocab'), vReviewCount)

  return {
    last7Days: {
      total: last7Total,
      reading: last7Reading,
      grammar: last7Grammar,
      vocab: last7Vocab,
    },
    allTime: {
      total: allTimeTotal,
      reading: allTimeReading,
      grammar: allTimeGrammar,
      vocab: allTimeVocab,
    },
  }
}
