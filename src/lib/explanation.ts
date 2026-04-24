import type { ExplanationBlock } from '@/types'

export function getDisplayExplanation(explanation: ExplanationBlock): string {
  return explanation.fullExplanation
}
