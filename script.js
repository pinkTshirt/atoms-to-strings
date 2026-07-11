const canvas = document.getElementById('cosmicCanvas');
const ctx = canvas.getContext('2d');

// Fixed State Engine properties initializing at Stage 0
let currentMode = 'scale'; 
let currentStage = 0; 
let targetStage = 0;
let transitionProgress = 1.0; 
let globalRotation = 0;
let stars = [];

// Component Dictionary for Interactive Raycasting Pop-ups
const componentData = {
    "Electron": "Fundamental subatomic particles with a negative elementary electric charge. In an atom, they are bound to the nucleus by electromagnetism and exist in quantum probability clouds.",
    "Atomic Nucleus": "The extremely dense region consisting of protons and neutrons at the center of an atom. It contains over 99.9% of the atom's mass but occupies a tiny fraction of its volume.",
    "Proton": "A stable subatomic particle with a positive electric charge, found in atomic nuclei. It is a hadron, comprised of two 'up' quarks and one 'down' quark.",
    "Neutron": "A subatomic particle of about the same mass as a proton but without an electric charge. It is comprised of one 'up' quark and two 'down' quarks.",
    "Up Quark": "The lightest of all quarks, a major constituent of visible matter, carrying a fractional electric charge of +2/3 e. They are never found in isolation.",
    "Down Quark": "The second lightest quark, carrying a fractional electric charge of -1/3 e. Along with up quarks, they form the protons and neutrons of atomic nuclei.",
    "Gluon Field": "Gluons are the exchange particles (gauge bosons) for the strong force between quarks. This force field generates the vast majority of the mass of a proton or neutron.",
    "Quark Core": "Quarks are treated as point-like elementary particles in the Standard Model, meaning they have no measurable physical volume or internal structure.",
    "Fundamental String": "In string theory, point particles are replaced by one-dimensional vibrating strings. The specific vibrational mode of the string dictates the particle's mass and charge.",
    "Free Quark / Gluon": "At extreme energies (trillions of degrees), the strong force cannot confine quarks. They dissolve into a nearly perfect, frictionless liquid soup called Quark-Gluon Plasma.",
    "Newly Bound Hadron": "As the universe expanded and cooled below the Hagedorn temperature, quarks suddenly became permanently bound together by gluons, creating the first protons and neutrons.",
    "Stable Nucleus": "During the Recombination epoch, the universe finally cooled enough to allow positively charged nuclei to capture free-roaming electrons.",
    "Bound Electron": "Once captured by nuclei, electrons settled into distinct energy states. This cleared the universe of free-scattering plasma, allowing light to travel freely for the first time."
};

// Definition Matrices
const scaleStages = [
    { title: "Atom", metric: "~10⁻¹⁰ m", desc: "A cloud of electrons surrounds a nucleus 100,000× smaller — quantum mechanics describes their positions as probability clouds.", color: "#38bdf8" },
    { title: "Nucleus", metric: "~10⁻¹⁴ m", desc: "Protons and neutrons packed 100,000× smaller than the atom, held against electrostatic repulsion by the residual strong force.", color: "#10b981" },
    { title: "Proton", metric: "~10⁻¹⁵ m", desc: "Three quarks bound by gluons in constant exchange. The strong force generates 99% of the proton's mass from pure field energy.", color: "#f59e0b" },
    { title: "Quark", metric: "< 10⁻¹⁸ m", desc: "Elementary particles of matter. Quarks are point-like entities possessing fractional electric charge, never observed in isolation.", color: "#a855f7" },
    { title: "String (Hypothetical)", metric: "~10⁻³⁵ m", desc: "At the Planck scale, superstring theory replaces point particles with vibrating 1D loops — each vibrational mode a different particle.", color: "#ec4899" }
];

const cosmicStages = [
    { title: "Quark-Gluon Plasma", metric: "Time: ~10⁻⁵ Seconds | Temp: ~10¹² K", desc: "The universe is a hot, dense, deconfined primordial soup. Environmental energy is too high for the strong force to confine quarks; they bounce and stream freely alongside gluons.", color: "#f43f5e" },
    { title: "Hadronization Epoch", metric: "Time: ~10⁻⁴ Seconds | Temp: ~10¹² K", desc: "As expansion cools the universe, ambient energy drops below the confinement threshold. Quarks are suddenly bound together by the strong force, freezing into stable protons and neutrons.", color: "#eab308" },
    { title: "Recombination (CMB)", metric: "Time: ~380,000 Years | Temp: ~3,000 K", desc: "The universe cools enough for electrons to bind with nuclei, forming the first stable, neutral atoms. Photons are suddenly free to travel across open space, forming the Cosmic Microwave Background.", color: "#3b82f6" }
];

