export type CategoryType = 'reading' | 'grammar' | 'vocab'

export type ReadingKind =
  | 'short'
  | 'medium'
  | 'long'
  | 'integrated'
  | 'claim'
  | 'information-search'

export type GrammarQuestionKind = 'blank-fill' | 'sentence-order' | 'context-choice'

export type CanonicalVocabQuestionKind =
  | 'kanji-reading'
  | 'orthography'
  | 'word-formation'
  | 'context-defined'
  | 'paraphrase'
  | 'usage'

export type LegacyVocabQuestionKind = 'context-word' | 'reading-to-kanji'

export type VocabQuestionKind = CanonicalVocabQuestionKind | LegacyVocabQuestionKind

export interface ChoiceOption {
  id: string
  label: string
  text: string
}

export interface ExplanationBlock {
  correctAnswerId: string
  fullExplanation: string
  /** @deprecated Dùng fullExplanation viết tiếng Việt thay thế */
  vietnameseExplanation?: string
}

export interface ReadingQuestion {
  id: string
  prompt: string
  choices: ChoiceOption[]
  explanation: ExplanationBlock
}

export interface ReadingSet {
  id: string
  kind: ReadingKind
  title?: string
  passage: string
  vietnameseTranslation: string
  timeLimitSeconds: number
  questions: ReadingQuestion[]
}

export interface GrammarQuestion {
  id: string
  kind: GrammarQuestionKind
  prompt: string
  choices: ChoiceOption[]
  explanation: ExplanationBlock
}

export interface VocabQuestion {
  id: string
  kind: VocabQuestionKind
  prompt: string
  choices: ChoiceOption[]
  explanation: ExplanationBlock
}

export interface AnswerHistoryRecord {
  itemId: string
  category: CategoryType
  isCorrect: boolean
  answeredAt: string
}

export interface ReadingQuestionHistoryRecord {
  readingSetId: string
  questionId: string
  isCorrect: boolean
  answeredAt: string
}

export interface ReadingSetHistoryRecord {
  readingSetId: string
  hasBeenAttempted: boolean
  fullyCorrectCompleted: boolean
  lastAnsweredAt: string
}

export interface ReviewItemRecord {
  category: 'grammar' | 'vocab'
  itemId: string
  firstWrongAt: string
  nextReviewAt?: string
}

export interface ReadingReviewRecord {
  category: 'reading'
  readingSetId: string
  wrongQuestionIds: string[]
  firstWrongAt: string
  nextReviewAt?: string
}

export interface SummaryStatLine {
  answered: number
  correct: number
  wrong: number
  reviewNeeded: number
  accuracyRate: number
}

export interface OverviewSummary {
  last7Days: {
    total: SummaryStatLine
    reading: SummaryStatLine
    grammar: SummaryStatLine
    vocab: SummaryStatLine
  }
  allTime: {
    total: SummaryStatLine
    reading: SummaryStatLine
    grammar: SummaryStatLine
    vocab: SummaryStatLine
  }
}
