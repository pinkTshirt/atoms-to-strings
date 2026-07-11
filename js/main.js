import { stages, ns } from './stages.js';
import { initStars, drawStars } from './starfield.js';
import { PlasmaSimulation } from './plasma.js';

var app = document.getElementById("app");
var container = document.getElementById("viewports-container");
var W = container.offsetWidth, H = container.offsetHeight;
var BASE = Math.min(W, H) * 0.65;

// State management configuration
let currentActiveMode = 'scale'; // 'scale' or 'cosmo'

// Initialize Context Engines
initStars();
drawStars();
const cosmoSim = new PlasmaSimulation('plasma-canvas');

// Build Zoom Layers dynamically for Scale Mode
var scene = document.getElementById("scene"), layers = [];
stages.forEach(function(s, i){
  var div = document.createElement("div"); div.className = "layer";
  var svg = s.draw(BASE); svg.style.filter = "drop-shadow(0 0 28px " + s.glow + ")";
  div.appendChild(svg); scene.appendChild(div); layers.push(div);
});

// Build Side Navigation indicators
var navEl = document.getElementById("nav"), progEl = document.getElementById("prog");
stages.forEach(function(s, i){
  var d = document.createElement("div"); d.className = "nav-dot"; d.title = s.title; d.addEventListener("click", function(){ goToScaleStage(i); }); navEl.appendChild(d);
  var pl = document.createElement("div"); pl.className = "prog-label"; pl.textContent = s.title; pl.addEventListener("click", function(){ goToScaleStage(i); }); progEl.appendChild(pl);
});

function updateScaleNav(c){
  document.querySelectorAll(".nav-dot").forEach(function(d, i){ d.classList.toggle("active", i === c); });
  document.querySelectorAll(".prog-label").forEach(function(d, i){ d.classList.toggle("active", i === c); });
}

// Update text data for Scale Headers
var stTitle = document.getElementById("st-title"), stScale = document.getElementById("st-scale"), scrollHint = document.getElementById("scroll-hint"), scrollLabel = document.getElementById("scroll-label");
function updateScaleTitle(c){
  var s = stages[c]; stTitle.textContent = s.title; stTitle.style.color = s.color; stScale.textContent = s.scale;
  scrollLabel.textContent = c === 0 ? "Scroll to zoom in" : c === stages.length - 1 ? "Scroll up to go back" : "Scroll to continue";
  scrollHint.style.opacity = c === stages.length - 1 ? "0" : "1";
}

// Math core interpolation loops for Scale Viewport
var current = 0, progress = 0, target = 0, animId = null;
function applyScaleTransforms(p){
  stages.forEach(function(s, i){
    var d = p - i;
    if(d < -1.2 || d > 1.2){ layers[i].style.opacity = "0"; layers[i].style.pointerEvents = "none"; return; }
    var scale, opacity;
    if(d <= 0){ scale = 0.15 + 0.85 * (1 + d); opacity = Math.max(0, 1 + d); }
    else{ scale = 1 + 5 * d; opacity = Math.max(0, 1 - d); }
    layers[i].style.transform = "scale(" + scale.toFixed(4) + ")";
    layers[i].style.opacity = opacity.toFixed(4);
    layers[i].style.pointerEvents = (Math.abs(d) < 0.15) ? "auto" : "none";
  });
}

function scaleTimelineTick(){
  var diff = target - progress;
  if(Math.abs(diff) < 0.0008){ progress = target; applyScaleTransforms(progress); animId = null; var c = Math.round(progress); updateScaleNav(c); updateScaleTitle(c); return; }
  progress += diff * 0.1;
  applyScaleTransforms(progress);
  var c = Math.round(progress); if(c !== current){ current = c; updateScaleNav(c); updateScaleTitle(c); }
  animId = requestAnimationFrame(scaleTimelineTick);
}

function goToScaleStage(idx){
  idx = Math.max(0, Math.min(stages.length - 1, idx));
  target = idx; if(!animId) animId = requestAnimationFrame(scaleTimelineTick);
}

// Set up primary initial defaults
applyScaleTransforms(0); updateScaleTitle(0); updateScaleNav(0);

/* --- SIDEBAR ROUTING HUB MECHANICS --- */
const btnScale = document.getElementById("btn-scale-mode");
const btnCosmo = document.getElementById("btn-cosmo-mode");
const vpScale = document.getElementById("viewport-scale");
const vpCosmo = document.getElementById("viewport-cosmo");