function getActiveStages() {
    return currentMode === 'scale' ? scaleStages : cosmicStages;
}

// Setup environment structures securely
function init() {
    resize();
    stars = Array.from({length: 150}, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5,
        alpha: Math.random(),
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: ['#38bdf8', '#f59e0b', '#ec4899', '#ffffff'][Math.floor(Math.random() * 4)]
    }));
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
    
    if (transitionProgress < 1.0) {
        transitionProgress += 0.05;
        if (transitionProgress >= 1.0) {
            transitionProgress = 1.0;
            currentStage = targetStage;
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackgroundPlasma();

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    let stageToRender = transitionProgress < 1.0 ? currentStage : targetStage;
    renderStageVisuals(stageToRender, transitionProgress);

    ctx.restore();
    window.requestAnimationFrame(loop);
}

function drawBackgroundPlasma() {
    stars.forEach(s => {
        if (currentMode === 'cosmic') {
            s.x += s.speedX * (targetStage + 1);
            s.y += s.speedY * (targetStage + 1);
            if (s.x < 0 || s.x > canvas.width) s.speedX *= -1;
            if (s.y < 0 || s.y > canvas.height) s.speedY *= -1;
            ctx.fillStyle = s.color;
        } else {
            ctx.fillStyle = '#ffffff';
        }
        ctx.globalAlpha = s.alpha * (0.2 + Math.sin(globalRotation * 2 + s.x) * 0.3);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * (currentMode === 'cosmic' ? 2 : 1), 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1.0;
}

function renderStageVisuals(stageIdx, progress) {
    let scaleFactor = 1.0;
    if (transitionProgress < 1.0) {
        scaleFactor = targetStage > currentStage ? 1.0 + (progress * 0.4) : 1.4 - (progress * 0.4);
    }
    ctx.scale(scaleFactor, scaleFactor);

    if (currentMode === 'scale') {
        ctx.rotate(globalRotation * 0.2);
        renderScaleVisuals(stageIdx);
    } else {
        renderCosmicVisuals(stageIdx);
    }
}

function renderScaleVisuals(stageIdx) {
    switch(stageIdx) {
        case 0: // ATOM
            drawOrbitRing(160, 'rgba(56, 189, 248, 0.2)');
            drawOrbitRing(100, 'rgba(56, 189, 248, 0.15)');
            drawElectronNode(160, globalRotation * 1.5);
            drawElectronNode(100, -globalRotation * 2);
            drawCoreSphere(0, 0, 14, '#10b981');
            break;
        case 1: // NUCLEUS
            const cluster = [{x:-20,y:-10,t:'p'}, {x:15,y:-20,t:'n'}, {x:-5,y:20,t:'p'}, {x:25,y:15,t:'n'}, {x:-25,y:25,t:'n'}, {x:0,y:0,t:'p'}];
            cluster.forEach(p => drawCoreSphere(p.x, p.y, 22, p.t === 'p' ? '#10b981' : '#1e293b', p.t === 'p' ? '#ffffff' : '#475569'));
            break;
        case 2: // PROTON
            ctx.beginPath();
            ctx.moveTo(-70, 40); ctx.lineTo(70, 40); ctx.lineTo(0, -70); ctx.closePath();
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)'; ctx.lineWidth = 3; ctx.setLineDash([6, 6]); ctx.stroke(); ctx.setLineDash([]);
            drawGluonField();
            drawQuarkNode(-70, 40, "u", '#f59e0b');
            drawQuarkNode(70, 40, "u", '#f59e0b');
            drawQuarkNode(0, -70, "d", '#f59e0b');
            break;
        case 3: // QUARK
            drawPulseGlowRing(80, 'rgba(168, 85, 247, 0.4)');
            drawCoreSphere(0, 0, 30, '#a855f7');
            break;
        case 4: // STRINGS
            drawVibratingStringLoop();
            break;
    }
}

function renderCosmicVisuals(stageIdx) {
    let time = Date.now() * 0.002;
    switch(stageIdx) {
        case 0: // Quark-Gluon Plasma
            for (let i = 0; i < 8; i++) {
                let x = Math.sin(time + i) * 60;
                let y = Math.cos(time * 0.8 + i) * 60;
                drawCoreSphere(x, y, 12, '#f43f5e', 'rgba(244,63,94,0.3)');
            }
            break;
        case 1: // Hadronization Epoch
            ctx.strokeStyle = 'rgba(234, 179, 8, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                let x = Math.sin(time + i) * 40;
                let y = Math.cos(time + i) * 40;
                if (i === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
                drawCoreSphere(x, y, 16, i % 2 === 0 ? '#eab308' : '#1e293b');
            }
            ctx.closePath();
            ctx.stroke();
            break;
        case 2: // Recombination CMB
            drawOrbitRing(100, 'rgba(59, 130, 246, 0.2)');
            drawCoreSphere(0, 0, 20, '#1e293b', '#3b82f6');
            drawElectronNode(100, time);
            break;
    }
}

function drawOrbitRing(radius, color) {
    ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
}

function drawElectronNode(radius, angle) {
    let x = Math.cos(angle) * radius; let y = Math.sin(angle) * radius;
    ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8'; ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0;
}

function drawCoreSphere(x, y, r, fill, stroke = 'rgba(255,255,255,0.1)') {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.fill(); ctx.stroke();
}

function drawQuarkNode(x, y, label, color) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(-globalRotation * 0.2);
    ctx.beginPath(); ctx.arc(0, 0, 38, 0, Math.PI * 2); ctx.fillStyle = 'rgba(245, 158, 11, 0.12)'; ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI * 2); ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 20; ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = '#000000'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 0);
    ctx.restore();
}

