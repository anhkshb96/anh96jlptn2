'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import completeVocabSample from '@/data/vocab-complete-sample'
import {
  getVocabContent,
  getAnswerHistory,
  getVocabReview,
  addAnswerHistory,
  addVocabReview,
  removeVocabReview,
  resetVocabProgress,
  setVocabContent,
} from '@/lib/storage'
import { getDisplayExplanation } from '@/lib/explanation'
import { VOCAB_KIND_LABELS, mergeVocabQuestions } from '@/lib/vocab'
import { selectNextVocabItem, isReviewItem } from '@/lib/practice'
import type { VocabQuestion } from '@/types'

function renderWithUnderline(text: string): React.ReactNode {
  const parts = text.split(/(__[^_]+__)/)
  return parts.map((part, i) =>
    part.startsWith('__') && part.endsWith('__')
      ? <u key={i}>{part.slice(2, -2)}</u>
      : part
  )
}

function ImportModal({
  onClose,
  onImport,
}: {
  onClose: () => void
  onImport: (data: VocabQuestion[]) => void
}) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    setError('')
    try {
      const parsed = JSON.parse(text)
      const items: VocabQuestion[] = Array.isArray(parsed) ? parsed : parsed?.items
      if (!Array.isArray(items) || items.length === 0) throw new Error()
      onImport(items)
    } catch {
      setError('JSONが正しくありません')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end" onClick={onClose}>
      <div
        className="bg-white w-full max-w-lg mx-auto rounded-t-3xl p-5 pb-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
        <h2 className="text-lg font-bold mb-3">語彙 JSONを入力</h2>
        <p className="text-xs text-gray-500 mb-3">
          内容が同じ問題は、IDが違っても自動的にスキップします。
        </p>
        <textarea
          className="w-full h-40 border border-gray-200 rounded-xl p-3 text-sm font-mono resize-none focus:outline-none focus:border-black"
          placeholder='{"category":"vocab","items":[...]}'
          value={text}
          onChange={e => setText(e.target.value)}
        />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        <div className="flex gap-3 mt-3">
          <button className="btn-secondary flex-1" onClick={onClose}>キャンセル</button>
          <button className="btn-primary flex-1" onClick={handleSubmit}>インポート</button>
        </div>
      </div>
    </div>
  )
}

type Stage = 'loading' | 'empty' | 'question'
type EmptyReason = 'noContent' | 'noAvailable'

