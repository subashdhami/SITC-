/* ─── Custom cursor ─────────────────────── */
const cursor = document.getElementById("cursor");
const cursorTrail = document.getElementById("cursorTrail");
let mouseX = 0,
	mouseY = 0;

document.addEventListener("mousemove", (e) => {
	mouseX = e.clientX;
	mouseY = e.clientY;
	cursor.style.left = mouseX + "px";
	cursor.style.top = mouseY + "px";
	cursorTrail.style.left = mouseX + "px";
	cursorTrail.style.top = mouseY + "px";
	updateCoords(e);
});

document.querySelectorAll("a, button, .planet-card").forEach((el) => {
	el.addEventListener(
		"mouseenter",
		() => (cursor.style.transform = "translate(-50%,-50%) scale(2.5)"),
	);
	el.addEventListener(
		"mouseleave",
		() => (cursor.style.transform = "translate(-50%,-50%) scale(1)"),
	);
});

/* ─── Nav coordinates from mouse ───────── */
function updateCoords(e) {
	const pctX = ((e.clientX / window.innerWidth) * 360 - 180).toFixed(1);
	const pctY = ((e.clientY / window.innerHeight) * 180 - 90).toFixed(1);
	const lat = pctY < 0 ? Math.abs(pctY) + "°S" : pctY + "°N";
	const lon = pctX < 0 ? Math.abs(pctX) + "°W" : pctX + "°E";
	const el = document.getElementById("coords");
	if (el) el.textContent = `${lat}  ${lon}`;
}

/* ─── Starfield canvas ──────────────────── */
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Three layers for depth parallax
const LAYERS = [
	{ count: 250, r: 0.5, speed: 0.015, alpha: 0.6 },
	{ count: 150, r: 1.0, speed: 0.025, alpha: 0.8 },
	{ count: 60, r: 1.8, speed: 0.04, alpha: 1.0 },
];

const stars = [];
LAYERS.forEach((layer) => {
	for (let i = 0; i < layer.count; i++) {
		stars.push({
			x: Math.random(),
			y: Math.random() * window.innerHeight,
			r: layer.r * (0.7 + Math.random() * 0.6),
			speed: layer.speed,
			alpha: layer.alpha * (0.5 + Math.random() * 0.5),
			twinkleOffset: Math.random() * Math.PI * 2,
		});
	}
});

// Shooting stars
const shoots = [];
function spawnShoot() {
	shoots.push({
		x: Math.random() * canvas.width,
		y: Math.random() * canvas.height * 0.5,
		len: 80 + Math.random() * 120,
		speed: 8 + Math.random() * 8,
		alpha: 1,
		angle: Math.PI / 5 + (Math.random() - 0.5) * 0.3,
		life: 1,
	});
}
setInterval(spawnShoot, 3000 + Math.random() * 4000);

let scrollY = 0;
window.addEventListener("scroll", () => {
	scrollY = window.scrollY;
});

