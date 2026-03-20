/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, MouseEvent, useState, FormEvent } from 'react';
import { renderToString } from 'react-dom/server';
import { Building2, Briefcase, Watch, Pill, Smartphone, Microscope, Stethoscope, ClipboardList, Eye, Target, Puzzle } from 'lucide-react';

export default function App() {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    /* ── SCROLL PROGRESS BAR ── */
    const pb = document.getElementById('progress-bar');
    const handleScroll = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
      if (pb) pb.style.width = pct + '%';
      
      /* ── NAV SCROLL STATE ── */
      const nav = document.getElementById('main-nav');
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);

    /* ── INTERSECTION OBSERVER — REVEAL ── */
    const reveals = document.querySelectorAll('.r');
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => ro.observe(el));

    /* ── HERO BARS animate on load ── */
    const heroBarsTimeout = setTimeout(() => {
      document.querySelectorAll('.hcm-fill').forEach(b => b.classList.add('animate'));
    }, 800);

    /* ── ANIMATED COUNTERS ── */
    function animateCounter(el: HTMLElement | null, target: number, suffix: string, duration: number, delay: number) {
      if (!el) return;
      setTimeout(() => {
        const start = performance.now();
        function step(now: number) {
          const t = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 4);
          el!.textContent = Math.round(ease * target) + suffix;
          if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }, delay);
    }

    // Hero count-up
    animateCounter(document.querySelector('[data-count="40"]'), 40, '%', 1400, 800);
    animateCounter(document.querySelector('[data-count="3"]'), 3, '×', 1000, 1000);

    /* ── PHONE BAR FILL ── */
    const phoneObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.ch-pf').forEach(b => b.classList.add('go'));
          phoneObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.phone-wrap').forEach(el => phoneObs.observe(el));

    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.querySelectorAll('.counter').forEach(c => {
          const target = +(c as HTMLElement).dataset.target!;
          const suffix = (c as HTMLElement).dataset.suffix || '';
          animateCounter(c as HTMLElement, target, suffix, 2000, 0);
        });
        counterObs.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('.outcomes-grid').forEach(el => counterObs.observe(el));

    /* ── DEPLOY LINE + STEPS ── */
    const depObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const line = e.target.querySelector('#dep-line');
        const steps = e.target.querySelectorAll('.dep-step');
        if (line) line.classList.add('grow');
        steps.forEach(s => s.classList.add('in'));
        depObs.unobserve(e.target);
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.dep-steps').forEach(el => depObs.observe(el));

    /* ── MAGNETIC BUTTON EFFECT ── */
    const magneticEffect = (e: MouseEvent) => {
      const btn = e.currentTarget as HTMLElement;
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      btn.style.transform = `translate(${x*0.15}px,${y*0.15}px) translateY(-2px)`;
    };
    const resetMagnetic = (e: MouseEvent) => {
      const btn = e.currentTarget as HTMLElement;
      btn.style.transform = '';
    };
    const magneticBtns = document.querySelectorAll('.btn-primary,.btn-outline,.nav-cta');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', magneticEffect as any);
      btn.addEventListener('mouseleave', resetMagnetic as any);
    });

    /* ── CURSOR GLOW (desktop only) ── */
    let glow: HTMLDivElement | null = null;
    const handleGlowMove = (e: MouseEvent) => {
      if (glow) {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
      }
    };
    if (window.matchMedia('(pointer:fine)').matches) {
      glow = document.createElement('div');
      glow.style.cssText = `
        position:fixed;width:400px;height:400px;border-radius:50%;pointer-events:none;z-index:0;
        background:radial-gradient(circle,rgba(0,201,160,.04) 0%,transparent 70%);
        transform:translate(-50%,-50%);transition:opacity .3s;
      `;
      document.body.appendChild(glow);
      document.addEventListener('mousemove', handleGlowMove);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      ro.disconnect();
      phoneObs.disconnect();
      counterObs.disconnect();
      depObs.disconnect();
      clearTimeout(heroBarsTimeout);
      magneticBtns.forEach(btn => {
        btn.removeEventListener('mousemove', magneticEffect as any);
        btn.removeEventListener('mouseleave', resetMagnetic as any);
      });
      if (glow) {
        document.removeEventListener('mousemove', handleGlowMove);
        document.body.removeChild(glow);
      }
    };
  }, []);

  const toggleModule = (e: MouseEvent<HTMLDivElement>) => {
    const item = e.currentTarget;
    item.classList.toggle('on');
    const toggle = item.querySelector('.mp-toggle');
    if (toggle) toggle.textContent = item.classList.contains('on') ? '✓' : '';
    const count = document.querySelectorAll('.mp-item.on').length;
    const note = document.getElementById('picker-note');
    if (note) {
      const msgs: Record<number, string> = {
        0: 'Select at least one module to get started',
        1: '✓ 1 module selected — great starting point',
        2: '✓ 2 modules selected — all share one unified member data & rewards layer',
        3: '✓ 3 modules selected — strong coverage across your population',
        4: '✓ Full platform selected — maximum ROI potential'
      };
      note.textContent = msgs[count] || msgs[0];
    }
  };

  const handleDemoSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setShowDemoModal(false);
      setFormSubmitted(false);
    }, 3000);
  };

  useEffect(() => {
    const demoBtns = document.querySelectorAll('#hero-demo-btn, #cta-demo-btn, .nav-cta');
    const videoBtns = document.querySelectorAll('#hero-video-btn, #cta-video-btn');

    const openDemo = (e: Event) => {
      e.preventDefault();
      setShowDemoModal(true);
    };
    const openVideo = (e: Event) => {
      e.preventDefault();
      setShowVideoModal(true);
    };

    demoBtns.forEach(btn => btn.addEventListener('click', openDemo));
    videoBtns.forEach(btn => btn.addEventListener('click', openVideo));

    return () => {
      demoBtns.forEach(btn => btn.removeEventListener('click', openDemo));
      videoBtns.forEach(btn => btn.removeEventListener('click', openVideo));
    };
  }, []);

  return (
    <div className="app-container">
      {/* ── MODALS ── */}
      {showDemoModal && (
        <div className="modal-overlay" onClick={() => setShowDemoModal(false)}>
          <div className="modal-content demo-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDemoModal(false)}>×</button>
            {!formSubmitted ? (
              <div className="demo-form-wrap">
                <div className="section-label">Request a Demo</div>
                <h2>Let's build your <em>health strategy.</em></h2>
                <p>Fill in your details and our insurance solutions team will reach out within 24 hours.</p>
                <form className="demo-form" onSubmit={handleDemoSubmit}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="John Doe" required />
                  </div>
                  <div className="form-group">
                    <label>Work Email</label>
                    <input type="email" placeholder="john@insurance-co.com" required />
                  </div>
                  <div className="form-group">
                    <label>Company Name</label>
                    <input type="text" placeholder="Global Insurance Ltd" required />
                  </div>
                  <div className="form-group">
                    <label>Primary Interest</label>
                    <select required>
                      <option value="">Select an option</option>
                      <option value="phm">Population Health Management</option>
                      <option value="chronic">Chronic Patient Care</option>
                      <option value="wellness">Corporate Wellness</option>
                      <option value="mms">Managed Medical Services</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-primary w-full"><span>Submit Request</span></button>
                </form>
              </div>
            ) : (
              <div className="success-state">
                <div className="success-icon">✓</div>
                <h2>Request Received!</h2>
                <p>Thank you. Our team will be in touch shortly to schedule your personalized demo.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showVideoModal && (
        <div className="modal-overlay" onClick={() => setShowVideoModal(false)}>
          <div className="modal-content video-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowVideoModal(false)}>×</button>
            <div className="video-container">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/z9_YvXF_XmY?autoplay=1" 
                title="GOQii healthEngage Platform Overview" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="video-info">
              <h3>Platform Overview: Data to Outcomes</h3>
              <p>See how GOQii healthEngage connects your ecosystem and drives claim savings.</p>
            </div>
          </div>
        </div>
      )}

      <div dangerouslySetInnerHTML={{ __html: `
<div id="progress-bar"></div>

<!-- ═══════════════════ NAV ═══════════════════ -->
<nav id="main-nav">
  <div class="logo">
    <img src="https://appcdn.goqii.com/storeimg/34779_1774000918.png" alt="GOQii healthEngage" class="logo-img" referrerPolicy="no-referrer" />
  </div>
  <ul>
    <li><a href="#platform">Platform</a></li>
    <li><a href="#modules">Solutions</a></li>
    <li><a href="#engagement">Engagement</a></li>
    <li><a href="#connect">Integration</a></li>
    <li><a href="#cta" class="nav-cta">Request a Demo</a></li>
  </ul>
</nav>

<!-- ═══════════════════ HERO ═══════════════════ -->
<div class="hero">
  <div class="hero-mesh"></div>
  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>
  <div class="orb orb-3"></div>
  <div class="hero-grid-lines"></div>
  <div class="hero-inner">
    <div>
      <div class="hero-eyebrow"><div class="live-dot"></div>Built for Insurance Companies</div>
      <h1>Turn Health Risk<br/>into <em>Claim Savings.</em></h1>
      <p class="hero-sub">GOQii healthEngage helps insurers proactively manage member health — reducing preventable claims, building loyalty and improving outcomes. Before the bill arrives.</p>
      <div class="hero-actions">
        <button id="hero-demo-btn" class="btn-primary"><span>Book a Business Demo</span></button>
        <button id="hero-video-btn" class="btn-outline">See How It Works →</button>
      </div>
    </div>
    <div class="hero-visual">
      <div class="hero-badge2">🏆 60+ NPS Uplift</div>
      <div class="hero-card-main">
        <div class="hcm-label">Platform Outcomes — Year 1</div>
        <div class="hcm-row">
          <div class="hcm-stat">
            <div class="hcm-num teal" data-count="40" data-suffix="%">0%</div>
            <div class="hcm-unit">Claim Cost Reduction</div>
          </div>
          <div class="hcm-stat">
            <div class="hcm-num" data-count="3" data-suffix="×">0×</div>
            <div class="hcm-unit">Member Engagement</div>
          </div>
        </div>
        <div class="hcm-bar-row">
          <div class="hcm-bar-label"><span>Preventable Claims Avoided</span><span style="color:var(--teal);font-weight:700">↑ 73%</span></div>
          <div class="hcm-bar"><div class="hcm-fill" style="--w:73%"></div></div>
        </div>
        <div class="hcm-bar-row" style="margin-top:.8rem">
          <div class="hcm-bar-label"><span>Chronic Patient Adherence</span><span style="color:var(--teal);font-weight:700">↑ 85%</span></div>
          <div class="hcm-bar"><div class="hcm-fill" style="--w:85%"></div></div>
        </div>
        <div class="hcm-bar-row" style="margin-top:.8rem">
          <div class="hcm-bar-label"><span>Active Member Engagement</span><span style="color:var(--teal);font-weight:700">↑ 68%</span></div>
          <div class="hcm-bar"><div class="hcm-fill" style="--w:68%"></div></div>
        </div>
      </div>
      <div class="hero-badge"><strong>28%</strong>Fewer Hospitalisations</div>
    </div>
  </div>
</div>

<!-- TRUST MARQUEE -->
<div class="trust-bar">
  <div class="trust-track">
    <div class="trust-item">🔒 HIPAA &amp; DPDPA Compliant</div><div class="trust-sep">·</div>
    <div class="trust-item">⚡ Go Live in 4–6 Weeks</div><div class="trust-sep">·</div>
    <div class="trust-item">🧩 Modular — Start with One Solution</div><div class="trust-sep">·</div>
    <div class="trust-item">🔗 Connects to Your Existing Systems</div><div class="trust-sep">·</div>
    <div class="trust-item">🏥 Trusted Across Insurance &amp; Healthcare</div><div class="trust-sep">·</div>
    <div class="trust-item">🎯 40% Avg Claim Reduction</div><div class="trust-sep">·</div>
    <div class="trust-item">🔒 HIPAA &amp; DPDPA Compliant</div><div class="trust-sep">·</div>
    <div class="trust-item">⚡ Go Live in 4–6 Weeks</div><div class="trust-sep">·</div>
    <div class="trust-item">🧩 Modular — Start with One Solution</div><div class="trust-sep">·</div>
    <div class="trust-item">🔗 Connects to Your Existing Systems</div><div class="trust-sep">·</div>
    <div class="trust-item">🏥 Trusted Across Insurance &amp; Healthcare</div><div class="trust-sep">·</div>
    <div class="trust-item">🎯 40% Avg Claim Reduction</div><div class="trust-sep">·</div>
  </div>
</div>

<!-- ═══════════════════ PROBLEM ═══════════════════ -->
<div class="problem-wrap">
  <div class="problem-inner">
    <div class="problem-grid">
      <div class="r from-left">
        <div class="section-label">The Challenge</div>
        <h2>Claim losses that were <em>predictable</em> — and preventable.</h2>
        <p class="section-sub">Most high-cost claims don't arrive without warning. Unmanaged chronic conditions, disengaged members and fragmented care create a ticking clock on your loss ratio.</p>
        <div class="insight-box">
          <strong>Industry Insight:</strong> Up to 80% of high-value medical claims relate to conditions that are identifiable and manageable months before hospitalisation.
        </div>
      </div>
      <div class="problem-cards r from-right">
        <div class="prob-card r rd1">
          <span class="prob-icon">📈</span>
          <div class="prob-title">Chronic Disease Burden</div>
          <div class="prob-text">Diabetes, hypertension and obesity drive the majority of avoidable hospital admissions in your book of business.</div>
          <div class="prob-arrow">↑ Rising every year</div>
        </div>
        <div class="prob-card r rd2">
          <span class="prob-icon">😴</span>
          <div class="prob-title">Low Member Engagement</div>
          <div class="prob-text">Most wellness programmes see drop-off within weeks. Members only interact when they're already sick.</div>
          <div class="prob-arrow">↓ NPS declining</div>
        </div>
        <div class="prob-card r rd3">
          <span class="prob-icon">🔗</span>
          <div class="prob-title">Fragmented Care</div>
          <div class="prob-text">Hospitals, employers, pharmacies and your systems all operate in silos. No unified picture of member risk.</div>
          <div class="prob-arrow">↓ Missed interventions</div>
        </div>
        <div class="prob-card r rd4">
          <span class="prob-icon">🏃</span>
          <div class="prob-title">No Retention Story</div>
          <div class="prob-text">Members renew based on price alone. There's no ongoing value, no loyalty, and no differentiation.</div>
          <div class="prob-arrow">↑ Churn risk</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════ PLATFORM ═══════════════════ -->
<div id="platform">
  <div class="section-wrap">
    <div class="platform-grid">
      <!-- Animated SVG Ecosystem -->
      <div class="eco-vis r from-left">
        <svg class="eco-svg" viewBox="0 0 440 440" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Background circle rings -->
          <circle cx="220" cy="220" r="180" stroke="rgba(0,201,160,.08)" stroke-width="1" stroke-dasharray="6 4"/>
          <circle cx="220" cy="220" r="130" stroke="rgba(0,201,160,.12)" stroke-width="1" stroke-dasharray="6 4"/>
          <circle cx="220" cy="220" r="75" stroke="rgba(0,201,160,.18)" stroke-width="1"/>
          <!-- Animated rotating ring -->
          <circle cx="220" cy="220" r="155" stroke="rgba(0,201,160,.15)" stroke-width="1.5" stroke-dasharray="12 8">
            <animateTransform attributeName="transform" type="rotate" from="0 220 220" to="360 220 220" dur="30s" repeatCount="indefinite"/>
          </circle>
          <!-- Connector lines (spokes) -->
          <g stroke="rgba(0,201,160,.25)" stroke-width="1" stroke-dasharray="4 4">
            <line x1="220" y1="145" x2="220" y2="55"/>
            <line x1="286" y1="163" x2="360" y2="100"/>
            <line x1="295" y1="220" x2="385" y2="220"/>
            <line x1="286" y1="277" x2="360" y2="340"/>
            <line x1="220" y1="295" x2="220" y2="385"/>
            <line x1="154" y1="277" x2="80" y2="340"/>
            <line x1="145" y1="220" x2="55" y2="220"/>
            <line x1="154" y1="163" x2="80" y2="100"/>
          </g>
          <!-- Animated data pulses along spokes -->
          <circle r="4" fill="var(--teal)" opacity=".8">
            <animateMotion dur="2.5s" repeatCount="indefinite" begin="0s">
              <mpath href="#spoke1"/>
            </animateMotion>
          </circle>
          <circle r="4" fill="var(--teal)" opacity=".8">
            <animateMotion dur="2.5s" repeatCount="indefinite" begin="0.6s">
              <mpath href="#spoke3"/>
            </animateMotion>
          </circle>
          <circle r="4" fill="var(--amber)" opacity=".8">
            <animateMotion dur="2.5s" repeatCount="indefinite" begin="1.2s">
              <mpath href="#spoke5"/>
            </animateMotion>
          </circle>
          <circle r="4" fill="var(--teal)" opacity=".8">
            <animateMotion dur="2.5s" repeatCount="indefinite" begin="1.8s">
              <mpath href="#spoke7"/>
            </animateMotion>
          </circle>
          <!-- Invisible paths for motion -->
          <path id="spoke1" d="M220 145 L220 55" visibility="hidden"/>
          <path id="spoke3" d="M295 220 L385 220" visibility="hidden"/>
          <path id="spoke5" d="M220 295 L220 385" visibility="hidden"/>
          <path id="spoke7" d="M145 220 L55 220" visibility="hidden"/>
          <!-- Center node -->
          <circle cx="220" cy="220" r="68" fill="#07192e" filter="url(#glow)"/>
          <circle cx="220" cy="220" r="68" fill="url(#center-grad)"/>
          <text x="220" y="213" text-anchor="middle" fill="white" font-family="Fraunces,serif" font-size="13" font-weight="800">GOQii</text>
          <text x="220" y="230" text-anchor="middle" fill="rgba(0,240,194,.9)" font-family="Fraunces,serif" font-size="11" font-weight="700">healthEngage</text>
          <text x="220" y="246" text-anchor="middle" fill="rgba(255,255,255,.4)" font-family="Plus Jakarta Sans,sans-serif" font-size="8" font-weight="600">CONNECTED CARE</text>
          <!-- Outer nodes -->
          <!-- Top -->
          <circle cx="220" cy="42" r="28" fill="white" stroke="rgba(0,201,160,.3)" stroke-width="1.5"/>
          <g transform="translate(210, 24)">
            ${renderToString(<Building2 color="#0f2236" size={20} />)}
          </g>
          <text x="220" y="54" text-anchor="middle" fill="#0f2236" font-family="Plus Jakarta Sans,sans-serif" font-size="7" font-weight="700">HOSPITALS</text>
          <!-- Top right -->
          <circle cx="368" cy="93" r="28" fill="white" stroke="rgba(0,201,160,.3)" stroke-width="1.5"/>
          <g transform="translate(358, 75)">
            ${renderToString(<Briefcase color="#0f2236" size={20} />)}
          </g>
          <text x="368" y="105" text-anchor="middle" fill="#0f2236" font-family="Plus Jakarta Sans,sans-serif" font-size="7" font-weight="700">EMPLOYERS</text>
          <!-- Right -->
          <circle cx="398" cy="220" r="28" fill="white" stroke="rgba(0,201,160,.3)" stroke-width="1.5"/>
          <g transform="translate(388, 202)">
            ${renderToString(<Watch color="#0f2236" size={20} />)}
          </g>
          <text x="398" y="232" text-anchor="middle" fill="#0f2236" font-family="Plus Jakarta Sans,sans-serif" font-size="7" font-weight="700">WEARABLES</text>
          <!-- Bottom right -->
          <circle cx="368" cy="347" r="28" fill="white" stroke="rgba(245,166,35,.35)" stroke-width="1.5"/>
          <g transform="translate(358, 329)">
            ${renderToString(<Pill color="#0f2236" size={20} />)}
          </g>
          <text x="368" y="359" text-anchor="middle" fill="#0f2236" font-family="Plus Jakarta Sans,sans-serif" font-size="7" font-weight="700">PHARMACY</text>
          <!-- Bottom -->
          <circle cx="220" cy="398" r="28" fill="white" stroke="rgba(0,201,160,.3)" stroke-width="1.5"/>
          <g transform="translate(210, 380)">
            ${renderToString(<Smartphone color="#0f2236" size={20} />)}
          </g>
          <text x="220" y="410" text-anchor="middle" fill="#0f2236" font-family="Plus Jakarta Sans,sans-serif" font-size="7" font-weight="700">MEMBER APP</text>
          <!-- Bottom left -->
          <circle cx="72" cy="347" r="28" fill="white" stroke="rgba(0,201,160,.3)" stroke-width="1.5"/>
          <g transform="translate(62, 329)">
            ${renderToString(<Microscope color="#0f2236" size={20} />)}
          </g>
          <text x="72" y="359" text-anchor="middle" fill="#0f2236" font-family="Plus Jakarta Sans,sans-serif" font-size="7" font-weight="700">DIAGNOSTICS</text>
          <!-- Left -->
          <circle cx="42" cy="220" r="28" fill="white" stroke="rgba(0,201,160,.3)" stroke-width="1.5"/>
          <g transform="translate(32, 202)">
            ${renderToString(<Stethoscope color="#0f2236" size={20} />)}
          </g>
          <text x="42" y="232" text-anchor="middle" fill="#0f2236" font-family="Plus Jakarta Sans,sans-serif" font-size="7" font-weight="700">COACHES</text>
          <!-- Top left -->
          <circle cx="72" cy="93" r="28" fill="white" stroke="rgba(0,201,160,.3)" stroke-width="1.5"/>
          <g transform="translate(62, 75)">
            ${renderToString(<ClipboardList color="#0f2236" size={20} />)}
          </g>
          <text x="72" y="105" text-anchor="middle" fill="#0f2236" font-family="Plus Jakarta Sans,sans-serif" font-size="7" font-weight="700">POLICY SYS</text>
          <!-- Defs -->
          <defs>
            <radialGradient id="center-grad" cx="50%" cy="40%">
              <stop offset="0%" stop-color="#163354"/>
              <stop offset="100%" stop-color="#07192e"/>
            </radialGradient>
            <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
        </svg>
      </div>
      <div class="r from-right rd1">
        <div class="section-label">The Platform</div>
        <h2>One platform.<br/>Your entire <em>ecosystem</em><br/>connected.</h2>
        <p class="section-sub">GOQii healthEngage is the intelligent hub between every partner in your care ecosystem — giving you a real-time picture of member health risk and the tools to act on it.</p>
        <div class="platform-checks">
          <div class="pcheck">
            <div class="pcheck-icon">${renderToString(<Eye color="#00c9a0" size={24} />)}</div>
            <div>
              <div class="pcheck-title">One View of Every Member</div>
              <div class="pcheck-text">Health data, risk scores, care pathways and engagement — unified in a single dashboard.</div>
            </div>
          </div>
          <div class="pcheck">
            <div class="pcheck-icon">${renderToString(<Target color="#00c9a0" size={24} />)}</div>
            <div>
              <div class="pcheck-title">Act Before Claims Happen</div>
              <div class="pcheck-text">Predictive risk signals identify high-risk members weeks before an expensive claim materialises.</div>
            </div>
          </div>
          <div class="pcheck">
            <div class="pcheck-icon">${renderToString(<Puzzle color="#00c9a0" size={24} />)}</div>
            <div>
              <div class="pcheck-title">Modular — Start Where It Matters</div>
              <div class="pcheck-text">Deploy the solution that addresses your most pressing need first. Expand at your own pace.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════ MODULES ═══════════════════ -->
<div class="modules-bg" id="modules">
  <div class="section-wrap">
    <div class="modules-header r">
      <div class="section-label">Solutions</div>
      <h2>Four solutions. One <em>platform.</em><br/>Deploy what you need most.</h2>
      <p class="section-sub">Each module is fully standalone yet shares the same member data and engagement engine — combining them multiplies the impact.</p>
    </div>
    <div class="modules-scroll-wrap">
      <div class="mod-card r rd1">
        <div class="mod-top-line tl-teal"></div>
        <img src="https://appcdn.goqii.com/storeimg/86158_1773991269.png" class="mod-img" alt="Population Health" referrerPolicy="no-referrer" />
        <div class="mod-header">
          <div class="mod-icon mg">🫀</div>
          <div class="mod-title">Population Health Management</div>
        </div>
        <div class="mod-desc">Get a clear, real-time picture of health risk across your entire insured population. Identify who needs intervention — and when — before a claim is filed.</div>
        <div class="mod-outcomes">
          <div class="mo"><div class="mo-arrow">→</div>Identify high-risk members months before hospitalisation</div>
          <div class="mo"><div class="mo-arrow">→</div>Reduce loss ratio with proactive outreach</div>
          <div class="mo"><div class="mo-arrow">→</div>Segment your population for targeted programmes</div>
        </div>
      </div>
      <div class="mod-card r rd2">
        <div class="mod-top-line tl-navy"></div>
        <div class="mod-badge bi">Highest ROI</div>
        <img src="https://appcdn.goqii.com/storeimg/35830_1773999087.png" class="mod-img" alt="Chronic Care" referrerPolicy="no-referrer" />
        <div class="mod-header">
          <div class="mod-icon mb">💊</div>
          <div class="mod-title">Chronic Patient Care</div>
        </div>
        <div class="mod-desc">Structured care pathways for your highest-cost members — diabetes, hypertension, obesity, heart disease. Keep them monitored, medicated and engaged.</div>
        <div class="mod-outcomes">
          <div class="mo"><div class="mo-arrow">→</div>85% medication adherence in active cohorts</div>
          <div class="mo"><div class="mo-arrow">→</div>28% fewer chronic disease hospitalisations</div>
          <div class="mo"><div class="mo-arrow">→</div>Regular health coach touchpoints — automated</div>
        </div>
      </div>
      <div class="mod-card r rd3">
        <div class="mod-top-line tl-amber"></div>
        <img src="https://appcdn.goqii.com/storeimg/61884_1773999094.png" class="mod-img" alt="Corporate Wellness" referrerPolicy="no-referrer" />
        <div class="mod-header">
          <div class="mod-icon ma">🏢</div>
          <div class="mod-title">Corporate Employee Wellness</div>
        </div>
        <div class="mod-desc">Deliver tangible wellness value to your corporate group accounts. Give HR teams dashboards, run team challenges and demonstrate measurable ROI of health coverage.</div>
        <div class="mod-outcomes">
          <div class="mo"><div class="mo-arrow">→</div>Strengthen relationships with group accounts</div>
          <div class="mo"><div class="mo-arrow">→</div>Real ROI reporting for HR and CFO audiences</div>
          <div class="mo"><div class="mo-arrow">→</div>Team challenges employees actually participate in</div>
        </div>
      </div>
      <div class="mod-card r rd4">
        <div class="mod-top-line tl-rose"></div>
        <img src="https://appcdn.goqii.com/storeimg/92748_1773999731.png" class="mod-img" alt="Medical Services" referrerPolicy="no-referrer" />
        <div class="mod-header">
          <div class="mod-icon mr">🏥</div>
          <div class="mod-title">Managed Medical Services</div>
        </div>
        <div class="mod-desc">Guide members to the right care at the right cost. Telehealth, diagnostics, pharmacy and specialist routing — reduce unnecessary emergency visits.</div>
        <div class="mod-outcomes">
          <div class="mo"><div class="mo-arrow">→</div>Reduce unnecessary ER and specialist visits</div>
          <div class="mo"><div class="mo-arrow">→</div>Connected pharmacy and lab fulfilment</div>
          <div class="mo"><div class="mo-arrow">→</div>Cost-appropriate care routing, every time</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════ DEPLOY ═══════════════════ -->
<div>
  <div class="section-wrap">
    <div class="deploy-grid">
      <div class="r from-left">
        <div class="section-label">Flexible Deployment</div>
        <h2>Start with one.<br/><em>Scale</em> as you prove value.</h2>
        <p class="section-sub" style="margin-bottom:2.5rem">GOQii healthEngage is designed for a low-risk, phased approach — proving ROI at every step before you expand.</p>
        <div class="dep-steps">
          <div class="dep-line" id="dep-line"></div>
          <div class="dep-step" style="transition-delay:.1s">
            <div class="dep-num">1</div>
            <div>
              <div class="dep-title">Assess Your Priority</div>
              <div class="dep-desc">Our team analyses your claims data and identifies the highest-value intervention opportunity in your population.</div>
            </div>
          </div>
          <div class="dep-step" style="transition-delay:.25s">
            <div class="dep-num">2</div>
            <div>
              <div class="dep-title">Choose Your First Module</div>
              <div class="dep-desc">Select the solution that addresses your most urgent business goal. No obligation to deploy everything at once.</div>
            </div>
          </div>
          <div class="dep-step" style="transition-delay:.4s">
            <div class="dep-num">3</div>
            <div>
              <div class="dep-title">Connect to Your Systems</div>
              <div class="dep-desc">Our team handles the integration. Go live in 4–6 weeks — without large internal IT resource commitments.</div>
            </div>
          </div>
          <div class="dep-step" style="transition-delay:.55s">
            <div class="dep-num">4</div>
            <div>
              <div class="dep-title">Measure, Expand, Repeat</div>
              <div class="dep-desc">Track outcomes on a live dashboard. Use the results to build the business case for your next module.</div>
            </div>
          </div>
        </div>
      </div>
      <div class="module-picker r from-right rd2">
        <div class="mp-heading">👇 Select the modules you need:</div>
        <div class="mp-item on" id="mod-phm">
          <span>🫀&nbsp; Population Health Management</span>
          <div class="mp-toggle">✓</div>
        </div>
        <div class="mp-item on" id="mod-cpc">
          <span>💊&nbsp; Chronic Patient Care</span>
          <div class="mp-toggle">✓</div>
        </div>
        <div class="mp-item" id="mod-cew">
          <span>🏢&nbsp; Corporate Employee Wellness</span>
          <div class="mp-toggle"></div>
        </div>
        <div class="mp-item" id="mod-mms">
          <span>🏥&nbsp; Managed Medical Services</span>
          <div class="mp-toggle"></div>
        </div>
        <div class="mp-note" id="picker-note">✓ 2 modules selected — All share one unified member data &amp; rewards layer</div>
        <a href="#cta" class="mp-cta"><span>Talk to Us About This Combination →</span></a>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════ HOW IT WORKS — DARK SECTION ═══════════════════ -->
<div class="hiw-wrap" id="how">
  <div class="hiw-bg-pattern"></div>
  <div class="hiw-glow"></div>
  <div class="hiw-inner">
    <div class="r">
      <div class="section-label">How It Works</div>
      <h2>From data to <em>health outcomes</em> in four steps.</h2>
      <p class="hiw-sub">No complex transformation required. GOQii healthEngage works alongside your existing operations — amplifying what you already have.</p>
    </div>
    <div class="hiw-steps r">
      <div class="hiw-connector"></div>
      <div class="hiw-step rd1">
        <div class="hiw-num">01</div>
        <span class="hiw-icon">🔗</span>
        <div class="hiw-title">Connect &amp; Unify</div>
        <div class="hiw-desc">We connect to your existing data sources — claims, policy records, member profiles — and create a single health picture per member.</div>
      </div>
      <div class="hiw-step rd2">
        <div class="hiw-num">02</div>
        <span class="hiw-icon">🎯</span>
        <div class="hiw-title">Identify &amp; Prioritise</div>
        <div class="hiw-desc">Our platform risk-scores your population and surfaces who needs attention now — so your team focuses where it matters most.</div>
      </div>
      <div class="hiw-step rd3">
        <div class="hiw-num">03</div>
        <span class="hiw-icon">💚</span>
        <div class="hiw-title">Engage &amp; Support</div>
        <div class="hiw-desc">Members receive personalised journeys, coach support, gamified challenges and real rewards — sustaining daily healthy habits.</div>
      </div>
      <div class="hiw-step rd4">
        <div class="hiw-num">04</div>
        <span class="hiw-icon">📊</span>
        <div class="hiw-title">Measure &amp; Report</div>
        <div class="hiw-desc">Live dashboards track claim savings, member engagement, NPS improvement and health outcomes — clear business ROI.</div>
      </div>
    </div>
    <div class="hiw-outcome r">
      <span style="font-size:1.5rem">🎯</span>
      <span>The result: Members who are healthier, more engaged and less likely to file high-cost claims — a better business outcome and a better member experience, simultaneously.</span>
    </div>
  </div>
</div>

<!-- ═══════════════════ ENGAGEMENT — PHONE + FEATURES ═══════════════════ -->
<div class="engage-wrap" id="engagement">
  <div class="section-wrap">
    <div class="engage-grid">
      <div class="r from-left">
        <div class="section-label">Member Engagement</div>
        <h2>Engagement that keeps<br/>members <em>coming back</em><br/>— not just claiming.</h2>
        <img src="https://appcdn.goqii.com/storeimg/95209_1774001193.png" class="engage-img" alt="Member Engagement" referrerPolicy="no-referrer" />
        <p class="section-sub" style="margin-bottom:2rem">GOQii's fully gamified experience creates daily habits, real rewards and a genuine reason to stay with your brand.</p>
        <div class="engage-features">
          <div class="ef-card">
            <span class="ef-icon">🏆</span>
            <div>
              <div class="ef-title">Points, Streaks &amp; Leaderboards</div>
              <div class="ef-desc">Members earn rewards for every healthy action — steps, sleep, health checks — redeemable for real benefits including premium discounts.</div>
            </div>
          </div>
          <div class="ef-card">
            <span class="ef-icon">🎯</span>
            <div>
              <div class="ef-title">Personalised Daily Challenges</div>
              <div class="ef-desc">Every member receives challenges matched to their health profile and risk level — making the programme feel personal, not generic.</div>
            </div>
          </div>
          <div class="ef-card">
            <span class="ef-icon">🧑‍⚕️</span>
            <div>
              <div class="ef-title">Human Health Coaching</div>
              <div class="ef-desc">Certified health coaches provide regular check-ins — automated at scale, but deeply personal in experience.</div>
            </div>
          </div>
          <div class="ef-card">
            <span class="ef-icon">🎁</span>
            <div>
              <div class="ef-title">Rewards Tied to Outcomes</div>
              <div class="ef-desc">Rewards are linked to verifiable health improvements, not just participation — ensuring your investment drives actual change.</div>
            </div>
          </div>
        </div>
      </div>
      <div class="phone-outer r from-right">
        <!-- Floating notification cards -->
        <div class="notif-card notif-1"><span class="notif-dot"></span>Challenge complete — +50 pts 🎉</div>
        <div class="notif-card notif-2"><span class="notif-dot"></span>Health score improved +4 📈</div>
        <div class="phone-wrap">
          <div class="phone-top">
            <div style="display:flex;gap:.8rem;align-items:center">
              <img src="https://picsum.photos/seed/priya-avatar/100/100" class="p-avatar" alt="Priya" referrerPolicy="no-referrer" />
              <div class="p-greeting">Good morning, Priya 👋<strong>Your health today</strong></div>
            </div>
            <div class="health-score"><div class="hs-num">82</div><div class="hs-label">Health Score</div></div>
          </div>
          <div class="streak-banner">
            <span>🔥</span>
            <div><strong>14-Day Streak!</strong><span>Keep your momentum going</span></div>
          </div>
          <div style="font-size:.7rem;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:.55rem">Today's Challenges</div>
          <div class="ch-cards">
            <div class="ch-card">
              <div class="ch-icon">🚶</div>
              <div class="ch-pw"><div class="ch-name">Walk 8,000 Steps</div><div class="ch-pb"><div class="ch-pf" style="--pw:73%"></div></div></div>
              <div class="ch-pts">+50 pts</div>
            </div>
            <div class="ch-card">
              <div class="ch-icon">💧</div>
              <div class="ch-pw"><div class="ch-name">Stay Hydrated</div><div class="ch-pb"><div class="ch-pf" style="--pw:55%"></div></div></div>
              <div class="ch-pts">+20 pts</div>
            </div>
            <div class="ch-card">
              <div class="ch-icon">😴</div>
              <div class="ch-pw"><div class="ch-name">Sleep 7 Hours</div><div class="ch-pb"><div class="ch-pf" style="--pw:100%;background:var(--amber)"></div></div></div>
              <div class="ch-pts">✓ Done</div>
            </div>
            <div class="ch-card">
              <div class="ch-icon">🍎</div>
              <div class="ch-pw"><div class="ch-name">Healthy Meal Log</div><div class="ch-pb"><div class="ch-pf" style="--pw:30%"></div></div></div>
              <div class="ch-pts">+30 pts</div>
            </div>
          </div>
          <div class="reward-strip">
            <span>🎁</span>
            <div>Redeem <strong>5,000 pts</strong> → <strong>Premium Discount</strong></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════ ECOSYSTEM ═══════════════════ -->
<div class="eco-bg">
  <div class="section-wrap">
    <div class="r" style="text-align:center;max-width:580px;margin:0 auto">
      <div class="section-label">Connected Care</div>
      <h2>Every partner.<br/><em>One platform.</em></h2>
      <p class="section-sub" style="margin:0 auto">GOQii healthEngage connects your entire care ecosystem so members receive co-ordinated, continuous support.</p>
    </div>
    <div class="eco-full-grid">
      <div class="eco-full-card r rd1"><span class="ecf-icon">🏥</span><div class="ecf-title">Hospitals &amp; Clinics</div><div class="ecf-desc">Bi-directional clinical data, referral management and post-discharge care pathways</div></div>
      <div class="eco-full-card r rd2"><span class="ecf-icon">🏢</span><div class="ecf-title">Corporate Employers</div><div class="ecf-desc">Group wellness dashboards, HR reporting and team challenge management</div></div>
      <div class="eco-full-card r rd3"><span class="ecf-icon">💊</span><div class="ecf-title">Pharmacy Networks</div><div class="ecf-desc">Medication adherence monitoring, home delivery and prescription renewal flows</div></div>
      <div class="eco-full-card r rd1"><span class="ecf-icon">⌚</span><div class="ecf-title">Wearable Devices</div><div class="ecf-desc">20+ device integrations for continuous, passive biometric data collection</div></div>
      <div class="eco-full-card r rd2"><span class="ecf-icon">🔬</span><div class="ecf-title">Diagnostic Labs</div><div class="ecf-desc">At-home test kits, lab result ingestion and automated risk flag triggers</div></div>
      <div class="eco-full-card r rd3"><span class="ecf-icon">📱</span><div class="ecf-title">Your Member App</div><div class="ecf-desc">White-label ready — deploy under your brand within your existing member portal</div></div>
    </div>
  </div>
</div>

<!-- ═══════════════════ INTEGRATION ═══════════════════ -->
<div class="int-bg" id="connect">
  <div class="section-wrap">
    <div class="r" style="max-width:600px">
      <div class="section-label">Fits Into Your Journey</div>
      <h2>Works with your existing systems.<br/><em>No disruption.</em></h2>
      <p class="section-sub">GOQii healthEngage connects to your policy management, CRM and member portal — your digital transformation team will appreciate the simplicity.</p>
    </div>
    <div class="int-grid">
      <div class="int-hub r from-left">
        <div class="int-center">
          <div class="int-pulse"></div>
          <div class="logo" style="color:#fff;font-size:.95rem;justify-content:center">GOQii <span>healthEngage</span></div>
          <div class="sub" style="font-size:.7rem;color:rgba(255,255,255,.5);margin-top:.3rem">Your Connected Health Hub</div>
        </div>
        <div style="display:flex;justify-content:center;margin-bottom:1.2rem">
          <svg width="2" height="32"><line x1="1" y1="0" x2="1" y2="32" stroke="rgba(0,201,160,.5)" stroke-width="2" stroke-dasharray="4 4"><animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1s" repeatCount="indefinite"/></line></svg>
        </div>
        <div class="int-systems">
          <div class="int-sys"><div class="int-dot"></div>Policy Management</div>
          <div class="int-sys"><div class="int-dot"></div>CRM &amp; Member Portal</div>
          <div class="int-sys"><div class="int-dot"></div>Claims Systems</div>
          <div class="int-sys"><div class="int-dot"></div>HR &amp; Payroll</div>
          <div class="int-sys"><div class="int-dot"></div>Hospital Networks</div>
          <div class="int-sys"><div class="int-dot"></div>Your Mobile App</div>
        </div>
      </div>
      <div class="int-promises r from-right">
        <div class="int-promise rd1">
          <div class="ip-icon">🧩</div>
          <div><div class="ip-title">Plugs Into What You Have</div><div class="ip-desc">No need to rebuild your technology stack. We connect with minimal IT effort.</div></div>
        </div>
        <div class="int-promise rd2">
          <div class="ip-icon">🏷️</div>
          <div><div class="ip-title">Your Brand, Our Engine</div><div class="ip-desc">Full white-label capability. Members experience it as your own digital health product.</div></div>
        </div>
        <div class="int-promise rd3">
          <div class="ip-icon">⚡</div>
          <div><div class="ip-title">Live in 4–6 Weeks</div><div class="ip-desc">Our implementation team handles the heavy lifting — fast, without large IT resource commitments.</div></div>
        </div>
        <div class="int-promise rd1">
          <div class="ip-icon">🔒</div>
          <div><div class="ip-title">Enterprise Security &amp; Compliance</div><div class="ip-desc">HIPAA and DPDPA compliant. Full data governance and audit trails built in as standard.</div></div>
        </div>
        <div class="int-promise rd2">
          <div class="ip-icon">📈</div>
          <div><div class="ip-title">Scales With Your Ambition</div><div class="ip-desc">Start with 10,000 members or 10 million. The platform scales without re-architecture.</div></div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════ OUTCOMES — ANIMATED COUNTERS ═══════════════════ -->
<div class="outcomes-wrap">
  <div class="outcomes-mesh"></div>
  <div class="outcomes-inner">
    <div class="r">
      <div class="section-label">Proven Business Outcomes</div>
      <h2>Numbers that matter<br/>to your <em>business.</em></h2>
    </div>
    <div class="outcomes-grid r">
      <div class="out-card"><div class="out-num counter" data-target="40" data-suffix="%">0%</div><div class="out-label">Average reduction in preventable claim costs within 12 months</div></div>
      <div class="out-card"><div class="out-num">3.2<span style="font-size:2.5rem">×</span></div><div class="out-label">Higher sustained member engagement vs. traditional wellness programmes</div></div>
      <div class="out-card"><div class="out-num">+<span class="counter" data-target="62" data-suffix="">0</span></div><div class="out-label">NPS point uplift among members actively engaged on the platform</div></div>
      <div class="out-card"><div class="out-num counter" data-target="28" data-suffix="%">0%</div><div class="out-label">Fewer hospitalisations among members on chronic care pathways</div></div>
      <div class="out-card"><div class="out-num counter" data-target="85" data-suffix="%">0%</div><div class="out-label">Medication adherence rate among members enrolled in chronic care</div></div>
      <div class="out-card"><div class="out-num" style="font-size:2.8rem">4–6<span style="font-size:1.8rem;color:rgba(0,240,194,.6)">w</span></div><div class="out-label">Typical time from sign-off to a live, operational platform</div></div>
    </div>
  </div>
</div>

<!-- ═══════════════════ CTA — MORPHING GRADIENT ═══════════════════ -->
<div class="cta-wrap" id="cta">
  <div class="cta-inner r">
    <div class="section-label" style="display:flex;justify-content:center">Let's Talk</div>
    <h2>Ready to see what GOQii healthEngage<br/>can do for <em>your members?</em></h2>
    <p>Tell us your challenge — claims costs, engagement, chronic care or corporate wellness. We'll show you which modules deliver the fastest, clearest ROI for your book of business.</p>
    <div class="cta-actions">
      <button id="cta-demo-btn" class="btn-primary"><span>Book a Business Demo</span></button>
      <button id="cta-video-btn" class="btn-outline">See How It Works →</button>
    </div>
    <div class="cta-note">No commitment required <span>·</span> Live in 4–6 weeks <span>·</span> Modular — start small <span>·</span> Your brand, your experience</div>
  </div>
</div>

<!-- FOOTER -->
<footer>
  <div class="footer-logo"><img src="https://appcdn.goqii.com/storeimg/28249_1774003156.png" alt="GOQii healthEngage" class="footer-logo-img" referrerPolicy="no-referrer" /></div>
  <div>Population Health · Chronic Care · Corporate Wellness · Medical Services</div>
  <div>© 2025 GOQii Inc. All rights reserved.</div>
</footer>
    ` }} onClick={(e) => {
      const target = e.target as HTMLElement;
      const item = target.closest('.mp-item');
      if (item) {
        toggleModule({ currentTarget: item } as any);
      }
    }} />
    </div>
  );
}

