// Cross-Platform Special Interactions
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Custom Cursor
const cursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', (e) => {
    if (isMobile) return;
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

document.addEventListener('mousedown', () => {
    cursor.style.transform = 'scale(0.8)';
    cursor.style.background = 'rgba(161, 0, 255, 0.4)';
});

document.addEventListener('mouseup', () => {
    cursor.style.transform = 'scale(1)';
    cursor.style.background = 'transparent';
});

// Hover effect for cursor
const interactiveElements = document.querySelectorAll('a, button, .game-card, .id-card');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2.5)';
        cursor.style.borderColor = '#00f2ff';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.borderColor = '#a100ff';
    });
});

// Intersection Observer for Reveal
const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            // Check for counter animation
            if (entry.target.classList.contains('about-stats')) {
                animateCounters();
            }
        }
    });
};

const animateCounters = () => {
    const counters = document.querySelectorAll('.count-up');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const suffix = counter.getAttribute('data-suffix') || '';
        const prefix = counter.getAttribute('data-prefix') || '';
        const duration = 2000;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function: easeOutExpo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentCount = Math.floor(easeProgress * target);

            counter.innerText = prefix + currentCount + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = prefix + target + suffix;
            }
        };

        requestAnimationFrame(updateCounter);
    });
};

const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
});

const initReveals = () => {
    document.querySelectorAll('.reveal, .reveal-stagger, .game-card, .id-card, .section-title, .about-text, .about-stats, .contact-card').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
};

document.addEventListener('DOMContentLoaded', initReveals);
window.addEventListener('load', initReveals);

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Copy ID Function
function copyID(text) {
    const btn = event.target;
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.innerText;
        btn.innerText = 'COPIED!';
        btn.style.borderColor = '#00ff41';
        btn.style.color = '#00ff41';

        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.borderColor = '#00f2ff';
            btn.style.color = '#00f2ff';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Mobile Menu Placeholder (Simple)
// Mobile Menu Overlay Logic
const mobileBtn = document.querySelector('.mobile-menu-btn');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const closeBtn = document.querySelector('.close-menu-btn');
const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

if (mobileBtn && mobileMenuOverlay) {
    mobileBtn.addEventListener('click', () => {
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    });

    const closeMenu = () => {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// Click to reveal ID on game cards
document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', function () {
        this.classList.toggle('show-id');

        // If it's the anime card, maybe we don't need a reveal, but we can add one for consistency
        if (this.classList.contains('show-id')) {
            cursor.style.borderColor = '#00ff41'; // Green for success/show
        } else {
            cursor.style.borderColor = '#00f2ff';
        }
    });
});

// Particles System
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5;
        this.color = Math.random() > 0.5 ? '#a100ff' : '#00f2ff';
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        // Mouse Interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 3;
            this.y -= Math.sin(angle) * force * 3;
        }

        // Apply friction to return to normal speed
        this.speedX *= 0.99;
        this.speedY *= 0.99;

        // Ensure minimum speed
        if (Math.abs(this.speedX) < 1) this.speedX += (Math.random() - 0.5) * 0.2;
        if (Math.abs(this.speedY) < 1) this.speedY += (Math.random() - 0.5) * 0.2;

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect lines
        particles.forEach(p2 => {
            const dx = this.x - p2.x;
            const dy = this.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                ctx.strokeStyle = this.color;
                ctx.globalAlpha = (1 - distance / 100) * 0.2;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });
    }
}

const mouse = { x: null, y: null };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Click Burst Effect
window.addEventListener('mousedown', (e) => {
    particles.forEach(p => {
        const dx = p.x - e.clientX;
        const dy = p.y - e.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = 1000 / (distance + 1);
        const angle = Math.atan2(dy, dx);

        p.speedX += Math.cos(angle) * force;
        p.speedY += Math.sin(angle) * force;
    });
});

for (let i = 0; i < 180; i++) { // Increased particle count
    particles.push(new Particle());
}

// Cross-Platform Special Interactions

