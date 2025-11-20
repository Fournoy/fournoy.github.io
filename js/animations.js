document.addEventListener('DOMContentLoaded', () => {
    // Animation des cartes au clic
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        // Cache initialement le contenu
        const content = card.querySelector('.card-content');
        content.style.height = '0';
        content.style.opacity = '0';
        // create an effect overlay element per card
        let effect = card.querySelector('.card-effect');
        if (!effect) {
            effect = document.createElement('div');
            effect.className = 'card-effect';
            // insert real elements to mirror ::before/::after animations (more reliable)
            // and an ef-wave element for directional wave effect
            effect.innerHTML = '<div class="ef-before"></div><div class="ef-after"></div><div class="ef-wave"></div>';
            card.appendChild(effect);
        }
        // create a cipher placeholder shown when card is closed
        let placeholder = card.querySelector('.card-placeholder');
        if (!placeholder) {
            placeholder = document.createElement('div');
            placeholder.className = 'card-placeholder';
            // generate a cipher-like text based on card id/title
            function generateCipher(seed) {
                const chars = '0123456789ABCDEFabcdef01アイウエオカキクケコサシス';
                const lines = [];
                const countLines = 3;
                for (let l = 0; l < countLines; l++) {
                    let line = '';
                    const len = 36 + Math.floor(Math.random() * 8);
                    for (let i = 0; i < len; i++) {
                        line += chars[Math.floor(Math.random() * chars.length)];
                    }
                    lines.push(line);
                }
                return lines.join('\n');
            }
            placeholder.textContent = generateCipher(card.id || '');
            card.insertBefore(placeholder, content);
        }
        
        card.addEventListener('click', () => {
            const isActive = card.classList.contains('active');

            // Toggle only this card. Do not close other cards — this keeps opened cards
            // in their state until the page is refreshed.
            if (isActive) {
                // Close this card
                card.classList.remove('active');
                content.style.height = '0';
                content.style.opacity = '0';
                card.style.transform = '';
                card.style.zIndex = '1';
                // reveal cipher placeholder when closed
                const thisPlaceholder = card.querySelector('.card-placeholder');
                if (thisPlaceholder) thisPlaceholder.classList.remove('hidden');
                // ensure any active effect is cleared
                effect.className = 'card-effect';
            } else {
                // Open this card (leave others untouched)
                card.classList.add('active');
                content.style.height = content.scrollHeight + 'px';
                content.style.opacity = '1';
                card.style.transform = 'scale(1.02) translateY(-15px)';
                card.style.zIndex = '2';
                // hide the cipher placeholder on open
                const thisPlaceholder = card.querySelector('.card-placeholder');
                if (thisPlaceholder) thisPlaceholder.classList.add('hidden');

                // add effect based on card id
                effect.className = 'card-effect';
                let duration = 2000; // default
                let waveDir = '';
                switch (card.id) {
                    case 'personal':
                        effect.classList.add('effect-offensive');
                        waveDir = 'wave-right';
                        duration = 2500;
                        break;
                    case 'studies':
                        effect.classList.add('effect-knowledge');
                        waveDir = 'wave-left';
                        duration = 3600;
                        break;
                    case 'internship':
                        effect.classList.add('effect-network');
                        waveDir = 'wave-up';
                        duration = 2200;
                        break;
                    case 'hackathon':
                        effect.classList.add('effect-burst');
                        waveDir = 'wave-down';
                        duration = 4000;
                        break;
                    default:
                        break;
                }
                const waveEl = effect.querySelector('.ef-wave');
                if (waveEl) {
                    waveEl.className = 'ef-wave';
                    if (waveDir) waveEl.classList.add(waveDir);
                }
                effect.classList.add('play-once');
                console.log('Card clicked:', card.id, '-> effect:', effect.className);
                const beforeEl = effect.querySelector('.ef-before');
                const afterEl = effect.querySelector('.ef-after');
                if (!beforeEl || !afterEl) {
                    effect.innerHTML = '<div class="ef-before"></div><div class="ef-after"></div>';
                }
                setTimeout(() => {
                    effect.className = 'card-effect';
                }, duration + 200);
            }
        });
    });

    // Création de l'animation Matrix
    const background = document.querySelector('.background-animation');
    
    // Création des colonnes de texte
    function createMatrixColumn() {
        const column = document.createElement('div');
        column.className = 'matrix-text';
        column.style.left = Math.random() * 100 + '%';
        column.style.animationDuration = (Math.random() * 2 + 1) + 's';
        column.style.opacity = Math.random() * 0.5;
        
        // Création du texte chiffré
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        let text = '';
        const length = Math.floor(Math.random() * 20) + 10;
        
        for(let i = 0; i < length; i++) {
            text += chars[Math.floor(Math.random() * chars.length)];
        }
        
        column.textContent = text;
        column.style.animation = `fall ${Math.random() * 10 + 5}s linear infinite`;
        column.style.transform = `translateY(-${Math.random() * 100}%)`;
        
        return column;
    }

    // Ajout des colonnes de texte
    function initMatrix() {
        // Vider l'arrière-plan existant
        background.innerHTML = '';
        
        // Ajouter de nouvelles colonnes
        for(let i = 0; i < 50; i++) {
            const column = createMatrixColumn();
            background.appendChild(column);
        }
    }

    // Initialisation de l'animation Matrix
    initMatrix();
    
    // Régénération périodique des colonnes pour maintenir l'animation fraîche
    setInterval(() => {
        const oldColumns = background.querySelectorAll('.matrix-text');
        if(oldColumns.length < 50) {
            background.appendChild(createMatrixColumn());
        }
    }, 2000);

    // Ajout des styles d'animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            from { transform: translateY(-100%); }
            to { transform: translateY(100vh); }
        }
    `;
    document.head.appendChild(style);

    // -------- Canvas background 'informatique' animation --------
    const canvas = document.getElementById('bg-canvas');
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        let W = 0, H = 0;
        let nodes = [];
        let particles = [];

        function resizeCanvas() {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
            // recalc node count by area
            const area = W * H;
            // increase density: fewer pixels per node -> more nodes (higher density)
            const count = Math.max(80, Math.min(320, Math.floor(area / 18000)));
            // if nodes empty or count changed significantly, recreate
            if (!nodes.length || Math.abs(nodes.length - count) > 10) {
                nodes = [];
                for (let i = 0; i < count; i++) {
                    nodes.push({
                        x: Math.random() * W,
                        y: Math.random() * H,
                        vx: (Math.random() - 0.5) * 0.35,
                        vy: (Math.random() - 0.5) * 0.35,
                        r: 0.7 + Math.random() * 1.2
                    });
                }
            }
        }

        window.addEventListener('resize', resizeCanvas, { passive: true });
        resizeCanvas();

        // spawn a particle traveling between two nodes
        function spawnParticle() {
            if (nodes.length < 2) return;
            const a = nodes[Math.floor(Math.random() * nodes.length)];
            let b = nodes[Math.floor(Math.random() * nodes.length)];
            if (a === b) return;
            particles.push({
                ax: a.x, ay: a.y,
                bx: b.x, by: b.y,
                t: 0,
                speed: 0.004 + Math.random() * 0.01
            });
            // limit particles
            if (particles.length > 90) particles.shift();
        }

        // occasionally spawn particles
        setInterval(spawnParticle, 350);

        let lastTime = performance.now();
        function animate(now) {
            const dt = Math.min(40, now - lastTime);
            lastTime = now;

            // clear with translucent fill to create subtle trails
            ctx.clearRect(0, 0, W, H);

            // subtle background grid / glow (very faint)
            const grad = ctx.createLinearGradient(0, 0, W, H);
            grad.addColorStop(0, 'rgba(10,18,30,0.04)');
            grad.addColorStop(1, 'rgba(16,24,36,0.06)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, W, H);

            // update nodes
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                // small drifting
                n.x += n.vx * (dt * 0.06);
                n.y += n.vy * (dt * 0.06);
                // gentle wrap-around
                if (n.x < -50) n.x = W + 50;
                if (n.x > W + 50) n.x = -50;
                if (n.y < -50) n.y = H + 50;
                if (n.y > H + 50) n.y = -50;
            }

            // draw connections
            const maxDist = Math.min(320, Math.max(160, (W + H) / 8));
            ctx.lineWidth = 1;
            for (let i = 0; i < nodes.length; i++) {
                const a = nodes[i];
                for (let j = i + 1; j < nodes.length; j++) {
                    const b = nodes[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < maxDist * maxDist) {
                        const d = Math.sqrt(d2);
                        const alpha = 0.12 * (1 - d / maxDist);
                        ctx.strokeStyle = `rgba(140,200,255,${alpha})`;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }

            // draw nodes
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 20);
                glow.addColorStop(0, 'rgba(180,220,255,0.9)');
                glow.addColorStop(1, 'rgba(180,220,255,0)');
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(n.x, n.y, 2.6, 0, Math.PI * 2);
                ctx.fill();
            }

            // update particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.t += p.speed * (dt);
                if (p.t >= 1) {
                    particles.splice(i, 1);
                    continue;
                }
                const x = p.ax + (p.bx - p.ax) * p.t;
                const y = p.ay + (p.by - p.ay) * p.t;
                ctx.fillStyle = 'rgba(255,255,255,0.95)';
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
            }

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    }
});