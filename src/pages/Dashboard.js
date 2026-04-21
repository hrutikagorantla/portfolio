import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatar from "./avatar.png";

const PLANETS = [
  { id: 'about',    label: 'About Me',          src: '/planets/planet1.png', top: '15%', left: '75%', size: 182 },
  { id: 'contact',  label: 'Contact Me',         src: '/planets/planet2.png', top: '20%', left: '10%', size: 121 },
  { id: 'hobbies',  label: 'Hobbies',            src: '/planets/planet3.png', top: '65%', left: '8%', size: 210 },
  { id: 'projects', label: 'Projects',           src: '/planets/planet4.png', top: '48%', left: '78%', size: 264 },
  { id: 'research', label: 'Research Interests', src: '/planets/planet5.png', top: '72%', left: '50%', size: 140 },
];

function useStars(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    const stars = [];
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 180; i++) {
      stars.push({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
        r: Math.random() * 1.2 + 0.2, speed: Math.random() * 0.003 + 0.001, phase: Math.random() * Math.PI * 2 });
    }
    function draw(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        const alpha = 0.25 + 0.5 * Math.abs(Math.sin(t * s.speed + s.phase));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,220,255,${alpha})`; ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [canvasRef]);
}

function useCursor() {
  useEffect(() => {
    const dot = document.querySelector('.cursor');
    const ring = document.querySelector('.cursor-ring');
    let rx = 0, ry = 0, mx = 0, my = 0;
    function move(e) { mx = e.clientX; my = e.clientY; if (dot) { dot.style.left = mx+'px'; dot.style.top = my+'px'; } }
    let raf = requestAnimationFrame(function loop() {
      rx += (mx-rx)*0.12; ry += (my-ry)*0.12;
      if (ring) { ring.style.left = rx+'px'; ring.style.top = ry+'px'; }
      raf = requestAnimationFrame(loop);
    });
    window.addEventListener('mousemove', move);
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);
}

function Blob({ avatarSrc }) {
  const pathRef = useRef(null);
  const animRef = useRef(null);
  useEffect(() => {
    let t = 0;
    function frame() {
      t += 0.010;
      const R = 120, n = 8, points = [];
      for (let i = 0; i < n; i++) {
        const angle = (i/n)*Math.PI*2 - Math.PI/2;
        const wobble = 20*Math.sin(t*1.0+i*1.3) + 12*Math.sin(t*0.6+i*2.1) + 8*Math.sin(t*1.7+i*0.9);
        const r = R + wobble;
        points.push([150 + r*Math.cos(angle), 150 + r*Math.sin(angle)]);
      }
      let d = `M ${points[0][0]} ${points[0][1]}`;
      for (let i = 0; i < n; i++) {
        const curr = points[i], next = points[(i+1)%n];
        const cp1x = curr[0]+(next[0]-points[(i-1+n)%n][0])/6;
        const cp1y = curr[1]+(next[1]-points[(i-1+n)%n][1])/6;
        const cp2x = next[0]-(points[(i+2)%n][0]-curr[0])/6;
        const cp2y = next[1]-(points[(i+2)%n][1]-curr[1])/6;
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next[0]} ${next[1]}`;
      }
      d += ' Z';
      if (pathRef.current) pathRef.current.setAttribute('d', d);
      animRef.current = requestAnimationFrame(frame);
    }
    animRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="blob-wrap">
      <svg className="blob-svg" viewBox="0 0 300 300">
        <defs>
          <radialGradient id="blobGrad" cx="50%" cy="45%" r="55%">
            <stop offset="0%"   stopColor="#2272b8" stopOpacity="0.9" />
            <stop offset="60%"  stopColor="#0d2240" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#060d1a" stopOpacity="1" />
          </radialGradient>
          <filter id="blobGlow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <path ref={pathRef} fill="url(#blobGrad)" filter="url(#blobGlow)" opacity="0.95" />
        <circle cx="150" cy="150" r="90" fill="none" stroke="rgba(168,212,240,0.1)" strokeWidth="1" />
      </svg>
      <div className="blob-avatar">
        <img src={avatarSrc} alt="Hrutika" />
      </div>
    </div>
  );
}

/* Planet button — absolute positioning with explicit coordinates */
function PlanetBtn({ planet, onClick, bobDelay }) {
  const style = {
    position: 'fixed',
    top: planet.top,
    left: planet.left,
    transform: 'translate(-50%, -50%)',
    animationDelay: bobDelay,
  };
  return (
    <button
      className="planet-btn"
      onClick={() => onClick(planet.id)}
      style={style}
      title={planet.label}
    >
      <img src={planet.src} alt={planet.label} className="planet-img" style={{width: planet.size, height: planet.size}} />
      <span className="planet-label">{planet.label}</span>
    </button>
  );
}

