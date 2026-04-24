'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  getReadingContent,
  getGrammarContent,
  getVocabContent,
  getGrammarReview,
  getVocabReview,
  getReadingReview,
  getAnswerHistory,
  deleteGrammarData,
  deleteVocabData,
  deleteReadingData,
  setReadingContent,
  setGrammarContent,
  setVocabContent,
  resetReadingProgress,
  resetGrammarProgress,
  resetVocabProgress,
  getStorageUsageKB,
} from '@/lib/storage'
import { buildMarkdownExport } from '@/lib/export'
import { mergeGrammarQuestions } from '@/lib/grammar'
import { mergeReadingSets } from '@/lib/reading'
import { mergeVocabQuestions } from '@/lib/vocab'
import type { ReadingSet, GrammarQuestion, VocabQuestion } from '@/types'

type ConfirmTarget = 'reading' | 'grammar' | 'vocab' | null

const CATEGORY_VN: Record<string, string> = {
  reading: 'Đọc hiểu (読解)',
  grammar: 'Ngữ pháp (文法)',
  vocab: 'Từ vựng (語彙)',
}

function ImportModal({
  category,
  onClose,
  onImport,
}: {
  category: 'reading' | 'grammar' | 'vocab'
  onClose: () => void
  onImport: (text: string) => void
}) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    setError('')
    try {
      const parsed = JSON.parse(text)
      const items = Array.isArray(parsed) ? parsed : parsed?.items
      if (!Array.isArray(items) || items.length === 0) throw new Error()
      onImport(text)
    } catch {
      setError('JSON không hợp lệ — vui lòng kiểm tra lại định dạng')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end" onClick={onClose}>
      <div
        className="bg-white w-full max-w-lg mx-auto rounded-t-3xl p-5 pb-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
        <h2 className="text-lg font-bold mb-1">Nhập dữ liệu JSON</h2>
        <p className="text-xs text-gray-400 mb-3">{CATEGORY_VN[category]}</p>
        <p className="text-xs text-gray-500 mb-2">
          Dán nội dung JSON vào ô bên dưới rồi nhấn <strong>Nhập</strong>.
          Dữ liệu mới sẽ được <strong>gộp thêm</strong> vào dữ liệu hiện có.
          {category === 'reading' && ' Với đọc hiểu, ID trùng sẽ cập nhật nội dung và đặt lại tiến độ học; khác ID nhưng trùng nội dung sẽ bị bỏ qua.'}
          {category === 'grammar' && ' Với ngữ pháp, ID trùng sẽ cập nhật nội dung và đặt lại tiến độ học; khác ID nhưng trùng nội dung sẽ bị bỏ qua.'}
          {category === 'vocab' && ' Với từ vựng, ID trùng có thể được làm mới để học lại, còn khác ID nhưng trùng nội dung sẽ bị bỏ qua.'}
        </p>
        <textarea
          className="w-full h-44 border border-gray-200 rounded-xl p-3 text-sm font-mono resize-none focus:outline-none focus:border-black"
          placeholder={`{"category":"${category}","items":[...]}`}
          value={text}
          onChange={e => setText(e.target.value)}
        />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        <div className="flex gap-3 mt-3">
          <button className="btn-secondary flex-1" onClick={onClose}>Huỷ</button>
          <button className="btn-primary flex-1" onClick={handleSubmit}>Nhập</button>
        </div>
      </div>
    </div>
  )
}

function ConfirmDialog({
  label,
  onConfirm,
  onCancel,
}: {
  label: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-6 w-full max-w-xs">
        <p className="text-base font-medium mb-2">Xác nhận xoá dữ liệu</p>
        <p className="text-sm text-gray-500 mb-6">
          Toàn bộ dữ liệu của mục <strong>{label}</strong> sẽ bị xoá vĩnh viễn, bao gồm câu hỏi, lịch sử làm bài và danh sách ôn tập. Không thể hoàn tác.
        </p>
        <div className="flex gap-3">
          <button className="btn-secondary flex-1" onClick={onCancel}>Huỷ</button>
          <button
            className="flex-1 bg-red-600 text-white font-medium py-3 px-4 rounded-xl active:opacity-70 transition-opacity"
            onClick={onConfirm}
          >
            Xoá
          </button>
        </div>
      </div>
    </div>
  )
}

function CategorySection({
  category,
  itemCount,
  reviewCount,
  onImport,
  onDelete,
}: {
  category: 'reading' | 'grammar' | 'vocab'
  itemCount: number
  reviewCount: number
  onImport: () => void
  onDelete: () => void
}) {
  const label = CATEGORY_VN[category]
  return (
    <div className="card mx-4">
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-base">{label}</span>
      </div>
      <div className="flex gap-3 text-xs text-gray-400 mb-3">
        <span>{itemCount} câu hỏi</span>
        {reviewCount > 0 && (
          <span className="text-amber-700 font-medium">⚑ {reviewCount} cần ôn</span>
        )}
        {itemCount === 0 && (
          <span className="text-gray-300">— chưa có dữ liệu</span>
        )}
      </div>
      <div className="space-y-2">
        <button
          className="btn-secondary text-sm py-2.5"
          onClick={onImport}
        >
          📥 Nhập JSON
        </button>
        <button
          className="w-full text-left py-2.5 px-4 rounded-xl border border-red-100 text-red-600 text-sm active:bg-red-50 transition-colors"
          onClick={onDelete}
        >
          🗑 Xoá toàn bộ dữ liệu mục này
        </button>
      </div>
    </div>
  )
}

