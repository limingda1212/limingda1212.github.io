// 1. 主题切换功能
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeToggle.querySelector('i');

// 初始化主题
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        body.classList.add('dark-theme');
        icon.classList.replace('fa-moon', 'fa-sun');
    }
}

// 切换主题
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');

    if (body.classList.contains('dark-theme')) {
        icon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// 2. 图片轮播功能
function initSlideshow() {
    const slideshow = document.getElementById('slideshow');
    if (!slideshow) return;

    // 使用时替换照片路径
    const photos = [
        './photos/main/1.jpg',
        './photos/main/2.jpg',
        './photos/main/3.jpg',
        './photos/main/4.jpg'
    ];

    // 如果没有找到照片，使用默认渐变背景
    if (photos.length === 0) {
        slideshow.innerHTML = `
            <div class="default-gradient"></div>
        `;
        return;
    }

    // 创建图片元素
    photos.forEach((photo, index) => {
        const img = document.createElement('img');
        img.src = photo;
        img.alt = `背景图片 ${index + 1}`;
        img.classList.add('photo-slide');
        if (index === 0) img.classList.add('active');
        slideshow.appendChild(img);
    });

    // 轮播逻辑
    let currentIndex = 0;
    const slides = slideshow.querySelectorAll('.photo-slide');

    function nextSlide() {
        slides[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % slides.length;
        slides[currentIndex].classList.add('active');
    }

    // 每5秒切换一次
    setInterval(nextSlide, 5000);
}

// 3. 标签切换功能
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有激活状态
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // 添加当前激活状态
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');

            // 滚动到内容顶部（平滑滚动）
            document.querySelector('.main-content').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}

// 4. 滚动效果
function initScrollEffects() {
    const backToTop = document.getElementById('back-to-top');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    // 显示/隐藏回到顶部按钮
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // 滚动时导航栏阴影
        const contentTabs = document.querySelector('.content-tabs');
        if (contentTabs) {
            if (window.scrollY > 100) {
                contentTabs.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            } else {
                contentTabs.style.boxShadow = 'none';
            }
        }
    });

    // 回到顶部功能
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 滚动指示器点击
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            document.querySelector('.main-content').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // 时间轴动画
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, observerOptions);

    // 观察时间轴项
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        if (item.classList.contains('left')) {
            item.style.transform = 'translateX(-30px)';
        } else {
            item.style.transform = 'translateX(30px)';
        }

        observer.observe(item);
    });
}

