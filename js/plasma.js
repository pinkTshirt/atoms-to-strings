const cosmicEpochs = [
    {
        title: "Quark-Gluon Plasma",
        time: "Time: ~10⁻⁵ Seconds",
        temp: "Temp: ~10¹² K",
        body: "The universe is a hot, dense, deconfined primordial soup. Environmental energy is too high for the strong force to confine quarks; they bounce and stream freely alongside gluons.",
        color: "#ff8c00"
    },
    {
        title: "Hadronization Epoch",
        time: "Time: ~10⁻⁴ Seconds",
        temp: "Temp: ~10¹¹ K",
        body: "As expansion cools the universe, ambient energy drops below the confinement threshold. Quarks are suddenly bound together by the strong force, freezing into stable protons and neutrons.",
        color: "#e8a84a"
    },
    {
        title: "Big Bang Nucleosynthesis",
        time: "Time: ~2 to 20 Minutes",
        temp: "Temp: ~10⁹ K",
        body: "Protons and neutrons fuse under stellar-grade cosmic density. The first atomic nuclei form—predominantly Hydrogen ions, Helium-4, and trace amounts of Deuterium and Lithium.",
        color: "#50e0a0"
    },
    {
        title: "Recombination (CMB)",
        time: "Time: ~380,000 Years",
        temp: "Temp: ~3,000 K",
        body: "The universe cools enough for electrons to bind with nuclei, forming the first stable, neutral atoms. Photons are suddenly free to travel across open space, forming the Cosmic Microwave Background.",
        color: "#4aa8ff"
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

        window.addEventListener("resize", () => {
            if (this.isAnimating) this.resize();
        });
    }

    resize() {
        // Calculate dimensions relative to the split viewport area container
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
                setTimeout(() => { this.isTransitioning = false; }, 500);
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
        
        if (this.currentEpoch === cosmicEpochs.length - 1) {
            this.scrollHint.querySelector("span").textContent = "End of Early Cosmology Timeline";
        } else {
            this.scrollHint.querySelector("span").textContent = "Scroll Down to Advance Cosmic Time ↓";
        }
    }

    start() {
        this.isAnimating = true;
        this.currentEpoch = 0;
        this.scrollAccumulator = 0;
        this.updateHUD();
        this.resize();

        this.particles = [];
        const density = Math.floor((this.canvas.width * this.canvas.height) / 10000);
        for (let i = 0; i < density; i++) {
            this.particles.push(new CosmoParticle(this.canvas, this.currentEpoch));
        }
        this.loop();
    }

    loop() {
        if (!this.isAnimating) return;
        
        const alpha = this.currentEpoch === 3 ? 0.6 : 0.25;
        this.ctx.fillStyle = `rgba(4, 4, 12, ${alpha})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.currentEpoch === 0 || this.currentEpoch === 1) {
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    let dx = this.particles[i].x - this.particles[j].x;
                    let dy = this.particles[i].y - this.particles[j].y;
                    let dist = Math.hypot(dx, dy);
                    
                    let limit = this.currentEpoch === 0 ? 60 : 40;
                    if (dist < limit && this.particles[i].state === 'quark' && this.particles[j].state === 'quark') {
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.strokeStyle = `rgba(232, 168, 74, ${0.4 * (1 - dist/limit)})`;
                        this.ctx.lineWidth = 1;
                        this.ctx.stroke();
                    }
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

class CosmoParticle {
    constructor(canvas, epoch) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.changeState(epoch);
    }

    changeState(epoch) {
        this.epoch = epoch;
        const speedScale = [12, 6, 2.5, 0.6][epoch];
        this.vx = (Math.random() - 0.5) * speedScale;
        this.vy = (Math.random() - 0.5) * speedScale;

        if (epoch === 0) {
            this.state = 'quark';
            this.radius = Math.random() > 0.4 ? 4 : 2;
            const colors = ['#ff3366', '#33ff66', '#3366ff', '#ffff33'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        } 
        else if (epoch === 1) {
            this.state = Math.random() > 0.5 ? 'proton' : 'neutron';
            this.radius = 6;
            this.color = this.state === 'proton' ? '#e8a84a' : '#556c8a';
        } 
        else if (epoch === 2) {
            this.state = 'nucleus';
            this.radius = Math.random() > 0.7 ? 10 : 7;
            this.color = this.radius === 10 ? '#50e0a0' : '#e8a84a';
        } 
        else {
            this.state = Math.random() > 0.6 ? 'atom' : 'photon';
            this.radius = this.state === 'atom' ? 12 : 1.5;
            this.color = this.state === 'atom' ? 'rgba(74, 168, 255, 0.8)' : '#ffffff';
        }
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.epoch === 3) {
            if (this.x < 0) this.x = this.canvas.width;
            if (this.x > this.canvas.width) this.x = 0;
            if (this.y < 0) this.y = this.canvas.height;
            if (this.y > this.canvas.height) this.y = 0;
        } else {
            if (this.x - this.radius < 0 || this.x + this.radius > this.canvas.width) this.vx *= -1;
            if (this.y - this.radius < 0 || this.y + this.radius > this.canvas.height) this.vy *= -1;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        
        if (this.state === 'photon') {
            ctx.shadowBlur = 8; ctx.shadowColor = '#ffffff';
        } else if (this.state === 'quark' && this.color === '#ffff33') {
            ctx.shadowBlur = 4; ctx.shadowColor = '#ffff33';
        } else {
            ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}
