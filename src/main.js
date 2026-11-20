/*
// === START: RIGHT-CLICK & F12 BLOCK (disabled while testing) ===
document.addEventListener('contextmenu', (e) => e.preventDefault());

document.addEventListener('keydown', (e) => {
  const key = (e.key || '').toUpperCase();
  if (
    e.key === 'F12' ||
    ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'J', 'C'].includes(key)) ||
    (e.metaKey && e.altKey && ['I', 'J', 'C'].includes(key)) ||
    ((e.ctrlKey || e.metaKey) && ['U', 'S'].includes(key))
  ) {
    e.preventDefault();
  }
});
// === END: RIGHT-CLICK & F12 BLOCK ===
*/

document.addEventListener('DOMContentLoaded', () => {
  const SECTION_IDS = ['overview', 'experience', 'skills', 'credentials'];
  const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
  const dockItems = document.querySelectorAll('.dock-item');
  const topNavPills = document.querySelectorAll('.top-nav-pill');

  let toastTimer = null;
  let manualScrollLockUntil = 0;

  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.remove('-translate-y-4', 'opacity-0');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('-translate-y-4', 'opacity-0');
    }, 2400);
  }

  function setActiveSectionNav(id) {
    if (!SECTION_IDS.includes(id)) return;
    dockItems.forEach((item) => {
      item.classList.toggle('active', item.dataset.section === id);
    });
    topNavPills.forEach((pill) => {
      pill.classList.toggle('active', pill.dataset.section === id);
    });
  }

  function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;
    manualScrollLockUntil = Date.now() + 900;
    setActiveSectionNav(id);
    history.replaceState(null, '', `#${id}`);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.querySelectorAll('.section-link, .dock-item, .top-nav-pill').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.dataset.section;
      if (targetId && SECTION_IDS.includes(targetId)) {
        e.preventDefault();
        scrollToSection(targetId);
      }
    });
  });

  // Reliable Scroll Position Spy (Handles Bottom-of-Page & Short Final Sections Accurately)
  function updateActiveSectionFromScroll() {
    if (Date.now() < manualScrollLockUntil || sections.length === 0) return;

    const scrollBottom = window.scrollY + window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // If scrolled near the bottom of the page, activate the final section (Credentials)
    if (docHeight - scrollBottom < 80) {
      setActiveSectionNav(SECTION_IDS[SECTION_IDS.length - 1]);
      return;
    }

    const triggerLine = window.scrollY + 180;
    let currentId = SECTION_IDS[0];

    for (const sec of sections) {
      if (sec.offsetTop <= triggerLine) {
        currentId = sec.dataset.sectionId;
      }
    }

    setActiveSectionNav(currentId);
  }

  window.addEventListener('scroll', updateActiveSectionFromScroll, { passive: true });
  updateActiveSectionFromScroll();

  // ---------- KPI Counter Animation ----------
  function animateKpis() {
    document.querySelectorAll('.kpi-counter').forEach((el) => {
      const target = parseFloat(el.dataset.target || '0');
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const suffix = el.dataset.suffix || '';
      const duration = 700;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        const formatted =
          decimals > 0
            ? current.toFixed(decimals)
            : Math.round(current).toLocaleString('en-US');
        el.textContent = `${formatted}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
  animateKpis();

  // ---------- Mobile Touch Ripple ----------
  document.addEventListener(
    'touchstart',
    (e) => {
      if (window.innerWidth >= 1024 || !e.touches || e.touches.length === 0) return;
      const t = e.touches[0];
      const ripple = document.createElement('span');
      ripple.className = 'touch-ripple';
      ripple.style.left = `${t.clientX}px`;
      ripple.style.top = `${t.clientY}px`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 560);
    },
    { passive: true }
  );

  // ---------- Mobile/Tablet Scroll-Driven Spotlights ----------
  let spotlightObserver = null;
  function observeMobileSpotlights() {
    if (spotlightObserver) spotlightObserver.disconnect();
    const cards = document.querySelectorAll('.mobile-spotlight');
    if (!('IntersectionObserver' in window) || window.innerWidth >= 1024) {
      cards.forEach((c) => c.classList.remove('is-in-view'));
      return;
    }

    spotlightObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-in-view', entry.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );

    cards.forEach((card) => spotlightObserver.observe(card));
  }
  observeMobileSpotlights();

  // ---------- Desktop Cursor & 3D Card Tilt ----------
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (dot && window.innerWidth >= 768) {
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }
  });

  function animateCursorRing() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    if (ring && window.innerWidth >= 768) {
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    }
    requestAnimationFrame(animateCursorRing);
  }
  requestAnimationFrame(animateCursorRing);

  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 768) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = (x / rect.width - 0.5) * 5.5;
      const rotateX = (0.5 - y / rect.height) * 5.5;

      card.style.setProperty('--spot-x', `${x}px`);
      card.style.setProperty('--spot-y', `${y}px`);
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
      document.body.classList.add('cursor-active');
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      document.body.classList.remove('cursor-active');
    });
  });

  // ---------- Living Endpoint Telemetry Canvas ----------
  const canvas = document.getElementById('telemetry-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let nodes = [];

  function initTelemetryNodes() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = window.innerWidth < 768 ? 24 : 46;
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 1,
    }));
  }

  function renderTelemetry() {
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const maxDist = window.innerWidth < 768 ? 115 : 155;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > canvas.width) a.vx *= -1;
        if (a.y < 0 || a.y > canvas.height) a.vy *= -1;

        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 211, 238, 0.35)';
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.14;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(34, 211, 238, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }
    requestAnimationFrame(renderTelemetry);
  }

  initTelemetryNodes();
  renderTelemetry();
  window.addEventListener('resize', () => {
    initTelemetryNodes();
    observeMobileSpotlights();
    updateActiveSectionFromScroll();
  });

  // ---------- Cyber 2.0 Pipeline Stage Inspector ----------
  const WORKFLOW_STAGES = {
    rollout: {
      badge: 'STAGE 01 // FLEET ROLLOUT & POLICY',
      title: 'Cyber 2.0 Rollout, Zero-Day Whitelisting & SMB Guard',
      desc: 'Rolled out and administered Cyber 2.0 EDR across 10+ enterprise environments covering 6,000+ hybrid endpoints, enforcing built-in zero-day/behavioral whitelisting and SMB shared folder protection.',
      highlightNode: 'svg-node-rollout',
    },
    triage: {
      badge: 'STAGE 02 // HASH CAPTURE & VIRUSTOTAL',
      title: 'New-Application MD5 Hashing & Reputation Lookup',
      desc: 'Captured MD5 hashes on newly observed applications and checked reputation telemetry via VirusTotal to accelerate unknown binary classification.',
      highlightNode: 'svg-node-triage',
    },
    siem: {
      badge: 'STAGE 03 // SIEM LOG FORWARDING',
      title: 'IP / Port Log Forwarding to Client SIEM Collectors',
      desc: 'Configured reliable IP/Port log forwarding to client SIEM collectors for centralized monitoring, compliance visibility, and SOC alerting.',
      highlightNode: 'svg-node-siem',
    },
    rca: {
      badge: 'STAGE 04 // L2/L3 INCIDENT RESPONSE',
      title: 'Root-Cause Analysis (RCA), Host Isolation & Remediation',
      desc: 'Executed L2/L3 incident investigations, isolated impacted endpoints when needed, and delivered structured RCA and remediation.',
      highlightNode: 'svg-node-rca',
    },
  };

  document.querySelectorAll('.workflow-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.workflow-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const info = WORKFLOW_STAGES[tab.dataset.stage];
      if (!info) return;

      document.getElementById('workflow-badge').textContent = info.badge;
      document.getElementById('workflow-title').textContent = info.title;
      document.getElementById('workflow-desc').textContent = info.desc;

      ['svg-node-rollout', 'svg-node-triage', 'svg-node-siem', 'svg-node-rca'].forEach((id) => {
        const rect = document.querySelector(`#${id} rect`);
        if (rect) {
          rect.setAttribute('stroke', id === info.highlightNode ? '#22D3EE' : '#475569');
          rect.setAttribute('stroke-width', id === info.highlightNode ? '2' : '1.2');
        }
      });
    });
  });

  // ---------- Interactive EDR Containment Simulator ----------
  const simModeBtn = document.getElementById('sim-mode-btn');
  const simRunBtn = document.getElementById('sim-run-btn');
  const simConsole = document.getElementById('sim-console');
  let isHardened = true;

  if (simModeBtn) {
    simModeBtn.addEventListener('click', () => {
      isHardened = !isHardened;
      simModeBtn.dataset.hardened = String(isHardened);
      simModeBtn.textContent = isHardened
        ? 'Mode: Cyber 2.0 Hardened (Toggle)'
        : 'Mode: Unprotected Baseline (Toggle)';
    });
  }

  if (simRunBtn && simConsole) {
    simRunBtn.addEventListener('click', () => {
      simConsole.innerHTML = '';
      const steps = isHardened
        ? [
            { color: 'text-cyan-300', line: '[00:00.12] Unverified binary "svch0st_update.exe" attempted execution from \\\\SMB-SHARE\\Drop\\.' },
            { color: 'text-slate-200', line: '[00:00.38] Cyber 2.0 EDR captured MD5: 8f9c2e41b70d3a91c6e54b20891f4d72' },
            { color: 'text-amber-300', line: '[00:00.85] VirusTotal check: Unapproved / anomalous reputation → Behavioral Whitelist policy evaluated.' },
            { color: 'text-emerald-300', line: '[00:01.10] BLOCKED execution & protected SMB shared folder; host isolated for L2/L3 review.' },
            { color: 'text-indigo-300', line: '[00:01.35] Forwarded structured telemetry via IP/Port to Client SIEM Collector for SOC correlation & RCA.' },
          ]
        : [
            { color: 'text-amber-300', line: '[00:00.12] Unverified binary "svch0st_update.exe" launched from \\\\SMB-SHARE\\Drop\\.' },
            { color: 'text-rose-400', line: '[00:00.65] WARNING: Behavioral whitelisting or SMB share guard not enforced → unauthorized share write risk.' },
            { color: 'text-rose-400', line: '[00:01.20] Slower response: manual MD5/VirusTotal lookup and L2/L3 isolation required post-alert.' },
          ];

      steps.forEach((step, idx) => {
        setTimeout(() => {
          const div = document.createElement('div');
          div.className = step.color;
          div.textContent = step.line;
          simConsole.appendChild(div);
        }, idx * 260);
      });
    });
  }

  // ---------- Forensic Lab Dossier Switcher ----------
  const LAB_DATA = {
    'emotet-remcos': {
      tag: 'MALWARE & RAT FORENSICS',
      tools: 'IDA Pro · Procmon · Wireshark',
      title: 'Emotet & Remcos RAT Analysis',
      summary:
        'Investigated execution chains, persistence behaviors, and host/network indicators associated with Emotet and Remcos samples using Procmon for process/file/registry tracing, IDA Pro for binary inspection, and Wireshark for traffic analysis.',
      highlights: [
        '• Traced child process creation, file/registry modifications, and persistence hooks in Procmon.',
        '• Examined binary structure and routines in IDA Pro alongside network behavior in Wireshark.',
      ],
      defense:
        'Connects malware internals directly to behavioral whitelisting rules, MD5/VirusTotal reputation checks, SMB share guards, and rapid L2/L3 containment.',
    },
    'malware-vis': {
      tag: 'VISUALIZATION & TRIAGE',
      tools: 'Autopsy · Procmon · Artifact Mapping',
      title: 'Malware Visualization & Timeline Reconstruction',
      summary:
        'Mapped execution touchpoints, disk artifacts, and event sequences into clear visual timelines to accelerate root-cause analysis and triage.',
      highlights: [
        '• Reconstructed activity timelines and file/artifact relationships in Autopsy.',
        '• Paired visual evidence maps with endpoint telemetry to speed up L2/L3 investigation.',
      ],
      defense:
        'Reduces triage time during complex investigations by turning raw logs and disk artifacts into structured timelines.',
    },
    'owasp-lab': {
      tag: 'EXPOSURE & WEB VAPT',
      tools: 'Burp Suite · Nmap · Nessus · OWASP Top 10',
      title: 'OWASP Top 10 Assessment & Network Recon',
      summary:
        'Performed network discovery and web vulnerability assessment using Burp Suite, Nmap, and Nessus aligned with OWASP Top 10 risk categories.',
      highlights: [
        '• Enumerated open ports/services via Nmap and reviewed vulnerability findings in Nessus.',
        '• Inspected HTTP/S traffic in Burp Suite against OWASP Top 10 attack patterns.',
      ],
      defense:
        'Strengthens intrusion-path analysis by connecting exposed services and web vectors with endpoint defense.',
    },
  };

  document.querySelectorAll('.lab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const lab = LAB_DATA[btn.dataset.lab];
      if (!lab) return;

      document.getElementById('lab-tag').textContent = lab.tag;
      document.getElementById('lab-tools').textContent = lab.tools;
      document.getElementById('lab-title').textContent = lab.title;
      document.getElementById('lab-summary').textContent = lab.summary;
      document.getElementById('lab-defense').textContent = lab.defense;

      const listEl = document.getElementById('lab-highlights');
      listEl.innerHTML = '';
      lab.highlights.forEach((line) => {
        const div = document.createElement('div');
        div.textContent = line;
        listEl.appendChild(div);
      });
    });
  });

  // ---------- Print / Save PDF ----------
  const printBtn = document.getElementById('print-resume-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      showToast('Opening ATS print / PDF view...');
      setTimeout(() => window.print(), 150);
    });
  }

  // ---------- Command Palette (Ctrl+K / Cmd+K) ----------
  const palette = document.getElementById('command-palette');
  const paletteInput = document.getElementById('palette-input');
  const paletteResults = document.getElementById('palette-results');
  const openPaletteBtn = document.getElementById('open-palette-btn');
  const closePaletteBtn = document.getElementById('close-palette-btn');

  const COMMAND_ITEMS = [
    { label: '01. Overview — Hero, Contact & Dossier Map', keywords: 'overview top hero contact dossier', action: () => scrollToSection('overview') },
    { label: '02. Experience — Cyber 2.0 EDR, Simulator & SIEM', keywords: 'experience cyber 2.0 edr simulator whitelist smb siem rca', action: () => scrollToSection('experience') },
    { label: '03. Skills & Labs — Emotet, Remcos, IDA Pro, Procmon, Wireshark', keywords: 'skills labs emotet remcos ida procmon wireshark autopsy burp nmap nessus', action: () => scrollToSection('skills') },
    { label: '04. Credentials & Growth — NFSU, DIET, Splunk, Autopsy, SC-200, Qualys', keywords: 'credentials education nfsu diet splunk autopsy sc-200 qualys', action: () => scrollToSection('credentials') },
    { label: 'Export Resume PDF (ATS Print Layout)', keywords: 'pdf print resume download ats', action: () => window.print() },
    { label: 'Open GitHub Profile (sai-sri94)', keywords: 'github code sai-sri94', action: () => window.open('https://github.com/sai-sri94', '_blank', 'noopener,noreferrer') },
  ];

  function renderPaletteItems(query = '') {
    if (!paletteResults) return;
    const q = query.trim().toLowerCase();
    const matches = COMMAND_ITEMS.filter(
      (item) => !q || item.label.toLowerCase().includes(q) || item.keywords.includes(q)
    );

    paletteResults.innerHTML = '';
    if (matches.length === 0) {
      paletteResults.innerHTML = '<div class="px-3 py-4 text-slate-400 text-center">No matching section or command</div>';
      return;
    }

    matches.forEach((item) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className =
        'w-full text-left px-3 py-2.5 rounded-xl hover:bg-cyan-400/15 hover:text-cyan-200 text-slate-200 transition-colors flex items-center justify-between';
      btn.innerHTML = `<span>${item.label}</span><span class="font-mono text-[10px] text-cyan-400">↵</span>`;
      btn.addEventListener('click', () => {
        closePalette();
        item.action();
      });
      paletteResults.appendChild(btn);
    });
  }

  function openPalette() {
    if (!palette) return;
    palette.classList.remove('hidden');
    renderPaletteItems('');
    setTimeout(() => paletteInput && paletteInput.focus(), 20);
  }

  function closePalette() {
    if (!palette) return;
    palette.classList.add('hidden');
    if (paletteInput) paletteInput.value = '';
  }

  if (openPaletteBtn) openPaletteBtn.addEventListener('click', openPalette);
  if (closePaletteBtn) closePaletteBtn.addEventListener('click', closePalette);
  if (palette) {
    palette.addEventListener('click', (e) => {
      if (e.target === palette) closePalette();
    });
  }
  if (paletteInput) {
    paletteInput.addEventListener('input', (e) => renderPaletteItems(e.target.value));
  }

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (palette && !palette.classList.contains('hidden')) {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === 'Escape' && palette && !palette.classList.contains('hidden')) {
      closePalette();
    }
  });

  const initialHash = window.location.hash.replace('#', '');
  if (SECTION_IDS.includes(initialHash)) {
    setTimeout(() => scrollToSection(initialHash), 80);
  }
});