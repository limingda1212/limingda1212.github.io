/* =========================================================
   about.js关于我页面
   自我介绍文字（改 ABOUT_TEXT）
   联系方式（改 CONTACTS 数组）
   站尾运行计时
   ========================================================= */

/* 自我介绍：改成你自己的话即可，换行用 \n 分隔 */
const ABOUT_TEXT = `你好，我是 Limnda，一名喜欢把想法变成代码的开发者。
平时主要折腾 网络爬虫、开源小工具和一些有趣的小项目，也喜欢研究效率工具和新技术。
这个网站是我在 GitHub Pages 上的一个小家，会陆续放上我的项目、收藏和随手整理的资源。
欢迎随时来逛逛，也欢迎在留言区留下你的足迹。`;

/* 联系方式：href
       留空则只展示、不可点击 */
const CONTACTS = [
  {label: '邮箱', icon: '邮', value: 'limingda1212@outlook.com', href: ''},
  {label: 'GitHub', icon: 'G', value: 'limingda1212', href: 'https://github.com/limingda1212'},
  {label: 'QQ号', icon: 'Q', value: '3779806100', href: ''},
  {label: '抖音', icon: 'D', value: 'Limnda', href: 'https://www.douyin.com/user/MS4wLjABAAAAFmQggqERHXrt4JxDx-ZBJb7hDFBEU33dXYRzm1aEoRPRDJ75K-tpAe6QQN3h80wY'},
  {label: 'B站', icon: 'B', value: 'Limnda', href: 'https://space.bilibili.com/3690998255323468'},
  {label: '微信号', icon: '信', value: 'limingda1212', href: '' }
];

function renderAbout() {
  const el = document.getElementById('aboutText');
  if (!el) return;
  el.innerHTML = ABOUT_TEXT.split('\n').map(p => `<p>${p}</p>`).join('');
}

function renderContacts() {
  const el = document.getElementById('contacts');
  if (!el) return;
  el.innerHTML = CONTACTS.map(c => {
    const inner = `
      <span class="chip-icon">${c.icon}</span>
      <span>
        <span class="chip-label">${c.label}</span>
        <span class="chip-value">${c.value}</span>
      </span>`;
    return c.href
      ? `<a class="contact-chip" href="${c.href}" target="_blank" rel="noopener">${inner}</a>`
      : `<div class="contact-chip">${inner}</div>`;
  }).join('');
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

renderAbout();
renderContacts();
setYear();
updateUptime();
setInterval(updateUptime, 1000);