let t = 0;
function drawStars() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	t += 0.01;

	// Stars with twinkle
	stars.forEach((s) => {
		const twinkle = 0.5 + 0.5 * Math.sin(t * 1.5 + s.twinkleOffset);
		const alpha = s.alpha * (0.4 + 0.6 * twinkle);
		const px = (s.x * canvas.width + scrollY * s.speed * 0.3) % canvas.width;
		const py = s.y;
		ctx.beginPath();
		ctx.arc(px, py, s.r, 0, Math.PI * 2);
		ctx.fillStyle = `rgba(200,220,255,${alpha})`;
		ctx.fill();
		// Glow for bigger stars
		if (s.r > 1.4) {
			ctx.beginPath();
			ctx.arc(px, py, s.r * 2.5, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(180,210,255,${alpha * 0.1})`;
			ctx.fill();
		}
	});

	// Shooting stars
	for (let i = shoots.length - 1; i >= 0; i--) {
		const s = shoots[i];
		const dx = Math.cos(s.angle) * s.len;
		const dy = Math.sin(s.angle) * s.len;
		const g = ctx.createLinearGradient(s.x, s.y, s.x + dx, s.y + dy);
		g.addColorStop(0, `rgba(255,255,255,${s.alpha})`);
		g.addColorStop(1, "rgba(255,255,255,0)");
		ctx.beginPath();
		ctx.moveTo(s.x, s.y);
		ctx.lineTo(s.x + dx, s.y + dy);
		ctx.strokeStyle = g;
		ctx.lineWidth = 1.5;
		ctx.stroke();
		s.x += Math.cos(s.angle) * s.speed;
		s.y += Math.sin(s.angle) * s.speed;
		s.alpha -= 0.02;
		if (s.alpha <= 0) shoots.splice(i, 1);
	}

	requestAnimationFrame(drawStars);
}
drawStars();

/* ─── Nebula canvas overlay ─────────────── */
const nebulaCanvas = document.getElementById("nebula");
const nctx = nebulaCanvas.getContext("2d");

function resizeNebula() {
	nebulaCanvas.width = window.innerWidth;
	nebulaCanvas.height = window.innerHeight;
}
resizeNebula();
window.addEventListener("resize", resizeNebula);

function drawNebula() {
	nctx.clearRect(0, 0, nebulaCanvas.width, nebulaCanvas.height);
	const cx = nebulaCanvas.width * 0.7;
	const cy = nebulaCanvas.height * 0.3;
	const g1 = nctx.createRadialGradient(cx, cy, 0, cx, cy, 400);
	g1.addColorStop(0, "rgba(167,139,250,0.25)");
	g1.addColorStop(0.5, "rgba(255,110,180,0.1)");
	g1.addColorStop(1, "transparent");
	nctx.fillStyle = g1;
	nctx.fillRect(0, 0, nebulaCanvas.width, nebulaCanvas.height);

	const cx2 = nebulaCanvas.width * 0.15;
	const cy2 = nebulaCanvas.height * 0.7;
	const g2 = nctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, 300);
	g2.addColorStop(0, "rgba(52,211,153,0.15)");
	g2.addColorStop(0.6, "rgba(74,144,226,0.08)");
	g2.addColorStop(1, "transparent");
	nctx.fillStyle = g2;
	nctx.fillRect(0, 0, nebulaCanvas.width, nebulaCanvas.height);
}
drawNebula();

/* ─── Parallax on scroll ────────────────── */
window.addEventListener("scroll", () => {
	const y = window.scrollY;
	const planet = document.querySelector(".planet");
	const hero = document.querySelector(".hero-text");
	if (planet) planet.style.transform = `translateY(${y * 0.12}px)`;
	if (hero) hero.style.transform = `translateY(${y * 0.06}px)`;
});

/* ─── Animated counters ─────────────────── */
function formatBig(n) {
	if (n >= 1e12) return (n / 1e12).toFixed(1) + "T";
	if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
	if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
	return n.toLocaleString();
}

function animateCounter(el, target, duration = 2000) {
	let start = null;
	function step(ts) {
		if (!start) start = ts;
		const p = Math.min((ts - start) / duration, 1);
		const eased = 1 - Math.pow(1 - p, 4);
		el.textContent = formatBig(Math.round(target * eased));
		if (p < 1) requestAnimationFrame(step);
		else el.textContent = formatBig(target);
	}
	requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll(".stat-val");
let fired = false;
const obs = new IntersectionObserver(
	(entries) => {
		if (entries[0].isIntersecting && !fired) {
			fired = true;
			counterEls.forEach((el) => animateCounter(el, parseInt(el.dataset.val)));
		}
	},
	{ threshold: 0.5 },
);
if (counterEls.length) obs.observe(counterEls[0]);

/* ─── Scroll reveal for planet cards ───── */
const cards = document.querySelectorAll(".planet-card");
const cardObs = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry, i) => {
			if (entry.isIntersecting) {
				setTimeout(() => {
					entry.target.style.opacity = "1";
					entry.target.style.transform = "translateY(0)";
				}, i * 60);
				cardObs.unobserve(entry.target);
			}
		});
	},
	{ threshold: 0.1 },
);
cards.forEach((c) => {
	c.style.opacity = "0";
	c.style.transform = "translateY(30px)";
	c.style.transition =
		"opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)";
	cardObs.observe(c);
});

/* ─── Mouse parallax on hero planet ────── */
document.addEventListener("mousemove", (e) => {
	const cx = window.innerWidth / 2;
	const cy = window.innerHeight / 2;
	const dx = (e.clientX - cx) / cx;
	const dy = (e.clientY - cy) / cy;
	const rings = document.querySelectorAll(".orbit-ring");
	rings.forEach((r, i) => {
		const factor = (i + 1) * 4;
		r.style.marginLeft = dx * factor + "px";
		r.style.marginTop = dy * factor + "px";
	});
});