const initSpecialInteractions = () => {

    // Pulse Effect (Touch or Click)
    const triggerPulse = (x, y) => {
        const pulse = document.createElement('div');
        pulse.className = 'touch-pulse';
        pulse.style.left = x - 10 + 'px';
        pulse.style.top = y - 10 + 'px';
        document.body.appendChild(pulse);
        setTimeout(() => pulse.remove(), 500);
    };

    document.addEventListener('touchstart', (e) => triggerPulse(e.touches[0].clientX, e.touches[0].clientY));
    document.addEventListener('mousedown', (e) => {
        if (!isMobile) triggerPulse(e.clientX, e.clientY);
    });

    // Glitch Trigger
    const triggerGlitch = () => {
        document.body.classList.add('mobile-shake-glitch');
        setTimeout(() => document.body.classList.remove('mobile-shake-glitch'), 500);
    };

    // Desktop glitch trigger (Logo Click)
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            triggerGlitch();
        });
    }

    // Shake to Glitch for Mobile
    if (isMobile) {
        let lastX, lastY, lastZ;
        let threshold = 15;

        window.addEventListener('devicemotion', (e) => {
            let acc = e.accelerationIncludingGravity;
            if (!acc || !acc.x) return;

            let diffX = Math.abs(lastX - acc.x);
            let diffY = Math.abs(lastY - acc.y);
            let diffZ = Math.abs(lastZ - acc.z);

            if (diffX > threshold || diffY > threshold || diffZ > threshold) {
                triggerGlitch();
            }

            lastX = acc.x;
            lastY = acc.y;
            lastZ = acc.z;
        });
    }

    // Floating blips for all
    setInterval(() => {
        const blip = document.createElement('div');
        blip.className = 'floating-blip';
        blip.style.left = Math.random() * 100 + 'vw';
        blip.style.top = Math.random() * 100 + 'vh';
        document.body.appendChild(blip);
        setTimeout(() => blip.remove(), 3000);
    }, 4000);

    // Mobile Wake Effect
    if (isMobile) {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 1.5s ease';
            document.body.style.opacity = '1';
            triggerGlitch();
        }, 500);
    }
};

initSpecialInteractions();

// Auto-Update Social Profile Pictures
const updateProfilePictures = () => {
    const cards = document.querySelectorAll('.social-card[data-platform]');

    cards.forEach(card => {
        const platform = card.getAttribute('data-platform');
        const username = card.getAttribute('data-username');
        const img = card.querySelector('.social-pfp');
        const loader = card.querySelector('.pfp-loader');

        // Using unavatar.io for cross-platform profile images
        const avatarUrl = platform === 'discord'
            ? `https://unavatar.io/discord/${username}`
            : `https://unavatar.io/${platform}/${username}`;

        img.src = avatarUrl;

        img.onload = () => {
            img.style.display = 'block';
            if (loader) loader.style.display = 'none';
        };

        img.onerror = () => {
            // Fallback to local AI Brand Logo if fetching fails
            img.src = 'ai_brand_logo.png';
            if (img) img.style.display = 'block';
            if (loader) loader.style.display = 'none';
        };
    });
};

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}
animate();

// Glitch Text Initializer
document.querySelectorAll('.reveal-text').forEach(el => {
    el.setAttribute('data-text', el.innerText);
});

// Typewriter Effect
const words = ["BGMI / PUBG PRO", "MINECRAFT MASTER", "ROBLOX EXPLORER", "CLASH STRATEGIST", "ANIME ENTHUSIAST", "ASPHALT 9 RACER"];
const logo = document.querySelector('.logo');
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeTarget = document.getElementById('typewriter');

function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
        typeTarget.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typeTarget.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(type, 2000); // Wait at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 500);
    } else {
        setTimeout(type, isDeleting ? 50 : 150);
    }
}

// Cookie Banner Logic
const cookieBanner = document.getElementById('cookie-banner');
const acceptCookiesBtn = document.getElementById('accept-cookies');

if (acceptCookiesBtn) {
    acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.classList.remove('show');
        if (window.location.hash === '#cookies') {
            history.back();
        }
    });
}

// Swipe down to hide gesture
let touchStartY = 0;
cookieBanner.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

cookieBanner.addEventListener('touchmove', e => {
    const touchY = e.touches[0].clientY;
    const diff = touchY - touchStartY;
    if (diff > 0) {
        cookieBanner.style.transform = `translateX(-50%) translateY(${diff}px)`;
    }
}, { passive: true });

cookieBanner.addEventListener('touchend', e => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchEndY - touchStartY;
    if (diff > 100) { // Threshold for dismiss
        cookieBanner.classList.remove('show');
        if (window.location.hash === '#cookies') {
            history.back();
        }
    }
    cookieBanner.style.transform = ''; // Reset
}, { passive: true });

// Hide cookie banner on back button press
window.addEventListener('popstate', () => {
    if (cookieBanner.classList.contains('show')) {
        cookieBanner.classList.remove('show');
    }
});

// When showing banner, push a state so back button works
const showCookieBanner = () => {
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            // Final check just in case it was accepted during the delay
            if (!localStorage.getItem('cookiesAccepted')) {
                cookieBanner.classList.add('show');
                history.pushState({ banner: 'cookies' }, '', '#cookies');
            }
        }, 2000);
    }
};
showCookieBanner();

