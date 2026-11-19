document.addEventListener('DOMContentLoaded', () => {
  /* TEMPORARILY DISABLED FOR TESTING (Delete opening and closing comment lines to re-enable)
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('keydown', (e) => {
    const key = e.key.toUpperCase();
    if (e.key === 'F12') { e.preventDefault(); return false; }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'J', 'C'].includes(key)) { e.preventDefault(); return false; }
    if (e.metaKey && e.altKey && ['I', 'J', 'C'].includes(key)) { e.preventDefault(); return false; }
    if ((e.ctrlKey || e.metaKey) && ['U', 'S'].includes(key)) { e.preventDefault(); return false; }
  });
  */

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isHoverDevice = window.matchMedia('(hover: hover)').matches;

  // 1. 4-Chapter Multi-View Controller with Hash Deep-Linking
  const validViews = ['overview', 'experience', 'skills', 'credentials'];
  const viewPanels = document.querySelectorAll('.view-panel');
  const viewTabs = document.querySelectorAll('.view-tab');
  const mobileViewTabs = document.querySelectorAll('.mobile-view-tab');

  function switchView(viewName, updateHash = true) {
    const target = validViews.includes(viewName) ? viewName : 'overview';

    viewPanels.forEach((panel) => {
      if (panel.id === `view-${target}`) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    });

    viewTabs.forEach((tab) => {
      if (tab.dataset.view === target) {
        tab.className = 'view-tab px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-400 text-slate-950 shadow-sm transition';
      } else {
        tab.className = 'view-tab px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition';
      }
    });

    mobileViewTabs.forEach((tab) => {
      if (tab.dataset.view === target) {
        tab.classList.add('text-cyan-400');
        tab.classList.remove('text-white');
      } else {
        tab.classList.remove('text-cyan-400');
        tab.classList.add('text-white');
      }
    });

    if (updateHash) {
      history.replaceState(null, '', `#${target}`);
    }
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }

  // Initialize view from URL hash
  const initialHash = window.location.hash.replace('#', '');
  switchView(initialHash || 'overview', false);

  viewTabs.forEach((tab) => {
    tab.addEventListener('click', () => switchView(tab.dataset.view));
  });

  document.querySelectorAll('.view-nav-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.viewTarget) switchView(btn.dataset.viewTarget);
    });
  });

  // 2. Full-Height Mobile Drawer with 60ms Staggered Links
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuPanel = document.getElementById('mobile-menu-panel');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');
  let isMenuOpen = false;

  function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', String(isMenuOpen));

    if (isMenuOpen) {
      mobileMenuPanel?.classList.remove('opacity-0', 'pointer-events-none');
      menuIconOpen?.classList.add('hidden');
      menuIconClose?.classList.remove('hidden');
      mobileViewTabs.forEach((item, idx) => {
        setTimeout(() => item.classList.remove('translate-y-6', 'opacity-0'), idx * 60);
      });
    } else {
      mobileMenuPanel?.classList.add('opacity-0', 'pointer-events-none');
      menuIconOpen?.classList.remove('hidden');
      menuIconClose?.classList.add('hidden');
      mobileViewTabs.forEach((item) => item.classList.add('translate-y-6', 'opacity-0'));
    }
  }

  mobileMenuBtn?.addEventListener('click', toggleMobileMenu);
  mobileViewTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      switchView(tab.dataset.view);
      if (isMenuOpen) toggleMobileMenu();
    });
  });

  // 3. Futuristic Dual-Layer Cursor Choreography + 3D Card Tilt + Mobile Touch/Scroll Glow
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const cursorAura = document.getElementById('cursor-aura');
  const tiltCards = document.querySelectorAll('.tilt-card');

  if (isHoverDevice && !prefersReducedMotion) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDot) {
        cursorDot.style.opacity = '1';
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      if (cursorRing) cursorRing.style.opacity = '1';
      if (cursorAura) {
        cursorAura.style.opacity = '1';
        cursorAura.style.transform = `translate3d(${mouseX - 230}px, ${mouseY - 230}px, 0)`;
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      if (cursorDot) cursorDot.style.opacity = '0';
      if (cursorRing) cursorRing.style.opacity = '0';
      if (cursorAura) cursorAura.style.opacity = '0';
    });

    // Smooth interpolated trailing ring
    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (cursorRing) {
        cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      requestAnimationFrame(animateRing);
    }
    requestAnimationFrame(animateRing);

    // Expand reticle over clickable elements
    document.querySelectorAll('button, a').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (cursorRing) {
          cursorRing.style.width = '52px';
          cursorRing.style.height = '52px';
          cursorRing.style.borderColor = 'rgba(34, 211, 238, 0.85)';
        }
      });
      el.addEventListener('mouseleave', () => {
        if (cursorRing) {
          cursorRing.style.width = '40px';
          cursorRing.style.height = '40px';
          cursorRing.style.borderColor = 'rgba(34, 211, 238, 0.5)';
        }
      });
    });

    // Subtle 3D Card Tilt + Radial Spotlight Sweep
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${relX}px`);
        card.style.setProperty('--mouse-y', `${relY}px`);

        const rotateY = ((relX / rect.width) - 0.5) * 4;
        const rotateX = (0.5 - (relY / rect.height)) * 4;
        card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
      });
    });

    // Magnetic Buttons
    document.querySelectorAll('.magnetic-el').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const offsetX = (e.clientX - rect.left - rect.width / 2) * 0.14;
        const offsetY = (e.clientY - rect.top - rect.height / 2) * 0.14;
        el.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate3d(0px, 0px, 0)';
      });
    });
  } else {
    // Mobile & Tablet Touch + Center Scroll Glow
    tiltCards.forEach((card) => {
      const litTouch = (e) => {
        const touch = e.touches[0];
        if (!touch) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${touch.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${touch.clientY - rect.top}px`);
        card.classList.add('touch-lit');
      };
      card.addEventListener('touchstart', litTouch, { passive: true });
      card.addEventListener('touchmove', litTouch, { passive: true });
      card.addEventListener('touchend', () => setTimeout(() => card.classList.remove('touch-lit'), 350), { passive: true });
    });

    const scrollObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.setProperty('--mouse-x', '50%');
          entry.target.style.setProperty('--mouse-y', '25%');
          entry.target.classList.add('scroll-lit');
        } else {
          entry.target.classList.remove('scroll-lit');
        }
      });
    }, { rootMargin: '-25% 0px -25% 0px', threshold: 0.15 });

    tiltCards.forEach((card) => scrollObs.observe(card));
  }

  // 4. Chapter 02: Enterprise Experience Interactive Console
  const expData = [
    {
      badge: 'Cyber 2.0 · Fleet Architecture',
      scope: '10+ Enterprise Organizations',
      title: 'Hybrid Enterprise EDR Rollout (6,000+ Endpoints)',
      diagramLabel: 'Active Focus: Hybrid Fleet (6,000+ Nodes)',
      nodes: [0],
      conns: [],
      color: '#22D3EE',
      context: 'Deploying endpoint agents across heterogeneous enterprise fleets (Windows Server, Active Directory, RHEL/Ubuntu Linux, and macOS) requires pre-installation validation so existing production workloads remain uninterrupted.',
      execution: 'Led end-to-end architecture planning, pre-installation infrastructure assessments, staged pilot rollouts, and production administration across 6,000+ servers and workstations across 10+ enterprise client organizations.',
      artifactTitle: 'Sanitized Fleet Rollout Summary',
      artifact: `Protected Scale  : 6,000+ Hybrid Endpoints across 10+ Client Organizations
Platforms        : Windows Server & Workstations | Ubuntu & RHEL Linux | macOS
Deployment Phase : Pre-installation readiness checks -> staged rollout -> production tuning`
    },
    {
      badge: 'Cyber 2.0 · Built-In Policy Configuration',
      scope: 'Enterprise SMB Shares',
      title: 'Built-In Zero-Day Whitelisting & SMB Shared-Folder Lockdown',
      diagramLabel: 'Active Focus: Built-In Zero-Day & SMB Policy',
      nodes: [0, 1],
      conns: [0],
      color: '#34D399',
      context: 'Shared network folders (SMB) are a primary channel for lateral movement and unauthorized binary execution when attackers attempt to spread across enterprise endpoints.',
      execution: 'Configured and tuned policies leveraging Cyber 2.0’s built-in zero-day / behavioral application whitelisting to lock down network shared folders (SMB), blocking unapproved executables while keeping legitimate business workflows running.',
      artifactTitle: 'Sanitized Policy Configuration Workflow',
      artifact: `Capability       : Built-in Zero-Day / Behavioral Application Whitelisting
Configured Scope : Network Shared Folders (SMB) & Endpoint Execution Policies
Operational Role : Policy configuration, exception tuning & unauthorized execution prevention`
    },
    {
      badge: 'Cyber 2.0 · Application Triage',
      scope: 'New-Install Hash Verification',
      title: 'Application MD5 Hash Lookup & Triage',
      diagramLabel: 'Active Focus: MD5 Hash -> VirusTotal Check',
      nodes: [0, 2],
      conns: [0, 1],
      color: '#FBBF24',
      context: 'When new software or utilities are installed across client endpoints, security teams need fast verification to confirm whether the binary is trustworthy or potentially malicious.',
      execution: 'Monitored newly installed applications where the endpoint tool automatically captures each application’s MD5 hash, cross-referencing those hashes on VirusTotal to check reputation and flag or isolate suspicious binaries.',
      artifactTitle: 'Sanitized New-Application MD5 Triage Flow',
      artifact: `Trigger          : New application installed on client endpoint
Telemetry        : Endpoint tool automatically collects application MD5 hash
Verification     : Cross-checked MD5 hash on VirusTotal to validate safety / malicious flags`
    },
    {
      badge: 'Telemetry Handoff · Client SIEM Integration',
      scope: 'Client-Managed Collectors',
      title: 'IP/Port Log Forwarding to Client SIEM Collectors',
      diagramLabel: 'Active Focus: EDR -> Client SIEM IP:Port',
      nodes: [1, 2],
      conns: [1],
      color: '#60A5FA',
      context: 'Enterprise clients deploy and administer their own SIEM platforms (such as Splunk or Syslog/CEF collectors) and require endpoint security events routed into their central visibility pipeline.',
      execution: 'Configured EDR log forwarding using the destination IP address and listening port provided by each client’s SIEM team, validating event delivery and coordinating with client SOC/SIEM engineers to confirm ingestion.',
      artifactTitle: 'Sanitized SIEM Log-Forwarding Handoff',
      artifact: `SIEM Ownership   : Client-installed and client-managed SIEM collector
My Configuration : Configured EDR log forwarding to client-provided IP & listening Port
Validation       : Verified network reachability & confirmed log receipt with client SIEM team`
    },
    {
      badge: 'Incident Escalation · L2 / L3 RCA',
      scope: 'Containment & SOC Enablement',
      title: 'Incident RCA, SOC Workshops & R&D',
      diagramLabel: 'Active Focus: L2/L3 Investigation & RCA',
      nodes: [2, 3],
      conns: [2],
      color: '#C084FC',
      context: 'High-priority alerts during onboarding and steady-state operations require structured isolation, root cause documentation, and strong collaboration with client SOC teams and internal R&D.',
      execution: 'Served as primary L2/L3 technical escalation point—leading endpoint isolation, incident investigation, and Root Cause Analysis (RCA) reports, delivering hands-on SOC analyst workshops, and partnering with internal R&D to resolve agent issues.',
      artifactTitle: 'Sanitized Escalation & Enablement Scope',
      artifact: `Escalation Role  : Primary L2 / L3 technical escalation point during & post rollout
Deliverables     : Host isolation, Root Cause Analysis (RCA) reports & SOC training workshops
Engineering Loop : Reproduced field edge cases with internal R&D to drive agent enhancements`
    }
  ];

  const expBtns = document.querySelectorAll('.exp-item');
  const expPane = document.getElementById('exp-detail-pane');

  function updateExpDiagram(nodes, conns, color, label) {
    const lbl = document.getElementById('exp-diagram-label');
    if (lbl) {
      lbl.textContent = label;
      lbl.style.color = color;
    }
    for (let i = 0; i < 4; i++) {
      const g = document.getElementById(`exp-node-${i}`);
      if (!g) continue;
      const rect = g.querySelector('rect');
      const texts = g.querySelectorAll('text');
      const active = nodes.includes(i);
      if (rect) {
        rect.setAttribute('fill', active ? '#0F172A' : '#0B1120');
        rect.setAttribute('stroke', active ? color : '#1E293B');
        rect.setAttribute('stroke-width', active ? '2' : '1.5');
      }
      if (texts[0]) texts[0].setAttribute('fill', active ? '#F8FAFC' : '#94A3B8');
      if (texts[1]) texts[1].setAttribute('fill', active ? color : '#64748B');
    }
    for (let c = 0; c < 3; c++) {
      const line = document.getElementById(`exp-conn-${c}`);
      if (!line) continue;
      const active = conns.includes(c);
      line.setAttribute('stroke', active ? color : '#334155');
      line.setAttribute('stroke-width', active ? '2.5' : '1.5');
    }
  }

  function selectExp(idx, scrollMobile = false) {
    const item = expData[idx];
    if (!item) return;

    expBtns.forEach((b, i) => {
      if (i === idx) {
        b.classList.add('border-cyan-400/50', 'bg-white/[0.05]');
      } else {
        b.classList.remove('border-cyan-400/50', 'bg-white/[0.05]');
      }
    });

    if (expPane) {
      expPane.style.opacity = '0.45';
      setTimeout(() => {
        document.getElementById('exp-badge').textContent = item.badge;
        document.getElementById('exp-scope').textContent = item.scope;
        document.getElementById('exp-title').textContent = item.title;
        document.getElementById('exp-context').textContent = item.context;
        document.getElementById('exp-execution').textContent = item.execution;
        document.getElementById('exp-artifact-title').textContent = item.artifactTitle;
        document.getElementById('exp-artifact').textContent = item.artifact;
        updateExpDiagram(item.nodes, item.conns, item.color, item.diagramLabel);
        expPane.style.opacity = '1';

        if (scrollMobile && window.innerWidth < 1024) {
          expPane.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 90);
    }
  }

  selectExp(0, false);
  expBtns.forEach((btn) => {
    btn.addEventListener('click', () => selectExp(parseInt(btn.dataset.exp, 10), true));
  });

  // 5. Chapter 03: Investigation & Lab Case Files
  const labData = [
    {
      tag: 'NFSU Cyber Range · Malware Forensics Dossier',
      title: 'Behavioral Malware Analysis (Emotet & Remcos)',
      tools: 'Toolchain: Sysinternals Procmon · Wireshark · IDA Pro · Isolated VM Sandbox',
      stages: [
        {
          heading: '01. Sandbox Containment Setup',
          body: 'Executed samples inside an isolated virtual lab with clean pre-execution snapshots, disabled shared folders, and controlled network capture so live C2 traffic never touched production networks.'
        },
        {
          heading: '02. Host & Registry Telemetry (Procmon)',
          body: 'Filtered Process Monitor events by PID to trace child process spawning, payload drop locations in user/temp paths, and Windows Registry Run-key persistence modifications.'
        },
        {
          heading: '03. Network & Static Inspection (Wireshark & IDA Pro)',
          body: 'Captured outbound DNS and C2 beacon traffic in Wireshark while inspecting imported Windows APIs, strings, and control-flow structures in IDA Pro to confirm behavioral indicators.'
        },
        {
          heading: '04. Defensive EDR Takeaway',
          body: 'Mapped findings directly to endpoint controls: strict application whitelisting on user/shared paths, hash reputation verification, and outbound anomaly monitoring.'
        }
      ]
    },
    {
      tag: 'Threat Intelligence Research · NFSU M.Tech',
      title: 'Malware Threat Intelligence via Visualization',
      tools: 'Focus: Structural Sample Mapping · Family Clustering · Attribution Patterns',
      stages: [
        {
          heading: '01. Research Objective',
          body: 'Investigated how visual representation of shared structural attributes and metadata helps analysts classify related malware variants faster than manual one-by-one inspection.'
        },
        {
          heading: '02. Feature & Relationship Mapping',
          body: 'Grouped malware samples by shared behavioral traits, structural signatures, and infrastructure overlaps to expose recurring patterns across families.'
        },
        {
          heading: '03. Threat Actor Attribution Insights',
          body: 'Used visual cluster analysis to highlight campaign reuse and tooling lineage, supporting faster triage when unfamiliar variants appear.'
        },
        {
          heading: '04. Practical SOC Value',
          body: 'Demonstrated how structured visual intelligence speeds up analyst triage by linking isolated file hashes back to broader campaign context.'
        }
      ]
    },
    {
      tag: 'Application Security Lab · Ethical Hacking',
      title: 'Web Application Penetration Testing (OWASP Top 10)',
      tools: 'Toolchain: Burp Suite · Nmap · Manual Request Inspection',
      stages: [
        {
          heading: '01. Reconnaissance & Surface Mapping',
          body: 'Enumerated exposed services, open ports, and application endpoints using Nmap and Burp Suite proxy interception.'
        },
        {
          heading: '02. OWASP Top 10 Vulnerability Testing',
          body: 'Tested authentication flows, input validation, session handling, and access controls against common OWASP Top 10 security flaws.'
        },
        {
          heading: '03. Controlled Exploitation & Verification',
          body: 'Validated findings safely using Burp Repeater/Intruder to eliminate false positives and document exact reproduction steps.'
        },
        {
          heading: '04. Remediation Guidance',
          body: 'Documented clear code and configuration hardening recommendations so engineering teams could close identified exposure paths.'
        }
      ]
    }
  ];

  const labBtns = document.querySelectorAll('.lab-item');
  const labPane = document.getElementById('lab-detail-pane');

  function selectLab(idx, scrollMobile = false) {
    const item = labData[idx];
    if (!item) return;

    labBtns.forEach((b, i) => {
      if (i === idx) {
        b.classList.add('border-cyan-400/50', 'bg-white/[0.05]');
      } else {
        b.classList.remove('border-cyan-400/50', 'bg-white/[0.05]');
      }
    });

    if (labPane) {
      labPane.style.opacity = '0.45';
      setTimeout(() => {
        document.getElementById('lab-tag').textContent = item.tag;
        document.getElementById('lab-title').textContent = item.title;
        document.getElementById('lab-tools').textContent = item.tools;

        const stagesContainer = document.getElementById('lab-stages');
        if (stagesContainer) {
          stagesContainer.innerHTML = item.stages.map((st) => `
            <div class="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] space-y-1.5">
              <h5 class="text-xs font-mono font-semibold text-cyan-300">${st.heading}</h5>
              <p class="text-xs text-slate-300 leading-relaxed">${st.body}</p>
            </div>
          `).join('');
        }
        labPane.style.opacity = '1';

        if (scrollMobile && window.innerWidth < 1024) {
          labPane.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 90);
    }
  }

  selectLab(0, false);
  labBtns.forEach((btn) => {
    btn.addEventListener('click', () => selectLab(parseInt(btn.dataset.lab, 10), true));
  });

  // 6. Calm Clipboard Copy Toast
  const toast = document.getElementById('copy-toast');
  const toastText = document.getElementById('copy-toast-text');
  let toastTimer;

  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const val = btn.dataset.copy;
      const label = btn.dataset.label || 'Copied to clipboard';
      if (!val) return;
      try {
        await navigator.clipboard.writeText(val);
        if (toast && toastText) {
          toastText.textContent = label;
          toast.classList.remove('-translate-y-4', 'opacity-0');
          clearTimeout(toastTimer);
          toastTimer = setTimeout(() => toast.classList.add('-translate-y-4', 'opacity-0'), 2400);
        }
      } catch {
        window.location.href = val.includes('@') ? `mailto:${val}` : `tel:${val}`;
      }
    });
  });
});