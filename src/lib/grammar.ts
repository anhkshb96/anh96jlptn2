import type { GrammarQuestion } from '@/types'

function normalizeText(text?: string): string {
  return (text ?? '').normalize('NFKC').replace(/\s+/g, ' ').trim()
}

function getCorrectChoiceText(item: GrammarQuestion): string {
  return item.choices.find(choice => choice.id === item.explanation.correctAnswerId)?.text ?? ''
}

export function getGrammarQuestionContentSignature(item: GrammarQuestion): string {
  const normalizedItem = {
    kind: item.kind,
    prompt: normalizeText(item.prompt),
    choices: item.choices.map(choice => normalizeText(choice.text)).sort(),
    correctChoiceText: normalizeText(getCorrectChoiceText(item)),
  }

  return JSON.stringify(normalizedItem)
}

export interface MergeGrammarQuestionsResult {
  items: GrammarQuestion[]
  acceptedIds: string[]
  skippedDuplicateContentIds: string[]
}

export function mergeGrammarQuestions(
  existing: GrammarQuestion[],
  incoming: GrammarQuestion[]
): MergeGrammarQuestionsResult {
  const mergedById = new Map(existing.map(item => [item.id, item]))
  const contentSignatureToId = new Map(
    Array.from(mergedById.values()).map(item => [getGrammarQuestionContentSignature(item), item.id])
  )
  const uniqueIncoming = Array.from(new Map(incoming.map(item => [item.id, item])).values())
  const acceptedIds: string[] = []
  const skippedDuplicateContentIds: string[] = []

  for (const item of uniqueIncoming) {
    const existingById = mergedById.get(item.id)
    const nextSignature = getGrammarQuestionContentSignature(item)
    const matchedIdByContent = contentSignatureToId.get(nextSignature)

    if (!existingById && matchedIdByContent && matchedIdByContent !== item.id) {
      skippedDuplicateContentIds.push(item.id)
      continue
    }

    if (existingById) {
      const previousSignature = getGrammarQuestionContentSignature(existingById)

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
