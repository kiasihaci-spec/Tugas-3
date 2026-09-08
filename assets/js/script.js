// Animasi 3D Tilt pada Kartu
document.querySelectorAll('.card, .bio-card, .gallery-card, form, .contact-info').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        card.style.transform = `translateZ(35px) rotateX(${(-y / rect.height) * 10}deg) rotateY(${(x / rect.width) * 10}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateZ(0px) rotateX(0deg) rotateY(0deg)';
    });
});

// Interactive 3D Background Particles
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null, radius: 150 };

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas); resizeCanvas();
window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8; this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
    }
    draw() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        ctx.fillStyle = isDark ? 'rgba(0, 191, 255, 0.45)' : 'rgba(0, 122, 255, 0.25)';
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < Math.floor((canvas.width * canvas.height) / 14000); i++) particles.push(new Particle());
}
initParticles();

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    for (let i = 0; i < particles.length; i++) {
        particles[i].update(); particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y, dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 110) {
                ctx.strokeStyle = isDark ? `rgba(0, 191, 255, ${0.15 * (1 - dist / 110)})` : `rgba(0, 122, 255, ${0.1 * (1 - dist / 110)})`;
                ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

// Fungsi Menu & Tema
function toggleMenu() { document.getElementById('nav-links').classList.toggle('show'); }
function initTheme() {
    if (localStorage.getItem('theme') === 'light') { document.documentElement.removeAttribute('data-theme'); document.getElementById('themeIcon').textContent = '🌙'; } 
    else { document.documentElement.setAttribute('data-theme', 'dark'); document.getElementById('themeIcon').textContent = '☀️'; }
}
function toggleTheme() {
    if (document.documentElement.getAttribute('data-theme') === 'dark') { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('theme', 'light'); document.getElementById('themeIcon').textContent = '🌙'; } 
    else { document.documentElement.setAttribute('data-theme', 'dark'); localStorage.setItem('theme', 'dark'); document.getElementById('themeIcon').textContent = '☀️'; }
}
initTheme();