function drawGluonField() {
    ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fillStyle = 'rgba(236, 72, 153, 0.6)'; ctx.shadowColor = '#ec4899'; ctx.shadowBlur = 12; ctx.fill(); ctx.shadowBlur = 0;
}

function drawPulseGlowRing(baseRadius, color) {
    let pulse = baseRadius + Math.sin(Date.now() * 0.005) * 10;
    ctx.beginPath(); ctx.arc(0, 0, pulse, 0, Math.PI * 2); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
}

function drawVibratingStringLoop() {
    ctx.beginPath(); const points = 60;
    for(let i = 0; i <= points; i++) {
        let angle = (i / points) * Math.PI * 2;
        let offset = Math.sin(angle * 6 + Date.now() * 0.01) * 6;
        let r = 90 + offset;
        let x = Math.cos(angle) * r; let y = Math.sin(angle) * r;
        if(i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.strokeStyle = '#ec4899'; ctx.lineWidth = 3; ctx.shadowColor = '#ec4899'; ctx.shadowBlur = 15; ctx.stroke(); ctx.shadowBlur = 0;
}

// -----------------------------------------------------------
// INTERACTIVE HIT DETECTION SYSTEM (RAYCASTING)
// -----------------------------------------------------------

function detectComponentHit(clientX, clientY) {
    if (transitionProgress < 1.0) return null; // Prevent interaction during zooms

    const rect = canvas.getBoundingClientRect();
    
    // Normalize coordinates to canvas center
    let mx = clientX - rect.left - canvas.width / 2;
    let my = clientY - rect.top - canvas.height / 2;

    // Compensate for global rotation matrix applied in 'scale' mode
    if (currentMode === 'scale') {
        let unRotAngle = -globalRotation * 0.2;
        let unX = mx * Math.cos(unRotAngle) - my * Math.sin(unRotAngle);
        let unY = mx * Math.sin(unRotAngle) + my * Math.cos(unRotAngle);
        mx = unX;
        my = unY;
    }

    const getDistance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    if (currentMode === 'scale') {
        if (targetStage === 0) {
            if (getDistance(mx, my, 0, 0) <= 25) return "Atomic Nucleus";
            let e1Angle = globalRotation * 1.5;
            if (getDistance(mx, my, Math.cos(e1Angle) * 160, Math.sin(e1Angle) * 160) <= 20) return "Electron";
            let e2Angle = -globalRotation * 2;
            if (getDistance(mx, my, Math.cos(e2Angle) * 100, Math.sin(e2Angle) * 100) <= 20) return "Electron";
        }
        else if (targetStage === 1) {
            const cluster = [{x:-20,y:-10,t:'p'}, {x:15,y:-20,t:'n'}, {x:-5,y:20,t:'p'}, {x:25,y:15,t:'n'}, {x:-25,y:25,t:'n'}, {x:0,y:0,t:'p'}];
            for (let p of cluster) {
                if (getDistance(mx, my, p.x, p.y) <= 25) return p.t === 'p' ? "Proton" : "Neutron";
            }
        }
        else if (targetStage === 2) {
            if (getDistance(mx, my, -70, 40) <= 38) return "Up Quark";
            if (getDistance(mx, my, 70, 40) <= 38) return "Up Quark";
            if (getDistance(mx, my, 0, -70) <= 38) return "Down Quark";
            if (getDistance(mx, my, 0, 0) <= 35) return "Gluon Field";
        }
        else if (targetStage === 3) {
            if (getDistance(mx, my, 0, 0) <= 50) return "Quark Core";
        }
        else if (targetStage === 4) {
            let distToCenter = getDistance(mx, my, 0, 0);
            if (distToCenter >= 60 && distToCenter <= 120) return "Fundamental String";
        }
    } else { // Cosmic Mode
        let time = Date.now() * 0.002;
        if (targetStage === 0) {
            for (let i = 0; i < 8; i++) {
                if (getDistance(mx, my, Math.sin(time + i) * 60, Math.cos(time * 0.8 + i) * 60) <= 20) return "Free Quark / Gluon";
            }
        }
        else if (targetStage === 1) {
            for (let i = 0; i < 4; i++) {
                if (getDistance(mx, my, Math.sin(time + i) * 40, Math.cos(time + i) * 40) <= 25) return "Newly Bound Hadron";
            }
        }
        else if (targetStage === 2) {
            if (getDistance(mx, my, 0, 0) <= 30) return "Stable Nucleus";
            if (getDistance(mx, my, Math.cos(time) * 100, Math.sin(time) * 100) <= 20) return "Bound Electron";
        }
    }
    return null;
}

// Mouse Handlers for Interactivity
canvas.addEventListener('mousemove', (e) => {
    const component = detectComponentHit(e.clientX, e.clientY);
    canvas.style.cursor = component ? 'pointer' : 'default';
});

canvas.addEventListener('click', (e) => {
    const componentName = detectComponentHit(e.clientX, e.clientY);
    if (componentName && componentData[componentName]) {
        openModal(componentName, componentData[componentName]);
    }
});

// Modal Controller Functions
window.openModal = function(title, description) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalDesc').textContent = description;
    document.getElementById('componentModal').classList.add('active');
};

window.closeModal = function() {
    document.getElementById('componentModal').classList.remove('active');
};

// Global scope access functions
window.switchTimeline = function(mode) {
    if (currentMode === mode) return;
    currentMode = mode;
    
    document.getElementById('navScale').classList.toggle('active', mode === 'scale');
    document.getElementById('navCosmic').classList.toggle('active', mode === 'cosmic');
    
    const currentList = getActiveStages();
    document.getElementById('stepContainer').innerHTML = currentList.map((st, i) => `<div class="step-link" onclick="jumpToStage(${i})">${st.title}</div>`).join('');
    document.getElementById('dotContainer').innerHTML = currentList.map((st, i) => `<div class="dot" onclick="jumpToStage(${i})"></div>`).join('');

    currentStage = 0;
    targetStage = 0;
    transitionProgress = 1.0;
    
    setTimeout(updateUI, 50); 
};

window.jumpToStage = function(index) {
    const total = getActiveStages().length;
    if (index < 0 || index >= total || index === targetStage) return;
    currentStage = targetStage;
    targetStage = index;
    transitionProgress = 0.0;
    closeModal(); // Collapse modal if running a transition jump
    updateUI();
};

function updateUI() {
    const activeList = getActiveStages();
    if (!activeList || !activeList[targetStage]) return;
    
    const data = activeList[targetStage];
    
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
    }, 150);
}

// Hardware input controllers
window.addEventListener('wheel', (e) => {
    if (transitionProgress < 1.0) return;
    if (e.deltaY > 20) jumpToStage(targetStage + 1);
    else if (e.deltaY < -20) jumpToStage(targetStage - 1);
});

window.addEventListener('keydown', (e) => {
    if (transitionProgress < 1.0) return;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") jumpToStage(targetStage + 1);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") jumpToStage(targetStage - 1);
});

init();
