const bgMusic = document.getElementById('bgMusic');

// --- 1. MUSIC PERSISTENCE & DOUBLE-CLICK LOGIC ---
function initMusic() {
    if (!bgMusic) return;

    // Restore timestamp
    const savedTime = localStorage.getItem('musicTimestamp');
    if (savedTime) bgMusic.currentTime = parseFloat(savedTime);

    // Play if it was playing on the main page
    if (localStorage.getItem('musicPlaying') === 'true') {
        bgMusic.play().catch(() => {
            // Browser block: Resume on first click anywhere
            document.body.addEventListener('click', () => {
                if (localStorage.getItem('musicPlaying') === 'true') {
                    bgMusic.play();
                }
            }, { once: true });
        });
    }

    // Sync progress to localStorage every second
    setInterval(() => {
        if (!bgMusic.paused) {
            localStorage.setItem('musicTimestamp', bgMusic.currentTime);
        }
    }, 1000);
}

// NEW FEATURE: DOUBLE-CLICK TO TOGGLE MUSIC
document.addEventListener('dblclick', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        localStorage.setItem('musicPlaying', 'true');
    } else {
        bgMusic.pause();
        localStorage.setItem('musicPlaying', 'false');
    }
});

// --- 2. COPY TO CLIPBOARD LOGIC ---
function copyCode() {
    const code = document.getElementById('accessCode').innerText;
    navigator.clipboard.writeText(code);
    
    const feedback = document.getElementById('copyFeedback');
    feedback.style.opacity = '1';
    setTimeout(() => { feedback.style.opacity = '0'; }, 2000);
}

window.onload = initMusic;