function switchMode(newMode) {
    if (currentActiveMode === newMode) return;
    currentActiveMode = newMode;

    // Toggle active classes on sidebar selections
    btnScale.classList.toggle("active", newMode === 'scale');
    btnCosmo.classList.toggle("active", newMode === 'cosmo');

    // Swap active layout node containers
    vpScale.classList.toggle("active", newMode === 'scale');
    vpCosmo.classList.toggle("active", newMode === 'cosmo');

    // Run custom lifecycle methods per canvas mode context
    if (newMode === 'cosmo') {
        cosmoSim.start();
    } else {
        cosmoSim.stop();
        // Force dimensions re-check on returned view context maps
        initStars();
    }
}

btnScale.addEventListener("click", () => switchMode('scale'));
btnCosmo.addEventListener("click", () => switchMode('cosmo'));

/* --- ROUTED SYSTEM MOUSE WHEEL DRIVER --- */
var accumY = 0, scrollLock = false;
window.addEventListener("wheel", function(e){
  // Check targeting to avoid capturing inputs inside explicit details overlays
  if(document.getElementById("modal").classList.contains("open")) return;
  
  e.preventDefault();
  e.stopPropagation();

  if (currentActiveMode === 'cosmo') {
      // Pipe input vector telemetry immediately downstream to Cosmology runner
      cosmoSim.handleScroll(e.deltaY);
  } else {
      // Direct scroll events inside Scale Zoom engine arrays
      if(scrollLock) return;
      if((accumY > 0 && e.deltaY < 0) || (accumY < 0 && e.deltaY > 0)) accumY = 0;
      accumY += e.deltaY;
      if(Math.abs(accumY) < 36) return;
      var dir = accumY > 0 ? 1 : -1; accumY = 0; scrollLock = true;
      goToScaleStage(Math.round(target) + dir);
      setTimeout(function(){ scrollLock = false; }, 420);
  }
}, {passive: false});

/* --- KEYBOARD ROUTING NAVIGATION --- */
window.addEventListener("keydown", function(e){
  if(document.getElementById("modal").classList.contains("open")){ if(e.key === "Escape") closeModal(); return; }
  
  if (currentActiveMode === 'cosmo') {
      if(e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); cosmoSim.handleScroll(100); }
      if(e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); cosmoSim.handleScroll(-100); }
  } else {
      if(e.key === "ArrowDown" || e.key === "ArrowRight"){ e.preventDefault(); goToScaleStage(Math.round(target) + 1); }
      if(e.key === "ArrowUp" || e.key === "ArrowLeft"){ e.preventDefault(); goToScaleStage(Math.round(target) - 1); }
  }
});

/* --- POPUPS & DETAILS PANEL INTERFACES --- */
var tt = document.getElementById("tooltip"), ttTitle = document.getElementById("tt-title"), ttBadge = document.getElementById("tt-badge"), ttBody = document.getElementById("tt-body");
function showTooltip(i, x, y){ var s = stages[i]; ttTitle.textContent = s.title; ttBadge.textContent = s.scale; ttBody.textContent = s.short; tt.classList.add("visible"); posTooltip(x, y); }
function posTooltip(x, y){ var tx = x + 24, ty = y - 12; if(tx + 290 > W) tx = x - 300; if(ty + 180 > H) ty = y - 170; tt.style.left = tx + "px"; tt.style.top = ty + "px"; }

layers.forEach(function(div, i){
  div.addEventListener("mouseenter", function(e){ if(currentActiveMode==='scale') showTooltip(i, e.clientX, e.clientY); });
  div.addEventListener("mousemove", function(e){ if(tt.classList.contains("visible") && currentActiveMode==='scale') posTooltip(e.clientX, e.clientY); });
  div.addEventListener("mouseleave", function(){ tt.classList.remove("visible"); });
  div.addEventListener("click", function(){ if(currentActiveMode==='scale') openModal(i); });
});

var modal = document.getElementById("modal"), mTitle = document.getElementById("m-title"), mBadge = document.getElementById("m-badge"), mBody = document.getElementById("m-body");
function openModal(i){ var s = stages[i]; mTitle.textContent = s.title; mTitle.style.color = s.color; mBadge.textContent = s.scale; mBody.innerHTML = ""; s.long.forEach(function(sec){ var h = document.createElement("h4"); h.textContent = sec.h; mBody.appendChild(h); var p = document.createElement("p"); p.textContent = sec.t; mBody.appendChild(p); }); modal.classList.add("open"); }
function closeModal(){ modal.classList.remove("open"); }
document.getElementById("modal-close").addEventListener("click", closeModal);
modal.addEventListener("click", function(e){ if(e.target === modal) closeModal(); });

window.addEventListener("resize", () => {
    W = container.offsetWidth; H = container.offsetHeight;
    BASE = Math.min(W, H) * 0.65;
});

// === AUTO START COSMOLOGY MODE FOR TESTING ===
setTimeout(() => {
    switchMode('cosmo');
}, 500);
