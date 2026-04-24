import type { VocabQuestion } from '@/types'

const completeVocabSample: VocabQuestion[] = [
  {
    id: 'vocab-kanji-reading-a1b2c3',
    kind: 'kanji-reading',
    prompt: '最近、この地域では地震が<u>頻繁</u>に発生している。',
    choices: [
      { id: 'c1', label: 'A', text: 'ひんばん' },
      { id: 'c2', label: 'B', text: 'ひんぱつ' },
      { id: 'c3', label: 'C', text: 'ひんぱん' },
      { id: 'c4', label: 'D', text: 'びんぱん' },
    ],
    explanation: {
      correctAnswerId: 'c3',
      fullExplanation:
        '「頻繁」đọc là「ひんぱん」, nghĩa là "thường xuyên, liên tục". Các phương án khác là cách đọc sai. Cần chú ý 頻 (ひん) và 繁 (はん→ぱん do biến âm). Câu đầy đủ: "Gần đây, ở khu vực này động đất xảy ra thường xuyên."',
    },
  },
  {
    id: 'vocab-orthography-b2c3d4',
    kind: 'orthography',
    prompt: '地球の<u>かんきょう</u>を守るため、私たちにできることを考えよう。',
    choices: [
      { id: 'c1', label: 'A', text: '還境' },
      { id: 'c2', label: 'B', text: '環境' },
      { id: 'c3', label: 'C', text: '環景' },
      { id: 'c4', label: 'D', text: '還景' },
    ],
    explanation: {
      correctAnswerId: 'c2',
      fullExplanation:
        '「かんきょう」viết đúng là「環境」, nghĩa là "môi trường". 環 (かん) = vòng, 境 (きょう) = ranh giới, nơi chốn. Các phương án khác dùng kanji sai (還 = trở về, 景 = cảnh). Câu đầy đủ: "Để bảo vệ môi trường Trái Đất, hãy cùng suy nghĩ xem chúng ta có thể làm gì."',
    },
  },
  {
    id: 'vocab-word-formation-c3d4e5',
    kind: 'word-formation',
    prompt: '日本社会では急速な（　　）が進んでいる。',
    choices: [
      { id: 'c1', label: 'A', text: '高齢性' },
      { id: 'c2', label: 'B', text: '高齢化' },
      { id: 'c3', label: 'C', text: '高齢式' },
      { id: 'c4', label: 'D', text: '高齢的' },
    ],
    explanation: {
      correctAnswerId: 'c2',
      fullExplanation:
        '「高齢化」(こうれいか) = sự già hóa/lão hóa. Hậu tố「〜化」dùng để biểu thị "sự biến đổi, sự trở thành" (例: 国際化, デジタル化). 「〜性」chỉ tính chất, 「〜式」chỉ kiểu/cách, 「〜的」chỉ tính từ đuôi. Câu đầy đủ: "Trong xã hội Nhật Bản, quá trình già hóa đang diễn ra nhanh chóng."',
    },
  },
  {
    id: 'vocab-context-defined-d4e5f6',
    kind: 'context-defined',
    prompt: 'この問題については、もう少し（　　）する必要がある。',
    choices: [
      { id: 'c1', label: 'A', text: '検討' },
      { id: 'c2', label: 'B', text: '検索' },
      { id: 'c3', label: 'C', text: '発見' },
      { id: 'c4', label: 'D', text: '解決' },
    ],
    explanation: {
      correctAnswerId: 'c1',
      fullExplanation:
        '「検討」(けんとう) = xem xét, cân nhắc kỹ lưỡng — phù hợp nhất với văn cảnh "cần xem xét thêm". 「検索」= tìm kiếm (thông tin), 「発見」= phát hiện, 「解決」= giải quyết. Câu đầy đủ: "Về vấn đề này, cần phải cân nhắc thêm một chút nữa."',
    },
  },
  {
    id: 'vocab-paraphrase-e5f6g7',
    kind: 'paraphrase',
    prompt: '<u>うっかり</u>財布を家に忘れてしまった。',
    choices: [
      { id: 'c1', label: 'A', text: 'わざと' },
      { id: 'c2', label: 'B', text: '不注意で' },
      { id: 'c3', label: 'C', text: '急いで' },
      { id: 'c4', label: 'D', text: 'しっかり' },
    ],
    explanation: {
      correctAnswerId: 'c2',
      fullExplanation:
        '「うっかり」= vô ý, đãng trí, không để ý ≒「不注意で」= do bất cẩn. 「わざと」= cố ý (ngược nghĩa), 「急いで」= vội vàng, 「しっかり」= chắc chắn (ngược nghĩa). Câu đầy đủ: "Tôi lỡ quên mất ví ở nhà vì bất cẩn."',
    },
  },
  {
    id: 'vocab-usage-f6g7h8',
    kind: 'usage',
    prompt: '「貢献」の使い方として最も適切なものはどれか。',
    choices: [
      { id: 'c1', label: 'A', text: '彼は毎朝、公園で貢献をしている。' },
      { id: 'c2', label: 'B', text: '貢献な料理が並んでいる。' },
      { id: 'c3', label: 'C', text: '彼女は地域社会に大きく貢献した。' },
      { id: 'c4', label: 'D', text: 'この本を貢献してください。' },
    ],
    explanation: {
      correctAnswerId: 'c3',
      fullExplanation:
        '「貢献」(こうけん) = cống hiến, đóng góp. Dùng với「〜に貢献する」để chỉ việc đóng góp cho một tổ chức/xã hội. A dùng sai ngữ cảnh, B dùng sai từ loại (không phải tính từ), D dùng sai (cống hiến không phải "đưa/tặng"). Câu C đúng nghĩa: "Cô ấy đã đóng góp lớn cho cộng đồng địa phương."',
    },
  },
]

export default completeVocabSample
