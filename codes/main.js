/* =========================================================
   main.js主页
   渲染社交平台小圆框（SOCIALS 数组）
   渲染六个功能卡（CARDS 数组）
   站尾运行计时（SITE_START）
   ========================================================= */

/* ---------- 1. 社交平台 ----------
   每个圆框：name 平台名 / letter 圆框里显示的字 / color 背景色 / url 链接 */
const SOCIALS = [
  {name: 'GitHub', letter: 'G', color: '#89c2ffe0', url: 'https://github.com/limingda1212'},
  {name: 'Gitcode', letter: 'G', color: '#89c2ffe0', url: 'https://gitcode.com/limingda1212'},
  {name: '抖音', letter: 'D', color: '#89c2ffe0', url: 'https://www.douyin.com/user/MS4wLjABAAAAFmQggqERHXrt4JxDx-ZBJb7hDFBEU33dXYRzm1aEoRPRDJ75K-tpAe6QQN3h80wY'},
  // {name: '知乎', letter: '知', color: '#1e80c2', url: '#'},
  {name: 'B站', letter: 'B', color: '#89c2ffe0', url: 'https://space.bilibili.com/3690998255323468'},
  // {name: '博客', letter: '博', color: '#6f9f68', url: '#'}
];

/* ---------- 2. 六个功能卡 ---------- */
const CARDS = [
  {title: '关于我', desc: '我的介绍、经历，以及各种联系方式', icon: 'user', href: 'codes/about.html'},
  {title: '资源', desc: '开源项目 · 推荐网站 · 分享资源', icon: 'box', href: 'codes/resources.html'},
  {title: '留言', desc: '基于 GitHub Issue 的留言板', icon: 'chat', href: 'codes/message.html'},
  {title: '搜索聚合', desc: '多引擎一键搜索，常用网站直达', icon: 'search', href: 'codes/search.html'},
  {title: '待开发 1', desc: '这里藏着一个还没想好的小功能', icon: 'sparkle', href: 'codes/dev1.html'},
  {title: '待开发 2', desc: '另一个正在酝酿的小功能', icon: 'heart', href: 'codes/dev2.html'}
];

// icon 图标
const ICONS = {
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7.5" r="3.5"/><path d="M4.8 19.6c1.1-3.3 3.9-5 7.2-5s6.1 1.7 7.2 5"/></svg>',
  box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7.6 12 4l8 3.6-8 3.6z"/><path d="M4 7.6v8.8L12 20l8-3.6V7.6"/><path d="M12 11.2V20"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5C6.8 3.5 2.5 7.1 2.5 11.6c0 2.4 1.2 4.5 3.1 6L4 21.5l4.7-2.3c1 .3 2.1.5 3.3.5 5.2 0 9.5-3.6 9.5-8.1S17.2 3.5 12 3.5z"/><path d="M8.2 10.5h7.6M8.2 13.6h4.6"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.6-4.6"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3.5l2 5.4 5.5 2-5.5 2-2 5.4-2-5.4-5.5-2 5.5-2z"/><path d="M19 3.5v3M20.5 5h-3" stroke-linecap="round"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 20.2S4.5 15.3 2.6 11C1.4 8.3 3.5 5 6.7 5c2 0 3.7 1.1 4.5 2.7h1.6C13.6 6.1 15.3 5 17.3 5c3.2 0 5.3 3.3 4.1 6-1.9 4.3-9.4 9.2-9.4 9.2z"/></svg>'
};

/* ---------- 渲染 ---------- */
function renderSocials() {
  const wrap = document.getElementById('socials');
  if (!wrap) return;
  wrap.innerHTML = SOCIALS.map(s =>
    `<a class="social-item" href="${s.url}" target="_blank" rel="noopener" title="${s.name}" style="background:${s.color}">${s.letter}</a>`
  ).join('');
}

function renderCards() {
  const wrap = document.getElementById('cardsGrid');
  if (!wrap) return;
  wrap.innerHTML = CARDS.map((c, i) =>
    `<a class="card" href="${c.href}" style="animation-delay:${i * 0.06}s">
       <div class="card-icon">${ICONS[c.icon] || ''}</div>
       <h2 class="card-title">${c.title}</h2>
       <p class="card-desc">${c.desc}</p>
     </a>`
  ).join('');
}

/* ---------- 3. 站尾运行计时 ---------- */
// 建站时间：2026年2月7日 00:00:00
const SITE_START = new Date('2026-02-07T00:00:00+08:00');

function pad(n) { return n < 10 ? '0' + n : '' + n; }

function updateUptime() {
  const el = document.getElementById('uptime');
  if (!el) return;
  const now = new Date();
  let y  = now.getFullYear() - SITE_START.getFullYear();
  let mo = now.getMonth()    - SITE_START.getMonth();
  let d  = now.getDate()     - SITE_START.getDate();
  let h  = now.getHours()    - SITE_START.getHours();
  let mi = now.getMinutes()  - SITE_START.getMinutes();
  let s  = now.getSeconds()  - SITE_START.getSeconds();
  if (s  < 0) { s  += 60; mi--; }
  if (mi < 0) { mi += 60; h--;  }
  if (h  < 0) { h  += 24; d--;  }
  if (d  < 0) { d  += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); mo--; }
  if (mo < 0) { mo += 12; y--;  }
  el.textContent = `网站已运行 ${Math.max(0, y)} 年 ${Math.max(0, mo)} 月 ${Math.max(0, d)} 日 ${pad(Math.max(0, h))} 时 ${pad(Math.max(0, mi))} 分 ${pad(Math.max(0, s))} 秒`;
}

function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

renderSocials();
renderCards();
setYear();
updateUptime();
setInterval(updateUptime, 1000);