export default function SettingPage() {
  const [importTarget, setImportTarget] = useState<'reading' | 'grammar' | 'vocab' | null>(null)
  const [confirmTarget, setConfirmTarget] = useState<ConfirmTarget>(null)
  const [counts, setCounts] = useState({ reading: 0, grammar: 0, vocab: 0 })
  const [reviewCounts, setReviewCounts] = useState({ reading: 0, grammar: 0, vocab: 0 })
  const [historyCount, setHistoryCount] = useState(0)
  const [exported, setExported] = useState(false)
  const [importNotice, setImportNotice] = useState('')
  const [storageKB, setStorageKB] = useState(0)

  function refreshCounts() {
    setCounts({
      reading: getReadingContent().length,
      grammar: getGrammarContent().length,
      vocab: getVocabContent().length,
    })
    setReviewCounts({
      reading: getReadingReview().length,
      grammar: getGrammarReview().length,
      vocab: getVocabReview().length,
    })
    setHistoryCount(getAnswerHistory().length)
    setStorageKB(getStorageUsageKB())
  }

  useEffect(() => {
    refreshCounts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleImport(text: string) {
    if (!importTarget) return
    setImportNotice('')
    try {
      const parsed = JSON.parse(text)
      const items = Array.isArray(parsed) ? parsed : parsed?.items

      if (importTarget === 'reading') {
        const existing = getReadingContent()
        const result = mergeReadingSets(existing, items as ReadingSet[])
        const resetTargets = [
          ...result.acceptedItems,
          ...result.acceptedItems
            .map(item => existing.find(existingItem => existingItem.id === item.id))
            .filter((item): item is ReadingSet => Boolean(item)),
        ]
        const ok = setReadingContent(result.items)
        resetReadingProgress(resetTargets)
        setImportNotice(
          !ok
            ? '⚠️ Bộ nhớ đã đầy! Hãy xoá bớt dữ liệu trước khi nhập thêm.'
            : result.skippedDuplicateContentIds.length > 0
              ? `${result.acceptedItems.length} bộ đọc hiểu được nhập, ${result.skippedDuplicateContentIds.length} bộ trùng nội dung đã bị bỏ qua.`
              : `${result.acceptedItems.length} bộ đọc hiểu đã được nhập.`
        )
      } else if (importTarget === 'grammar') {
        const result = mergeGrammarQuestions(getGrammarContent(), items as GrammarQuestion[])
        const ok = setGrammarContent(result.items)
        resetGrammarProgress(result.acceptedIds)
        setImportNotice(
          !ok
            ? '⚠️ Bộ nhớ đã đầy! Hãy xoá bớt dữ liệu trước khi nhập thêm.'
            : result.skippedDuplicateContentIds.length > 0
              ? `${result.acceptedIds.length} câu ngữ pháp được nhập, ${result.skippedDuplicateContentIds.length} câu trùng nội dung đã bị bỏ qua.`
              : `${result.acceptedIds.length} câu ngữ pháp đã được nhập.`
        )
      } else if (importTarget === 'vocab') {
        const result = mergeVocabQuestions(getVocabContent(), items as VocabQuestion[])
        const ok = setVocabContent(result.items)
        resetVocabProgress(result.acceptedIds)
        setImportNotice(
          !ok
            ? '⚠️ Bộ nhớ đã đầy! Hãy xoá bớt dữ liệu trước khi nhập thêm.'
            : result.skippedDuplicateContentIds.length > 0
              ? `${result.acceptedIds.length} câu được nhập, ${result.skippedDuplicateContentIds.length} câu trùng nội dung đã bị bỏ qua.`
              : `${result.acceptedIds.length} câu từ vựng đã được nhập.`
        )
      }
    } catch {
      // handled by modal
    }
    setImportTarget(null)
    refreshCounts()
  }

  function handleDelete() {
    if (!confirmTarget) return
    if (confirmTarget === 'reading') deleteReadingData()
    if (confirmTarget === 'grammar') deleteGrammarData()
    if (confirmTarget === 'vocab') deleteVocabData()
    setConfirmTarget(null)
    refreshCounts()
  }

  function handleExport() {
    const md = buildMarkdownExport(
      getGrammarReview(),
      getVocabReview(),
      getReadingReview(),
      getGrammarContent(),
      getVocabContent(),
      getReadingContent()
    )
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `n2-cau-sai-${new Date().toISOString().slice(0, 10)}.md`
    a.click()
    URL.revokeObjectURL(url)
    setExported(true)
    setTimeout(() => setExported(false), 2500)
  }

  const totalReview = reviewCounts.reading + reviewCounts.grammar + reviewCounts.vocab

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <Link href="/" className="text-sm text-gray-500">← Trang chủ</Link>
        <span className="text-lg font-bold">Cài đặt</span>
        <div className="w-16" />
      </header>

      <main className="flex-1 overflow-y-auto py-5 space-y-5 pb-12">
        {importNotice && (
          <div className="mx-4 border border-amber-200 bg-amber-50 text-amber-900 rounded-2xl px-4 py-3 text-sm">
            {importNotice}
          </div>
        )}

        {/* Hướng dẫn nhanh */}
        <div className="mx-4 bg-gray-50 rounded-2xl p-4 text-sm text-gray-600 space-y-1.5">
          <p className="font-semibold text-gray-800 mb-2">Hướng dẫn sử dụng</p>
          <p>① Nhấn <strong>Nhập JSON</strong> ở từng mục để tải câu hỏi vào ứng dụng.</p>
          <p>② Quay lại trang chủ và nhấn nút <strong>読解 / 文法 / 語彙</strong> để bắt đầu luyện tập.</p>
          <p>③ Sau khi trả lời sai, câu đó tự động vào <strong>danh sách ôn tập</strong>.</p>
          <p>④ Dùng nút <strong>Xuất câu sai</strong> để tải file Markdown về gửi ChatGPT.</p>
        </div>

        {/* Thống kê tổng quan */}
        <div className="mx-4">
          <p className="section-label">Tổng quan dữ liệu</p>
          <div className="card">
            <div className="grid grid-cols-3 divide-x divide-gray-100 text-center mb-3">
              <div className="px-2">
                <div className="text-xl font-bold">{counts.reading + counts.grammar + counts.vocab}</div>
                <div className="text-xs text-gray-400 mt-0.5">Câu hỏi</div>
              </div>
              <div className="px-2">
                <div className="text-xl font-bold">{historyCount}</div>
                <div className="text-xs text-gray-400 mt-0.5">Đã làm</div>
              </div>
              <div className="px-2">
                <div className="text-xl font-bold">{totalReview}</div>
                <div className="text-xs text-gray-400 mt-0.5">Cần ôn</div>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Dung lượng đã dùng</span>
                <span className={`font-medium ${storageKB > 4000 ? 'text-red-600' : storageKB > 2000 ? 'text-amber-600' : 'text-gray-600'}`}>
                  {storageKB} KB / ~5120 KB
                </span>
              </div>
              <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${storageKB > 4000 ? 'bg-red-500' : storageKB > 2000 ? 'bg-amber-400' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(100, (storageKB / 5120) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Xuất câu sai */}
        <div className="mx-4">
          <p className="section-label">Xuất câu sai</p>
          <div className="card">
            {totalReview > 0 ? (
              <>
                <p className="text-sm text-gray-600 mb-3">
                  Bạn có <strong>{totalReview} câu</strong> cần ôn tập. Xuất ra file Markdown để dán vào ChatGPT xin giải thích thêm.
                </p>
                <button
                  className="btn-outline text-sm py-2.5 w-full"
                  onClick={handleExport}
                >
                  {exported ? '✓ Đã tải xuống!' : '📄 Xuất câu sai (.md)'}
                </button>
              </>
            ) : (
              <p className="text-sm text-gray-400">Chưa có câu sai nào để xuất.</p>
            )}
          </div>
        </div>

        {/* Quản lý từng mục */}
        <div>
          <p className="section-label px-4">Quản lý dữ liệu</p>
          <div className="space-y-3">
            <CategorySection
              category="reading"
              itemCount={counts.reading}
              reviewCount={reviewCounts.reading}
              onImport={() => setImportTarget('reading')}
              onDelete={() => setConfirmTarget('reading')}
            />
            <CategorySection
              category="grammar"
              itemCount={counts.grammar}
              reviewCount={reviewCounts.grammar}
              onImport={() => setImportTarget('grammar')}
              onDelete={() => setConfirmTarget('grammar')}
            />
            <CategorySection
              category="vocab"
              itemCount={counts.vocab}
              reviewCount={reviewCounts.vocab}
              onImport={() => setImportTarget('vocab')}
              onDelete={() => setConfirmTarget('vocab')}
            />
          </div>
        </div>

        <div className="mx-4 pt-1">
          <p className="text-xs text-gray-300 text-center">
            Dữ liệu được lưu trong localStorage của trình duyệt này
          </p>
        </div>
      </main>

      {importTarget && (
        <ImportModal
          category={importTarget}
          onClose={() => setImportTarget(null)}
          onImport={handleImport}
        />
      )}

      {confirmTarget && (
        <ConfirmDialog
          label={CATEGORY_VN[confirmTarget]}
          onConfirm={handleDelete}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </div>
  )
}
