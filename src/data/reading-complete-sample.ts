import type { ReadingSet } from '@/types'

const completeReadingSample: ReadingSet[] = [
  {
    id: 'reading-short-a1b2c3',
    kind: 'short',
    title: '読書の効用',
    passage:
      '読書にはさまざまな効用がある。まず、知識を広げることができる。本を通じて、自分が経験したことのない世界や時代にふれられるからだ。また、想像力も鍛えられる。文字だけで場面を思い描く作業は、脳にとって良い訓練になる。さらに、他人の考え方や感情に触れることで、人間理解も深まる。忙しい現代人こそ、一日十分でも本を開く時間を持ちたいものだ。',
    vietnameseTranslation:
      'Việc đọc sách có nhiều lợi ích. Trước tiên, ta có thể mở rộng kiến thức. Bởi vì thông qua sách, ta có thể tiếp xúc với những thế giới và thời đại mà mình chưa từng trải nghiệm. Ngoài ra, trí tưởng tượng cũng được rèn luyện. Việc hình dung bối cảnh chỉ bằng con chữ là một sự rèn luyện tốt cho não bộ. Hơn nữa, khi tiếp xúc với cách nghĩ và cảm xúc của người khác, sự hiểu biết về con người cũng trở nên sâu sắc hơn. Chính người hiện đại bận rộn càng nên dành ra dù chỉ mười phút mỗi ngày để mở một cuốn sách.',
    timeLimitSeconds: 180,
    questions: [
      {
        id: 'q1',
        prompt: 'この文章で筆者が最も伝えたいことは何か。',
        choices: [
          { id: 'c1', label: 'A', text: '読書は経験の代わりになるので旅行は不要だ。' },
          { id: 'c2', label: 'B', text: '現代人は忙しいので読書する時間を作るべきだ。' },
          { id: 'c3', label: 'C', text: '読書は子どもにとってのみ必要な訓練である。' },
          { id: 'c4', label: 'D', text: '十分な読書時間を確保することは不可能である。' },
        ],
        explanation: {
          correctAnswerId: 'c2',
          fullExplanation:
            'Câu cuối "忙しい現代人こそ、一日十分でも本を開く時間を持ちたいものだ" là ý chính tác giả muốn truyền đạt: người hiện đại bận rộn càng nên dành thời gian đọc sách. A sai vì bài không nói đọc sách thay thế du lịch. C sai vì bài không giới hạn ở trẻ em. D sai vì tác giả cho rằng nên có thời gian đọc, không nói là không thể.',
        },
      },
    ],
  },
  {
    id: 'reading-medium-b2c3d4',
    kind: 'medium',
    title: '在宅勤務について',
    passage:
      '近年、在宅勤務を取り入れる企業が急速に増えている。通勤時間がなくなることで、従業員は時間を有効に使えるようになり、仕事と家庭の両立がしやすくなった。企業にとっても、オフィスの維持費を削減できる利点がある。\n\nしかし、問題がないわけではない。同僚と直接顔を合わせる機会が減るため、コミュニケーションが不足し、チームとしての一体感が失われがちだ。また、仕事とプライベートの区別がつきにくく、かえって労働時間が長くなる人も少なくないと言われる。\n\nある調査によれば、在宅勤務を経験した社員の約七割が「続けたい」と答える一方、同じ調査で半数以上が「孤独を感じる」と回答している。便利さと引き換えに、私たちは人と人とのつながりを失いつつあるのかもしれない。これからの働き方は、在宅とオフィスをうまく組み合わせることが鍵になるだろう。',
    vietnameseTranslation:
      'Những năm gần đây, các công ty áp dụng chế độ làm việc tại nhà đang tăng nhanh chóng. Nhờ không còn thời gian đi lại, nhân viên có thể tận dụng thời gian hiệu quả, cân bằng giữa công việc và gia đình dễ dàng hơn. Đối với công ty, cũng có lợi thế cắt giảm chi phí duy trì văn phòng.\n\nTuy nhiên, không phải không có vấn đề. Do ít có cơ hội gặp mặt trực tiếp đồng nghiệp, việc giao tiếp trở nên thiếu hụt, cảm giác đoàn kết trong nhóm dễ bị mất đi. Ngoài ra, ranh giới giữa công việc và đời tư trở nên mờ nhạt, không ít người ngược lại làm việc quá giờ.\n\nTheo một khảo sát, khoảng 70% nhân viên từng làm việc tại nhà trả lời "muốn tiếp tục", nhưng cũng trong khảo sát đó hơn một nửa trả lời "cảm thấy cô đơn". Có lẽ, đổi lại sự tiện lợi, chúng ta đang dần đánh mất sự kết nối giữa con người. Cách làm việc sắp tới, chìa khóa sẽ là kết hợp tốt giữa làm việc tại nhà và tại văn phòng.',
    timeLimitSeconds: 360,
    questions: [
      {
        id: 'q1',
        prompt: '在宅勤務のデメリットとして本文で挙げられているものはどれか。',
        choices: [
          { id: 'c1', label: 'A', text: 'オフィスの維持費が高くなること' },
          { id: 'c2', label: 'B', text: '通勤時間が長くなること' },
          { id: 'c3', label: 'C', text: '家庭との両立ができなくなること' },
          { id: 'c4', label: 'D', text: '労働時間が逆に長くなることがあること' },
        ],
        explanation: {
          correctAnswerId: 'c4',
          fullExplanation:
            'Đoạn 2: "仕事とプライベートの区別がつきにくく、かえって労働時間が長くなる人も少なくない" → D đúng. A sai vì bài nói chi phí văn phòng giảm. B sai vì không còn thời gian đi lại. C sai vì bài nói dễ cân bằng hơn.',
        },
      },
      {
        id: 'q2',
        prompt: '筆者はこれからの働き方についてどう考えているか。',
        choices: [
          { id: 'c1', label: 'A', text: '完全に在宅勤務に移行するのが望ましい。' },
          { id: 'c2', label: 'B', text: '在宅とオフィスを組み合わせるのが重要だ。' },
          { id: 'c3', label: 'C', text: '従来通りオフィス勤務に戻すべきだ。' },
          { id: 'c4', label: 'D', text: '働き方の変化は避けるべきだ。' },
        ],
        explanation: {
          correctAnswerId: 'c2',
          fullExplanation:
            'Câu cuối: "在宅とオフィスをうまく組み合わせることが鍵になるだろう" → B đúng. Tác giả không chủ trương hoàn toàn tại nhà (A), cũng không quay lại hoàn toàn (C), và không phản đối thay đổi (D).',
        },
      },
    ],
  },
  {
    id: 'reading-long-c3d4e5',
    kind: 'long',
    title: '失敗から学ぶこと',
    passage:
      '人は誰でも失敗を避けたいと考える。できることなら、一度も失敗せずに順調に人生を歩みたいと願うのは自然な気持ちだろう。しかし、実際に振り返ってみると、人が本当に成長するのは、成功したときよりも、失敗したときのほうが多いのではないだろうか。\n\n失敗したとき、私たちはまず落ち込む。なぜうまくいかなかったのかと自問する。この「なぜ」を繰り返すことで、自分の弱点や考え方の癖に気づくことができる。一方、成功しているときは、「このやり方で間違っていなかった」と思うだけで、それ以上深く考える機会は少ない。\n\nある有名な発明家は、何百回も失敗を重ねた末に電球を発明したと言われている。彼は「私は失敗したのではない。うまくいかない方法を何百通りも見つけただけだ」と語ったという。この言葉には、失敗を前向きにとらえる姿勢が表れている。失敗は終わりではなく、次への手がかりなのだ。\n\nもちろん、失敗を肯定するといっても、同じ失敗を繰り返すのがよいという意味ではない。大切なのは、失敗の原因を自分なりに分析し、次の行動に生かすことだ。そのためには、失敗を恥ずかしいものとして隠すのではなく、周囲と共有する勇気も必要だろう。\n\n若い人たちに伝えたいのは、失敗を恐れて何もしないことこそ、最大の損失だということだ。挑戦しなければ、成功も失敗も得られない。失敗から何かを学び取れる限り、それは決して無駄にはならない。',
    vietnameseTranslation:
      'Ai cũng muốn tránh thất bại. Có thể được, thì mong muốn đi hết cuộc đời suôn sẻ không một lần thất bại là điều tự nhiên. Tuy nhiên, khi nhìn lại thực tế, chẳng phải con người thật sự trưởng thành nhiều hơn khi thất bại so với khi thành công sao?\n\nKhi thất bại, chúng ta trước tiên sẽ chán nản. Tự hỏi vì sao lại không suôn sẻ. Lặp lại câu "vì sao" này, ta có thể nhận ra điểm yếu và thói quen suy nghĩ của mình. Ngược lại, khi đang thành công, ta chỉ nghĩ "cách làm này không sai" và ít có cơ hội suy nghĩ sâu hơn.\n\nMột nhà phát minh nổi tiếng được cho là đã phát minh ra bóng đèn sau hàng trăm lần thất bại. Ông được cho là đã nói: "Tôi không thất bại. Tôi chỉ đơn giản tìm ra hàng trăm cách không hoạt động." Lời nói này thể hiện thái độ nhìn nhận thất bại một cách tích cực. Thất bại không phải là kết thúc, mà là manh mối cho bước tiếp theo.\n\nTất nhiên, nói khẳng định thất bại không có nghĩa là nên lặp lại cùng một sai lầm. Điều quan trọng là phân tích nguyên nhân thất bại theo cách của mình và vận dụng vào hành động tiếp theo. Vì vậy, cần có can đảm chia sẻ thất bại với những người xung quanh thay vì giấu giếm như điều đáng xấu hổ.\n\nĐiều tôi muốn truyền đạt cho các bạn trẻ: chính việc không làm gì vì sợ thất bại mới là tổn thất lớn nhất. Không thử thách thì không có cả thành công lẫn thất bại. Chỉ cần ta có thể học được điều gì đó từ thất bại, điều đó sẽ không bao giờ là vô ích.',
    timeLimitSeconds: 540,
    questions: [
      {
        id: 'q1',
        prompt: '筆者によれば、人が本当に成長するのはいつか。',
        choices: [
          { id: 'c1', label: 'A', text: '成功したとき' },
          { id: 'c2', label: 'B', text: '失敗したとき' },
          { id: 'c3', label: 'C', text: '何もしなかったとき' },
          { id: 'c4', label: 'D', text: '他人を助けたとき' },
        ],
        explanation: {
          correctAnswerId: 'c2',
          fullExplanation:
            'Đoạn 1: "人が本当に成長するのは、成功したときよりも、失敗したときのほうが多い" → B đúng. Tác giả khẳng định người ta trưởng thành nhiều hơn khi thất bại.',
        },
      },
      {
        id: 'q2',
        prompt: '発明家の言葉から読み取れるのはどのような姿勢か。',
        choices: [
          { id: 'c1', label: 'A', text: '失敗は恥ずかしいので隠すべきだという姿勢' },
          { id: 'c2', label: 'B', text: '成功するまで他人に頼るべきだという姿勢' },
          { id: 'c3', label: 'C', text: '失敗を前向きにとらえる姿勢' },
          { id: 'c4', label: 'D', text: '失敗を避けるのが賢明だという姿勢' },
        ],
        explanation: {
          correctAnswerId: 'c3',
          fullExplanation:
            'Đoạn 3: "この言葉には、失敗を前向きにとらえる姿勢が表れている" → C đúng. Câu nói của nhà phát minh thể hiện thái độ tích cực với thất bại.',
        },
      },
      {
        id: 'q3',
        prompt: '筆者が若い人たちに伝えたいことは何か。',
        choices: [
          { id: 'c1', label: 'A', text: '挑戦しないことが最大の損失である。' },
          { id: 'c2', label: 'B', text: '同じ失敗は何度繰り返してもよい。' },
          { id: 'c3', label: 'C', text: '失敗は完全に避けるべきだ。' },
          { id: 'c4', label: 'D', text: '成功した人だけが挑戦する資格がある。' },
        ],
        explanation: {
          correctAnswerId: 'c1',
          fullExplanation:
            'Đoạn cuối: "失敗を恐れて何もしないことこそ、最大の損失だ" → A đúng. B sai vì tác giả nói không nên lặp lại. C sai vì tác giả ủng hộ thử thách. D sai, bài không nói vậy.',
        },
      },
    ],
  },
  {
    id: 'reading-integrated-d4e5f6',
    kind: 'integrated',
    title: 'スマートフォンと子ども',
    passage:
      '【A】\nスマートフォンを子どもに持たせることに反対する声は根強い。確かに、長時間画面を見続けることは視力や姿勢に悪影響を与えるし、SNSでのトラブルに巻き込まれる危険もある。しかし、現代社会において完全にスマートフォンから子どもを遠ざけることは現実的ではない。むしろ、親が一緒に使い方を学び、ルールを決めて適切に付き合わせる方が、将来のためになるのではないか。禁止するだけでは問題は解決しない。\n\n【B】\n子どもにスマートフォンを与える年齢はできるだけ遅い方がよい。脳が発達する大切な時期に、短い動画を次々と見るような習慣をつけてしまうと、集中力が育ちにくいと専門家は指摘する。友達との直接の会話や外遊びの時間が減ることも問題だ。便利な道具であることは否定しないが、子ども時代にしか身につけられない力がある。親は「周りが持っているから」という理由で簡単に渡すべきではない。',
    vietnameseTranslation:
      '【A】\nTiếng nói phản đối việc cho trẻ em sử dụng smartphone vẫn còn mạnh mẽ. Quả thật, việc nhìn màn hình liên tục trong thời gian dài ảnh hưởng xấu đến thị lực và tư thế, cũng có nguy cơ dính vào rắc rối trên SNS. Tuy nhiên, trong xã hội hiện đại, việc tách trẻ em hoàn toàn khỏi smartphone là không thực tế. Thay vào đó, chẳng phải việc cha mẹ cùng học cách sử dụng, đặt ra quy tắc và hướng dẫn trẻ sử dụng phù hợp sẽ có ích cho tương lai hơn sao? Chỉ cấm đoán thì không giải quyết được vấn đề.\n\n【B】\nĐộ tuổi cho trẻ em dùng smartphone càng muộn càng tốt. Các chuyên gia chỉ ra rằng nếu hình thành thói quen xem liên tục các video ngắn trong giai đoạn quan trọng phát triển não bộ, thì sự tập trung sẽ khó phát triển. Việc giảm thời gian trò chuyện trực tiếp với bạn bè và chơi ngoài trời cũng là vấn đề. Không phủ nhận đây là công cụ tiện lợi, nhưng có những năng lực chỉ có thể hình thành trong tuổi thơ. Cha mẹ không nên dễ dàng đưa cho trẻ chỉ vì lý do "mọi người xung quanh có".',
    timeLimitSeconds: 420,
    questions: [
      {
        id: 'q1',
        prompt: 'AとBはスマートフォンを子どもに持たせることについて、どのような立場か。',
        choices: [
          { id: 'c1', label: 'A', text: 'AもBも完全に反対している。' },
          { id: 'c2', label: 'B', text: 'AもBも完全に賛成している。' },
          { id: 'c3', label: 'C', text: 'Aは適切な使用なら肯定的、Bは慎重派である。' },
          { id: 'c4', label: 'D', text: 'Aは慎重派、Bは積極的に勧めている。' },
        ],
        explanation: {
          correctAnswerId: 'c3',
          fullExplanation:
            'A nói "ルールを決めて適切に付き合わせる方が将来のためになる" → lập trường tích cực có điều kiện. B nói "与える年齢はできるだけ遅い方がよい" → lập trường thận trọng. Do đó đáp án C đúng. A và D đảo ngược quan điểm.',
        },
      },
      {
        id: 'q2',
        prompt: 'AとBに共通する考えはどれか。',
        choices: [
          { id: 'c1', label: 'A', text: 'スマートフォンには問題がないわけではない。' },
          { id: 'c2', label: 'B', text: '子どもには絶対にスマートフォンを持たせてはいけない。' },
          { id: 'c3', label: 'C', text: '親は子どもの使用に関与しなくてよい。' },
          { id: 'c4', label: 'D', text: '学校でスマートフォンの使い方を教えるべきだ。' },
        ],
        explanation: {
          correctAnswerId: 'c1',
          fullExplanation:
            'A thừa nhận "視力や姿勢に悪影響", B nêu "集中力が育ちにくい" → cả hai đều thừa nhận có vấn đề. B sai vì A không cấm hoàn toàn. C sai, cả hai đều đề cập vai trò cha mẹ. D không được đề cập ở cả hai bài.',
        },
      },
    ],
  },
  {
    id: 'reading-claim-e5f6g7',
    kind: 'claim',
    title: '情報社会における読解力',
    passage:
      '現代は、かつてないほど多くの情報に囲まれている時代である。インターネットを開けば、一瞬で世界中のニュースや意見にアクセスできる。便利になった一方で、私たちに求められる力も変わってきた。それは、情報を「早く多く読む力」ではなく、「深く正しく読む力」である。\n\n残念ながら、現代人の読解力は低下していると言われている。短い文章や見出しだけを読んで内容を理解したつもりになり、全体の文脈を捉えられないまま意見を形成してしまう。SNSでの議論がしばしばかみ合わないのも、このためだろう。\n\n深く読むためには、時間をかけることが欠かせない。著者の意図はどこにあるのか、主張を支える根拠は十分か、反対の立場から見たらどうか——こうした問いを自分に投げかけながら読む習慣が必要だ。画面をスクロールする速さと、理解の深さは、決して両立しない。\n\nまた、一つの情報源だけに頼るのも危険である。同じ出来事でも、伝える立場や視点によって見え方は大きく異なる。複数の情報を比べ、その差異を考えることこそ、真の「読解力」だと私は考える。\n\n情報が多すぎる時代だからこそ、私たちは立ち止まって読むことを学び直すべきではないだろうか。',
    vietnameseTranslation:
      'Thời đại ngày nay bị bao vây bởi lượng thông tin nhiều chưa từng có. Chỉ cần mở Internet, ta có thể tiếp cận tin tức và ý kiến khắp thế giới trong tích tắc. Trở nên tiện lợi, nhưng năng lực được yêu cầu ở chúng ta cũng thay đổi. Đó không phải là "khả năng đọc nhanh và nhiều" thông tin, mà là "khả năng đọc sâu và chính xác".\n\nTiếc là, khả năng đọc hiểu của người hiện đại được cho là đang giảm sút. Chỉ đọc đoạn văn ngắn hay tiêu đề rồi tưởng là đã hiểu nội dung, hình thành ý kiến mà không nắm bắt được toàn bộ văn cảnh. Các tranh luận trên SNS thường không ăn khớp, có lẽ cũng vì lý do này.\n\nĐể đọc sâu, việc bỏ thời gian là không thể thiếu. Ý đồ tác giả nằm ở đâu, luận cứ hỗ trợ có đủ không, nhìn từ lập trường đối lập thì sao — cần thói quen tự đặt những câu hỏi như vậy khi đọc. Tốc độ cuộn màn hình và chiều sâu hiểu biết không bao giờ có thể song hành.\n\nNgoài ra, chỉ dựa vào một nguồn thông tin cũng nguy hiểm. Cùng một sự kiện, cách nhìn sẽ khác nhau rất nhiều tùy vào lập trường và góc nhìn truyền tải. Chính việc so sánh nhiều nguồn thông tin và suy nghĩ về sự khác biệt đó mới là "năng lực đọc hiểu" thực sự — tôi nghĩ vậy.\n\nChính vì là thời đại quá nhiều thông tin, chẳng phải chúng ta nên dừng lại và học lại cách đọc sao?',
    timeLimitSeconds: 480,
    questions: [
      {
        id: 'q1',
        prompt: '筆者の主張として最も適切なものはどれか。',
        choices: [
          { id: 'c1', label: 'A', text: '現代人は情報量を増やすべきだ。' },
          { id: 'c2', label: 'B', text: '情報を深く正しく読む力が必要である。' },
          { id: 'c3', label: 'C', text: 'インターネットを使うのをやめるべきだ。' },
          { id: 'c4', label: 'D', text: 'SNSで意見を発信してはいけない。' },
        ],
        explanation: {
          correctAnswerId: 'c2',
          fullExplanation:
            'Luận điểm chính của tác giả nằm ở đoạn 1: "求められる力は、『深く正しく読む力』である" → B đúng. A ngược lại với lập trường "không cần nhiều, cần sâu". C và D không được tác giả chủ trương.',
        },
      },
      {
        id: 'q2',
        prompt: '筆者が考える「真の読解力」とは何か。',
        choices: [
          { id: 'c1', label: 'A', text: '画面を速くスクロールできる能力' },
          { id: 'c2', label: 'B', text: '見出しだけを読んで要点をつかむ能力' },
          { id: 'c3', label: 'C', text: '一つの情報源を信頼する能力' },
          { id: 'c4', label: 'D', text: '複数の情報を比べ差異を考える能力' },
        ],
        explanation: {
          correctAnswerId: 'c4',
          fullExplanation:
            'Đoạn 4: "複数の情報を比べ、その差異を考えることこそ、真の『読解力』だ" → D đúng. A bị phủ định trong đoạn 3 ("画面をスクロールする速さと、理解の深さは両立しない"). B là hành vi bị phê phán ở đoạn 2. C bị phủ định ("一つの情報源だけに頼るのも危険").',
        },
      },
    ],
  },
  {
    id: 'reading-info-search-f6g7h8',
    kind: 'information-search',
    title: '市民文化センター 春の講座案内',
    passage:
      '【さくら市 市民文化センター　春の講座案内】\n\n◆講座一覧\n①「初心者の俳句教室」\n　・日時：毎週水曜日 10:00〜11:30（全8回）\n　・料金：市民 4,000円／市外 6,000円\n　・定員：20名（先着順）\n\n②「親子で楽しむ料理教室」\n　・日時：第2土曜日 14:00〜16:00（全4回）\n　・料金：親子1組 8,000円（材料費込み）\n　・定員：10組（先着順）\n　・対象：小学生の子どもと保護者\n\n③「英会話ビギナーズ」\n　・日時：毎週金曜日 19:00〜20:30（全10回）\n　・料金：市民 6,000円／市外 9,000円\n　・定員：15名（抽選）\n\n◆申し込み方法\n・窓口受付：平日 9:00〜17:00（土日祝は休み）\n・インターネット：センター公式サイトから\n・締切：4月20日（月）\n\n◆注意事項\n・市外の方は、市民料金では受講できません。\n・③英会話ビギナーズは申込多数の場合、抽選となります。結果は4月25日までにメールでお知らせします。\n・一度納入された受講料は、原則返金できません。ただし、センター側の都合で講座が中止になった場合は全額返金します。',
    vietnameseTranslation:
      '【Trung tâm Văn hóa Công dân Sakura — Hướng dẫn Khóa học Mùa xuân】\n\n◆Danh sách khóa học\n①「Lớp Haiku cho người mới bắt đầu」\n・Thời gian: Thứ Tư hàng tuần 10:00〜11:30 (tổng 8 buổi)\n・Học phí: Công dân TP 4,000 yên / Ngoài TP 6,000 yên\n・Số lượng: 20 người (theo thứ tự đăng ký)\n\n②「Lớp nấu ăn cha mẹ con cái cùng vui」\n・Thời gian: Thứ Bảy tuần 2 hàng tháng 14:00〜16:00 (tổng 4 buổi)\n・Học phí: 1 cặp cha mẹ con 8,000 yên (bao gồm nguyên liệu)\n・Số lượng: 10 cặp (theo thứ tự đăng ký)\n・Đối tượng: Trẻ tiểu học và phụ huynh\n\n③「Hội thoại tiếng Anh cho người mới」\n・Thời gian: Thứ Sáu hàng tuần 19:00〜20:30 (tổng 10 buổi)\n・Học phí: Công dân TP 6,000 yên / Ngoài TP 9,000 yên\n・Số lượng: 15 người (rút thăm)\n\n◆Cách đăng ký\n・Đăng ký tại quầy: Ngày thường 9:00〜17:00 (nghỉ T7, CN, lễ)\n・Internet: Từ trang chủ của trung tâm\n・Hạn chót: Thứ Hai 20/4\n\n◆Lưu ý\n・Người ngoài thành phố không thể đăng ký với mức phí công dân.\n・③ nếu có nhiều người đăng ký sẽ rút thăm. Kết quả sẽ được thông báo qua email trước ngày 25/4.\n・Học phí một khi đã nộp, về nguyên tắc không hoàn lại. Tuy nhiên nếu trung tâm hủy lớp vì lý do riêng sẽ hoàn lại toàn bộ.',
    timeLimitSeconds: 360,
    questions: [
      {
        id: 'q1',
        prompt:
          'さくら市在住の田中さん（大人）が、金曜日の夜に受講できる講座を探している。最も条件に合う講座と料金はどれか。',
        choices: [
          { id: 'c1', label: 'A', text: '①俳句教室・4,000円' },
          { id: 'c2', label: 'B', text: '②料理教室・8,000円' },
          { id: 'c3', label: 'C', text: '③英会話ビギナーズ・6,000円' },
          { id: 'c4', label: 'D', text: '③英会話ビギナーズ・9,000円' },
        ],
        explanation: {
          correctAnswerId: 'c3',
          fullExplanation:
            'Điều kiện: cư dân Sakura + tối thứ Sáu. ① là thứ Tư sáng (loại), ② là thứ Bảy chiều và dành cho phụ huynh-trẻ em (loại), ③ là thứ Sáu tối, phù hợp. Vì là cư dân thành phố → 6,000円 → C đúng. D sai vì 9,000円 là giá người ngoài thành phố.',
        },
      },
      {
        id: 'q2',
        prompt: '受講料について正しいのはどれか。',
        choices: [
          { id: 'c1', label: 'A', text: 'どのような場合でも一度納入した料金は返金されない。' },
          { id: 'c2', label: 'B', text: 'センターが講座を中止した場合は全額返金される。' },
          { id: 'c3', label: 'C', text: '市外の人でも市民料金で受講できる。' },
          { id: 'c4', label: 'D', text: '料理教室の材料費は別料金である。' },
        ],
        explanation: {
          correctAnswerId: 'c2',
          fullExplanation:
            'Mục 注意事項: "センター側の都合で講座が中止になった場合は全額返金します" → B đúng. A sai vì có ngoại lệ hoàn tiền. C sai vì "市外の方は市民料金では受講できません". D sai vì ② ghi rõ "材料費込み" (đã bao gồm).',
        },
      },
    ],
  },
]

export default completeReadingSample
