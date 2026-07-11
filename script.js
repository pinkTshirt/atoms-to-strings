const canvas = document.getElementById('cosmicCanvas');
const ctx = canvas.getContext('2d');

let cameraZoom = 1.0;
let targetZoom = 1.0;
let panX = 0;
let panY = 0;
let isDragging = false;
let lastMouse = { x: 0, y: 0 };

const epochs = [
    { title: "Inflation", time: "~10⁻³² Seconds", detail: "The universe undergoes exponential expansion, smoothing out primordial fluctuations." },
    { title: "Primordial Particle Soup", time: "Early Universe", detail: "A hot, dense plasma of quarks and gluons before hadrons formed." },
    { title: "Atoms Form", time: "380,000 Years", detail: "Recombination: electrons bind to nuclei, allowing light to travel freely." },
    { title: "First Stars Form", time: "50-200 Million Years", detail: "Gravity collapses gas clouds, igniting the first nuclear fusion engines." },
    { title: "Present Day", time: "13.8 Billion Years", detail: "Mature galaxies and complex large-scale structures dominate the universe." }
];

window.zoomToEpoch = function(index) {
    targetZoom = 1 + (index * 2.5);
    panX = 0; panY = 0;
    const data = epochs[index];
    document.getElementById('cardTitle').textContent = data.title;
    document.getElementById('cardMetric').textContent = data.time;
    document.getElementById('cardDescription').textContent = data.detail;
};

canvas.addEventListener('mousedown', (e) => { isDragging = true; lastMouse = { x: e.clientX, y: e.clientY }; });
window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    panX += (e.clientX - lastMouse.x) / cameraZoom;
    panY += (e.clientY - lastMouse.y) / cameraZoom;
    lastMouse = { x: e.clientX, y: e.clientY };
});
window.addEventListener('mouseup', () => { isDragging = false; });

function loop() {
    cameraZoom += (targetZoom - cameraZoom) * 0.05;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(canvas.width / 2 + panX * cameraZoom, canvas.height / 2 + panY * cameraZoom);
    ctx.scale(cameraZoom, cameraZoom);
    
    // Draw visual representation
    ctx.fillStyle = "white";
    ctx.beginPath(); ctx.arc(0, 0, 40, 0, Math.PI * 2); ctx.fill();
    
    ctx.restore();
    requestAnimationFrame(loop);
}

window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
canvas.width = window.innerWidth; canvas.height = window.innerHeight;
loop();
