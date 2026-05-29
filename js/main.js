/* ========== 枫雪阁 · 交互脚本 ========== */

/* --- 全局金色微尘 --- */
function initGlobalParticles() {
    const canvas = document.getElementById('globalParticles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const particles = [];
    const count = 35;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class DustParticle {
        constructor() {
            this.reset(true);
        }
        reset(init) {
            this.x = Math.random() * canvas.width;
            this.y = init ? Math.random() * canvas.height : -10;
            this.size = 0.5 + Math.random() * 1.5;
            this.speedY = 0.2 + Math.random() * 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.opacity = 0.08 + Math.random() * 0.25;
            this.phase = Math.random() * Math.PI * 2;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin((this.y * 0.005) + this.phase) * 0.15;
            if (this.y > canvas.height + 10) this.reset(false);
            if (this.x < -10 || this.x > canvas.width + 10) this.reset(false);
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = '#C9A96E';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < count; i++) particles.push(new DustParticle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}

/* --- 雪花 + 枫叶飘落 --- */
function initSnowfall() {
    const canvas = document.getElementById('snowCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    const maxParticles = 50;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset(true);
        }
        reset(init) {
            this.x = Math.random() * canvas.width;
            this.y = init ? Math.random() * canvas.height : -20;
            this.size = 1 + Math.random() * 3;
            this.speed = 0.3 + Math.random() * 1.5;
            this.wind = (Math.random() - 0.5) * 0.6;
            this.opacity = 0.15 + Math.random() * 0.35;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.02;
            // 70% 雪花，30% 枫叶形状
            this.type = Math.random() > 0.7 ? 'leaf' : 'snow';
            this.hue = this.type === 'leaf' ? 25 + Math.random() * 15 : 0;
            this.saturation = this.type === 'leaf' ? '70%' : '0%';
            this.lightness = this.type === 'leaf' ? '55%' : '80%';
        }
        update() {
            this.y += this.speed;
            this.x += this.wind + Math.sin(this.y * 0.01) * 0.4;
            this.rotation += this.rotSpeed;

            if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
                this.reset(false);
            }
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;

            if (this.type === 'leaf') {
                // 简化枫叶形状
                ctx.fillStyle = `hsl(${this.hue}, ${this.saturation}, ${this.lightness})`;
                ctx.beginPath();
                ctx.moveTo(0, -this.size * 2);
                ctx.lineTo(this.size * 2, -this.size);
                ctx.lineTo(this.size, 0);
                ctx.lineTo(this.size * 2, this.size);
                ctx.lineTo(0, this.size * 2);
                ctx.lineTo(-this.size * 2, this.size);
                ctx.lineTo(-this.size, 0);
                ctx.lineTo(-this.size * 2, -this.size);
                ctx.closePath();
                ctx.fill();
            } else {
                // 雪花
                ctx.fillStyle = `rgba(255, 255, 255, 0.7)`;
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fill();
                // 十字光
                ctx.strokeStyle = `rgba(255, 255, 255, 0.3)`;
                ctx.lineWidth = 0.5;
                const r = this.size * 2;
                ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.stroke();
            }
            ctx.restore();
        }
    }

    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}

/* --- 导航栏滚动效果 --- */
function handleHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 50);
}

/* --- 移动端菜单 --- */
function setupMobileMenu() {
    const btn = document.getElementById('menuBtn');
    const nav = document.getElementById('nav');
    if (!btn || !nav) return;

    function open() {
        btn.classList.add('active');
        nav.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function close() {
        btn.classList.remove('active');
        nav.classList.remove('open');
        document.body.style.overflow = '';
    }

    btn.addEventListener('click', () => {
        nav.classList.contains('open') ? close() : open();
    });

    // 点击导航链接关闭
    nav.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', close);
    });

    // 点击页面其他区域关闭
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('open') && !nav.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
            close();
        }
    });

    // 滑动关闭（向右滑动导航）
    let touchStartX = 0;
    nav.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    nav.addEventListener('touchmove', (e) => {
        const diff = e.touches[0].clientX - touchStartX;
        if (diff > 30) close();
    }, { passive: true });
}

/* --- 滚动画高亮 --- */
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item[href^="#"]');
    let current = '';

    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 150) {
            current = sec.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === '#' + current) {
            item.classList.add('active');
        }
    });
}

/* --- 入场动画 --- */
function setupReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 进入视野 — 显示
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            } else {
                // 离开视野 — 重置，下次进入时重新播放动画
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(40px)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.feature-card, .leader-card, .gallery-main, .gallery-frame, .join-card, .timeline-item, .declaration-frame').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        observer.observe(el);
    });

    // 核心成员逐行延迟 + 可重复播放
    const coreObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            } else {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(50px)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.core-member-row').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.15}s`;
        coreObserver.observe(el);
    });
}

function handleRevealScroll() {
    const cards = document.querySelectorAll('.feature-card, .leader-card, .gallery-main, .gallery-frame, .join-card, .timeline-item, .declaration-frame');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
}

