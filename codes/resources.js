/* =========================================================
   resources.js资源页
   开源项目：从 GitHub API 自动抓取（GITHUB_USER）
   推荐网站：读取 ../datas/rec_web.csv
   资源分享：读取 ../datas/shares/shares.csv
   站尾运行计时
   ========================================================= */

const GITHUB_USER = 'limingda1212'; // 我的的 GitHub
const REPO_API = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12&type=owner`;

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', HTML: '#e34c26', CSS: '#563d7c',
  Python: '#3572A5', Java: '#b07219', Vue: '#41b883', Go: '#00ADD8',
  Shell: '#89e051', C: '#555555', 'C++': '#f34b96', Rust: '#dea584', PHP: '#4F5D95'
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function resCard(name, desc, url, tag) {
  return `<a class="res-card" href="${url}" target="_blank" rel="noopener">
    <span class="res-name">${escapeHtml(name)}</span>
    <span class="res-desc">${escapeHtml(desc)}</span>
    ${tag ? `<span class="res-tag">${tag}</span>` : ''}
  </a>`;
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

/* ---------- 1. 开源项目 ---------- */
async function loadRepos() {
  const wrap = document.getElementById('repoList');
  try {
    const res = await fetch(REPO_API);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const repos = await res.json();
    if (!Array.isArray(repos) || !repos.length) {
      wrap.innerHTML = '<div class="empty">还没有公开项目，先去 GitHub 创建一个吧</div>';
      return;
    }
    wrap.innerHTML = repos.map(r => {
      const color = LANG_COLORS[r.language] || '#9db8c5';
      const tag = r.language ? `<i style="background:${color}"></i>${escapeHtml(r.language)}` : '';
      return resCard(r.name, r.description || '这个项目还没有简介', r.html_url, tag);
    }).join('');
  } catch (e) {
    wrap.innerHTML = `<div class="error">开源项目加载失败：${escapeHtml(e.message)}。如果是在本地直接打开文件，请部署到 GitHub Pages 后再看。</div>`;
  }
}

/* ---------- 2/3. 读取 CSV 数据 ----------
   prefixRelative = true 时，相对链接会补上 ../ 前缀（因为页面在 codes/ 下） */
async function loadCSVList(path, id, prefixRelative) {
  const wrap = document.getElementById(id);
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const rows = parseCSV(await res.text()).slice(1); // 跳过表头
    if (!rows.length) {
      wrap.innerHTML = '<div class="empty">还没有数据，去对应的 CSV 文件里补充吧</div>';
      return;
    }
    wrap.innerHTML = rows.map(r => {
      let url = (r[2] || '').trim();
      if (prefixRelative && url && !/^https?:\/\//i.test(url)) {
        url = '../' + url.replace(/^\.?\//, '');
      }
      return resCard(r[0], r[1] || '暂无介绍', url || '#');
    }).join('');
  } catch (e) {
    wrap.innerHTML = `<div class="error">加载失败：${escapeHtml(e.message)}。如果是在本地直接打开文件，请部署到 GitHub Pages 后再看。</div>`;
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

loadRepos();
loadCSVList('../datas/rec_web.csv', 'webList', false);
loadCSVList('../datas/shares/shares.csv', 'shareList', true);
setYear();
updateUptime();
setInterval(updateUptime, 1000);
