export class PlasmaSimulation {
    constructor(canvasId, triggerId, overlayId, closeId, onOpenCallback, onCloseCallback) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.routeBtn = document.getElementById(triggerId);
        this.overlay = document.getElementById(overlayId);
        this.closeBtn = document.getElementById(closeId);
        
        this.frameId = null;
        this.isAnimating = false;
        this.particles = [];

        this.routeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.overlay.classList.add("active");
            if (onOpenCallback) onOpenCallback();
            this.resize();
            this.start();
        });

        this.closeBtn.addEventListener("click", () => {
            this.overlay.classList.remove("active");
            if (onCloseCallback) onCloseCallback();
            this.stop();
        });

        window.addEventListener("resize", () => {
            if (this.isAnimating) this.resize();
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        this.isAnimating = true;
        this.particles = [];
        const density = Math.floor((this.canvas.width * this.canvas.height) / 12000);
        for (let i = 0; i < density; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const type = Math.random() > 0.45 ? 'quark' : 'gluon';
            this.particles.push(new Particle(x, y, type, this.canvas));
        }
        this.loop();
    }

    loop() {
        if (!this.isAnimating) return;
        this.ctx.fillStyle = 'rgba(4, 4, 12, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                let dx = this.particles[i].x - this.particles[j].x;
                let dy = this.particles[i].y - this.particles[j].y;
                let distance = Math.hypot(dx, dy);

                if (distance < 85 && this.particles[i].type === 'quark' && this.particles[j].type === 'quark') {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(255, 255, 51, ${1 - distance / 85})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }

        this.particles.forEach(p => {
            p.update();
            p.draw(this.ctx);
        });

        this.frameId = requestAnimationFrame(() => this.loop());
    }

    stop() {
        this.isAnimating = false;
        cancelAnimationFrame(this.frameId);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

class Particle {
    constructor(x, y, type, canvas) {
        this.canvas = canvas;
        this.x = x; this.y = y; this.type = type;
        this.radius = type === 'gluon' ? 2 : 5;
        this.vx = (Math.random() - 0.5) * 12;
        this.vy = (Math.random() - 0.5) * 12;

        if (type === 'quark') {
            const colors = ['#ff3366', '#33ff66', '#3366ff'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        } else {
            this.color = '#ffff33';
        }
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x - this.radius < 0 || this.x + this.radius > this.canvas.width) this.vx *= -1;
        if (this.y - this.radius < 0 || this.y + this.radius > this.canvas.height) this.vy *= -1;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        if (this.type === 'gluon') {
            ctx.shadowBlur = 6; ctx.shadowColor = '#ffff33';
        }
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}
