/* ========== 枫雪阁 · 交互脚本 ========== */

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

    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        nav.classList.toggle('open');
    });

    nav.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', () => {
            btn.classList.remove('active');
            nav.classList.remove('open');
        });
    });
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
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.feature-card, .leader-card, .member-card, .gallery-main, .gallery-frame, .join-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        observer.observe(el);
    });
}

function handleRevealScroll() {
    const cards = document.querySelectorAll('.feature-card, .leader-card, .member-card, .gallery-main, .gallery-frame, .join-card');
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
    const cards = document.querySelectorAll('.feature-card, .leader-card, .member-card, .gallery-main, .gallery-frame, .join-card');
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

/* ========== 初始化 ========== */
document.addEventListener('DOMContentLoaded', () => {
    initSnowfall();
    setupMobileMenu();
    setupSmoothScroll();
    setupReveal();
    setupForm();
    setupParallax();
    animateTitleChars();

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
