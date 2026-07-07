var canvas = document.getElementById("starfield");
var ctx = canvas.getContext("2d");
var stars = [];
var W = window.innerWidth;
var H = window.innerHeight;

export function initStars(){
  var app = document.getElementById("app");
  canvas.width = W = app.offsetWidth;
  canvas.height = H = app.offsetHeight;
  stars = [];
  for(var i=0; i<300; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.2,
      a: Math.random(),
      da: (Math.random() - .5) * .003
    });
  }
}

export function drawStars(){
  ctx.clearRect(0, 0, W, H);
  stars.forEach(function(s){
    s.a += s.da;
    if(s.a <= 0 || s.a >= 1) s.da *= -1;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(180,210,255," + s.a.toFixed(3) + ")";
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}

window.addEventListener("resize", initStars);
