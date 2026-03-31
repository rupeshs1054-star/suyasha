const slidesData = [
    {
        image: "assets/images/165129-2560x1440-desktop-hd-jaguar-cars-wallpaper.jpg",
        title: "Sleek Aerodynamics",
        text: "Experience the ultimate combination of luxury and power. This magnificent Jaguar car blends aerodynamic design with heart-pounding horsepower, a true marvel of modern engineering."
    },
    {
        image: "assets/images/165131-1920x1080-desktop-full-hd-jaguar-cars-background-photo.jpg",
        title: "Unbridled Power",
        text: "The road bends to your will. With aggressive styling and unmatched grace, every mile becomes a story of unbridled passion and mechanical perfection."
    },
    {
        image: "assets/images/wp10871817-max-verstappen-2022-wallpapers.jpg",
        title: "Champion's Focus",
        text: "Precision and speed combined. Witness the thrill of the race where every split second counts and legends are cemented in history."
    },
    {
        image: "assets/images/wp12224112-formula-1-pc-wallpapers.jpg",
        title: "The Racing Spirit",
        text: "Adrenaline, teamwork, and cutting-edge technology. The pinnacle of motorsport where drivers push the limits of human capability."
    },
    {
        image: "assets/images/nature2.jpg",
        title: "Natural Harmony",
        text: "Step back from the pace of modern life. Find peace in the stunning beauty of the natural world, where tranquility and majesty reign supreme."
    },
    {
        image: "assets/images/nature2.webp",
        title: "Serene Reflections",
        text: "A different perspective on the same beautiful landscape, demonstrating the raw power of nature's endless canvas of colors."
    },
    {
        image: "assets/images/IMG_20241125_172340244_HDR~3.jpg",
        title: "Captured Moments",
        text: "Every picture tells a story. Look back at the warmth of lived experiences, immortalized in vivid detail for generations to admire."
    },
    {
        image: "assets/images/IMG_20250618_142537324_HDR~2.jpg",
        title: "Future Horizons",
        text: "Gazing towards tomorrow with eyes full of hope. The endless sky invites us to dream bigger and reach farther than ever before."
    }
];

// Initialize Slider DOM
const wrapper = document.getElementById('slider-wrapper');
let currentSlide = 0;
// Total slides is data + 1 for the intro slide
const totalSlides = slidesData.length + 1;

// 1. Create the Intro Slide (index 0)
const introSection = document.createElement('section');
introSection.className = 'slide active intro-slide'; // Start active
introSection.innerHTML = `
    <div class="intro-content">
        <h1 class="fancy-question">Are you ready my love ...</h1>
    </div>
`;
wrapper.appendChild(introSection);

// 2. Generate Image Slides (indices 1 to 8)
slidesData.forEach((slide, index) => {
    const section = document.createElement('section');
    section.className = 'slide';
    
    // Alternate sides for content
    const isEven = index % 2 !== 0; 
    
    section.innerHTML = `
        <div class="slide-content" style="flex-direction: ${isEven ? 'row-reverse' : 'row'}">
            <div class="image-container">
                <img src="${slide.image}" alt="${slide.title}">
                <div class="image-overlay"></div>
            </div>
            <div class="text-container">
                <h2>${slide.title}</h2>
                <div class="separator"></div>
                <p>${slide.text}</p>
            </div>
        </div>
    `;
    wrapper.appendChild(section);
});

function updateSlider() {
    wrapper.style.transform = `translateY(-${currentSlide * 100}vh)`;
    
    document.querySelectorAll('.slide').forEach((slide, idx) => {
        if (idx === currentSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
}


// --- Cursor Pointing Trail Logic ---
const cursorTrailLayer = document.getElementById('cursor-trail-layer');
let lastTrailTime = 0;

window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    // Throttle to create a balanced trail of symbols
    if (now - lastTrailTime > 50) { 
        lastTrailTime = now;
        const heartPoint = document.createElement('div');
        heartPoint.className = 'cursor-heart';
        heartPoint.innerHTML = '❤️'; 
        heartPoint.style.left = e.clientX + 'px';
        heartPoint.style.top = e.clientY + 'px';
        cursorTrailLayer.appendChild(heartPoint);

        // Remove element perfectly synchronously with animation end
        setTimeout(() => {
            heartPoint.remove();
        }, 1000);
    }
});


// --- Draggable Heart Navigation System ---
const draggableHeart = document.getElementById('draggable-heart');
const targetHeart = document.getElementById('target-heart');

let interactionState = {
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0, // Element actual X center
    currentY: 0  // Element actual Y center
};

function randomizeTargetLocation() {
    // Generate difficult places keeping padding away from edges
    // Hearts are 150px wide now, so padding must be larger
    const padding = 150;
    const maxX = window.innerWidth - padding * 2;
    const maxY = window.innerHeight - padding * 2;

    const targetX = padding + Math.random() * maxX;
    const targetY = padding + Math.random() * maxY;

    targetHeart.style.left = targetX + 'px';
    targetHeart.style.top = targetY + 'px';
}

function resetDraggableHeart() {
    // Reset position to bottom center
    const x = window.innerWidth / 2;
    const y = window.innerHeight - 150; // Raised up slightly because it's larger
    updateDraggablePosition(x, y);
}

function updateDraggablePosition(x, y) {
    interactionState.currentX = x;
    interactionState.currentY = y;
    draggableHeart.style.left = x + 'px';
    draggableHeart.style.top = y + 'px';
}

// Ensure the layout uses initial sizing
window.addEventListener('resize', () => {
    if (!interactionState.isDragging) {
        resetDraggableHeart();
    }
});

// Pointer events for unified cross-device support (mouse & touch)
draggableHeart.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    interactionState.isDragging = true;
    draggableHeart.setPointerCapture(e.pointerId); // Allows dragging even when mouse exits window momentarily
});

