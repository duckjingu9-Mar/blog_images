/* Signal and Silicon: Blogger 언어 설정이 한국어로 고정되어 있어(설정 화면 오류로 변경 불가),
   Blogger가 자동으로 넣는 한국어 문구와 날짜를 영어(미국식)로 바꾼다.
   테마 HTML의 </body> 바로 앞에 <script> 로 들어간다. 원본: design/english-ui.js */
(function () {
  var MAP = {
    '기본 콘텐츠로 건너뛰기': 'Skip to main content',
    '자세한 내용 보기': 'Read more',
    '댓글 쓰기': 'Post a Comment',
    '댓글': 'Comments',
    '프로필로 이동': 'Visit profile',
    '자료실': 'Archive',
    '보관함': 'Archive',
    '블로그 보관함': 'Archive',
    '글': 'Posts',
    '게시물': 'Posts',
    '홈': 'Home',
    '공유': 'Share',
    '공유하기': 'Share',
    '기타 앱': 'Other Apps',
    '링크 복사': 'Copy link',
    '링크 가져오기': 'Get link',
    '이메일': 'Email',
    '더보기…': 'More…',
    '더보기': 'More',
    '모두 표시': 'Show all',
    '간략히 보기': 'Show less',
    '검색': 'Search',
    '이 블로그 검색': 'Search this blog',
    '태그': 'Topics',
    '라벨': 'Labels',
    '최근 게시물': 'Latest posts',
    '이전 게시물': 'Older posts',
    '최근 글': 'Newer posts',
    '이 블로그의 인기 게시물': 'Popular posts from this blog',
    '인기 게시물': 'Popular posts',
    '추천 게시물': 'Featured post',
    '구독': 'Subscribe',
    '신고하기': 'Report Abuse',
    '댓글 없음': 'No comments',
    '댓글을 입력하세요.': 'Enter your comment...',
    '게시물 더보기': 'More posts',
    '닫기': 'Close'
  };
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  function tr(s) {
    var t = s.trim();
    if (!t) return null;
    if (MAP[t]) return s.replace(t, MAP[t]);
    var m = t.match(/^(\d{1,2})월$/);                       // 보관함의 "11월"
    if (m) return s.replace(t, MONTHS[+m[1] - 1]);
    m = t.match(/^(\d{1,2})월 (\d{1,2}), (\d{4})$/);         // "11월 22, 2026"
    if (m) return s.replace(t, MONTHS[+m[1] - 1] + ' ' + (+m[2]) + ', ' + m[3]);
    m = t.match(/^댓글 (\d+)개$/);
    if (m) return s.replace(t, m[1] + (m[1] === '1' ? ' comment' : ' comments'));
    return null;
  }

  function fixDates(root) {
    var times = root.querySelectorAll('time[datetime]');
    for (var i = 0; i < times.length; i++) {
      var d = new Date(times[i].getAttribute('datetime'));
      if (!isNaN(d)) times[i].textContent = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/New_York' });
    }
  }

  function walk(root) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false), n, out;
    while ((n = w.nextNode())) {
      if (!/[가-힣]/.test(n.nodeValue)) continue;
      out = tr(n.nodeValue);
      if (out !== null) n.nodeValue = out;
    }
    var attrs = ['aria-label', 'title', 'placeholder', 'alt'];
    var els = root.querySelectorAll('[aria-label],[title],[placeholder],[alt]');
    for (var i = 0; i < els.length; i++) {
      for (var j = 0; j < attrs.length; j++) {
        var v = els[i].getAttribute(attrs[j]);
        if (v && /[가-힣]/.test(v)) { out = tr(v); if (out !== null) els[i].setAttribute(attrs[j], out); }
      }
    }
  }

  function run() {
    document.documentElement.setAttribute('lang', 'en-US');
    fixDates(document);
    walk(document.body);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  // 나중에 붙는 공유 메뉴, 댓글 등도 처리
  if (window.MutationObserver) {
    var busy = false;
    new MutationObserver(function () {
      if (busy) return; busy = true;
      setTimeout(function () { walk(document.body); busy = false; }, 50);
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
