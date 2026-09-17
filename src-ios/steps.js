/* 연습 갈래와 단계 정의 — 아이폰(iOS) 기준.
 *
 * 단계 모양은 안드로이드와 같습니다 (src/steps.js 머리말 참고).
 * 안드로이드와 갈리는 곳만 적어둡니다.
 *   · KIS Pay가 없습니다. 카드는 «카드 결제하기»를 누르면 곧장 이지체크로 넘어갑니다
 *   · 결제수단에 «QR 간편»이 있습니다. 고객 폰의 바코드·QR을 카메라로 읽습니다
 *   · 분할 결제는 한 회차를 받으면 «결제 완료»가 잠깐 떴다 사라지고,
 *     바텀시트가 닫히며 남은 금액이 찍힌 배달지 화면으로 돌아옵니다
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
    recap: ['받은 현금만큼 <b>M캐시에서 차감</b>돼요', '취소는 <b>VCC 1800-8255</b> 전화로만 돼요'],
  },

  /* ═════════════ 2. 카드 결제 ═════════════
   * 아이폰은 KIS Pay를 거치지 않고 바로 이지체크(KICC) 앱으로 넘어갑니다. */
  {
    id: 'card',
    title: '카드 결제',
    desc: '이지체크 앱에서 카드를 읽어요',
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
        note: '리더기가 있으면 확인을 눌러 등록해두면 다음부터 자동으로 연결돼요',
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
        screen: 'progress',
        state: { under: 'detail', order: 'card', total: TOTAL },
        q: '부릉플러스가 결제 결과를 받고 있어요',
        a: '잠시만 기다려주세요',
        auto: 900,
      },
      {
        screen: 'done',
        state: { doneKind: 'card' },
        q: '카드 결제가 끝났어요',
        a: '<b>확인</b>을 눌러 마무리해주세요',
        target: '#d-ok',
      },
    ],
    /* 아이폰은 KIS Pay를 쓰지 않아 이지체크만 답니다. */
    apps: [{ name: '이지체크', url: 'https://apps.apple.com/kr/app/easycheckic/id1043451429' }],
    recap: [
      '<b>앱 설치</b>와 <b>가맹점 다운로드</b>를 최초 1번 해야 결제돼요',
      '이지체크는 <b>마지막 확인</b>까지 눌러야 반영돼요',
    ],
  },

  /* ═════════════ 3. QR 간편결제 ═════════════
   * 아이폰에만 있습니다. 고객 폰의 바코드·QR을 기사님 카메라로 읽습니다. */
  {
    id: 'qr',
    title: 'QR 간편결제',
    desc: '고객 폰의 바코드를 카메라로 읽어요',
    steps: [
      {
        screen: 'detail',
        state: { order: 'card', total: TOTAL },
        q: '고객이 카드 대신 <b>페이로 내겠다</b>고 해요',
        scene: { held: 'qr', say: '페이로 결제할게요' },
        a: '<b>다른 방법으로 결제</b>를 눌러주세요',
        target: '#alt',
      },
      {
        screen: 'methodSheet',
        state: { order: 'card', total: TOTAL },
        q: '결제 방법을 고르는 창이에요',
        a: '<b>QR 간편</b>을 눌러주세요',
        target: '#m-qr',
      },
      {
        screen: 'ecQr',
        state: {},
        q: '이지체크 간편결제가 열리고 카메라가 켜져요',
        a: '고객 폰의 <b>바코드</b>를 비춰주세요',
        target: '#e-qr-code',
      },
      {
        screen: 'ecQr',
        state: { reading: true },
        q: '바코드를 읽고 번호가 맞는지 물어봐요',
        a: '<b>확인</b>을 눌러주세요',
        target: '#e-qr-ok',
      },
      {
        screen: 'ecQrNum',
        state: {},
        q: '읽은 번호와 결제 유형을 보여줘요',
        a: '<b>확인</b>을 눌러주세요',
        target: '#e-qrno-ok',
      },
      {
        screen: 'ecQrAmount',
        state: { total: TOTAL },
        q: '받을 금액이 맞는지 보여줘요',
        a: '금액이 맞으면 <b>확인</b>을 눌러주세요',
        target: '#e-qramt-ok',
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
        screen: 'progress',
        state: { under: 'detail', order: 'card', total: TOTAL },
        q: '부릉플러스가 결제 결과를 받고 있어요',
        a: '잠시만 기다려주세요',
        auto: 900,
      },
      {
        screen: 'done',
        state: { doneKind: 'card' },
        q: '간편결제가 끝났어요',
        a: '<b>확인</b>을 눌러 마무리해주세요',
        target: '#d-ok',
      },
    ],
    recap: [
      '<b>다른 방법으로 결제 → QR 간편</b>으로 들어가요',
      '고객 폰의 <b>바코드·QR</b>을 카메라로 읽어요',
    ],
  },

  /* ═════════════ 4. 분할 결제 ═════════════
   * 한 회차를 받으면 «결제 완료»가 잠깐 떴다 사라지고, 잔액이 줄어든
   * 분할 화면에 그대로 남습니다 (안드로이드는 배달지 화면으로 나갑니다). */
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
        q: '결제 방법을 고르는 창이에요',
        a: '<b>분할</b>을 눌러주세요',
        target: '#m-split',
      },
      {
        screen: 'splitSheet',
        state: { order: 'cash', total: TOTAL },
        q: '먼저 현금으로 받을 20,000원을 넣어요',
        a: '<b>+1만원</b>을 두 번 누르거나 숫자로 <b>20000</b>을 눌러주세요',
        type: { expect: 20000 },
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
        screen: 'splitDone',
        state: { order: 'cash', total: TOTAL, typed: 20000, paidWith: 'cash' },
        q: '현금 20,000원을 받았어요',
        a: '잠깐 뜨고 저절로 사라져요',
        note: '잠시 뒤 시트가 닫히고 배달지 화면으로 돌아와요',
        auto: 1500,
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
        state: { total: TOTAL, payNow: 38500 },
        q: '남은 38,500원이 찍혀요',
        a: '금액이 맞으면 <b>확인</b>을 눌러주세요',
        note: '총액이 아니라 이번 회차 금액이에요',
        target: '#e-amount-ok',
      },
      {
        screen: 'easycheckSign',
        state: { total: TOTAL, payNow: 38500 },
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
        state: { total: TOTAL, payNow: 38500 },
        q: '남은 금액 승인이 끝났어요. 여기가 제일 중요해요',
        a: '<b>확인</b>을 꼭 눌러주세요',
        note: '이 확인을 눌러야 부릉플러스에 결제 결과가 들어가요',
        target: '#e-done-ok',
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
        q: '두 번에 나눠 모두 받았어요',
        a: '<b>확인</b>을 눌러 마무리해주세요',
        target: '#d-ok',
      },
    ],
    recap: [
      '회차마다 <b>현금·카드·QR</b>을 따로 고를 수 있어요',
    ],
  },

  /* ═════════════ 5. 현금영수증 발급 ═════════════
   * 아이폰은 KIS Pay가 없어 현금영수증도 이지체크로 넘어갑니다.
   * 이지체크에서는 «소비자소득공제»라는 이름이고, 카드번호 대신
   * 식별번호(휴대폰번호나 주민번호) 한 칸을 받습니다.
   * 안드로이드와 달리 부릉플러스 시트에서는 번호를 받지 않고,
   * «번호 입력하기»로 이지체크를 열어 거기서 번호를 넣습니다 (1397:125018~125024). */
  {
    id: 'receipt',
    title: '현금영수증 발급',
    desc: '현금으로 받은 건에 영수증을 끊어줘요',
    steps: [
      {
        screen: 'mainMap',
        state: {},
        q: '고객이 현금영수증을 해달라고 해요',
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
        q: '개인용인지 사업자용인지 골라요',
        a: '<b>번호 입력하기</b>를 눌러주세요',
        note: '사업자 지출증빙이면 위에서 바꿔주세요',
        target: '#r-issue',
      },
      {
        screen: 'ecCashShop',
        state: {},
        q: '이지체크가 열리고 가맹점 정보를 보여줘요',
        a: '<b>확인</b>을 눌러주세요',
        target: '#e-cash-shop-ok',
      },
      {
        screen: 'ecCashId',
        state: { readerAlert: true },
        q: '리더기를 등록할지 물어봐요',
        a: '<b>취소</b>를 눌러주세요',
        note: '번호만 넣을 거라 리더기는 등록하지 않아요',
        target: '#e-reader-no',
      },
      {
        screen: 'ecCashId',
        state: {},
        q: '고객 번호를 넣을 차례예요',
        a: '<b>식별번호</b> 칸을 눌러주세요',
        target: '#e-cash-no',
      },
      {
        screen: 'ecCashKeypad',
        state: {},
        q: '숫자 자리가 섞인 보안 키패드가 올라와요',
        a: '번호를 다 넣고 <b>확인</b>을 눌러주세요',
        note: '누를 때마다 숫자 자리가 바뀌니 천천히 확인하고 누르세요',
        target: '#e-cash-key-ok',
      },
      {
        screen: 'ecCashAmount',
        state: { total: TOTAL },
        q: '발급할 금액이 맞는지 보여줘요',
        a: '금액이 맞으면 <b>확인</b>을 눌러주세요',
        target: '#e-cash-amt-ok',
      },
      {
        screen: 'kiccSplash',
        state: {},
        q: 'KICC로 발급을 요청하고 있어요',
        a: '잠시만 기다려주세요',
        auto: 1000,
      },
      {
        screen: 'ecCashDone',
        state: { total: TOTAL },
        q: '발급이 끝나고 영수증이 나왔어요',
        a: '<b>확인</b>을 꼭 눌러주세요',
        note: '이 확인을 눌러야 부릉플러스로 돌아와요',
        target: '#e-cash-done-ok',
      },
      {
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
