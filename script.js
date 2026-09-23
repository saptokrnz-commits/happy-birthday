const surpriseButton = document.getElementById("surpriseButton");
const surpriseModal = document.getElementById("surpriseModal");
const closeModal = document.getElementById("closeModal");
const backgroundMusic = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
const musicStatus = document.getElementById("musicStatus");
const introGate = document.getElementById("introGate");
const introGateButton = document.getElementById("introGateButton");

function setPlayingUI(isPlaying) {
    musicToggle.classList.toggle("playing", isPlaying);
    musicToggle.setAttribute("aria-pressed", isPlaying ? "true" : "false");
    musicToggle.setAttribute("aria-label", isPlaying ? "Jeda backsound" : "Putar backsound");
    musicStatus.textContent = isPlaying ? "Pause music" : "Play music";
}

backgroundMusic.load();

// Tapping "Buka" is a real user gesture, so the browser allows audio
// with sound to start here — this is the moment it's guaranteed to work
// on every browser/device, including iPhone Safari.
introGateButton.addEventListener("click", async () => {
    try {
        await backgroundMusic.play();
        setPlayingUI(true);
    } catch {
        setPlayingUI(false);
    }

    introGate.classList.add("hidden");
    setTimeout(() => introGate.remove(), 700);
});

musicToggle.addEventListener("click", async () => {
    if (backgroundMusic.paused) {
        try {
            await backgroundMusic.play();
            setPlayingUI(true);
        } catch {
            setPlayingUI(false);
        }
    } else {
        backgroundMusic.pause();
        setPlayingUI(false);
    }
});

backgroundMusic.addEventListener("ended", () => {
    setPlayingUI(false);
});

surpriseButton.addEventListener("click", () => {
    surpriseModal.classList.add("active");
    createConfetti();
});

closeModal.addEventListener("click", () => {
    surpriseModal.classList.remove("active");
});

surpriseModal.addEventListener("click", (event) => {
    if (event.target === surpriseModal) {
        surpriseModal.classList.remove("active");
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        surpriseModal.classList.remove("active");
    }
});

function createConfetti() {
    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement("div");

        confetti.style.position = "fixed";
        confetti.style.width = "7px";
        confetti.style.height = "7px";
        confetti.style.background = i % 2 === 0 ? "#75685d" : "#d8cec3";
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.top = "-10px";
        confetti.style.zIndex = "1000";
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

        document.body.appendChild(confetti);

        const animation = confetti.animate(
            [
                { transform: "translateY(0) rotate(0deg)", opacity: 1 },
                { transform: "translateY(110vh) rotate(720deg)", opacity: 0 }
            ],
            {
                duration: 2500 + Math.random() * 2000,
                easing: "cubic-bezier(.2,.8,.3,1)"
            }
        );

        animation.onfinish = () => confetti.remove();
    }
}

/* ---------- Scroll reveal ----------
   Uses the .reveal / .is-visible classes defined in style.css instead of
   inline styles, so the animation timing lives entirely in CSS (and is
   automatically switched off for users with prefers-reduced-motion).
   Elements that sit inside a repeating group (gallery photos, wish
   cards) get a small staggered delay based on their position, so they
   cascade in rather than popping in all at once — on both desktop and
   mobile. */

const revealGroups = [
    { selector: ".gallery .photo", step: 90, max: 4 },
    { selector: ".wish", step: 90, max: 4 },
    { selector: ".photo, .message-card, .wishes-title, .hero-photo, .intro-photo, .message-photo, .wishes-photo, .surprise-photo", step: 0, max: 0 }
];

const revealTargets = new Map();

revealGroups.forEach(({ selector, step, max }) => {
    document.querySelectorAll(selector).forEach((element, index) => {
        if (revealTargets.has(element)) return; // keep the first (most specific) group match
        const delay = step ? Math.min(index, max) * step : 0;
        element.style.setProperty("--reveal-delay", `${delay}ms`);
        element.classList.add("reveal");
        revealTargets.set(element, true);
    });
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {
    revealTargets.forEach((_, element) => element.classList.add("is-visible"));
} else {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealTargets.forEach((_, element) => observer.observe(element));
}