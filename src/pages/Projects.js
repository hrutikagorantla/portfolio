import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

function useCursor() {
  React.useEffect(() => {
    const dot = document.querySelector('.cursor');
    const ring = document.querySelector('.cursor-ring');
    let rx = 0, ry = 0;
    function move(e) {
      const x = e.clientX, y = e.clientY;
      if (dot) { dot.style.left = x + 'px'; dot.style.top = y + 'px'; }
      rx += (x - rx) * 0.12; ry += (y - ry) * 0.12;
    }
    let raf = requestAnimationFrame(function loop() {
      if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
      raf = requestAnimationFrame(loop);
    });
    window.addEventListener('mousemove', move);
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);
}

const PROJECTS = [
  {
    num: '01',
    title: 'Peer-to-Peer Tutoring Platform',
    tech: ['React', 'Node.js', 'Express.js', 'Supabase', 'SQL'],
    date: 'January 2026 – Present',
    desc: 'A full-stack platform connecting students with peer tutors — with intelligent matchmaking, scheduling, and real-time messaging.',
    bullets: [
      'Built responsive UI with React and scalable backend APIs using Node.js, Express.js, and Supabase',
      'Integrated ML models via FastAPI and PyTorch for automated topic tagging and personalised recommendations',
      'Implemented real-time messaging and scheduling between tutors and students',
    ],
    screenshotPath: process.env.PUBLIC_URL + '/projectpics/ptp.jpeg',
    link: 'https://github.com/hrutikagorantla/Peer2Peer-Platform',
    linkLabel: 'View on GitHub',
  },
  {
    num: '02',
    title: 'Password Strength Checker',
    tech: ['HTML', 'CSS', 'JavaScript'],
    date: 'August 2025 – December 2025',
    desc: 'A client-side security tool that analyses passwords for character diversity, pattern vulnerabilities, and estimated cracking time.',
    bullets: [
      'Evaluated character diversity, known patterns, and dictionary-based vulnerabilities',
      'Built a brute-force time estimator using search-space calculation',
      'Real-time validation with dynamic UI feedback and actionable security recommendations',
    ],
    screenshotPath: process.env.PUBLIC_URL + '/projectpics/passwordstrength.png',
    link: 'https://github.com/hrutikagorantla/Password-Strength-Checker',
    linkLabel: 'View on GitHub',
  },
  {
    num: '03',
    title: 'Centrality & Herding Analysis',
    tech: ['Python', 'Figma', 'Gephi'],
    date: 'October 2025 – December 2025',
    desc: 'A network analysis study modelling crowd behaviour and opinion influence — how influential nodes shift majority consensus.',
    bullets: [
      'Modelled opinion shifts from 50–50 to 75–25 splits using centrality metrics',
      'Studied natural, local, and global centrality-driven influence patterns',
      'Used Python for data analysis and network graphing; Figma to visualise influence patterns',
    ],
    screenshotPath: process.env.PUBLIC_URL + '/projectpics/herdingposter.png',
    link: process.env.PUBLIC_URL + '/projectpics/herdingposter.png',
    linkLabel: 'View Poster',
  },
  {
    num: '04',
    title: 'Aura Handicrafts',
    tech: ['Business', 'Marketing', 'Crochet'],
    date: '2023',
    desc: 'Founded and ran a small handicraft business from scratch — product sourcing, pricing strategy, and social media marketing.',
    bullets: [
      'Generated ₹20,000 in revenue over 4 months',
      'Handled end-to-end operations: sourcing, pricing, customer orders, and marketing',
      'Learned the ropes of small business management alongside a full academic workload',
    ],
    highlight: '₹20,000 in 4 months',
    screenshotPath: process.env.PUBLIC_URL + '/projectpics/aura.png',
    link: 'https://www.instagram.com/aurahandicraftss?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    linkLabel: 'View on Instagram',
  },
];

export default function Projects() {
  const canvasRef = useRef(null);
  const [openImage, setOpenImage] = React.useState(null);
  useCursor();

  React.useEffect(() => {
    document.body.classList.add('scrollable');
    return () => document.body.classList.remove('scrollable');
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    const stars = [];
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 160; i++) {
      stars.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1 + 0.2,
        speed: Math.random() * 0.004 + 0.002, phase: Math.random() * Math.PI * 2 });
    }
    function draw(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        const alpha = 0.2 + 0.4 * Math.abs(Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168,212,240,${alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div className="projects-page">
      <div className="cursor" />
      <div className="cursor-ring" />
      <canvas id="stars-canvas" ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      <Link to="/" className="projects-back">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </Link>

      <div className="projects-content" style={{ position: 'relative', zIndex: 1 }}>
        <div className="projects-header">
          <span className="panel-label">Work & Projects</span>
          <h1 className="panel-title">Things I've built</h1>
        </div>

        {PROJECTS.map(p => (
          <div className="project-card" key={p.num} data-num={p.num}>
            {/* Screenshot placeholder — replace src with your project screenshot */}
            <div className="project-screenshot-wrap">
              {p.screenshotPath ? (
                <img src={p.screenshotPath} alt={p.title} className="project-screenshot-img" onClick={() => setOpenImage(p.screenshotPath)} style={{ cursor: 'pointer' }} />
              ) : (
                <div className="project-screenshot-placeholder">
                  <span className="project-screenshot-num">{p.num}</span>
                  <span className="project-screenshot-hint">replace with screenshot</span>
                </div>
              )}
            </div>
            <div className="project-tech">
              {p.tech.map(t => <span className="tech-pill" key={t}>{t}</span>)}
            </div>
            <h2 className="project-title">{p.title}</h2>
            <p className="project-date">{p.date}</p>
            <p className="project-desc">{p.desc}</p>
            <ul className="project-bullets">
              {p.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
            {p.highlight && <span className="project-highlight">{p.highlight}</span>}
            {p.link && (
              <a href={p.link} target="_blank" rel="noopener noreferrer" className="project-link">
                {p.linkLabel} →
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Image Lightbox Modal */}
      {openImage && (
        <div className="image-modal" onClick={() => setOpenImage(null)}>
          <button className="image-modal-close" onClick={() => setOpenImage(null)}>✕</button>
          <img src={openImage} alt="Full view" className="image-modal-img" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}