const canvas = document.getElementById('cosmicCanvas');
const ctx = canvas.getContext('2d');

// State Engine properties
let currentStage = 2; // Default starting at Proton view
let targetStage = 2;
let transitionProgress = 1.0; 
let globalRotation = 0;
let stars = [];

// Definition Matrix
const stages = [
    {
        title: "Atom",
        metric: "~10⁻¹⁰ m",
        desc: "A cloud of electrons surrounds a nucleus 100,000× smaller — quantum mechanics describes their positions as probability clouds.",
        color: "#38bdf8"
    },
    {
        title: "Nucleus",
        metric: "~10⁻¹⁴ m",
        desc: "Protons and neutrons packed 100,000× smaller than the atom, held against electrostatic repulsion by the residual strong force.",
        color: "#10b981"
    },
    {
        title: "Proton",
        metric: "~10⁻¹⁵ m",
        desc: "Three quarks bound by gluons in constant exchange. The strong force generates 99% of the proton's mass from pure field energy.",
        color: "#f59e0b"
    },
    {
        title: "Quark",
        metric: "< 10⁻¹⁸ m",
        desc: "Elementary particles of matter. Quarks are point-like entities possessing fractional electric charge, never observed in isolation.",
        color: "#a855f7"
    },
    {
        title: "String (Hypothetical)",
        metric: "~10⁻³⁵ m",
        desc: "At the Planck scale, superstring theory replaces point particles with vibrating 1D loops — each vibrational mode a different particle.",
        color: "#ec4899"
    }
];

// Setup environment structures
function init() {
    resize();
    stars = Array.from({length: 120}, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5,
        alpha: Math.random()
    }));
    updateUI();
    window.requestAnimationFrame(loop);
}

function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener('resize', resize);

// Core Render Matrix Engine Loop
function loop() {
    globalRotation += 0.003;
    
    // Interpolate smooth transition curves smoothly
    if (transitionProgress < 1.0) {
        transitionProgress += 0.04;
        if (transitionProgress >= 1.0) {
            transitionProgress = 1.0;
            currentStage = targetStage;
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackgroundStars();

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    let stageToRender = transitionProgress < 1.0 ? currentStage : targetStage;
    renderStageVisuals(stageToRender, transitionProgress);

    ctx.restore();
    window.requestAnimationFrame(loop);
}

function drawBackgroundStars() {
    ctx.fillStyle = '#ffffff';
    stars.forEach(s => {
        ctx.globalAlpha = s.alpha * (0.3 + Math.sin(globalRotation * 2 + s.x) * 0.3);
        ctx.fillRect(s.x, s.y, s.size, s.size);
    });
    ctx.globalAlpha = 1.0;
}

function renderStageVisuals(stageIdx, progress) {
    let scaleFactor = 1.0;
    if (transitionProgress < 1.0) {
        scaleFactor = targetStage > currentStage ? 1.0 + (progress * 0.5) : 1.5 - (progress * 0.5);
    }

    ctx.scale(scaleFactor, scaleFactor);
    ctx.rotate(globalRotation * 0.2);

    switch(stageIdx) {
        case 0: // ATOM VIEW
            drawOrbitRing(160, 'rgba(56, 189, 248, 0.2)');
            drawOrbitRing(100, 'rgba(56, 189, 248, 0.15)');
            drawElectronNode(160, globalRotation * 1.5);
            drawElectronNode(100, -globalRotation * 2);
            drawCoreSphere(0, 0, 14, '#10b981');
            break;

        case 1: // NUCLEUS VIEW
            const clusterPositions = [{x:-20,y:-10,t:'p'}, {x:15,y:-20,t:'n'}, {x:-5,y:20,t:'p'}, {x:25,y:15,t:'n'}, {x:-25,y:25,t:'n'}, {x:0,y:0,t:'p'}];
            clusterPositions.forEach(p => {
                drawCoreSphere(p.x, p.y, 22, p.t === 'p' ? '#10b981' : '#1e293b', p.t === 'p' ? '#ffffff' : '#475569');
            });
            break;

        case 2: // PROTON VIEW
            ctx.beginPath();
            ctx.moveTo(-70, 40); ctx.lineTo(70, 40); ctx.lineTo(0, -70); ctx.closePath();
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
            ctx.lineWidth = 3;
            ctx.setLineDash([6, 6]);
            ctx.stroke();
            ctx.setLineDash([]);

            drawGluonField();

            drawQuarkNode(-70, 40, "u", '#f59e0b');
            drawQuarkNode(70, 40, "u", '#f59e0b');
            drawQuarkNode(0, -70, "d", '#f59e0b');
            break;

        case 3: // QUARK VIEW
            drawPulseGlowRing(80, 'rgba(168, 85, 247, 0.4)');
            drawCoreSphere(0, 0, 30, '#a855f7');
            break;

        case 4: // STRINGS VIEW
            drawVibratingStringLoop();
            break;
    }
}

function drawOrbitRing(radius, color) {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
}

function drawElectronNode(radius, angle) {
    let x = Math.cos(angle) * radius;
    let y = Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawCoreSphere(x, y, r, fill, stroke = 'rgba(255,255,255,0.1)') {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
}

// Global scope access function definition for HTML context click hooks
window.jumpToStage = function(index) {
    if (index < 0 || index >= stages.length || index === targetStage) return;
    currentStage = targetStage;
    targetStage = index;
    transitionProgress = 0.0;
    updateUI();
};

function drawQuarkNode(x, y, label, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-globalRotation * 0.2);

    ctx.beginPath();
    ctx.arc(0, 0, 38, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 0, 0);
    ctx.restore();
}

function drawGluonField() {
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(236, 72, 153, 0.6)';
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawPulseGlowRing(baseRadius, color) {
    let pulse = baseRadius + Math.sin(Date.now() * 0.005) * 10;
    ctx.beginPath();
    ctx.arc(0, 0, pulse, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawVibratingStringLoop() {
    ctx.beginPath();
    const points = 60;
    for(let i = 0; i <= points; i++) {
        let angle = (i / points) * Math.PI * 2;
        let offset = Math.sin(angle * 6 + Date.now() * 0.01) * 6;
        let r = 90 + offset;
        let x = Math.cos(angle) * r;
        let y = Math.sin(angle) * r;
        if(i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;
}

function updateUI() {
    const data = stages[targetStage];
    
    document.querySelectorAll('.step-link').forEach((el, idx) => {
        el.classList.toggle('active', idx === targetStage);
    });

    document.querySelectorAll('.dot').forEach((el, idx) => {
        el.classList.toggle('active', idx === targetStage);
    });

    const card = document.getElementById('infoCard');
    card.classList.remove('visible');
    
    setTimeout(() => {
        document.getElementById('cardTitle').textContent = data.title;
        document.getElementById('cardMetric').textContent = data.metric;
        document.getElementById('cardDescription').textContent = data.desc;
        document.getElementById('focusTitle').textContent = data.title;
        card.classList.add('visible');
    }, 250);
}

// Hardware Input Bindings
window.addEventListener('wheel', (e) => {
    if (transitionProgress < 1.0) return;
    if (e.deltaY > 20) {
        jumpToStage(targetStage + 1);
    } else if (e.deltaY < -20) {
        jumpToStage(targetStage - 1);
    }
});

window.addEventListener('keydown', (e) => {
    if (transitionProgress < 1.0) return;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        jumpToStage(targetStage + 1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        jumpToStage(targetStage - 1);
    }
});

// Run
init();
