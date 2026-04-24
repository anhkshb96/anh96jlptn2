import type {
  ReviewItemRecord,
  ReadingReviewRecord,
  GrammarQuestion,
  VocabQuestion,
  ReadingSet,
} from '@/types'

export function buildMarkdownExport(
  grammarReview: ReviewItemRecord[],
  vocabReview: ReviewItemRecord[],
  readingReview: ReadingReviewRecord[],
  grammarItems: GrammarQuestion[],
  vocabItems: VocabQuestion[],
  readingSets: ReadingSet[]
): string {
  const lines: string[] = []
  lines.push('# Câu trả lời sai - JLPT N2')
  lines.push(`_Xuất ngày: ${new Date().toLocaleDateString('vi-VN')}_`)
  lines.push('')

  if (grammarReview.length > 0) {
    lines.push('## 文法 (Ngữ pháp)')
    lines.push('')
    for (const rev of grammarReview) {
      const item = grammarItems.find(i => i.id === rev.itemId)
      if (!item) continue
      lines.push(`### ${item.id}`)
      lines.push(`**Câu hỏi:** ${item.prompt}`)
      lines.push('')
      lines.push('**Đáp án:**')
      for (const c of item.choices) {
        const isCorrect = c.id === item.explanation.correctAnswerId
        lines.push(`- ${c.label}. ${c.text}${isCorrect ? ' ✓' : ''}`)
      }
      lines.push('')
    }
  }

  if (vocabReview.length > 0) {
    lines.push('## 語彙 (Từ vựng)')
    lines.push('')
    for (const rev of vocabReview) {
      const item = vocabItems.find(i => i.id === rev.itemId)
      if (!item) continue
      lines.push(`### ${item.id}`)
      lines.push(`**Câu hỏi:** ${item.prompt}`)
      lines.push('')
      lines.push('**Đáp án:**')
      for (const c of item.choices) {
        const isCorrect = c.id === item.explanation.correctAnswerId
        lines.push(`- ${c.label}. ${c.text}${isCorrect ? ' ✓' : ''}`)
      }
      lines.push('')
    }
  }

  if (readingReview.length > 0) {
    lines.push('## 読解 (Đọc hiểu)')
    lines.push('')
    for (const rev of readingReview) {
      const set = readingSets.find(s => s.id === rev.readingSetId)
      if (!set) continue
      lines.push(`### ${set.title ?? set.id}`)
      lines.push('')
      for (const qid of rev.wrongQuestionIds) {
        const q = set.questions.find(q => q.id === qid)
        if (!q) continue
        lines.push(`**Câu hỏi:** ${q.prompt}`)
        lines.push('')
        lines.push('**Đáp án:**')
        for (const c of q.choices) {
          const isCorrect = c.id === q.explanation.correctAnswerId
          lines.push(`- ${c.label}. ${c.text}${isCorrect ? ' ✓' : ''}`)
        }
        lines.push('')
      }
    }
  }

  if (grammarReview.length === 0 && vocabReview.length === 0 && readingReview.length === 0) {
    lines.push('_Không có câu sai nào._')
  }

  return lines.join('\n')
}
