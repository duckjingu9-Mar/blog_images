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
    '공유 링크 만들기': 'Get link',
    '테마 이미지 제공:': 'Theme images by',
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
    '닫기': 'Close',
    '기타 앱과 공유': 'Share to other apps',
    '이미지': 'Image',
    '내 사진': 'My photo',
    '이름': 'Name',
    '메시지': 'Message',
    '보내기': 'Send'
  };
  // 문의 양식이 띄우는 성공/오류 문구(정확한 한국어 원문을 몰라 내용과 상관없이 영어 문구로 바꿈)
  var CF_SUCCESS = 'Thanks! Your message has been sent.';
  var CF_ERROR = 'Please enter a valid email address and a message, then try again.';
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  function tr(s) {
    var t = s.trim();
    if (!t) return null;
    if (MAP[t]) return s.replace(t, MAP[t]);
    var m = t.match(/^(\d{1,2})월$/);                       // 보관함의 "11월"
    if (m) return s.replace(t, MONTHS[+m[1] - 1]);
    m = t.match(/^(\d{1,2})월 (\d{4})$/);                   // 보관함의 "11월 2026"
    if (m) return s.replace(t, MONTHS[+m[1] - 1] + ' ' + m[2]);
    m = t.match(/^(\d{1,2})월 (\d{1,2}), (\d{4})$/);         // "11월 22, 2026"
    if (m) return s.replace(t, MONTHS[+m[1] - 1] + ' ' + (+m[2]) + ', ' + m[3]);
    m = t.match(/^(.+)에 공유$/);                            // "Facebook에 공유"
    if (m) return s.replace(t, 'Share to ' + m[1]);
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
      var p = n.parentElement;
      if (p && p.closest('.contact-form-success-message')) { n.nodeValue = CF_SUCCESS; continue; }
      if (p && p.closest('.contact-form-error-message')) { n.nodeValue = CF_ERROR; continue; }
      out = tr(n.nodeValue);
      if (out !== null) n.nodeValue = out;
    }
    var attrs = ['aria-label', 'title', 'placeholder', 'alt', 'value'];
    var els = root.querySelectorAll('[aria-label],[title],[placeholder],[alt],input[type=button][value],input[type=submit][value]');
    for (var i = 0; i < els.length; i++) {
      for (var j = 0; j < attrs.length; j++) {
        var v = els[i].getAttribute(attrs[j]);
        if (v && /[가-힣]/.test(v)) { out = tr(v); if (out !== null) els[i].setAttribute(attrs[j], out); }
      }
    }
  }

  // Contempo는 사이드바를 숨기므로, 사이드바의 문의 양식 가젯(ContactForm1)을
  // Contact 페이지 본문의 <div id="contact-form-here"> 자리로 옮긴다. 다른 화면에서는 숨긴다.
  function placeContactForm() {
    var cf = document.getElementById('ContactForm1');
    var slot = document.getElementById('contact-form-here');
    if (!cf) return;
    if (slot && !slot.contains(cf)) {
      slot.appendChild(cf);
      cf.style.display = 'block';
      var h = cf.querySelector('h3.title');
      if (h) h.style.display = 'none';
    } else if (!slot) {
      cf.style.display = 'none';
    }
  }

  function addFormStyle() {
    var css = '#contact-form-here{margin:24px 0;padding:24px;border:1px solid #E5E7EB;border-radius:12px;background:#F9FAFB;max-width:560px}' +
      '#contact-form-here .contact-form-widget{max-width:none}' +
      '#contact-form-here form{font-size:16px;color:#1F2937}' +
      '#contact-form-here input[type=text],#contact-form-here textarea{display:block;width:100%;max-width:none;box-sizing:border-box;margin:6px 0 4px;padding:10px 12px;border:1px solid #CBD5E1;border-radius:8px;font:inherit;background:#fff}' +
      '#contact-form-here textarea{min-height:140px}' +
      '#contact-form-here .contact-form-button-submit{margin-top:8px;padding:10px 24px;height:auto;border:0;border-radius:8px;background:#0F766E;color:#fff;font:inherit;font-weight:600;cursor:pointer}' +
      '#contact-form-here .contact-form-button-submit:hover{background:#115E59}' +
      '#contact-form-here form>div{max-width:none!important;text-align:left!important}';
    var s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  function run() {
    document.documentElement.setAttribute('lang', 'en-US');
    addFormStyle();
    placeContactForm();
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