// 首次可见元素立即显示
function revealInitial() {
    const cards = document.querySelectorAll('.feature-card, .leader-card, .gallery-main, .gallery-frame, .join-card, .timeline-item, .declaration-frame');
    cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            card.style.transitionDelay = (i % 4) * 0.1 + 's';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
}

/* --- 平滑滚动 --- */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 72;
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* --- 标题字悬浮（Hero 三字） --- */
function animateTitleChars() {
    const chars = document.querySelectorAll('.title-char');
    chars.forEach((char, i) => {
        char.style.animationDelay = i * 0.2 + 's';
    });
}

/* --- 表单提交 --- */
function setupForm() {
    const form = document.getElementById('joinForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = form.querySelector('.btn-gold');
        const origHTML = btn.innerHTML;
        btn.innerHTML = '<span>名帖已递 ✓</span>';
        btn.style.background = 'linear-gradient(135deg, #6B8E6B, #5A7A5A)';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = origHTML;
            btn.style.background = '';
            btn.disabled = false;
            form.reset();
        }, 2500);
    });
}

/* --- Hero 视差 --- */
function setupParallax() {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                const main = document.querySelector('.hero-main');
                if (main && scrolled < window.innerHeight) {
                    const progress = scrolled / window.innerHeight;
                    main.style.transform = `translateY(${progress * 60}px)`;
                    main.style.opacity = Math.max(0, 1 - progress * 1.5);
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* --- 成员轮播 --- */
function createCarousel(trackId, dotsId, prevId, nextId) {
    const track = document.getElementById(trackId);
    const dotsContainer = document.getElementById(dotsId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    if (!track || !dotsContainer) return;

    const pages = track.querySelectorAll('.roster-page, .carousel-page');
    const totalPages = pages.length;
    let currentPage = 0;
    let autoTimer;

    // 创建指示点
    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', '第' + (i + 1) + '页');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    }

    function goTo(index) {
        currentPage = index;
        track.style.transform = `translateX(-${currentPage * 100}%)`;
        dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
            d.classList.toggle('active', i === currentPage);
        });
    }

    function next() { goTo((currentPage + 1) % totalPages); }
    function prev() { goTo((currentPage - 1 + totalPages) % totalPages); }

    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    function startAuto() {
        autoTimer = setInterval(next, 4000);
    }
    function stopAuto() {
        clearInterval(autoTimer);
    }
    startAuto();

    track.addEventListener('mouseenter', stopAuto);
    track.addEventListener('mouseleave', startAuto);

    let touchStartX = 0;
    track.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        stopAuto();
    }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            diff > 0 ? next() : prev();
        }
        startAuto();
    });
}