window.addEventListener('pointermove', (e) => {
    if (!interactionState.isDragging) return;
    updateDraggablePosition(e.clientX, e.clientY);
});

window.addEventListener('pointerup', (e) => {
    if (!interactionState.isDragging) return;
    interactionState.isDragging = false;
    
    // Use getBoundingClientRect for absolute center comparing
    const targetRect = targetHeart.getBoundingClientRect();
    
    // We compute the center of the target dynamically because it might be "drifting" (animated via CSS)
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    // Check distance between dragging heart center and target center
    const dx = interactionState.currentX - targetCenterX;
    const dy = interactionState.currentY - targetCenterY;
    const distance = Math.hypot(dx, dy);

    // If placed accurately near target (threshold increased since hearts are 150px wide)
    if (distance < 100) {
        // Trigger next slide if available
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlider();
            randomizeTargetLocation();
            resetDraggableHeart();
        } else {
            // End of slideshow
            alert("End of journey!");
            resetDraggableHeart();
        }
    } else {
        // Snap back if incorrect place
        resetDraggableHeart();
    }
});


// Call initial states
updateSlider();
randomizeTargetLocation();
resetDraggableHeart();



// --- Watery Love Bubbles Particle Effect (Background) ---
const canvas = document.getElementById('bubble-canvas');
const ctx = canvas.getContext('2d');

let width, height;
function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class LoveBubble {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = height + 50 + Math.random() * 200; // Start below screen
        this.size = Math.random() * 0.8 + 0.3; // Random size scale
        this.baseX = this.x;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.wobbleSpeed = Math.random() * 0.02 + 0.01;
        this.wobbleAngle = Math.random() * Math.PI * 2;
        this.wobbleDistance = Math.random() * 30 + 10;
        this.alpha = Math.random() * 0.4 + 0.1;
        
        // Burst properties
        this.isBursting = false;
        this.burstScale = 1;
        this.burstAlpha = this.alpha;
    }

    burst() {
        this.isBursting = true;
    }

    update() {
        if (this.isBursting) {
            this.burstScale += 0.1;
            this.burstAlpha -= 0.02;
            if (this.burstAlpha <= 0) {
                this.reset();
            }
            return;
        }

        this.y -= this.speedY;
        this.wobbleAngle += this.wobbleSpeed;
        this.x = this.baseX + Math.sin(this.wobbleAngle) * this.wobbleDistance;

        // Random chance to burst
        if (Math.random() < 0.001 && this.y < height - 100) {
            this.burst();
        }

        // Reset if goes off screen
        if (this.y < -50) {
            this.reset();
        }
    }

    draw(ctx) {
        let currentSize = this.isBursting ? this.size * this.burstScale : this.size;
        let currentAlpha = this.isBursting ? this.burstAlpha : this.alpha;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(currentSize, currentSize);
        
        // Watery heart styling
        ctx.fillStyle = `rgba(255, 105, 135, ${currentAlpha * 0.5})`; // Pinkish tint inside
        ctx.strokeStyle = `rgba(255, 255, 255, ${currentAlpha * 0.8})`; // White glossy border
        ctx.lineWidth = 1;
        
        // Draw Heart
        ctx.beginPath();
        let yOffset = -5;
        ctx.moveTo(0, yOffset);
        ctx.bezierCurveTo(0, yOffset - 3, -5, yOffset - 15, -15, yOffset - 15);
        ctx.bezierCurveTo(-30, yOffset - 15, -30, yOffset - 2.5, -30, yOffset - 2.5);
        ctx.bezierCurveTo(-30, yOffset + 20, -10, yOffset + 30, 0, yOffset + 40);
        ctx.bezierCurveTo(10, yOffset + 30, 30, yOffset + 20, 30, yOffset - 2.5);
        ctx.bezierCurveTo(30, yOffset - 2.5, 30, yOffset - 15, 15, yOffset - 15);
        ctx.bezierCurveTo(5, yOffset - 15, 0, yOffset - 3, 0, yOffset);
        ctx.closePath();
        
        ctx.fill();
        ctx.stroke();

        // Add a glossy white highlight to make it look "watery"
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 1.5})`;
        ctx.beginPath();
        ctx.ellipse(-12, yOffset - 8, 4, 2, Math.PI / -4, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.restore();
    }
}

const bubbles = [];
for (let i = 0; i < 60; i++) { // 60 simultaneous floating bubbles
    bubbles.push(new LoveBubble());
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    bubbles.forEach(bubble => {
        bubble.update();
        bubble.draw(ctx);
    });

    requestAnimationFrame(animate);
}

animate();

// --- Background Music Auto-play ---
const bgMusic = document.getElementById('bg-music');
let hasInteracted = false;

// Browsers block autoplay until the user interacts with the page.
// The moment they click or grab the first heart, the slow romantic music starts.
window.addEventListener('pointerdown', () => {
    if (!hasInteracted && bgMusic) {
        // Set the volume to be calm and slightly lower (e.g., 0.6)
        bgMusic.volume = 0.6;
        bgMusic.play().catch(e => console.log("Audio play blocked or file missing: ", e));
        hasInteracted = true;
    }
}, { once: true });
