'use client'

import { useState, useEffect } from 'react'
import completeVocabSample from '@/data/vocab-complete-sample'
import completeReadingSample from '@/data/reading-complete-sample'

// One-time purge + seed: clear old JLPT data and seed vocab/reading samples
// from the built-in sample .ts files. Once done, the sentinel prevents this
// from running again. To trigger another purge+seed in the future, change
// the sentinel key name.
const CLEAR_SENTINEL_KEY = 'jlpt_cleared_by_claude_v2_seed'
const JLPT_KEYS_TO_CLEAR = [
  'jlpt_reading_content',
  'jlpt_grammar_content',
  'jlpt_vocab_content',
  'jlpt_answer_history',
  'jlpt_reading_question_history',
  'jlpt_reading_set_history',
  'jlpt_review_grammar',
  'jlpt_review_vocab',
  'jlpt_review_reading',
]

function runOneTimePurgeAndSeed() {
  try {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(CLEAR_SENTINEL_KEY) === 'done') return
    JLPT_KEYS_TO_CLEAR.forEach((k) => localStorage.removeItem(k))
    // Seed vocab + reading content from the built-in sample files so the user
    // sees at least one question per type without needing to click "Nhập mẫu".
    try {
      localStorage.setItem('jlpt_vocab_content', JSON.stringify(completeVocabSample))
    } catch {
      // ignore quota errors
    }
    try {
      localStorage.setItem('jlpt_reading_content', JSON.stringify(completeReadingSample))
    } catch {
      // ignore quota errors
    }
    localStorage.setItem(CLEAR_SENTINEL_KEY, 'done')
    console.info('[JLPT] One-time purge + sample seed completed.')
  } catch {
    // ignore
  }
}

export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    runOneTimePurgeAndSeed()
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-300 text-sm">読み込み中...</div>
      </div>
    )
  }

  return <>{children}</>
}