export default function GoiPage() {
  const [stage, setStage] = useState<Stage>('loading')
  const [emptyReason, setEmptyReason] = useState<EmptyReason>('noContent')
  const [item, setItem] = useState<VocabQuestion | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [inReview, setInReview] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [streak, setStreak] = useState(0)
  const [importNotice, setImportNotice] = useState('')
  const [totalItems, setTotalItems] = useState(0)

  const loadNext = useCallback(() => {
    const items = getVocabContent()
    setTotalItems(items.length)
    const history = getAnswerHistory()
    const review = getVocabReview()

    if (items.length === 0) {
      setEmptyReason('noContent')
      setStage('empty')
      return
    }

    const next = selectNextVocabItem(items, history, review)
    if (!next) {
      setEmptyReason('noAvailable')
      setStage('empty')
      return
    }

    setItem(next)
    setSelected(null)
    setSubmitted(false)
    setInReview(isReviewItem(next.id, review))
    setStage('question')
  }, [])

  useEffect(() => {
    loadNext()
  }, [loadNext])

  function handleSubmit() {
    if (!item || !selected) return
    const isCorrect = selected === item.explanation.correctAnswerId

    setSubmitted(true)

    addAnswerHistory({
      itemId: item.id,
      category: 'vocab',
      isCorrect,
      answeredAt: new Date().toISOString(),
    })

    if (isCorrect) {
      if (inReview) removeVocabReview(item.id)
      setStreak(s => s + 1)
    } else {
      addVocabReview(item.id)
      setStreak(0)
    }
  }

  function handleImport(data: VocabQuestion[]) {
    const result = mergeVocabQuestions(getVocabContent(), data)
    const ok = setVocabContent(result.items)
    resetVocabProgress(result.acceptedIds)
    if (!ok) {
      setImportNotice('⚠️ ストレージがいっぱいです。設定画面からデータを削除してから再試行してください。')
    } else {
      setImportNotice(
        result.skippedDuplicateContentIds.length > 0
          ? `${result.acceptedIds.length}件を取り込み、内容重複の${result.skippedDuplicateContentIds.length}件をスキップしました。`
          : `${result.acceptedIds.length}件を取り込みました。`
      )
    }
    setShowImport(false)
    loadNext()
  }

  function handleLoadSample() {
    handleImport(completeVocabSample)
  }

  if (stage === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400 text-sm">読み込み中...</div>
      </div>
    )
  }

  if (stage === 'empty') {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <Link href="/" className="text-sm text-gray-500">← ホーム</Link>
          <span className="text-lg font-bold">語彙</span>
          <button onClick={() => setShowImport(true)} className="text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg">
            JSON
          </button>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="text-5xl mb-2">📚</div>
          {importNotice && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 max-w-sm">
              {importNotice}
            </p>
          )}
          {emptyReason === 'noContent' ? (
            <p className="text-gray-500 text-sm">語彙データがありません。<br/>JSONをインポートしてください。</p>
          ) : (
            <p className="text-gray-500 text-sm">
              今日できる語彙問題はもうありません。<br/>
              新しいJSONを追加するか、復習は明日もう一度確認してください。
            </p>
          )}
          <button onClick={() => setShowImport(true)} className="btn-primary max-w-xs">JSONを入力</button>
          <button onClick={handleLoadSample} className="btn-secondary max-w-xs">サンプル6種類を入れる</button>
        </div>
        {showImport && <ImportModal onClose={() => setShowImport(false)} onImport={handleImport} />}
      </div>
    )
  }

  if (!item) return null

  const isCorrect = submitted && selected === item.explanation.correctAnswerId
  const explanationText = getDisplayExplanation(item.explanation)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <Link href="/" className="text-sm text-gray-500">← ホーム</Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {VOCAB_KIND_LABELS[item.kind] ?? item.kind}
          </span>
          {totalItems > 0 && (
            <span className="text-xs text-gray-400">{totalItems}問</span>
          )}
          {streak > 0 && (
            <span className="text-xs font-medium bg-black text-white px-2 py-1 rounded-full">
              {streak}連続 ✓
            </span>
          )}
        </div>
        <button
          onClick={() => setShowImport(true)}
          className="text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg"
        >
          JSON
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 pb-32 space-y-5">
        {importNotice && (
          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            {importNotice}
          </div>
        )}

        {/* Question */}
        <div>
          {inReview && <span className="fukkyu-badge mb-2 block w-fit">復習</span>}
          <p className="text-base leading-relaxed text-gray-900">{renderWithUnderline(item.prompt)}</p>
        </div>

        {/* Choices */}
        <div className="space-y-2">
          {item.choices.map(c => {
            let cls = 'choice-btn'
            if (submitted) {
              if (c.id === item.explanation.correctAnswerId) cls += ' choice-btn-correct'
              else if (c.id === selected) cls += ' choice-btn-wrong'
            } else if (c.id === selected) {
              cls += ' choice-btn-selected'
            }
            return (
              <button
                key={c.id}
                className={cls}
                disabled={submitted}
                onClick={() => !submitted && setSelected(c.id)}
              >
                <span className="font-semibold mr-2">{c.label}.</span>{c.text}
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {submitted && (
          <div className={`rounded-xl p-4 leading-relaxed text-sm ${
            isCorrect
              ? 'bg-green-50 text-green-900 border border-green-200'
              : 'bg-red-50 text-red-900 border border-red-200'
          }`}>
            <p className="font-bold mb-2">{isCorrect ? '✓ 正解！' : '✗ 不正解'}</p>
            <p>{explanationText}</p>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto px-4 pb-6 pt-3 bg-white border-t border-gray-100">
        {!submitted ? (
          <button className="btn-primary" disabled={!selected} onClick={handleSubmit}>
            回答する
          </button>
        ) : (
          <button className="btn-primary" onClick={loadNext}>
            次へ
          </button>
        )}
      </div>

      {showImport && <ImportModal onClose={() => setShowImport(false)} onImport={handleImport} />}
    </div>
  )
}
