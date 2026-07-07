import { stages, ns } from './stages.js';
import { initStars, drawStars } from './starfield.js';
import { PlasmaSimulation } from './plasma.js';

var app = document.getElementById("app");
var W = app.offsetWidth, H = app.offsetHeight;
var BASE = Math.min(W, H) * 0.68;

// Initialize Background Stars
initStars();
drawStars();

// Build Zoom Layers dynamically from stages configuration data
var scene = document.getElementById("scene"), layers = [];
stages.forEach(function(s, i){
  var div = document.createElement("div"); div.className = "layer";
  var svg = s.draw(BASE); svg.style.filter = "drop-shadow(0 0 28px " + s.glow + ")";
  div.appendChild(svg); scene.appendChild(div); layers.push(div);
});

// Build Side Nav Controls & Indicators
var navEl = document.getElementById("nav"), progEl = document.getElementById("prog");
stages.forEach(function(s, i){
  var d = document.createElement("div"); d.className = "nav-dot"; d.title = s.title; d.addEventListener("click", function(){ goTo(i); }); navEl.appendChild(d);
  var pl = document.createElement("div"); pl.className = "prog-label"; pl.textContent = s.title; pl.addEventListener("click", function(){ goTo(i); }); progEl.appendChild(pl);
});

function updateNav(c){
  document.querySelectorAll(".nav-dot").forEach(function(d, i){ d.classList.toggle("active", i === c); });
  document.querySelectorAll(".prog-label").forEach(function(d, i){ d.classList.toggle("active", i === c); });
}

// Stage Heading UI Dynamic Updates
var stTitle = document.getElementById("st-title"), stScale = document.getElementById("st-scale"), scrollHint = document.getElementById("scroll-hint"), scrollLabel = document.getElementById("scroll-label");
function updateTitle(c){
  var s = stages[c]; stTitle.textContent = s.title; stTitle.style.color = s.color; stScale.textContent = s.scale;
  scrollLabel.textContent = c === 0 ? "Scroll to zoom in" : c === stages.length - 1 ? "Scroll up to go back" : "Scroll to continue";
  scrollHint.style.opacity = c === stages.length - 1 ? "0" : "1";
  
  // Conditionally trigger Quark-Gluon shortcut button entry animation
  var routeBtn = document.getElementById("plasma-route-trigger");
  if(s.title === "Quark") {
      routeBtn.classList.add("visible");
  } else {
      routeBtn.classList.remove("visible");
  }
}

// Core Zoom Transformation Engine Configuration
var current = 0, progress = 0, target = 0, animId = null;
function applyStates(p){
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

function tick(){
  var diff = target - progress;
  if(Math.abs(diff) < 0.0008){ progress = target; applyStates(progress); animId = null; var c = Math.round(progress); updateNav(c); updateTitle(c); return; }
  progress += diff * 0.1;
  applyStates(progress);
  var c = Math.round(progress); if(c !== current){ current = c; updateNav(c); updateTitle(c); }
  animId = requestAnimationFrame(tick);
}

function goTo(idx){
  idx = Math.max(0, Math.min(stages.length - 1, idx));
  target = idx; if(!animId) animId = requestAnimationFrame(tick);
}

applyStates(0); updateTitle(0); updateNav(0);

// Unified Mouse Wheel Scroller Bindings
var accumY = 0, locked = false;
app.addEventListener("wheel", function(e){
  e.stopPropagation(); e.preventDefault();
  if(locked) return;
  if((accumY > 0 && e.deltaY < 0) || (accumY < 0 && e.deltaY > 0)) accumY = 0;
  accumY += e.deltaY;
  if(Math.abs(accumY) < 36) return;
  var dir = accumY > 0 ? 1 : -1; accumY = 0; locked = true;
  goTo(Math.round(target) + dir);
  setTimeout(function(){ locked = false; }, 420);
}, {passive: false, capture: true});

// Keyboard Navigation Interceptors
window.addEventListener("keydown", function(e){
  if(document.getElementById("modal").classList.contains("open")){ if(e.key === "Escape") closeModal(); return; }
  if(e.key === "ArrowDown" || e.key === "ArrowRight"){ e.preventDefault(); goTo(Math.round(target) + 1); }
  if(e.key === "ArrowUp" || e.key === "ArrowLeft"){ e.preventDefault(); goTo(Math.round(target) - 1); }
});

// Dynamic Popover Hover Tooltip Binding Engine
var tt = document.getElementById("tooltip"), ttTitle = document.getElementById("tt-title"), ttBadge = document.getElementById("tt-badge"), ttBody = document.getElementById("tt-body");
function showTooltip(i, x, y){ var s = stages[i]; ttTitle.textContent = s.title; ttBadge.textContent = s.scale; ttBody.textContent = s.short; tt.classList.add("visible"); posTooltip(x, y); }
function posTooltip(x, y){ var tx = x + 24, ty = y - 12; if(tx + 290 > W) tx = x - 300; if(ty + 180 > H) ty = y - 170; tt.style.left = tx + "px"; tt.style.top = ty + "px"; }

layers.forEach(function(div, i){
  div.addEventListener("mouseenter", function(e){ showTooltip(i, e.clientX, e.clientY); });
  div.addEventListener("mousemove", function(e){ if(tt.classList.contains("visible")) posTooltip(e.clientX, e.clientY); });
  div.addEventListener("mouseleave", function(){ tt.classList.remove("visible"); });
  div.addEventListener("click", function(){ openModal(i); });
});

// In-Depth Deep Dive Modal Overlay Framework
var modal = document.getElementById("modal"), mTitle = document.getElementById("m-title"), mBadge = document.getElementById("m-badge"), mBody = document.getElementById("m-body");
function openModal(i){ var s = stages[i]; mTitle.textContent = s.title; mTitle.style.color = s.color; mBadge.textContent = s.scale; mBody.innerHTML = ""; s.long.forEach(function(sec){ var h = document.createElement("h4"); h.textContent = sec.h; mBody.appendChild(h); var p = document.createElement("p"); p.textContent = sec.t; mBody.appendChild(p); }); modal.classList.add("open"); }
function closeModal(){ modal.classList.remove("open"); }
document.getElementById("modal-close").addEventListener("click", closeModal);
modal.addEventListener("click", function(e){ if(e.target === modal) closeModal(); });

// Instantiate decoupled Quark-Gluon Plasma sandbox context module loops
new PlasmaSimulation(
    'plasma-canvas', 
    'plasma-route-trigger', 
    'plasma-animation-overlay', 
    'close-plasma-btn',
    () => { locked = true; },  // Freeze timeline engine scrolling when sandbox view overrides screen
    () => { locked = false; } // Return navigation access back to timeline context on exit
);
