'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { mergeReadingSets } from '@/lib/reading'
import {
  getReadingContent,
  getReadingSetHistory,
  getReadingReview,
  addAnswerHistory,
  addReadingQuestionHistory,
  upsertReadingSetHistory,
  addReadingReview,
  removeReadingReview,
  resetReadingProgress,
  setReadingContent,
} from '@/lib/storage'
import { getDisplayExplanation } from '@/lib/explanation'
import { selectNextReadingSet, getWrongQuestionIds } from '@/lib/practice'
import completeReadingSample from '@/data/reading-complete-sample'
import type { ReadingSet } from '@/types'

const KIND_LABELS: Record<string, string> = {
  short: '短文',
  medium: '中文',
  long: '長文',
  integrated: '統合理解',
  claim: '主張理解',
  'information-search': '情報検索',
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

// ── JSON Import Modal ────────────────────────────────────────────────
function ImportModal({ onClose, onImport }: { onClose: () => void; onImport: (data: ReadingSet[]) => void }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    setError('')
    try {
      const parsed = JSON.parse(text)
      const items: ReadingSet[] = Array.isArray(parsed) ? parsed : parsed?.items
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
        <h2 className="text-lg font-bold mb-3">読解 JSONを入力</h2>
        <p className="text-xs text-gray-500 mb-3">
          同じIDのセットは更新して学習状態をやり直し、内容が同じ別IDのセットは自動でスキップします。
        </p>
        <textarea
          className="w-full h-40 border border-gray-200 rounded-xl p-3 text-sm font-mono resize-none focus:outline-none focus:border-black"
          placeholder='{"category":"reading","items":[...]}'
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

// ── Result Screen ────────────────────────────────────────────────────
function ResultScreen({
  set,
  answers,
  onNext,
}: {
  set: ReadingSet
  answers: Record<string, string>
  onNext: () => void
}) {
  const [showTranslation, setShowTranslation] = useState(false)

  const results = set.questions.map(q => ({
    q,
    chosen: answers[q.id],
    correct: q.explanation.correctAnswerId,
    isCorrect: answers[q.id] === q.explanation.correctAnswerId,
    explanationText: getDisplayExplanation(q.explanation),
  }))

  const correctCount = results.filter(r => r.isCorrect).length
  const wrongCount = results.filter(r => !r.isCorrect).length

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <Link href="/" className="text-sm text-gray-500">← ホーム</Link>
        <span className="text-sm font-medium text-gray-500">{KIND_LABELS[set.kind] ?? set.kind}</span>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 pb-32">
        {/* Score */}
        <div className="text-center py-4">
          <div className="text-5xl font-bold mb-1">{correctCount}/{set.questions.length}</div>
          <div className="text-gray-500 text-sm">
            <span className="text-green-700 mr-3">正解 {correctCount}</span>
            <span className="text-red-600">誤答 {wrongCount}</span>
          </div>
        </div>

        {/* Translation toggle */}
        <button
          onClick={() => setShowTranslation(v => !v)}
          className="w-full text-sm text-gray-500 border border-gray-200 py-2 rounded-xl"
        >
          {showTranslation ? '翻訳を隠す' : 'ベトナム語訳を見る'}
        </button>

        {showTranslation && (
          <div className="card bg-gray-50 text-sm text-gray-700 leading-relaxed">
            {set.vietnameseTranslation}
          </div>
        )}

        {/* Per-question results */}
        {results.map(({ q, chosen, correct, isCorrect, explanationText }) => (
          <div key={q.id} className={`card border ${isCorrect ? 'border-green-200' : 'border-red-200'}`}>
            <p className="text-sm text-gray-700 mb-3 leading-relaxed">{q.prompt}</p>
            <div className="space-y-1.5 mb-3">
              {q.choices.map(c => {
                const isChosen = c.id === chosen
                const isAns = c.id === correct
                let cls = 'choice-btn text-sm'
                if (isAns) cls += ' choice-btn-correct'
                else if (isChosen && !isAns) cls += ' choice-btn-wrong'
                return (
                  <div key={c.id} className={cls}>
                    <span className="font-medium mr-2">{c.label}.</span>{c.text}
                    {isAns && <span className="ml-2 text-green-700">✓</span>}
                    {isChosen && !isAns && <span className="ml-2 text-red-600">✗</span>}
                  </div>
                )
              })}
            </div>
            <div className={`text-xs p-3 rounded-lg leading-relaxed ${isCorrect ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'}`}>
              {explanationText}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto px-4 pb-6 pt-3 bg-white border-t border-gray-100">
        <button className="btn-primary" onClick={onNext}>次のセットへ</button>
      </div>
    </div>
  )
}

// ── Main Practice ────────────────────────────────────────────────────
type PracticeState = 'loading' | 'empty' | 'practicing' | 'result'
type EmptyReason = 'noContent' | 'noAvailable'

export default function DokaiPage() {
  const [practiceState, setPracticeState] = useState<PracticeState>('loading')
  const [emptyReason, setEmptyReason] = useState<EmptyReason>('noContent')
  const [currentSet, setCurrentSet] = useState<ReadingSet | null>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [view, setView] = useState<'passage' | 'question'>('question')
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [timeUp, setTimeUp] = useState(false)
  const [wrongQuestionIds, setWrongQuestionIds] = useState<string[]>([])
  const [showImport, setShowImport] = useState(false)
  const [importNotice, setImportNotice] = useState('')

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startTimer = useCallback((seconds: number) => {
    stopTimer()
    setTimeLeft(seconds)
    setTimeUp(false)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          timerRef.current = null
          setTimeUp(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [stopTimer])

  const loadNextSet = useCallback(() => {
    const sets = getReadingContent()
    const setHistory = getReadingSetHistory()
    const review = getReadingReview()

    if (sets.length === 0) {
      setEmptyReason('noContent')
      setPracticeState('empty')
      return
    }

    const next = selectNextReadingSet(sets, setHistory, review)
    if (!next) {
      setEmptyReason('noAvailable')
      setPracticeState('empty')
      return
    }

    const prevWrong = getWrongQuestionIds(next.id, review)
    setWrongQuestionIds(prevWrong)
    setCurrentSet(next)
    setQuestionIndex(0)
    setView('question')
    setSelectedChoice(null)
    setSubmitted(false)
    setAnswers({})
    setPracticeState('practicing')
    startTimer(next.timeLimitSeconds)
  }, [startTimer])

  useEffect(() => {
    loadNextSet()
    return () => stopTimer()
  }, [loadNextSet, stopTimer])

  function handleSubmit() {
    if (!currentSet || (!selectedChoice && !timeUp)) return
    const q = currentSet.questions[questionIndex]
    const chosenChoice = selectedChoice ?? ''
    const isCorrect = chosenChoice === q.explanation.correctAnswerId

    setSubmitted(true)
    setAnswers(prev => ({ ...prev, [q.id]: chosenChoice }))

    addReadingQuestionHistory({
      readingSetId: currentSet.id,
      questionId: q.id,
      isCorrect,
      answeredAt: new Date().toISOString(),
    })
    addAnswerHistory({
      itemId: q.id,
      category: 'reading',
      isCorrect,
      answeredAt: new Date().toISOString(),
    })

    upsertReadingSetHistory({
      readingSetId: currentSet.id,
      hasBeenAttempted: true,
      fullyCorrectCompleted: false,
      lastAnsweredAt: new Date().toISOString(),
    })
  }

  function handleNext() {
    if (!currentSet) return

    if (questionIndex < currentSet.questions.length - 1) {
      setQuestionIndex(i => i + 1)
      setSelectedChoice(null)
      setSubmitted(false)
      setView('question')
    } else {
      stopTimer()
      // Evaluate the whole set
      const allAnswers = { ...answers }
      if (selectedChoice) {
        const q = currentSet.questions[questionIndex]
        allAnswers[q.id] = selectedChoice
      }

      const wrongIds = currentSet.questions
        .filter(q => allAnswers[q.id] !== q.explanation.correctAnswerId)
        .map(q => q.id)

      const fullyCorrect = wrongIds.length === 0

      if (fullyCorrect) {
        removeReadingReview(currentSet.id)
        upsertReadingSetHistory({
          readingSetId: currentSet.id,
          hasBeenAttempted: true,
          fullyCorrectCompleted: true,
          lastAnsweredAt: new Date().toISOString(),
        })
      } else {
        addReadingReview(currentSet.id, wrongIds)
        upsertReadingSetHistory({
          readingSetId: currentSet.id,
          hasBeenAttempted: true,
          fullyCorrectCompleted: false,
          lastAnsweredAt: new Date().toISOString(),
        })
      }

      setAnswers(allAnswers)
      setPracticeState('result')
    }
  }

  function handleImport(items: ReadingSet[]) {
    const existing = getReadingContent()
    const result = mergeReadingSets(existing, items)
    const resetTargets = [
      ...result.acceptedItems,
      ...result.acceptedItems
        .map(item => existing.find(existingItem => existingItem.id === item.id))
        .filter((item): item is ReadingSet => Boolean(item)),
    ]

    const ok = setReadingContent(result.items)
    resetReadingProgress(resetTargets)
    if (!ok) {
      setImportNotice('⚠️ ストレージがいっぱいです。設定画面からデータを削除してから再試行してください。')
    } else {
      setImportNotice(
        result.skippedDuplicateContentIds.length > 0
          ? `${result.acceptedItems.length}件を取り込み、内容重複の${result.skippedDuplicateContentIds.length}件をスキップしました。`
          : `${result.acceptedItems.length}件を取り込みました。`
      )
    }
    setShowImport(false)
    loadNextSet()
  }

  function handleLoadSample() {
    handleImport(completeReadingSample)
  }

  // ── Empty state ──────────────────────────────────────────────────
  if (practiceState === 'empty') {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <Link href="/" className="text-sm text-gray-500">← ホーム</Link>
          <span className="text-lg font-bold">読解</span>
          <button onClick={() => setShowImport(true)} className="text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg">
            JSON
          </button>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="text-5xl mb-2">📄</div>
          {importNotice && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 max-w-sm">
              {importNotice}
            </p>
          )}
          {emptyReason === 'noContent' ? (
            <p className="text-gray-500 text-sm">
              読解データがありません。<br/>
              まずはサンプル6種類を読み込むか、JSONをインポートしてください。
            </p>
          ) : (
            <p className="text-gray-500 text-sm">
              今日できる読解セットはもうありません。<br/>
              新しいJSONを追加するか、復習は明日もう一度確認してください。
            </p>
          )}
          <div className="w-full max-w-xs flex flex-col gap-3">
            <button onClick={handleLoadSample} className="btn-primary">
              サンプル6種類を入れる
            </button>
            <button onClick={() => setShowImport(true)} className="btn-secondary">
              JSONを入力
            </button>
          </div>
          <div className="text-xs text-gray-400 leading-relaxed">
            短文 / 中文 / 長文 / 統合理解 / 主張理解 / 情報検索
          </div>
        </div>
        {showImport && <ImportModal onClose={() => setShowImport(false)} onImport={handleImport} />}
      </div>
    )
  }

  // ── Loading ──────────────────────────────────────────────────────
  if (practiceState === 'loading' || !currentSet) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400 text-sm">読み込み中...</div>
      </div>
    )
  }

  // ── Result ───────────────────────────────────────────────────────
  if (practiceState === 'result') {
    return (
      <>
        <ResultScreen set={currentSet} answers={answers} onNext={loadNextSet} />
        {showImport && <ImportModal onClose={() => setShowImport(false)} onImport={handleImport} />}
      </>
    )
  }

  // ── Practicing ──────────────────────────────────────────────────
  const q = currentSet.questions[questionIndex]
  const isReview = wrongQuestionIds.includes(q.id)
  const timerWarning = timeLeft <= 30 && timeLeft > 0
  const timerCritical = timeLeft <= 10 && timeLeft > 0
  const explanationText = getDisplayExplanation(q.explanation)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
        <Link href="/" className="text-gray-400 text-sm shrink-0">←</Link>
        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full shrink-0">
          {KIND_LABELS[currentSet.kind] ?? currentSet.kind}
        </span>
        <div className="flex-1" />
        {timeUp ? (
          <span className="text-xs font-bold text-red-600">時間切れ</span>
        ) : (
          <span className={`text-sm font-mono font-medium tabular-nums ${timerCritical ? 'text-red-600 animate-pulse-fast' : timerWarning ? 'text-red-600' : 'text-gray-500'}`}>
            {formatTime(timeLeft)}
          </span>
        )}
        <button onClick={() => setShowImport(true)} className="text-xs text-gray-400 border border-gray-200 px-2 py-1 rounded-lg ml-1">
          JSON
        </button>
      </header>

      {/* Progress */}
      <div className="px-4 pt-2 pb-1 flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {currentSet.questions.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i < questionIndex
                  ? 'bg-black'
                  : i === questionIndex
                  ? 'bg-gray-400'
                  : 'bg-gray-100'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-400 shrink-0">
          {questionIndex + 1}/{currentSet.questions.length}
        </span>
      </div>

      {/* Content Switcher */}
      <div className="flex border-b border-gray-100 px-4">
        <button
          onClick={() => setView('passage')}
          className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            view === 'passage' ? 'border-black text-black' : 'border-transparent text-gray-400'
          }`}
        >
          本文
        </button>
        <button
          onClick={() => setView('question')}
          className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            view === 'question' ? 'border-black text-black' : 'border-transparent text-gray-400'
          }`}
        >
          設問
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        {view === 'passage' ? (
          <div className="px-4 py-4 space-y-4">
            {importNotice && (
              <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                {importNotice}
              </div>
            )}
            <p className="text-sm leading-loose text-gray-900 whitespace-pre-wrap">{currentSet.passage}</p>
          </div>
        ) : (
          <div className="px-4 py-4 space-y-4">
            {importNotice && (
              <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                {importNotice}
              </div>
            )}
            {/* Question */}
            <div>
              {isReview && (
                <span className="fukkyu-badge mb-2 block w-fit">復習</span>
              )}
              <p className="text-sm leading-relaxed text-gray-900">{q.prompt}</p>
            </div>

            {/* Choices */}
            <div className="space-y-2">
              {q.choices.map(c => {
                let cls = 'choice-btn text-sm'
                if (submitted) {
                  if (c.id === q.explanation.correctAnswerId) cls += ' choice-btn-correct'
                  else if (c.id === selectedChoice) cls += ' choice-btn-wrong'
                } else if (c.id === selectedChoice) {
                  cls += ' choice-btn-selected'
                }
                return (
                  <button
                    key={c.id}
                    className={cls}
                    disabled={submitted}
                    onClick={() => !submitted && setSelectedChoice(c.id)}
                  >
                    <span className="font-semibold mr-2">{c.label}.</span>{c.text}
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {submitted && (
              <div className={`text-xs p-3 rounded-xl leading-relaxed ${
                selectedChoice === q.explanation.correctAnswerId
                  ? 'bg-green-50 text-green-900 border border-green-200'
                  : 'bg-red-50 text-red-900 border border-red-200'
              }`}>
                <div className="font-medium mb-1">
                  {selectedChoice === q.explanation.correctAnswerId ? '✓ 正解' : '✗ 不正解'}
                </div>
                {explanationText}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto px-4 pb-6 pt-3 bg-white border-t border-gray-100 flex gap-3">
        <button
          className="btn-secondary flex-shrink-0 w-auto px-4 text-sm"
          onClick={() => setView(v => v === 'passage' ? 'question' : 'passage')}
        >
          {view === 'passage' ? '設問へ' : '本文へ'}
        </button>
        {!submitted ? (
          <button
            className="btn-primary flex-1"
            disabled={!selectedChoice && !timeUp}
            onClick={handleSubmit}
          >
            回答する
          </button>
        ) : (
          <button className="btn-primary flex-1" onClick={handleNext}>
            {questionIndex < currentSet.questions.length - 1 ? '次の問題' : '結果を見る'}
          </button>
        )}
      </div>

      {showImport && <ImportModal onClose={() => setShowImport(false)} onImport={handleImport} />}
    </div>
  )
}