// Initial load check
window.addEventListener('load', () => {
    initReveals();
    updateProfilePictures();
    type(); // Start typewriter

    // VanillaTilt init
    if (typeof VanillaTilt !== 'undefined') {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        const tiltOptions = {
            max: isMobile ? 25 : 15, // Slightly more aggressive on mobile for better feel
            speed: 400,
            glare: true,
            "max-glare": 0.3,
            gyroscope: true,
            gyroscopeMinAngleX: -45,
            gyroscopeMaxAngleX: 45,
            gyroscopeMinAngleY: -45,
            gyroscopeMaxAngleY: 45,
        };

        VanillaTilt.init(document.querySelectorAll(".game-card, .contact-card"), tiltOptions);

        // Explicit permission request for iOS 13+
        if (isMobile && typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            const permissionOverlay = document.createElement('div');
            permissionOverlay.innerHTML = `
                <div style="position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:10000;background:var(--primary);padding:15px 25px;border-radius:30px;box-shadow:0 10px 30px var(--primary-glow);display:flex;align-items:center;gap:15px;cursor:pointer;" id="gyro-permission">
                    <span style="font-weight:900;font-size:0.8rem;">ENABLE TILT EFFECTS</span>
                    <span style="background:white;color:black;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;">!</span>
                </div>
            `;
            document.body.appendChild(permissionOverlay);

            document.getElementById('gyro-permission').addEventListener('click', function () {
                DeviceOrientationEvent.requestPermission()
                    .then(response => {
                        if (response === 'granted') {
                            this.parentElement.remove();
                            // Re-init tilt after permission
                            VanillaTilt.init(document.querySelectorAll(".game-card, .contact-card"), tiltOptions);
                        }
                    })
                    .catch(console.error);
            });
        }
    }
});

// Copy Protection & UX Features
const initCopyProtection = () => {
    // Prevent right-click
    document.addEventListener('contextmenu', (e) => {
        // Allow right click ONLY on input/textarea if they exist (unlikely here)
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });

    // Prevent copy shortcut (Ctrl+C, Cmd+C)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            const selection = window.getSelection().toString();
            // Allow copy only if the selection is inside an ID element
            const range = window.getSelection().getRangeAt(0);
            const container = range.commonAncestorContainer.parentElement;

            if (!container.classList.contains('card-id') && !container.classList.contains('id-value')) {
                e.preventDefault();
            }
        }
    });
};

// Instagram Easter Egg Trigger
const initEasterEgg = () => {
    const badge = document.querySelector('.verified-badge');
    const eggCard = document.getElementById('personal-insta-egg');
    let clicks = 0;

    // Reveal Function
    const revealSecret = () => {
        if (!eggCard.classList.contains('easter-egg-revealed')) {
            eggCard.classList.remove('easter-egg-hidden');
            eggCard.classList.add('easter-egg-revealed');

            // Trigger a global glitch
            document.body.classList.add('mobile-shake-glitch');
            setTimeout(() => document.body.classList.remove('mobile-shake-glitch'), 1000);

            // Scroll to the revealed card
            setTimeout(() => {
                eggCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);

            if (badge) {
                badge.style.transform = 'scale(1)';
                badge.innerText = '★';
                badge.title = "SECRET PROTOCOL ACTIVATED";
            }
        }
    };

    // Trigger 1: Badge Clicks
    if (badge && eggCard) {
        badge.style.cursor = 'pointer';
        badge.addEventListener('click', () => {
            clicks++;
            badge.style.transform = `scale(${1 + clicks * 0.1})`;
            badge.style.color = clicks % 2 === 0 ? 'var(--primary)' : 'var(--secondary)';
            if (clicks === 7) revealSecret();
        });
    }

    // Trigger 2: Keyboard Code "RIVU"
    let inputCode = "";
    const secretCode = "RIVU";
    document.addEventListener('keydown', (e) => {
        inputCode += e.key.toUpperCase();
        inputCode = inputCode.slice(-secretCode.length);

        if (inputCode === secretCode) {
            revealSecret();
            console.log("%c [SYSTEM] ACCESS OVERRIDE DETECTED ", "background: #a100ff; color: #fff; font-weight: bold;");
        }
    });

    // Trigger 3: Mobile Triple-Tap Logo
    if (isMobile && logo) {
        let logoTaps = 0;
        let lastTap = 0;
        logo.addEventListener('touchstart', (e) => {
            const now = Date.now();
            if (now - lastTap < 500) {
                logoTaps++;
            } else {
                logoTaps = 1;
            }
            lastTap = now;

            if (logoTaps === 5) { // 5 fast taps for secret
                revealSecret();
                logoTaps = 0;
            }
        });
    }

    // Redirection Animation for secret link
    eggCard.addEventListener('click', function (e) {
        const link = this.href;
        e.preventDefault();

        const overlay = document.getElementById('redirectionOverlay');
        overlay.classList.add('active');

        setTimeout(() => {
            overlay.classList.remove('active');
            window.open(link, '_blank');
        }, 1200); // Slightly more than the 1s bar animation
    });
};

initEasterEgg();
initCopyProtection();
