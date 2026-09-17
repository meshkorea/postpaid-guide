/* 연습 갈래와 단계 정의 (안드로이드 기준).
 *
 * 한 단계 = 화면 하나 + 지시 한 줄 + 눌러야 할 곳 하나.
 *   screen  screens.js의 함수 이름
 *   state   그 화면에 넘길 값 (금액, 배지, 얼럿 표시 여부 …)
 *   q       지금 어떤 상황인지 (배너 윗줄)
 *   a       무엇을 눌러야 하는지 (배너 아랫줄, <b>는 실제 버튼 이름)
 *   note    알아둘 것 (선택)
 *   target  눌러야 하는 요소의 선택자
 *   auto    누를 것이 없는 화면을 이 시간(ms) 뒤 자동으로 넘김
 *   type    키패드로 금액을 채우는 단계. 입력이 expect와 같아지면 넘어감
 */

const TOTAL = 58500

const TRACKS = [
  /* ═════════════ 1. 현금 결제 ═════════════ */
  {
    id: 'cash',
    title: '현금 결제',
    desc: '고객에게 현금을 받고 결제를 끝내요',
    steps: [
      {
        screen: 'detail',
        state: { order: 'cash', total: TOTAL },
        q: '고객에게 상품을 전달하고 현금을 받았어요',
        scene: { held: 'cash', say: '현금으로 낼게요' },
        a: '<b>현금 58,500원 결제하기</b>를 눌러주세요',
        target: '#cta',
      },
      {
        screen: 'cashAlert',
        state: { order: 'cash', total: TOTAL },
        q: '정말 현금으로 받았는지 한 번 더 물어봐요',
        a: '<b>현금 결제</b>를 눌러주세요',
        note: '받은 현금만큼 기사님 M캐시에서 차감돼요',
        target: '#a-cash',
      },
      {
        screen: 'progress',
        state: { under: 'detail', order: 'cash', total: TOTAL },
        q: '결제를 처리하고 있어요',
        a: '잠시만 기다려주세요',
        auto: 900,
      },
      {
        screen: 'done',
        state: { doneKind: 'cash' },
        q: '결제와 배달이 모두 끝났어요',
        a: '<b>확인</b>을 눌러 마무리해주세요',
        note: '배송수수료가 M캐시로 들어오면 위쪽에 알림이 잠깐 떠요',
        target: '#d-ok',
      },
    ],
    /* 완료 화면은 짧게 — 한 줄에 들어오는 길이로 씁니다. */
    recap: [
      '받은 현금만큼 <b>M캐시에서 차감</b>돼요',
      '취소는 <b>VCC 1800-8255</b> 전화로만 돼요',
    ],
  },

  /* ═════════════ 2. 카드 결제 ═════════════
   * 앞부분은 KIS Pay(리더기·NFC), 뒷부분은 카드번호 직접 입력(이지체크·KICC)입니다.
   * 기사가 둘 다 만나므로 한 갈래에서 이어서 연습합니다. */
  {
    id: 'card',
    title: '카드 결제',
    desc: 'KIS Pay로 받거나 카드번호를 직접 입력해요',
    steps: [
      {
        screen: 'detail',
        state: { order: 'card', total: TOTAL },
        q: '후불카드 오더예요. 고객이 카드를 줬어요',
        scene: { held: 'card', say: '카드로 결제할게요' },
        a: '<b>카드 58,500원 결제하기</b>를 눌러주세요',
        target: '#cta',
      },
      {
        screen: 'cardSheet',
        state: { order: 'card', total: TOTAL },
        q: '카드 결제 창이 열렸어요',
        a: '<b>두 가지 방법</b> 중에 고를 수 있어요',
        target: '.sheet__opts',
        tip: {
          title: '카드로 받는 방법은 두 가지',
          desc: 'KIS Pay 앱이 안 되면 <b>카드 직접 입력</b>으로 결제할 수 있어요',
        },
      },
      {
        screen: 'cardSheet',
        state: { order: 'card', total: TOTAL },
        q: '먼저 KIS Pay로 해볼게요',
        a: '<b>KIS Pay 결제</b>를 눌러주세요',
        target: '#c-kispay',
      },
      {
        screen: 'kispayLoading',
        state: {},
        q: 'KIS Pay 앱으로 넘어가고 있어요',
        a: '잠시만 기다려주세요',
        auto: 900,
      },
      {
        screen: 'kispay',
        state: { total: TOTAL },
        q: 'KIS Pay 앱이 열렸어요',
        a: '<b>여러 방법</b>으로 결제할 수 있어요',
        target: '.kis__grid',
        tip: {
          title: 'KIS Pay 결제 방법',
          desc: '카드 리더기가 있으면 <b>블루투스결제</b>, 없으면 신용결제·삼성페이·<b>카메라결제</b>·간편결제·애플페이를 쓸 수 있어요',
        },
      },
      {
        screen: 'kispay',
        state: { total: TOTAL },
        q: '이번에는 리더기 없이 해볼게요',
        a: '결제수단에서 <b>카메라결제</b>를 눌러주세요',
        target: '#k-way-camera',
      },
      {
        screen: 'kispayCamera',
        state: {},
        q: '카메라로 카드를 비추는 화면이에요',
        a: '네모 안의 <b>카드</b>를 눌러주세요',
        target: '#k-cam-card',
      },
      {
        screen: 'kispayReceipt',
        state: { total: TOTAL },
        q: '승인이 끝나고 영수증이 나왔어요',
        a: '<b>확인</b>을 눌러주세요',
        note: '확인을 눌러야 부릉플러스로 돌아와요',
        target: '#k-ok',
      },
      {
        screen: 'progress',
        state: { under: 'detail', order: 'card', total: TOTAL },
        q: '부릉플러스가 결제 결과를 받고 있어요',
        a: '잠시만 기다려주세요',
        auto: 900,
      },
      {
        screen: 'done',
        state: { doneKind: 'card' },
        q: 'KIS Pay로 받는 방법은 여기까지예요',
        a: '<b>확인</b>을 눌러 마무리해주세요',
        target: '#d-ok',
      },

      /* ── 여기서부터 카드번호 직접 입력 (이지체크 · KICC) ──
       * Figma 1346:124989~124995 순서 그대로입니다. */
      {
        screen: 'detail',
        state: { order: 'card', total: TOTAL },
        q: '이번에는 KIS Pay 앱이 안 돼요. 카드번호를 직접 입력해야 해요',
        a: '다시 <b>카드 58,500원 결제하기</b>를 눌러주세요',
        target: '#cta',
      },
      {
        screen: 'cardSheet',
        state: { order: 'card', total: TOTAL },
        q: '이번에는 아래쪽을 골라요',
        a: '<b>카드 직접 입력</b>을 눌러주세요',
        note: '이걸 누르면 이지체크(KICC) 앱이 열려요',
        target: '#c-keyin',
      },
      {
        screen: 'easycheckShop',
        state: {},
        q: '이지체크 앱이 열리고 가맹점 정보를 먼저 보여줘요',
        a: '<b>확인</b>을 눌러주세요',
        target: '#e-shop-ok',
      },
      {
        screen: 'easycheckRead',
        state: { readerAlert: true },
        q: '리더기를 등록할지 물어봐요',
        a: '<b>취소</b>를 눌러주세요',
        note: '번호만 넣을 거라 리더기는 등록하지 않아요',
        target: '#e-reader-no',
      },
      {
        screen: 'easycheckRead',
        state: {},
        q: '카드번호를 넣을 차례예요',
        a: '<b>첫 번째 칸</b>을 눌러주세요',
        target: '#e-no-0',
      },
      {
        screen: 'easycheckKeypad',
        state: { cardNo: ['4045', '77**', '', ''] },
        q: '숫자 자리가 섞인 보안 키패드가 올라와요',
        a: '번호를 다 넣고 <b>확인</b>을 눌러주세요',
        note: '누를 때마다 숫자 자리가 바뀌니 천천히 확인하고 누르세요',
        target: '#e-key-ok',
      },
      {
        screen: 'easycheckAmount',
        state: { total: TOTAL },
        q: '받을 금액이 맞는지 보여줘요',
        a: '금액이 맞으면 <b>확인</b>을 눌러주세요',
        note: '금액은 부릉플러스에서 넘어온 값이에요',
        target: '#e-amount-ok',
      },
      {
        screen: 'easycheckSign',
        state: { total: TOTAL },
        q: '서명 화면이에요. 화면이 가로로 돌아가요',
        a: '잠시만 기다려주세요',
        auto: 1600,
      },
      {
        screen: 'kiccSplash',
        state: {},
        q: 'KICC로 승인을 요청하고 있어요',
        a: '잠시만 기다려주세요',
        auto: 1000,
      },
      {
        screen: 'easycheckDone',
        state: { total: TOTAL },
        q: '승인이 끝났어요. 여기가 제일 중요해요',
        a: '<b>확인</b>을 꼭 눌러주세요',
        note: '이 확인을 눌러야 부릉플러스에 결제 결과가 들어가요',
        target: '#e-done-ok',
      },
      {
        screen: 'done',
        state: { doneKind: 'card' },
        q: '카드 직접 입력으로 결제가 끝났어요',
        a: '<b>확인</b>을 눌러 마무리해주세요',
        target: '#d-ok',
      },
    ],
    /* 마무리에서 바로 설치할 수 있게 스토어 주소를 답니다. */
    apps: [
      { name: 'KIS Pay', url: 'https://play.google.com/store/apps/details?id=kr.co.kisvan.mobile.konpay' },
      { name: '이지체크', url: 'https://play.google.com/store/apps/details?id=kr.co.kicc.ecm' },
    ],
    recap: [
      '카드 리더기가 있으면 <b>블루투스결제</b>',
      '리더기가 없어도 <b>카메라·간편결제·NFC</b>로 돼요',
      'KIS Pay가 안 되면 <b>카드 직접 입력</b>(이지체크)',
      '이지체크는 <b>마지막 확인</b>까지 눌러야 반영돼요',
    ],
  },

  /* ═════════════ 3. 분할 결제 ═════════════ */
  {
    id: 'split',
    title: '분할 결제',
    desc: '일부는 현금, 나머지는 카드로',
    steps: [
      {
        screen: 'detail',
        state: { order: 'cash', total: TOTAL },
        q: '고객이 2만원은 현금, 나머지는 카드로 내겠대요',
        scene: { held: 'split', say: '2만원은 현금으로 낼게요' },
        a: '<b>다른 방법으로 결제</b>를 눌러주세요',
        target: '#alt',
      },
      {
        screen: 'methodSheet',
        state: { order: 'cash', total: TOTAL },
        q: '받을 방법을 고를 수 있어요',
        a: '<b>분할</b>을 눌러주세요',
        target: '#m-split',
      },
      {
        screen: 'splitSheet',
        state: { order: 'cash', total: TOTAL, typed: 0 },
        q: '먼저 현금으로 받을 20,000원을 넣어요',
        a: '<b>+1만원</b>을 두 번 누르거나 숫자로 <b>20000</b>을 눌러주세요',
        type: { expect: 20000 },
        target: '.split__pad',
      },
      {
        screen: 'splitSheet',
        state: { order: 'cash', total: TOTAL, typed: 20000 },
        q: '20,000원을 넣었어요',
        a: '<b>현금</b>을 눌러주세요',
        target: '#s-cash',
      },
      {
        screen: 'cashAlert',
        state: { order: 'cash', total: TOTAL, payNow: 20000 },
        q: '이번 회차만 현금으로 받아요',
        a: '<b>현금 결제</b>를 눌러주세요',
        target: '#a-cash',
      },
      {
        screen: 'progress',
        state: { under: 'detail', order: 'cash', total: TOTAL },
        q: '현금 20,000원을 처리하고 있어요',
        a: '잠시만 기다려주세요',
        auto: 900,
      },
      {
        screen: 'detail',
        state: { order: 'cash', total: TOTAL, remain: 38500 },
        q: '20,000원을 받고 배달지 화면으로 돌아왔어요',
        scene: { held: 'card', say: '나머지는 카드로 할게요' },
        a: '<b>38,500원 결제하기</b>를 눌러주세요',
        note: '버튼에는 남은 금액만 떠요',
        target: '#cta',
      },
      {
        screen: 'splitSheet',
        state: { order: 'cash', total: TOTAL, remain: 38500, typed: 38500 },
        q: '남은 금액이 이미 채워져 있어요',
        a: '<b>카드</b>를 눌러주세요',
        note: '더 적게 받으려면 ✕로 지우고 다시 넣으면 돼요',
        target: '#s-card',
      },
      {
        screen: 'cardSheet',
        state: { order: 'cash', total: TOTAL, remain: 38500 },
        q: '카드로 받는 화면은 카드 결제와 같아요',
        a: '<b>KIS Pay 결제</b>를 눌러주세요',
        target: '#c-kispay',
      },
      {
        screen: 'kispay',
        state: { total: TOTAL, payNow: 38500 },
        q: '이번 회차 금액만 넘어와요',
        a: '결제수단에서 <b>카메라결제</b>를 눌러주세요',
        note: '58,500원이 아니라 남은 38,500원이 찍혀요',
        target: '#k-way-camera',
      },
      {
        screen: 'kispayCamera',
        state: {},
        q: '카드를 비춰 읽힐 차례예요',
        a: '네모 안의 <b>카드</b>를 눌러주세요',
        target: '#k-cam-card',
      },
      {
        screen: 'kispayReceipt',
        state: { total: TOTAL, payNow: 38500 },
        q: '남은 금액 승인이 끝났어요',
        a: '<b>확인</b>을 눌러주세요',
        target: '#k-ok',
      },
      {
        screen: 'progress',
        state: { under: 'detail', order: 'cash', total: TOTAL, remain: 38500 },
        q: '남은 금액을 처리하고 있어요',
        a: '잠시만 기다려주세요',
        auto: 900,
      },
      {
        screen: 'done',
        state: { doneKind: 'split' },
        q: '두 번에 나눠 전액을 받았어요',
        a: '<b>확인</b>을 눌러 마무리해주세요',
        target: '#d-ok',
      },
    ],
    recap: [
      '회차마다 <b>현금·카드</b>를 따로 고를 수 있어요',
    ],
  },

  /* ═════════════ 4. 현금영수증 발급 ═════════════
   * `안드로이드_현금 영수증.jpg` 플로우: 수행목록 → 결제내역 → 발급번호 입력
   * → KIS Pay 현금영수증 → 영수증. */
  {
    id: 'receipt',
    title: '현금영수증 발급',
    desc: '현금으로 받은 건에 영수증을 끊어줘요',
    steps: [
      {
        screen: 'mainMap',
        state: {},
        q: '방금 현금으로 받은 건이에요',
        scene: { held: 'receipt', say: '현금영수증 발급해주세요' },
        a: '오른쪽 위 <b>수행목록</b>을 눌러주세요',
        target: '#m-tasks',
      },
      {
        screen: 'taskList',
        state: {},
        q: '방금 배달한 건을 펼쳐뒀어요',
        a: '<b>결제내역</b>을 눌러주세요',
        target: '#t-pay',
      },
      {
        screen: 'payHistory',
        state: { total: TOTAL },
        q: '현금으로 받은 건이 보여요',
        a: '<b>현금 영수증 발급</b>을 눌러주세요',
        note: '카드로 받은 건에는 이 버튼이 없어요',
        target: '#p-receipt',
      },
      {
        screen: 'receiptSheet',
        state: { total: TOTAL },
        q: '개인용인지 사업자용인지 고르고 번호를 넣어요',
        a: '<b>번호 칸</b>을 눌러 고객 번호를 넣어주세요',
        note: '사업자 지출증빙이면 위에서 바꿔주세요',
        target: '#r-input',
      },
      {
        screen: 'receiptSheet',
        state: { total: TOTAL, no: '01012345678' },
        q: '번호를 다 넣었어요',
        a: '<b>발급하기</b>를 눌러주세요',
        target: '#r-issue',
      },
      {
        screen: 'kisCashReceipt',
        state: { total: TOTAL },
        q: 'KIS Pay 현금영수증 화면으로 넘어왔어요',
        a: '<b>현금영수증 발행</b>을 눌러주세요',
        note: '넣은 번호가 그대로 넘어와요',
        target: '#k-issue',
      },
      {
        screen: 'kispayReceipt',
        state: { total: TOTAL, receipt: 'cash' },
        q: '발급이 끝나고 영수증이 나왔어요',
        a: '<b>확인</b>을 눌러주세요',
        note: '확인을 눌러야 부릉플러스로 돌아와요',
        target: '#k-ok',
      },
      {
        /* 부릉플러스로 돌아오는 동안 «발급중»이 뜹니다 (882:82753) */
        screen: 'progress',
        state: { label: '발급중', under: 'payHistory', total: TOTAL },
        q: '부릉플러스로 돌아오고 있어요',
        a: '잠시만 기다려주세요',
        auto: 900,
      },
      {
        screen: 'payHistory',
        state: { total: TOTAL, issued: true },
        q: '발급이 끝났어요',
        a: '한 번 발급하면 <b>버튼이 꺼져요</b>',
        auto: 2400,
      },
    ],
    recap: [
      '<b>수행목록 → 결제내역</b>에서 발급해요',
      '현금으로 받은 건에만 <b>현금영수증 발급</b> 버튼이 있어요',
      '잘못 접수되면 <b>VCC 1800-8255</b>로 문의해요',
    ],
  },
]
