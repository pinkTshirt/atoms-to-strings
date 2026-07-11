const cosmicEpochs = [
    {
        title: "Inflation & Quark-Gluon Plasma",
        time: "Time: ~10⁻⁵ Seconds",
        temp: "Temp: ~10¹² K",
        body: "Rapid expansion from quantum fluctuations. Hot, dense soup of free quarks and gluons.",
        color: "#ffcc00"
    },
    {
        title: "Afterglow Light Pattern (CMB)",
        time: "Time: ~380,000 Years",
        temp: "Temp: ~3,000 K",
        body: "Universe cools; photons decouple forming the Cosmic Microwave Background.",
        color: "#66ccff"
    },
    {
        title: "Dark Ages → First Stars",
        time: "Time: ~400 Million Years",
        temp: "Temp: ~100 K",
        body: "Gravity pulls matter into filaments; first stars ignite, ending the cosmic dark ages.",
        color: "#ff9966"
    },
    {
        title: "Galaxy Formation & Acceleration",
        time: "Time: Billions of Years → Present",
        temp: "Temp: ~2.7 K",
        body: "Galaxies, clusters, and planets form. Dark energy drives accelerated expansion.",
        color: "#aaccff"
    }
];

export class PlasmaSimulation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        
        this.hudTitle = document.getElementById("cosmo-title");
        this.hudTime = document.getElementById("cosmo-time");
        this.hudTemp = document.getElementById("cosmo-temp");
        this.hudBody = document.getElementById("cosmo-body");
        this.scrollHint = document.getElementById("cosmo-scroll-hint");

        this.frameId = null;
        this.isAnimating = false;
        this.particles = [];
        this.currentEpoch = 0;
        this.scrollAccumulator = 0;
        this.isTransitioning = false;
        this.gridAlpha = 0.1; // for timeline cylinder grid
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.offsetWidth;
        this.canvas.height = parent.offsetHeight;
    }

    handleScroll(deltaY) {
        if (this.isTransitioning) return;
        this.scrollAccumulator += deltaY;
        if (Math.abs(this.scrollAccumulator) >= 40) {
            const direction = this.scrollAccumulator > 0 ? 1 : -1;
            this.scrollAccumulator = 0;
            const nextEpoch = this.currentEpoch + direction;
            if (nextEpoch >= 0 && nextEpoch < cosmicEpochs.length) {
                this.isTransitioning = true;
                this.currentEpoch = nextEpoch;
                this.updateHUD();
                this.particles.forEach(p => p.changeState(this.currentEpoch));
                setTimeout(() => { this.isTransitioning = false; }, 600);
            }
        }
    }

    updateHUD() {
        const data = cosmicEpochs[this.currentEpoch];
        this.hudTitle.textContent = data.title;
        this.hudTitle.style.color = data.color;
        this.hudTime.textContent = data.time;
        this.hudTemp.textContent = data.temp;
        this.hudBody.textContent = data.body;
        this.scrollHint.querySelector("span").textContent = this.currentEpoch === cosmicEpochs.length - 1 
            ? "End of Cosmic Timeline – Present Day" 
            : "Scroll to Advance Cosmic Time ↓";
    }

    start() {
        this.isAnimating = true;
        this.currentEpoch = 0;
        this.updateHUD();
        this.resize();

        this.particles = [];
        const density = Math.floor((this.canvas.width * this.canvas.height) / 8000); // denser for structure
        for (let i = 0; i < density; i++) {
            this.particles.push(new CosmoParticle(this.canvas, this.currentEpoch));
        }
        this.loop();
    }

    loop() {
        if (!this.isAnimating) return;

        // Background gradient mimicking cone/expansion (bright left → dark right)
        const grad = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        const alpha = this.currentEpoch === 3 ? 0.85 : 0.4;
        grad.addColorStop(0, `rgba(20, 10, 40, ${alpha})`);
        grad.addColorStop(1, `rgba(2, 2, 10, ${alpha})`);
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Subtle grid for "cylinder" timeline feel
        this.ctx.strokeStyle = `rgba(100, 180, 255, ${this.gridAlpha})`;
        this.ctx.lineWidth = 0.8;
        for (let x = 0; x < this.canvas.width; x += 60) {
            this.ctx.beginPath(); this.ctx.moveTo(x, 0); this.ctx.lineTo(x, this.canvas.height); this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += 50) {
            this.ctx.beginPath(); this.ctx.moveTo(0, y); this.ctx.lineTo(this.canvas.width, y); this.ctx.stroke();
        }

        // Connections for filaments / cosmic web (stronger in later epochs)
        const connectDist = [80, 70, 110, 140][this.currentEpoch];
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.hypot(dx, dy);
                if (dist < connectDist) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    const opacity = 0.35 * (1 - dist / connectDist);
                    this.ctx.strokeStyle = `rgba(180, 220, 255, ${opacity})`;
                    this.ctx.lineWidth = this.currentEpoch > 1 ? 1.2 : 0.8;
                    this.ctx.stroke();
                }
            }
        }

        this.particles.forEach(p => {
            p.update(this.currentEpoch);
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

class CosmoParticle {
    constructor(canvas, epoch) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = 0; this.vy = 0;
        this.trail = [];
        this.changeState(epoch);
    }

    changeState(epoch) {
        this.epoch = epoch;
        const baseSpeed = [15, 8, 4, 1.5][epoch];
        this.vx = (Math.random() - 0.5) * baseSpeed;
        this.vy = (Math.random() - 0.5) * baseSpeed;

        if (epoch === 0) { // Hot plasma / inflation
            this.state = 'quark';
            this.radius = Math.random() * 3.5 + 2;
            this.color = ['#ffcc00', '#ff6600', '#ffff88'][Math.floor(Math.random()*3)];
        } else if (epoch === 1) { // CMB
            this.state = Math.random() > 0.6 ? 'photon' : 'baryon';
            this.radius = this.state === 'photon' ? 1.8 : 5;
            this.color = this.state === 'photon' ? '#ffffff' : '#88ccff';
        } else if (epoch === 2) { // Stars / filaments
            this.state = 'star';
            this.radius = Math.random() > 0.7 ? 8 : 4;
            this.color = '#ffeeaa';
        } else { // Galaxies / present
            this.state = Math.random() > 0.5 ? 'galaxy' : 'matter';
            this.radius = this.state === 'galaxy' ? 11 : 3.5;
            this.color = this.state === 'galaxy' ? '#aaccff' : '#ddeeff';
        }
    }

    update(epoch) {
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > 12) this.trail.shift();

        this.x += this.vx;
        this.y += this.vy;

        // Mild attraction toward clusters in later epochs
        if (epoch >= 2) {
            this.vx *= 0.98; this.vy *= 0.98; // damping
            // Simple pull toward center-of-mass-ish
            const cx = this.canvas.width / 2;
            const cy = this.canvas.height / 2;
            this.vx += (cx - this.x) * 0.00008;
            this.vy += (cy - this.y) * 0.00008;
        }

        // Bounce or wrap
        if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
    }

    draw(ctx) {
        // Trail
        ctx.strokeStyle = this.color + '44';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        this.trail.forEach((pt, i) => {
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();

        ctx.shadowBlur = this.state === 'photon' || this.state === 'star' || this.state === 'galaxy' ? 12 : 4;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}
