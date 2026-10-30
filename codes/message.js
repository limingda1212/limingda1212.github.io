/* =========================================================
   message.js留言页
   进入页面时弹出鼓励语
   通过 GitHub API 拉取仓库的 Issue 作为留言
   站尾运行计时
   ========================================================= */

const REPO = 'limingda1212/limingda1212.github.io'; // 仓库名
const ISSUES_API = `https://api.github.com/repos/${REPO}/issues?state=all&per_page=30&sort=created&direction=desc`;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ---------- 弹窗 ---------- */
function showModal() {
  document.getElementById('welcomeModal').classList.add('show');
}
function closeModal() {
  document.getElementById('welcomeModal').classList.remove('show');
}

/* ---------- 留言列表 ---------- */
async function loadIssues() {
  const wrap = document.getElementById('issueList');
  try {
    const res = await fetch(ISSUES_API);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const issues = await res.json();
    if (!Array.isArray(issues) || !issues.length) {
      wrap.innerHTML = '<div class="empty">还没有留言，来抢个沙发吧</div>';
      return;
    }
    wrap.innerHTML = issues.map(it => {
      const t = new Date(it.created_at);
      const ds = `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())} ${pad(t.getHours())}:${pad(t.getMinutes())}`;
      return `
      <div class="issue-item">
        <div class="issue-avatar"><img src="${it.user.avatar_url}&s=88" alt="${escapeHtml(it.user.login)}" /></div>
        <div class="issue-main">
          <div class="issue-meta">${escapeHtml(it.user.login)} · ${ds}</div>
          <div class="issue-title"><a href="${it.html_url}" target="_blank" rel="noopener">${escapeHtml(it.title)}</a></div>
          ${it.body ? `<div class="issue-body">${escapeHtml(it.body)}</div>` : ''}
        </div>
      </div>`;
    }).join('');
  } catch (e) {
    wrap.innerHTML = `<div class="error">留言加载失败：${escapeHtml(e.message)}。GitHub API 有每小时访问次数限制，稍等一会儿再刷新即可。</div>`;
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
document.getElementById('modalLater').addEventListener('click', closeModal);
document.getElementById('welcomeModal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

setTimeout(showModal, 500); // 进入页面后弹出鼓励语
loadIssues();
setYear();
updateUptime();
setInterval(updateUptime, 1000);