function Panel({ open, onClose, label, title, children }) {
  useEffect(() => {
    function onKey(e) { if (e.key==='Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className={`overlay-backdrop${open?' open':''}`} onClick={onClose}>
      <div className="panel" onClick={e=>e.stopPropagation()}>
        <button className="panel-close" onClick={onClose}>✕</button>
        {label && <p className="panel-label">{label}</p>}
        <h2 className="panel-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}

const BOB_DELAYS = ['0s', '-1.5s', '-3s', '-4.5s', '-2s'];

export default function Dashboard() {
  const canvasRef = useRef(null);
  const [active, setActive] = useState(null);
  const navigate = useNavigate();
  useStars(canvasRef);
  useCursor();

  function handlePlanet(id) {
    if (id === 'projects') navigate('/projects');
    else setActive(id);
  }
  const close = () => setActive(null);

  return (
    <>
      <div className="cursor" />
      <div className="cursor-ring" />
      <canvas id="stars-canvas" ref={canvasRef} />

      <div className="dashboard">
        <p className="hero-name">Hrutika <em>Gorantla</em></p>
        <p className="hero-tagline">CS · Cybersecurity · Artist · Builder</p>

        {/* solar system — blob + orbiting planet buttons all in one relative container */}
        <div className="solar-system">
          <Blob avatarSrc="/avatar.png" />
          {PLANETS.map((p, i) => (
            <PlanetBtn key={p.id} planet={p} onClick={handlePlanet} bobDelay={BOB_DELAYS[i]} />
          ))}
        </div>
      </div>

      {/* ── ABOUT ── */}
      <Panel open={active==='about'} onClose={close} label="About Me" title="Hi, I'm Hrutika.">
        <div className="panel-body">
          <p>I'm a third-year CS student at Mahindra University (graduating June 2027), currently holding a <em>9.59 GPA</em> and a Merit Scholarship. My academic path has been shaped by a genuine love for subjects with a soft spot for the ones that explain the <em>why</em> behind how things work.</p>
          <p>I like understanding systems from the inside out — tracing signals through logic circuits, reading code line by line, figuring out exactly why something works the way it does. I'm currently interested in <strong>cybersecurity</strong>: it sits right at the overlap between careful, methodical thinking and actually making (and breaking) things.</p>
          <p>My secret weapon: <strong>Persistence.</strong> Give me a task I care about, and I will not quit. Whether the situation gets tough or the learning curve gets steep, showing up until the end is the one thing I can promise without fail.</p>
          <p style={{fontStyle:'italic',color:'rgba(168,212,240,0.6)',fontSize:'0.88rem'}}>"The more I learn, the less I know — and I wouldn't have it any other way."</p>
        </div>
        <div className="detail-row">
          <div className="detail-chip"><div className="detail-chip-label">University</div><div className="detail-chip-value">Mahindra University, Hyderabad</div></div>
          <div className="detail-chip"><div className="detail-chip-label">Degree</div><div className="detail-chip-value">B.S. Computer Science · June 2027</div></div>
          <div className="detail-chip"><div className="detail-chip-label">GPA</div><div className="detail-chip-value">9.59 / 10 · Merit Scholarship ×2</div></div>
          <div className="detail-chip"><div className="detail-chip-label">Professional Interests</div><div className="detail-chip-value">Cybersecurity · Security Engineering </div></div>
        </div>
      </Panel>

      {/* ── CONTACT ── */}
      <Panel open={active==='contact'} onClose={close} label="Get in touch" title="Contact Me">
        <div className="contact-grid">
          <a className="contact-item" href="tel:+919392022433"><div className="contact-icon">📞</div><div><div className="contact-label">Phone</div><div className="contact-value">+91 93920 22433</div></div></a>
          <a className="contact-item" href="mailto:hrutikagorantla@gmail.com"><div className="contact-icon">✉</div><div><div className="contact-label">Personal Email</div><div className="contact-value">hrutikagorantla@gmail.com</div></div></a>
          <a className="contact-item" href="mailto:se23ucse069@mahindrauniversity.edu.in"><div className="contact-icon">🎓</div><div><div className="contact-label">College Email</div><div className="contact-value">se23ucse069@mahindrauniversity.edu.in</div></div></a>
          <a className="contact-item" href="https://github.com/hrutikagorantla" target="_blank" rel="noopener noreferrer"><div className="contact-icon">⌥</div><div><div className="contact-label">GitHub</div><div className="contact-value">github.com/hrutikagorantla</div></div></a>
          <a className="contact-item" href="https://www.linkedin.com/in/hrutika-gorantla-503b68324/" target="_blank" rel="noopener noreferrer"><div className="contact-icon">in</div><div><div className="contact-label">LinkedIn</div><div className="contact-value">linkedin.com/in/hrutika-gorantla</div></div></a>
        </div>
      </Panel>

      {/* ── RESEARCH ── */}
      <Panel open={active==='research'} onClose={close} label="Research Interests" title="What I'm exploring">
        <div className="research-item"><div className="research-item-title">Cryptography & Fault-Tolerant Networks</div><div className="research-item-desc">Currently exploring cryptography problems related to threshold paths that are necessary and sufficient in a directed network with nodes that can be faulty or omitted. Interested in how fault tolerance, redundancy, and network topology interact at a formal level.</div></div>
        <div className="research-item"><div className="research-item-title">Literary & Cultural Analysis</div><div className="research-item-desc">Written analysis papers on <em>Sandworm</em> by Neil Gaiman and <em>Lord of the Flies</em> by William Golding for a Cultural Studies course. Happy to take part in more literature analysis — particularly where texts intersect with technology, power, or systems thinking.</div></div>
      </Panel>

      {/* ── HOBBIES ── */}
      <Panel open={active==='hobbies'} onClose={close} label="Beyond the terminal" title="Things I love">
        <div className="panel-body">
          <p>I'm a self-proclaimed hobby hoarder. I read fiction obsessively, make things with my hands, and recently turned my crochet pieces into a small business — learning marketing and management along the way.</p>
        </div>
        <p className="hobbies-section-title">Books I've loved</p>
        <div className="books-image-wrap">
          <img src="/bookspic.png" alt="Books I love" className="books-image" />
        </div>
        <p className="hobbies-section-title">Things I make</p>
        <div className="hobby-crafts">
          <img src="/hobbies.png" alt="Things I make" className="books-image" />
        </div>
      </Panel>
    </>
  );
}
