'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  getAnswerHistory,
  getGrammarReview,
  getVocabReview,
  getReadingReview,
  getGrammarContent,
  getVocabContent,
  getReadingContent,
} from '@/lib/storage'
import { computeOverviewSummary } from '@/lib/stats'
import type { OverviewSummary, SummaryStatLine } from '@/types'

function StatRow({ label, line }: { label: string; line: SummaryStatLine }) {
  return (
    <div className="grid grid-cols-[3rem_1fr_1fr_1fr_1fr_3rem] items-center gap-1 py-1.5 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-center text-gray-400 text-xs">{line.answered}問</span>
      <span className="text-center text-green-700 text-xs">{line.correct}正</span>
      <span className="text-center text-red-600 text-xs">{line.wrong}誤</span>
      <span className="text-center text-amber-700 text-xs">{line.reviewNeeded}復</span>
      <span className="font-medium text-gray-900 text-xs text-right">{line.accuracyRate}%</span>
    </div>
  )
}

function SummaryBlock({ summary }: { summary: OverviewSummary }) {
  const [tab, setTab] = useState<'7days' | 'all'>('7days')
  const data = tab === '7days' ? summary.last7Days : summary.allTime

  return (
    <div className="card mx-4">
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setTab('7days')}
          className={`flex-1 py-1.5 text-sm rounded-lg font-medium transition-colors ${
            tab === '7days' ? 'bg-black text-white' : 'text-gray-400'
          }`}
        >
          7日間
        </button>
        <button
          onClick={() => setTab('all')}
          className={`flex-1 py-1.5 text-sm rounded-lg font-medium transition-colors ${
            tab === 'all' ? 'bg-black text-white' : 'text-gray-400'
          }`}
        >
          累計
        </button>
      </div>

      <div className="border-b border-gray-100 pb-2 mb-2">
        <div className="grid grid-cols-[3rem_1fr_1fr_1fr_1fr_3rem] items-center gap-1 mb-1 text-xs text-gray-400">
          <span></span>
          <span className="text-center">回答</span>
          <span className="text-center">正解</span>
          <span className="text-center">誤答</span>
          <span className="text-center">復習</span>
          <span className="text-right">正答率</span>
        </div>
        <StatRow label="合計" line={data.total} />
      </div>

      <div className="space-y-0.5">
        <StatRow label="読解" line={data.reading} />
        <StatRow label="文法" line={data.grammar} />
        <StatRow label="語彙" line={data.vocab} />
      </div>
    </div>
  )
}

function ReviewBlock({
  reading,
  grammar,
  vocab,
}: {
  reading: number
  grammar: number
  vocab: number
}) {
  const total = reading + grammar + vocab
  return (
    <div className="card mx-4">
      <p className="section-label">復習リスト</p>
      {total === 0 ? (
        <p className="text-sm text-gray-400">復習項目なし</p>
      ) : (
        <div className="space-y-1">
          {reading > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">読解</span>
              <span className="font-medium">{reading}セット</span>
            </div>
          )}
          {grammar > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">文法</span>
              <span className="font-medium">{grammar}問</span>
            </div>
          )}
          {vocab > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">語彙</span>
              <span className="font-medium">{vocab}問</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  const [summary, setSummary] = useState<OverviewSummary | null>(null)
  const [reviewCounts, setReviewCounts] = useState({ reading: 0, grammar: 0, vocab: 0 })
  const [hasContent, setHasContent] = useState({ reading: false, grammar: false, vocab: false })

  useEffect(() => {
    const history = getAnswerHistory()
    const gReview = getGrammarReview()
    const vReview = getVocabReview()
    const rReview = getReadingReview()

    setSummary(computeOverviewSummary(history, gReview, vReview, rReview))
    setReviewCounts({
      reading: rReview.length,
      grammar: gReview.length,
      vocab: vReview.length,
    })
    setHasContent({
      reading: getReadingContent().length > 0,
      grammar: getGrammarContent().length > 0,
      vocab: getVocabContent().length > 0,
    })
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <h1 className="text-xl font-bold tracking-tight">JLPT N2</h1>
        <Link
          href="/setting"
          className="text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg active:bg-gray-50"
        >
          設定
        </Link>
      </header>

      <main className="flex-1 flex flex-col gap-5 py-5 pb-8">
        {/* Category Buttons */}
        <div className="px-4 flex flex-col gap-3">
          <CategoryButton
            href="/dokai"
            label="読解"
            sub="どっかい"
            hasContent={hasContent.reading}
            reviewCount={reviewCounts.reading}
          />
          <CategoryButton
            href="/bunpo"
            label="文法"
            sub="ぶんぽう"
            hasContent={hasContent.grammar}
            reviewCount={reviewCounts.grammar}
          />
          <CategoryButton
            href="/goi"
            label="語彙"
            sub="ごい"
            hasContent={hasContent.vocab}
            reviewCount={reviewCounts.vocab}
          />
        </div>

        {/* Summary */}
        {summary && (
          <div className="flex flex-col gap-2">
            <p className="section-label px-4">学習サマリー</p>
            <SummaryBlock summary={summary} />
          </div>
        )}

        {/* Review Counts */}
        <div className="flex flex-col gap-2">
          <p className="section-label px-4">復習</p>
          <ReviewBlock
            reading={reviewCounts.reading}
            grammar={reviewCounts.grammar}
            vocab={reviewCounts.vocab}
          />
        </div>
      </main>
    </div>
  )
}

function CategoryButton({
  href,
  label,
  sub,
  hasContent,
  reviewCount,
}: {
  href: string
  label: string
  sub: string
  hasContent: boolean
  reviewCount: number
}) {
  return (
    <Link href={href} className="block">
      <div className="bg-black text-white rounded-2xl px-6 py-5 flex items-center justify-between active:opacity-80 transition-opacity">
        <div>
          <div className="text-2xl font-bold">{label}</div>
          <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {!hasContent && (
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
              データなし
            </span>
          )}
          {reviewCount > 0 && (
            <span className="text-xs font-medium bg-white text-black px-2 py-0.5 rounded-full">
              復習 {reviewCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
