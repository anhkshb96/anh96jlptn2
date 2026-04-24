import type { VocabQuestion, VocabQuestionKind } from '@/types'

export const VOCAB_KIND_LABELS: Record<string, string> = {
  'kanji-reading': '漢字読み',
  orthography: '表記',
  'word-formation': '語形成',
  'context-defined': '文脈規定',
  paraphrase: '言い換え類義',
  usage: '用法',
  'context-word': '文脈規定',
  'reading-to-kanji': '表記',
}

const LEGACY_KIND_MAP: Partial<Record<VocabQuestionKind, VocabQuestionKind>> = {
  'context-word': 'context-defined',
  'reading-to-kanji': 'orthography',
}

export function normalizeVocabKind(kind: VocabQuestionKind): VocabQuestionKind {
  return LEGACY_KIND_MAP[kind] ?? kind
}

export function normalizeVocabQuestions(items: VocabQuestion[]): VocabQuestion[] {
  return items.map(item => ({
    ...item,
    kind: normalizeVocabKind(item.kind),
  }))
}

function normalizeText(text?: string): string {
  return (text ?? '').normalize('NFKC').replace(/\s+/g, ' ').trim()
}

function getCorrectChoiceText(item: VocabQuestion): string {
  return item.choices.find(choice => choice.id === item.explanation.correctAnswerId)?.text ?? ''
}

export function getVocabQuestionContentSignature(item: VocabQuestion): string {
  const normalizedItem = {
    kind: normalizeVocabKind(item.kind),
    prompt: normalizeText(item.prompt),
    choices: item.choices.map(choice => normalizeText(choice.text)).sort(),
    correctChoiceText: normalizeText(getCorrectChoiceText(item)),
  }

  return JSON.stringify(normalizedItem)
}

export interface MergeVocabQuestionsResult {
  items: VocabQuestion[]
  acceptedIds: string[]
  skippedDuplicateContentIds: string[]
}

export function mergeVocabQuestions(
  existing: VocabQuestion[],
  incoming: VocabQuestion[]
): MergeVocabQuestionsResult {
  const mergedById = new Map(normalizeVocabQuestions(existing).map(item => [item.id, item]))
  const contentSignatureToId = new Map(
    Array.from(mergedById.values()).map(item => [getVocabQuestionContentSignature(item), item.id])
  )
  const acceptedIds: string[] = []
  const skippedDuplicateContentIds: string[] = []

  for (const item of normalizeVocabQuestions(incoming)) {
    const existingById = mergedById.get(item.id)
    const nextSignature = getVocabQuestionContentSignature(item)
    const matchedIdByContent = contentSignatureToId.get(nextSignature)

    if (!existingById && matchedIdByContent && matchedIdByContent !== item.id) {
      skippedDuplicateContentIds.push(item.id)
      continue
    }

    if (existingById) {
      const previousSignature = getVocabQuestionContentSignature(existingById)

      if (
        previousSignature !== nextSignature &&
        matchedIdByContent &&
        matchedIdByContent !== item.id
      ) {
        skippedDuplicateContentIds.push(item.id)
        continue
      }

      contentSignatureToId.delete(previousSignature)
    }

    mergedById.set(item.id, item)
    contentSignatureToId.set(nextSignature, item.id)
    acceptedIds.push(item.id)
  }

  return {
    items: Array.from(mergedById.values()),
    acceptedIds,
    skippedDuplicateContentIds,
  }
}
