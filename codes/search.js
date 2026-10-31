/* =========================================================
   search.js搜索聚合页
   引擎选择 + 关键词拼接跳转（ENGINES 数组）
   常用网站小圆框：读取 ../datas/web.csv
   站尾运行计时
   ========================================================= */

/* 搜索引擎：url 为搜索页地址 + 关键词的拼接模板 */
const ENGINES = [
    { name: 'Bing',     url: 'https://www.bing.com/search?q=' },
    { name: '百度',     url: 'https://www.baidu.com/s?wd=' },
    { name: 'Google',   url: 'https://www.google.com/search?q=' },
    { name: 'GitHub',   url: 'https://github.com/search?q=' },
    { name: '知乎',     url: 'https://www.zhihu.com/search?type=content&q=' },
    { name: '哔哩哔哩', url: 'https://search.bilibili.com/all?keyword=' },
    { name: '360搜索',  url: 'https://www.so.com/s?q=' },
    { name: '搜狗',     url: 'https://www.sogou.com/web?query=' },
    { name: '夸克',     url: 'https://ai.quark.cn/s?q=' },
    { name: '神马',     url: 'https://m.sm.cn/s?q=' },
    { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
    { name: 'Ecosia',   url: 'https://www.ecosia.org/search?q=' },
    { name: 'Yahoo',    url: 'https://sg.search.yahoo.com/search?p=' },
    { name: 'Qwant',    url: 'https://www.qwant.us/?q=' },
    { name: 'Brave',    url: 'https://safe.search.brave.com/search?q=' },
    { name: 'NAVER',    url: 'https://search.naver.com/search.naver?query=' },
    { name: 'SearXNG-1',url: 'https://searxng.f24o.zip/search?q=' },
    { name: 'SearXNG-2',url: 'https://search.catboy.house/search?q=' },
    { name: 'SearXNG-3',url: 'https://search.080609.xyz/search?q=' },
    { name: 'SearXNG-4',url: 'https://suche.dasnetzundich.de/searx/search?q=' },
    { name: '4get-1',   url: 'https://4get.nadeko.net/search?q=' },
    { name: '4get-2',   url: 'https://4get.ca/search?q=' },
    { name: '4get-3',   url: 'https://4get.silly.computer/search?q=' },
    { name: '4get-4',   url: 'https://4get.dcs0.hu/search?q=' },
    { name: 'Semantic Scholar', url: 'https://www.semanticscholar.org/search?q=' }
];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* 简易 CSV 解析：支持引号包裹的字段，跳过以 # 开头的注释行 */
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.length && r.some(f => f.trim() !== '') && !r[0].trim().startsWith('#'));
}

function firstLetterOfHost(url) {
  try { return new URL(url).hostname.charAt(0).toUpperCase(); }
  catch (e) { return '网'; }
}

/* 小圆框图标加载失败时，显示网站首字母兜底 */
function imgFallback(img) {
  const fb = document.createElement('span');
  fb.className = 'fallback';
  fb.textContent = img.dataset.f || '网';
  img.replaceWith(fb);
}

function renderEngines() {
  const sel = document.getElementById('engine');
  sel.innerHTML = ENGINES.map(e => `<option value="${e.url}">${e.name}</option>`).join('');
}

function doSearch() {
  const input = document.getElementById('q');
  const q = input.value.trim();
  if (!q) { input.focus(); return; }
  const sel = document.getElementById('engine');
  const base = ENGINES[sel.selectedIndex].url;
  window.open(base + encodeURIComponent(q), '_blank', 'noopener');
}

async function loadQuickSites() {
  const wrap = document.getElementById('quickSites');
  try {
    const res = await fetch('../datas/web.csv');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const rows = parseCSV(await res.text()).slice(1); // 跳过表头
    if (!rows.length) {
      wrap.innerHTML = '<div class="empty">还没有常用网站</div>';
      return;
    }
    wrap.innerHTML = rows.map(r => {
      const link = (r[0] || '').trim();
      const icon = (r[1] || '').trim();
      if (!link) return '';
      return `<a class="quick-site" href="${escapeHtml(link)}" target="_blank" rel="noopener" title="${escapeHtml(link)}">
        <img src="${escapeHtml(icon)}" alt="" onerror="imgFallback(this)" data-f="${firstLetterOfHost(link)}" />
      </a>`;
    }).join('');
  } catch (e) {
    wrap.innerHTML = `<div class="empty">常用网站加载失败：${escapeHtml(e.message)}。</div>`;  // 部署到 GitHub Pages 后即可正常显示。
  }
}

/* ---------- 站尾运行计时（与主页一致） ---------- */
const SITE_START = new Date('2026-02-07T00:00:00+08:00'); // 网站首次上线时间

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

/* ---------- 初始化 ---------- */
renderEngines();
document.getElementById('searchBtn').addEventListener('click', doSearch);
document.getElementById('q').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') doSearch();
});
loadQuickSites();
setYear();
updateUptime();
setInterval(updateUptime, 1000);