// 5. 技能标签动画
function initSkillAnimation() {
    const skillTags = document.querySelectorAll('.skill-tag');

    skillTags.forEach((tag, index) => {
        // 延迟显示
        setTimeout(() => {
            tag.style.opacity = '1';
            tag.style.transform = 'translateY(0)';
        }, index * 100);

        // 初始状态
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(10px)';
        tag.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
}

// 6. GitHub Issues 留言功能
function initMessageBoard() {
    const messagesList = document.getElementById('messages-list');
    const messagesError = document.getElementById('messages-error');

    if (!messagesList || !messagesError) return; // 增加空值校验

    // GitHub API 配置
    const GITHUB_USERNAME = 'limingda1212';
    const GITHUB_REPO = 'limingda1212.github.io';
    const API_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/issues`;

    // 重置留言区状态（刷新前重置错误/加载状态）
    function resetMessageState() {
        messagesList.style.display = 'block';
        messagesError.style.display = 'none';
        messagesList.innerHTML = `
            <div class="loading-messages">
                <i class="fas fa-spinner fa-spin"></i> 正在加载留言...
            </div>
        `;
    }

    // 获取留言
    async function fetchMessages() {
        resetMessageState(); // 每次请求前重置状态
        try {
            const response = await fetch(`${API_URL}?state=open&sort=created&direction=desc&per_page=5`, {
                method: 'GET',
                cache: 'no-cache', // 禁用缓存
                headers: {
                    'Accept': 'application/vnd.github.v3+json', // 符合GitHub API规范
                    // 可选：添加User-Agent（GitHub API要求）
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            if (!response.ok) {
                throw new Error(`请求失败：${response.status}`);
            }

            const issues = await response.json();
            displayMessages(issues);
        } catch (error) {
            console.error('Error fetching messages:', error);
            showError();
        }
    }

    // 显示留言
    function displayMessages(issues) {
        if (!issues || issues.length === 0) {
            messagesList.innerHTML = `
                <div class="no-messages">
                    <i class="fas fa-comment-slash"></i>
                    <p>还没有留言，快来成为第一个留言的人吧！</p>
                </div>
            `;
            return;
        }

        const messagesHTML = issues.map(issue => {
            const date = new Date(issue.created_at);
            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            let body = issue.body || '';

            return `
                <div class="message-item">
                    <div class="message-header">
                        <div class="message-author">
                            <img src="${issue.user.avatar_url}" alt="${issue.user.login}" class="message-avatar">
                            <span class="message-username">${issue.user.login}</span>
                        </div>
                        <span class="message-date">${formattedDate}</span>
                    </div>
                    <div class="message-body">
                        <p>${escapeHTML(body.substring(0, 200))}${body.length > 200 ? '...' : ''}</p>
                        <a href="${issue.html_url}" target="_blank">查看完整对话 →</a>
                    </div>
                    <div class="message-tags">
                        ${issue.labels && issue.labels.length > 0 ?
                            issue.labels.map(label => `<span class="message-tag">${label.name}</span>`).join('') :
                            ''}
                    </div>
                </div>
            `;
        }).join('');

        messagesList.innerHTML = messagesHTML;
    }

    // 显示错误
    function showError() {
        messagesList.style.display = 'none';
        messagesError.style.display = 'block';
    }

    // HTML转义函数
    function escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 初始化时获取留言
    fetchMessages();

    // 添加刷新留言的按钮
    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'refresh-btn';
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> 刷新留言';
    refreshBtn.onclick = fetchMessages; // 绑定刷新逻辑

    const messagesContainer = document.querySelector('.messages-container');
    const messagesHeader = messagesContainer.querySelector('h5');
    if (messagesHeader) { // 修复：增加元素存在性校验
        messagesHeader.insertAdjacentElement('afterend', refreshBtn);
    }

    // 添加刷新按钮样式
    const style = document.createElement('style');
    style.textContent = `
        .refresh-btn {
            background: none;
            border: 1px solid var(--accent-color);
            color: var(--accent-color);
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            margin-left: 10px;
            transition: all 0.3s ease;
        }
        .refresh-btn:hover {
            background-color: var(--accent-color);
            color: white;
        }
        .refresh-btn i {
            margin-right: 5px;
        }
    `;
    document.head.appendChild(style);
}

// 7. 运行时间计算
function initSiteTime() {
    const siteTimeElement = document.getElementById('sitetime');
    if (!siteTimeElement) return;

    // 建站时间：2026年2月7日 00:00:00
    const siteCreationTime = new Date('2026-02-07T00:00:00').getTime();

    function updateSiteTime() {
        const now = new Date().getTime();
        const diff = now - siteCreationTime;

        const seconds = Math.floor(diff / 1000) % 60;
        const minutes = Math.floor(diff / (1000 * 60)) % 60;
        const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        // 计算年数（考虑闰年）
        let years = 0;
        let remainingDays = days;
        for (let year = 2026; year < new Date().getFullYear(); year++) {
            const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
            remainingDays -= isLeapYear ? 366 : 365;
            years++;
        }

        siteTimeElement.textContent = `${years}年${remainingDays}天${hours}小时${minutes}分钟${seconds}秒`;
    }

    // 初始更新
    updateSiteTime();

    // 每秒更新一次
    setInterval(updateSiteTime, 1000);
}

// 8. 页脚链接点击切换标签页
function initFooterLinks() {
    const footerLinks = document.querySelectorAll('.footer-tab-link');

    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = link.getAttribute('data-tab');

            if (tabName) {
                // 触发标签切换
                const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
                if (tabBtn) {
                    tabBtn.click();

                    // 平滑滚动到内容顶部
                    document.querySelector('.main-content').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// 9. 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSlideshow();
    initTabs();
    initScrollEffects();
    initSkillAnimation();
    initMessageBoard();
    initSiteTime();
    initFooterLinks();

    // 添加加载完成动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// 10. 键盘快捷键
document.addEventListener('keydown', (e) => {
    // Ctrl + T 切换主题
    if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        themeToggle.click();
    }

    // ESC 键回到顶部
    if (e.key === 'Escape') {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});

// 11. 项目卡片悬停效果增强
function enhanceProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const link = card.querySelector('.project-link');
            if (link) {
                link.style.transform = 'translateY(0)';
            }
        });

        card.addEventListener('mouseleave', () => {
            const link = card.querySelector('.project-link');
            if (link) {
                link.style.transform = '';
            }
        });
    });
}

// 初始化增强效果
enhanceProjectCards();