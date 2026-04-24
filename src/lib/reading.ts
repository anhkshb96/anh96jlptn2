import type { ReadingQuestion, ReadingSet } from '@/types'

function normalizeText(text?: string): string {
  return (text ?? '').normalize('NFKC').replace(/\s+/g, ' ').trim()
}

function getCorrectChoiceText(question: ReadingQuestion): string {
  return question.choices.find(choice => choice.id === question.explanation.correctAnswerId)?.text ?? ''
}

function getReadingQuestionContentSignature(question: ReadingQuestion): string {
  const normalizedQuestion = {
    prompt: normalizeText(question.prompt),
    choices: question.choices.map(choice => normalizeText(choice.text)).sort(),
    correctChoiceText: normalizeText(getCorrectChoiceText(question)),
  }

  return JSON.stringify(normalizedQuestion)
}

export function getReadingSetContentSignature(set: ReadingSet): string {
  const normalizedSet = {
    kind: set.kind,
    passage: normalizeText(set.passage),
    vietnameseTranslation: normalizeText(set.vietnameseTranslation),
    questions: set.questions.map(getReadingQuestionContentSignature).sort(),
  }

  return JSON.stringify(normalizedSet)
}

export interface MergeReadingSetsResult {
  items: ReadingSet[]
  acceptedItems: ReadingSet[]
  skippedDuplicateContentIds: string[]
}

export function mergeReadingSets(
  existing: ReadingSet[],
  incoming: ReadingSet[]
): MergeReadingSetsResult {
  const mergedById = new Map(existing.map(item => [item.id, item]))
  const contentSignatureToId = new Map(
    Array.from(mergedById.values()).map(item => [getReadingSetContentSignature(item), item.id])
  )
  const acceptedItems: ReadingSet[] = []
  const skippedDuplicateContentIds: string[] = []
  const uniqueIncoming = Array.from(new Map(incoming.map(item => [item.id, item])).values())

  for (const item of uniqueIncoming) {
    const existingById = mergedById.get(item.id)
    const nextSignature = getReadingSetContentSignature(item)
    const matchedIdByContent = contentSignatureToId.get(nextSignature)

    if (!existingById && matchedIdByContent && matchedIdByContent !== item.id) {
      skippedDuplicateContentIds.push(item.id)
      continue
    }

    if (existingById) {
      const previousSignature = getReadingSetContentSignature(existingById)

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
    acceptedItems.push(item)
  }

  return {
    items: Array.from(mergedById.values()),
    acceptedItems,
    skippedDuplicateContentIds,
  }
}
