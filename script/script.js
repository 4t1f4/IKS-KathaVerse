// --- 1. MUSIC MANAGER (With Double-Click & Persistence) ---
const bgMusic = document.getElementById('bgMusic');

function initMusic() {
    if (!bgMusic) return;

    // Load saved timestamp and playing state
    const savedTime = localStorage.getItem('musicTimestamp');
    const shouldBePlaying = localStorage.getItem('musicPlaying') === 'true';

    if (savedTime) {
        bgMusic.currentTime = parseFloat(savedTime);
    }

    // Play if it was playing on the previous page/refresh
    if (shouldBePlaying) {
        resumeMusic();
    }

    // Save timestamp every second
    setInterval(() => {
        if (!bgMusic.paused) {
            localStorage.setItem('musicTimestamp', bgMusic.currentTime);
        }
    }, 1000);
}

function resumeMusic() {
    bgMusic.play().catch(() => {
        console.log("Autoplay blocked. Waiting for first interaction.");
        const resumeOnAction = () => {
            if (localStorage.getItem('musicPlaying') === 'true' && modal.style.display !== "flex") {
                bgMusic.play();
            }
            document.removeEventListener('click', resumeOnAction);
        };
        document.addEventListener('click', resumeOnAction);
    });
}

function startMusic() {
    localStorage.setItem('musicPlaying', 'true');
    bgMusic.play().catch(err => console.error("Playback failed:", err));
}

// NEW: DOUBLE-CLICK TO TOGGLE MUSIC
document.addEventListener('dblclick', () => {
    if (bgMusic.paused) {
        startMusic();
        console.log("Music Resumed via Double-Click");
    } else {
        bgMusic.pause();
        localStorage.setItem('musicPlaying', 'false');
        console.log("Music Paused via Double-Click");
    }
});

initMusic();


// --- 2. PARTICLE SYSTEM ---
function createParticles() {
    const container = document.getElementById('particlesContainer');
    if (!container) return;
    
    container.innerHTML = '';
    for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const angle = (Math.random() * Math.PI * 2);
        const distance = Math.random() * 150 + 50;
        const tx = Math.cos(angle) * distance;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.animationDelay = `${Math.random() * 2}s`;
        particle.style.animationDuration = `${3 + Math.random() * 2}s`;
        
        container.appendChild(particle);
    }
    setTimeout(createParticles, 5000);
}
createParticles();


// --- 3. VIDEO MODAL LOGIC (With BG Music Pause/Resume) ---
const modal = document.getElementById("videoModal");
const modalVideo = document.getElementById("modalVideo");
const closeModal = document.getElementById("closeModal");

const videoLinks = [
    "videos/tuba.mp4", "videos/humaira.mp4", 
    "videos/khushal.mp4", "videos/isha.mp4", "videos/atifa.mp4"
];

document.querySelectorAll(".watch-btn").forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
        if (e.currentTarget.id === "backToHomeBtn") return;

        e.preventDefault();
        e.stopPropagation();

        // PAUSE BACKGROUND MUSIC TEMPORARILY
        if (bgMusic) bgMusic.pause();

        modalVideo.src = videoLinks[index] || videoLinks[0];
        modal.style.display = "flex";
        modalVideo.play().catch(err => console.error("Video error:", err));
    });
});

function handleCloseModal() {
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modal.style.display = "none";

    // ONLY RESUME IF USER HADN'T MANUALLY PAUSED
    if (bgMusic && localStorage.getItem('musicPlaying') === 'true') {
        bgMusic.play().catch(err => console.log("Music resume blocked"));
    }
}

closeModal.addEventListener("click", handleCloseModal);
modal.addEventListener("click", (e) => { if (e.target === modal) handleCloseModal(); });


// --- 4. NAVIGATION & SECTION CONTROL ---
const appWrapper = document.getElementById('appWrapper');
const landingSection = document.getElementById('landingSection');
const mainContent = document.getElementById('mainContent');
const enterBtn = document.getElementById('enterBtn');
const navDots = document.getElementById('navDots');
const scrollProgress = document.getElementById('scrollProgress');
const backToHomeBtn = document.getElementById('backToHomeBtn');

enterBtn.addEventListener('click', () => {
    startMusic();
    landingSection.style.display = 'none';
    mainContent.classList.add('active');
    navDots.classList.add('active');
    appWrapper.scrollTop = 0;
    observeSections();
});

backToHomeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    mainContent.classList.remove('active');
    navDots.classList.remove('active');
    landingSection.style.display = 'flex';
    appWrapper.scrollTop = 0;
});

function observeSections() {
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.2 });
    fadeElements.forEach(el => observer.observe(el));
}

appWrapper.addEventListener('scroll', () => {
    if (!mainContent.classList.contains('active')) return;

    const scrollTop = appWrapper.scrollTop;
    const scrollHeight = appWrapper.scrollHeight - appWrapper.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = `${progress}%`;

    const sections = mainContent.querySelectorAll('.story-section');
    const dots = navDots.querySelectorAll('.nav-dot');
    
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index]?.classList.add('active');
        }
    });
});

navDots.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-dot')) {
        const sectionIndex = parseInt(e.target.dataset.section);
        const sections = mainContent.querySelectorAll('.story-section');
        if (sections[sectionIndex]) {
            sections[sectionIndex].scrollIntoView({ behavior: 'smooth' });
        }
    }
});