function setupRosterCarousel() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            } else {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
            }
        });
    }, { threshold: 0.02 });

    document.querySelectorAll('.roster-item').forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.02}s`;
        observer.observe(item);
    });
}

/* --- UI 音效 --- */
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function getAudioCtx() {
    if (!audioCtx) audioCtx = new AudioCtx();
    return audioCtx;
}

function playHoverSound() {
    try {
        const ctx = getAudioCtx();
        const now = ctx.currentTime;
        // 古风编钟轻响 — 双音叠合
        [1047, 1319].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.015);
            gain.gain.setValueAtTime(0.03, now + i * 0.015);
            gain.gain.linearRampToValueAtTime(0, now + 0.25 + i * 0.02);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.015);
            osc.stop(now + 0.3);
        });
    } catch(e) {}
}

function playClickSound() {
    try {
        const ctx = getAudioCtx();
        const now = ctx.currentTime;
        // 水滴入潭 — 低频轻响
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
    } catch(e) {}
}

function setupSoundEffects() {
    // 悬停音效 — 所有可交互元素
    const hoverTargets = document.querySelectorAll(
        '.btn-gold, .btn-ghost, .btn-block, ' +
        '.nav-item, .nav-external, ' +
        '.feature-card, .leader-card, .member-card, ' +
        '.core-member-row, .core-photo-frame, ' +
        '.roster-item, .roster-avatar, ' +
        '.gallery-main-frame, .gallery-frame, ' +
        '.timeline-item, .join-card, ' +
        '.music-toggle, .carousel-btn, ' +
        '.footer-btn, .footer-links a, .footer-social a'
    );
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', playHoverSound);
    });

    // 点击音效 — 按钮和链接
    const clickTargets = document.querySelectorAll(
        '.btn-gold, .btn-ghost, .btn-block, ' +
        '.nav-item, ' +
        'a[href], button'
    );
    clickTargets.forEach(el => {
        el.addEventListener('click', playClickSound);
    });
}

/* --- 群侠谱筛选 --- */
function setupHeroFilter() {
    const grid = document.getElementById('heroesGrid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.hero-card[data-tags]'));

    const groups = {};
    document.querySelectorAll('.filter-group').forEach(group => {
        const groupName = group.dataset.group;
        groups[groupName] = { selected: new Set(), buttons: [], isSingle: true };

        group.querySelectorAll('.filter-btn').forEach(btn => {
            groups[groupName].buttons.push(btn);
            btn.addEventListener('click', () => {
                const value = btn.dataset.value;

                if (value === '') {
                    groups[groupName].selected.clear();
                    group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                } else {
                    group.querySelector('[data-value=""]').classList.remove('active');

                    if (groups[groupName].isSingle) {
                        // 单选：点击已选中的取消，点击新的替换
                        if (groups[groupName].selected.has(value)) {
                            groups[groupName].selected.clear();
                            btn.classList.remove('active');
                            group.querySelector('[data-value=""]').classList.add('active');
                        } else {
                            groups[groupName].selected.clear();
                            group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                            groups[groupName].selected.add(value);
                            btn.classList.add('active');
                        }
                    }
                }

                applyAllFilters();
            });
        });
    });

    function applyAllFilters() {
        // 先判断每个卡片是否匹配
        const matchStatus = cards.map(card => {
            const tags = card.dataset.tags.split(',');
            let match = true;

            for (const [groupName, groupData] of Object.entries(groups)) {
                if (groupData.selected.size === 0) continue;

                const prefix = groupName === 'school' ? '流派-' :
                               groupName === 'mode' ? '玩法-' :
                               groupName === 'role' ? '定位-' : '';

                const groupTags = Array.from(groupData.selected).map(v => prefix + v);
                if (!groupTags.some(gt => tags.includes(gt))) {
                    match = false;
                    break;
                }
            }
            return { card, match };
        });

        // 按荣誉排序：匹配的排前面，荣誉排最前
        const hasFilter = Object.values(groups).some(g => g.selected.size > 0);
        matchStatus.forEach(({ card, match }, i) => {
            let order = 0;
            if (hasFilter) {
                if (match) {
                    const hasHonor = card.querySelector('.hero-card-honor') &&
                                     card.querySelector('.hero-card-honor').textContent.trim();
                    order = hasHonor ? -2 : -1;
                } else {
                    order = 1;
                }
            }
            card.style.order = order;
            card.classList.toggle('dimmed', !match);
        });
    }
}

/* --- 海报弹窗 --- */
function setupPosters() {
    document.querySelectorAll('.core-photo-frame[data-poster]').forEach(frame => {
        frame.style.cursor = 'pointer';
        frame.addEventListener('click', (e) => {
            e.stopPropagation();
            const src = frame.dataset.poster;

            // 创建弹窗
            const overlay = document.createElement('div');
            overlay.className = 'poster-overlay';

            const img = document.createElement('img');
            img.src = src;
            img.alt = '人物海报';
            // 如果图片加载失败，显示占位
            img.onerror = () => {
                img.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.style.cssText = 'color:var(--gold);font-family:var(--font-display);font-size:2rem;letter-spacing:6px;text-align:center;padding:40px;';
                placeholder.textContent = '海报即将上线';
                overlay.appendChild(placeholder);
            };

            const closeBtn = document.createElement('button');
            closeBtn.className = 'poster-close';
            closeBtn.innerHTML = '✕';

            overlay.appendChild(img);
            overlay.appendChild(closeBtn);
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';

            const close = () => {
                overlay.remove();
                document.body.style.overflow = '';
            };

            overlay.addEventListener('click', (ev) => {
                if (ev.target === overlay || ev.target === closeBtn) close();
            });
            document.addEventListener('keydown', function esc(e) {
                if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
            });
        });
    });
}

/* --- 音乐控制 --- */
function setupMusic() {
    const player = document.getElementById('musicPlayer');
    const toggle = document.getElementById('musicToggle');
    const audio = document.getElementById('bgMusic');
    if (!player || !toggle || !audio) return;

    let playing = false;

    function play() {
        audio.play().then(() => {
            playing = true;
            player.classList.add('playing');
        }).catch(() => {
            // 自动播放被阻止，等待用户交互
        });
    }

    function pause() {
        audio.pause();
        playing = false;
        player.classList.remove('playing');
    }

    toggle.addEventListener('click', () => {
        if (playing) {
            pause();
        } else {
            play();
        }
    });

    // 首次用户点击页面任意位置时尝试播放
    function tryAutoPlay() {
        if (!playing) play();
        document.removeEventListener('click', tryAutoPlay);
    }
    document.addEventListener('click', tryAutoPlay);
}

/* ========== 初始化 ========== */
document.addEventListener('DOMContentLoaded', () => {
    initGlobalParticles();
    initSnowfall();
    setupMobileMenu();
    setupSmoothScroll();
    setupReveal();
    setupForm();
    setupParallax();
    animateTitleChars();
    setupRosterCarousel();
    setupMusic();
    setupSoundEffects();
    setupHeroFilter();
    setupPosters();

    // 首屏可见元素直接展示
    setTimeout(revealInitial, 300);
});

window.addEventListener('scroll', () => {
    handleHeaderScroll();
    updateActiveNav();
    handleRevealScroll();
});

// 立即处理导航状态
handleHeaderScroll();
updateActiveNav();
