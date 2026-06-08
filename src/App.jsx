import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Catalog',     href: '#catalog' },
  { label: 'How It Works',href: '#process' },
  { label: 'White Label', href: '#whitelabel' },
  { label: 'Packaging ✦', href: '#packaging' },
  { label: 'About',       href: '#about' },
];

const TICKER_ITEMS = [
  'Drop-Ship Ready', 'White Label Programs', 'Functional Nutrition',
  'Beverages & Supplements', 'Food Ingredients', 'Zero Inventory Risk',
  'Industry Expert Curation', 'North America & Europe',
  'Food-Safe Packaging Inks', 'FDA & EU Compliant',
];

const CATEGORIES = [
  {
    icon: '⚡',
    name: 'Energy & Focus',
    count: '48+ SKUs',
    desc: 'Pre-formulated energy beverages, nootropic blends, and caffeine-based powders ready for private labeling.',
    tags: ['RTD', 'Powder', 'Nootropics'],
  },
  {
    icon: '💧',
    name: 'Hydration & Electrolytes',
    count: '32+ SKUs',
    desc: 'Sports hydration formats from stick packs to RTD — customizable electrolyte profiles and flavour systems.',
    tags: ['Stick Packs', 'RTD', 'Powder'],
  },
  {
    icon: '🌿',
    name: 'Functional Ingredients',
    count: '60+ SKUs',
    desc: 'Adaptogens, vitamin premixes, protein isolates, and bioactive ingredients for product formulation.',
    tags: ['Adaptogens', 'Vitamins', 'Proteins'],
  },
  {
    icon: '🥤',
    name: 'Beverage Bases',
    count: '24+ SKUs',
    desc: 'Shelf-stable concentrates, kombucha bases, cold brew formats, and ready-to-label finished goods.',
    tags: ['Concentrates', 'Cold Brew', 'Kombucha'],
  },
  {
    icon: '💊',
    name: 'Supplement Formats',
    count: '75+ SKUs',
    desc: 'Capsules, softgels, gummies, and powder sachets with white-label packaging from verified manufacturers.',
    tags: ['Capsules', 'Gummies', 'Sachets'],
  },
  {
    icon: '🌾',
    name: 'Better-For-You Food',
    count: '30+ SKUs',
    desc: 'Functional snacks, protein bars, and specialty food components for retail and foodservice channels.',
    tags: ['Snacks', 'Bars', 'Foodservice'],
  },
];

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Browse & Select',
    text: 'Access our curated catalog of nutrition and beverage SKUs, all pre-qualified for drop-ship fulfillment.',
    icon: '🔍',
  },
  {
    num: '02',
    title: 'Apply Your Brand',
    text: 'White-label products with your logo and packaging, or sell existing branded SKUs as an authorised reseller.',
    icon: '🏷️',
  },
  {
    num: '03',
    title: 'Take Orders',
    text: 'Sell through your website, marketplace, or direct channel. We integrate with major e-commerce platforms.',
    icon: '🛒',
  },
  {
    num: '04',
    title: 'We Ship Direct',
    text: 'Orders route directly to fulfillment partners. Product ships branded as yours. You keep the margin.',
    icon: '📦',
  },
];

const VALUE_PROPS = [
  {
    icon: '🎓',
    title: 'Industry Expertise',
    text: 'Curated by professionals with deep roots in food, beverage, and nutritional sectors — not a generic catalog.',
  },
  {
    icon: '📦',
    title: 'True Drop-Ship',
    text: 'Zero stock commitment. Orders fulfilled direct from our supplier network, no minimum inventory required.',
  },
  {
    icon: '🏷️',
    title: 'White Label Ready',
    text: 'Launch your nutrition brand quickly. We handle supplier coordination, compliance docs, and branded packaging.',
  },
  {
    icon: '✅',
    title: 'Compliance Covered',
    text: 'All products sourced with current SDS, CoA, and regulatory compliance for North American and European markets.',
  },
  {
    icon: '🔗',
    title: 'Platform Integrations',
    text: 'Shopify, WooCommerce, and API access for custom storefronts. Automated order routing from day one.',
  },
  {
    icon: '💬',
    title: 'Dedicated Support',
    text: 'Formulation advice, supplier introductions, and regulatory guidance from your industry-insider partner team.',
  },
];

const SUPPLIERS = [
  'Gemini Nutraceuticals', 'NutraStar', 'Robinson Pharma',
  'Glanbia Nutritionals', 'Iovate Health', 'Prinova Group',
];

// ─── HOOKS ───────────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────

function SectionTag({ children }) {
  return (
    <div className="section-tag">
      <span className="section-tag__line" />
      {children}
    </div>
  );
}

function BtnPrimary({ href, children, onClick }) {
  return (
    <a href={href} className="btn-primary" onClick={onClick}>
      {children}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </a>
  );
}

function BtnGhost({ href, children }) {
  return <a href={href} className="btn-ghost">{children}</a>;
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <a href="#top" className="nav-logo">
        UPTIME<span>PARTS</span>HUB
      </a>

      <ul className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`}>
        {NAV_LINKS.map(l => (
          <li key={l.label}>
            <a href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
          </li>
        ))}
      </ul>

      <div className="nav-right">
        <BtnPrimary href="#contact">Partner Access</BtnPrimary>
        <button
          className={`nav-burger ${menuOpen ? 'nav-burger--open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-left">
        <div className="eyebrow">
          <span className="eyebrow__dot" />
          B2B Supply Platform
        </div>
        <h1>
          FUEL<br />
          <em>YOUR</em><br />
          BRAND.
        </h1>
        <p className="hero-sub">
          Drop-ship and white-label nutrition, functional food, and beverage
          components — sourced by industry insiders, delivered without inventory risk.
        </p>
        <div className="hero-actions">
          <BtnPrimary href="#catalog">Browse Catalog</BtnPrimary>
          <BtnGhost href="#contact">White Label Enquiry</BtnGhost>
        </div>
        <div className="hero-trust">
          <span>Trusted by brands in</span>
          <strong>NA</strong>
          <span>&amp;</span>
          <strong>EU</strong>
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-grid-bg" />
        <div className="hero-visual">
          {/* Floating stat cards */}
          <div className="stat-card stat-card--1">
            <div className="stat-num">0%</div>
            <div className="stat-label">Inventory Risk</div>
          </div>
          <div className="stat-card stat-card--2">
            <div className="stat-num">48H</div>
            <div className="stat-label">Avg. Dispatch</div>
          </div>
          <div className="stat-card stat-card--3">
            <div className="stat-num">MOQ1</div>
            <div className="stat-label">Min. Order</div>
          </div>

          {/* Orbital diagram */}
          <div className="orbit orbit--outer" />
          <div className="orbit orbit--mid" />
          <div className="hex-core">
            <div className="hex-label">ZERO<br />STOCK</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TICKER ───────────────────────────────────────────────────────────────────

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="ticker">
      <div className="ticker-track">
        {items.map((item, i) => (
          <React.Fragment key={i}>
            <span className="ticker-item">{item}</span>
            <span className="ticker-sep">✦</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

function Categories() {
  const [ref, visible] = useInView();
  const [active, setActive] = useState(null);

  return (
    <section className="section categories" id="catalog" ref={ref}>
      <div className={`section-intro ${visible ? 'is-visible' : ''}`}>
        <div>
          <SectionTag>Product Categories</SectionTag>
          <h2>THE PARTS THAT<br />POWER PERFORMANCE</h2>
        </div>
        <p className="section-desc">
          Curated by food &amp; beverage industry professionals. Every SKU is
          drop-ship enabled — no warehousing, no upfront capital, just your
          brand on proven products.
        </p>
      </div>

      <div className={`cat-grid ${visible ? 'is-visible' : ''}`}>
        {CATEGORIES.map((cat, i) => (
          <div
            key={cat.name}
            className={`cat-card ${active === i ? 'cat-card--active' : ''}`}
            style={{ animationDelay: `${i * 0.07}s` }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <div className="cat-card__accent" />
            <span className="cat-icon">{cat.icon}</span>
            <div className="cat-name">{cat.name}</div>
            <div className="cat-count">{cat.count}</div>
            <p className="cat-text">{cat.desc}</p>
            <div className="cat-tags">
              {cat.tags.map(t => (
                <span key={t} className="cat-tag">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── PROCESS ──────────────────────────────────────────────────────────────────

function Process() {
  const [ref, visible] = useInView();
  return (
    <section className="section process" id="process" ref={ref}>
      <div className={`${visible ? 'is-visible' : ''}`}>
        <SectionTag>The Process</SectionTag>
        <h2>ZERO INVENTORY.<br />FULL BRAND.</h2>
      </div>

      <div className={`steps ${visible ? 'is-visible' : ''}`}>
        {PROCESS_STEPS.map((s, i) => (
          <div key={s.num} className="step" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="step-connector" />
            <div className="step-num">{s.num}</div>
            <div className="step-icon">{s.icon}</div>
            <div className="step-title">{s.title}</div>
            <p className="step-text">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── WHITE LABEL ──────────────────────────────────────────────────────────────

function WhiteLabel() {
  const [ref, visible] = useInView();
  return (
    <section className="section whitelabel" id="whitelabel" ref={ref}>
      <div className={`wl-inner ${visible ? 'is-visible' : ''}`}>
        <div className="wl-left">
          <SectionTag>White Label Program</SectionTag>
          <h2>YOUR BRAND.<br />OUR SUPPLY CHAIN.</h2>
          <p className="wl-text">
            You bring the vision — we handle sourcing, compliance, co-manufacturer
            coordination, and branded packaging. Launch a private-label nutrition
            line in weeks, not months, with zero upfront inventory commitment.
          </p>
          <ul className="wl-list">
            {[
              'Minimum order from 1 unit on select lines',
              'Custom label design support available',
              'Certificate of Analysis (CoA) on every lot',
              'FDA / Health Canada / EU regulatory guidance',
              'Shopify & WooCommerce fulfillment integration',
            ].map(item => (
              <li key={item}>
                <span className="wl-check">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <BtnPrimary href="#contact">Start Your White Label Enquiry</BtnPrimary>
        </div>

        <div className="wl-right">
          <div className="wl-card">
            <div className="wl-card__header">
              <span className="wl-card__tag">PARTNER TIER</span>
              <span className="wl-card__badge">FREE TO JOIN</span>
            </div>
            {[
              ['Catalog Access', '✓'],
              ['Drop-Ship Fulfillment', '✓'],
              ['White Label Program', '✓'],
              ['Compliance Docs', '✓'],
              ['Platform Integration', '✓'],
              ['Dedicated Account Rep', '✓'],
            ].map(([label, val]) => (
              <div key={label} className="wl-row">
                <span className="wl-row__label">{label}</span>
                <span className="wl-row__val">{val}</span>
              </div>
            ))}
            <a href="#contact" className="wl-apply">Apply for Partner Access →</a>
          </div>

          <div className="wl-suppliers">
            <div className="wl-suppliers__label">Verified Supplier Network</div>
            <div className="wl-suppliers__list">
              {SUPPLIERS.map(s => (
                <span key={s} className="wl-supplier">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── VALUE PROPS ──────────────────────────────────────────────────────────────

function ValueProps() {
  const [ref, visible] = useInView();
  return (
    <section className="section values" ref={ref}>
      <div className={`${visible ? 'is-visible' : ''}`}>
        <SectionTag>Why UptimePartsHub</SectionTag>
        <h2>BUILT BY INSIDERS.<br />FOR BUILDERS.</h2>
      </div>

      <div className={`value-grid ${visible ? 'is-visible' : ''}`}>
        {VALUE_PROPS.map((v, i) => (
          <div key={v.title} className="value-item" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="value-icon">{v.icon}</div>
            <div>
              <div className="value-title">{v.title}</div>
              <p className="value-text">{v.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────

function About() {
  const [ref, visible] = useInView();
  return (
    <section className="section about" id="about" ref={ref}>
      <div className={`about-inner ${visible ? 'is-visible' : ''}`}>
        <div className="about-left">
          <SectionTag>About</SectionTag>
          <h2>INDUSTRY ROOTS.<br />SUPPLY CHAIN<br />EXPERTISE.</h2>
          <div className="about-divider" />
          <p>
            UptimePartsHub was founded by professionals with deep operational
            experience in the food, beverage, and nutritional sectors. We saw
            firsthand how hard it is to launch or scale a nutrition brand without
            warehouse space, massive capital, or a black book of manufacturer contacts.
          </p>
          <p>
            Our platform solves exactly that — connecting emerging brands and
            resellers to a vetted drop-ship and white-label supply network, with
            the compliance, logistics, and formulation expertise to back it up.
          </p>
          <p>
            We operate across North America and Europe, and we grow when you grow.
          </p>
        </div>
        <div className="about-right">
          <div className="about-stat-grid">
            {[
              ['200+', 'SKUs Ready to Ship'],
              ['48H',  'Avg. Dispatch Time'],
              ['2',    'Markets Served (NA & EU)'],
              ['0',    'Min. Inventory Required'],
            ].map(([num, label]) => (
              <div key={label} className="about-stat">
                <div className="about-stat__num">{num}</div>
                <div className="about-stat__label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────

function Contact() {
  const [ref, visible] = useInView();
  const [form, setForm] = useState({ name: '', company: '', email: '', interest: 'dropship', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError(false);
    try {
      const res = await fetch('https://formspree.io/f/mvznaoew', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Form submission failed');
      setSent(true);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <section className="section contact" id="contact" ref={ref}>
      <div className={`contact-inner ${visible ? 'is-visible' : ''}`}>
        <div className="contact-left">
          <SectionTag>Get Started</SectionTag>
          <h2>PARTNER WITH<br />UPTIMEPARTSHUB</h2>
          <p className="contact-sub">
            Whether you're looking to drop-ship existing brands or launch your own
            white-label line, fill in the form and we'll be in touch within 1 business day.
          </p>
          <div className="contact-info">
            <div className="contact-info__item">
              <span>✉</span>
              <a href="mailto:hello@uptimepartshub.com">hello@uptimepartshub.com</a>
            </div>
            <div className="contact-info__item">
              <span>🌐</span>
              <span>uptimepartshub.com</span>
            </div>
          </div>
        </div>

        <div className="contact-right">
          {sent ? (
            <div className="contact-success">
              <div className="contact-success__icon">✓</div>
              <div className="contact-success__title">We've received your enquiry!</div>
              <p>We'll be in touch within 1 business day.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <label>Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                </div>
                <div className="form-field">
                  <label>Company</label>
                  <input name="company" value={form.company} onChange={handleChange} placeholder="Your brand / company" />
                </div>
              </div>
              <div className="form-field">
                <label>Email Address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@yourcompany.com" required />
              </div>
              <div className="form-field">
                <label>I'm interested in</label>
                <select name="interest" value={form.interest} onChange={handleChange}>
                  <option value="dropship">Drop-Ship Reselling</option>
                  <option value="whitelabel">White Label Program</option>
                  <option value="ingredients">Ingredient Sourcing</option>
                  <option value="both">Both Drop-Ship &amp; White Label</option>
                  <option value="other">Other / General Enquiry</option>
                </select>
              </div>
              <div className="form-field">
                <label>Message (optional)</label>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us about your brand or what you're looking for..." rows={4} />
              </div>
              <button type="submit" className="btn-submit">
                Send Enquiry
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {error && <p className="contact-error">Something went wrong sending your enquiry. Please try again or email us directly.</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── CTA BAND ─────────────────────────────────────────────────────────────────

function CtaBand() {
  return (
    <div className="cta-band">
      <div className="cta-band__text">
        <h2>READY TO BUILD YOUR BRAND?</h2>
        <p>Partner access is free. Start browsing the catalog today.</p>
      </div>
      <BtnPrimary href="#contact">Apply for Partner Access</BtnPrimary>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">UPTIME<span>PARTS</span>HUB</div>
          <p className="footer-tagline">
            Performance nutrition supply for brands that move.
          </p>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <div className="footer-col__title">Platform</div>
            <a href="#catalog">Browse Catalog</a>
            <a href="#whitelabel">White Label</a>
            <a href="#packaging">Packaging Inks</a>
            <a href="#process">How It Works</a>
            <a href="#contact">Partner Access</a>
          </div>
          <div className="footer-col">
            <div className="footer-col__title">Company</div>
            <a href="#about">About Us</a>
            <a href="#contact">Contact</a>
            <a href="mailto:hello@uptimepartshub.com">hello@uptimepartshub.com</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 UptimePartsHub. All rights reserved.</span>
        <span>uptimepartshub.com</span>
      </div>
    </footer>
  );
}

// ─── PACKAGING DATA ───────────────────────────────────────────────────────────

const INK_CATEGORIES = [
  {
    id: 'water-based', icon: '💧', name: 'Water-Based Inks',
    tag: 'Most Popular', tagColor: '#c8f542', skus: '34+ SKUs',
    desc: 'Low-VOC, food-contact safe formulations for flexible films, pouches, and paper packaging. Compliant with FDA 21 CFR and EU 10/2011.',
    specs: ['VOC < 5%', 'FDA 21 CFR', 'EU 10/2011', 'Recyclable'],
    apps: ['Flexible Pouches', 'Paper Bags', 'Cartons', 'Labels'],
    filters: ['all', 'food', 'sustainable'],
  },
  {
    id: 'low-migration', icon: '🛡️', name: 'Low-Migration Inks',
    tag: 'Regulatory Essential', tagColor: '#ff9f42', skus: '22+ SKUs',
    desc: 'Engineered to prevent ink component migration into food. Required for direct and indirect food-contact packaging under EU PPWR and FDA guidance.',
    specs: ['Zero Migration', 'SML Compliant', 'PPWR Ready', 'Pharma Grade'],
    apps: ['Direct Food Contact', 'Inner Liners', 'Sachets', 'Pharma'],
    filters: ['all', 'food', 'eu'],
  },
  {
    id: 'uv-curable', icon: '⚡', name: 'UV-Curable Inks',
    tag: 'High Performance', tagColor: '#c8f542', skus: '28+ SKUs',
    desc: 'Instant-cure energy-efficient inks for high-speed label and packaging lines. Superior scratch resistance and vibrant color reproduction.',
    specs: ['Instant Cure', 'Scratch Resistant', 'Vivid Color', 'Energy Efficient'],
    apps: ['Labels', 'Shrink Sleeves', 'Rigid Containers', 'Caps'],
    filters: ['all'],
  },
  {
    id: 'thermochromic', icon: '🌡️', name: 'Thermochromic Inks',
    tag: 'Smart Packaging', tagColor: '#42d4f5', skus: '12+ SKUs',
    desc: 'Temperature-responsive inks that change color to indicate cold-chain integrity. Perfect for refrigerated beverages, dairy, and supplement packaging.',
    specs: ['Color-Change', 'Cold Chain', 'FDA Cleared', 'Custom Temp Range'],
    apps: ['Cold Beverages', 'Dairy', 'Frozen Foods', 'Supplements'],
    filters: ['all', 'smart'],
  },
  {
    id: 'eco-solvent', icon: '🌿', name: 'Eco-Solvent Inks',
    tag: 'Sustainable', tagColor: '#c8f542', skus: '18+ SKUs',
    desc: 'Bio-based solvent formulations with reduced environmental impact. Certified for compostable and recyclable packaging substrates.',
    specs: ['Bio-Based', 'Compostable OK', 'Low Odour', 'REACH Compliant'],
    apps: ['Compostable Bags', 'Kraft Packaging', 'Eco Labels', 'Wraps'],
    filters: ['all', 'sustainable'],
  },
  {
    id: 'nc-free', icon: '♻️', name: 'NC-Free Inks',
    tag: 'EU Mandate', tagColor: '#ff9f42', skus: '16+ SKUs',
    desc: 'Nitrocellulose-free formulations for PE and PP packaging. Directly addresses EU PPWR recyclability mandates taking effect 2025–2026.',
    specs: ['NC-Free', 'PE/PP Compatible', 'PPWR 2025', 'Recyclable'],
    apps: ['PE Films', 'PP Bags', 'Flexible Packaging', 'Stand-Up Pouches'],
    filters: ['all', 'sustainable', 'eu'],
  },
];

const COMPLIANCE_DOCS = [
  {
    icon: '🇺🇸', code: 'FDA 21 CFR', level: 'Required',
    title: 'US Food Contact Compliance',
    desc: 'Code of Federal Regulations covering indirect food additives including inks and coatings for food-contact packaging.',
  },
  {
    icon: '🇪🇺', code: 'EU 10/2011', level: 'Required',
    title: 'EU Plastics Regulation',
    desc: 'European regulation on plastic materials and articles intended to contact food. Covers migration limits and substance restrictions.',
  },
  {
    icon: '📋', code: 'PPWR 2025', level: 'Upcoming',
    title: 'EU Packaging Waste Regulation',
    desc: 'New EU mandate requiring recyclable packaging by 2030. Drives demand for NC-free and water-based inks on PE/PP substrates.',
  },
  {
    icon: '🔬', code: 'SML / OML', level: 'Standard',
    title: 'Migration Limits Testing',
    desc: 'Specific and Overall Migration Limit testing — the standard CoA requirement for food-contact ink certification.',
  },
];

const INK_PROCESS_STEPS = [
  { num: '01', title: 'Specify Your Substrate', text: 'Tell us your packaging material — PE film, PP pouch, kraft paper, shrink sleeve, etc.' },
  { num: '02', title: 'Select Ink Type',         text: 'Browse by application, regulation, or performance spec. Filter by FDA / EU / PPWR compliance.' },
  { num: '03', title: 'Request CoA Package',     text: 'Every order includes Certificate of Analysis, migration test reports, and regulatory declaration.' },
  { num: '04', title: 'Drop-Ship to Printer',    text: 'We ship direct to your packaging printer or contract manufacturer. No stock, no hassle.' },
];

const INK_WHY = [
  { icon: '🎓', title: 'F&B Industry Roots',    text: 'Our team comes from food, beverage, and nutrition — we understand what\'s actually at stake with packaging compliance.' },
  { icon: '📄', title: 'Docs on Every Order',   text: 'CoA, SDS, migration test data, and regulatory declaration shipped with every ink order. No chasing paperwork.' },
  { icon: '🌍', title: 'NA & EU Coverage',      text: 'Dual-compliant sourcing across FDA and EU frameworks. One supplier for both markets.' },
  { icon: '📦', title: 'Zero Stock Required',   text: 'Same drop-ship model as our nutrition supply. No minimum inventory, no warehouse cost.' },
];

const INK_FILTERS = ['All', 'Food-Contact', 'Sustainable', 'Smart', 'EU Mandate'];
const INK_FILTER_MAP = {
  'All': 'all', 'Food-Contact': 'food', 'Sustainable': 'sustainable',
  'Smart': 'smart', 'EU Mandate': 'eu',
};

// ─── PACKAGING COMPONENTS ─────────────────────────────────────────────────────

function InkCard({ cat, active, onEnter, onLeave }) {

  const tc = cat.tagColor;
  return (
    <div
      className={`ink-card ${active ? 'ink-card--active' : ''}`}
      style={{ '--ink-accent': tc }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="ink-card__badge" style={{ color: tc, background: `${tc}18`, border: `1px solid ${tc}35` }}>
        {cat.tag}
      </div>
      <span className="ink-icon">{cat.icon}</span>
      <div className="ink-name">{cat.name}</div>
      <div className="ink-skus">{cat.skus}</div>
      <p className="ink-desc">{cat.desc}</p>
      <div className="ink-specs">
        {cat.specs.map(s => <span key={s} className="ink-spec">{s}</span>)}
      </div>
      <div className="ink-apps-label">Applications</div>
      <div className="ink-apps">
        {cat.apps.map(a => <span key={a} className="ink-app">{a}</span>)}
      </div>
    </div>
  );
}

function ComplianceCard({ doc }) {
  const lc = doc.level === 'Required' ? '#ff9f42' : doc.level === 'Upcoming' ? '#42d4f5' : 'var(--mid)';
  return (
    <div className="reg-card">
      <div className="reg-card__icon">{doc.icon}</div>
      <div>
        <div className="reg-card__header">
          <span className="reg-card__code">{doc.code}</span>
          <span className="reg-card__level" style={{ color: lc, background: `${lc}18`, border: `1px solid ${lc}35` }}>
            {doc.level}
          </span>
        </div>
        <div className="reg-card__title">{doc.title}</div>
        <p className="reg-card__desc">{doc.desc}</p>
      </div>
    </div>
  );
}

function PackagingSolutions() {
  const [activeCard, setActiveCard] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [ref, visible] = useInView();

  const filterKey = INK_FILTER_MAP[activeFilter];
  const filtered = INK_CATEGORIES.filter(c => c.filters.includes(filterKey));

  return (
    <section className="pkg-section" id="packaging" ref={ref}>

      {/* Hero band */}
      <div className={`pkg-hero ${visible ? 'is-visible' : ''}`}>
        <div className="pkg-hero__grid" />
        <div className="pkg-hero__content">
          <SectionTag>New Category — Packaging Solutions</SectionTag>
          <h2 className="pkg-hero__h">
            FOOD-SAFE INKS.<br />
            <em>ZERO COMPLIANCE RISK.</em>
          </h2>
          <p className="pkg-hero__sub">
            The same brands sourcing nutrition components from UptimePartsHub now have
            one place for compliant packaging inks — water-based, low-migration,
            UV-curable, and smart formulations, drop-shipped with full documentation.
          </p>
          <div className="pkg-badges">
            {[
              ['FDA 21 CFR', '#c8f542'],
              ['EU 10/2011', '#c8f542'],
              ['PPWR 2025 Ready', '#ff9f42'],
              ['CoA on Every Order', '#42d4f5'],
            ].map(([label, color]) => (
              <span key={label} className="pkg-badge"
                style={{ color, background: `${color}12`, border: `1px solid ${color}35` }}>
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="pkg-hero__deco" aria-hidden>
          {['WATER-BASED','LOW-MIGRATION','UV-CURABLE','THERMOCHROMIC','ECO-SOLVENT','NC-FREE'].map((t, i) => (
            <span key={t} style={{ color: i % 2 === 0 ? 'var(--lime)' : 'var(--steel2)' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="pkg-stats">
        {[['130+','Ink SKUs'],['6','Ink Categories'],['2','Regulatory Frameworks'],['48H','Avg. Dispatch']].map(([n, l], i) => (
          <div key={l} className="pkg-stat" style={{ borderRight: i < 3 ? '1px solid var(--steel2)' : 'none' }}>
            <div className="pkg-stat__num">{n}</div>
            <div className="pkg-stat__label">{l}</div>
          </div>
        ))}
      </div>

      {/* Ink catalog */}
      <div className="pkg-catalog">
        <div className="pkg-catalog__header">
          <div>
            <SectionTag>Ink Catalog</SectionTag>
            <h2>BROWSE BY<br />INK TYPE</h2>
          </div>
          <div className="pkg-filters">
            {INK_FILTERS.map(f => (
              <button
                key={f}
                className={`pkg-filter ${activeFilter === f ? 'pkg-filter--active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="ink-grid">
          {filtered.map((cat, i) => (
            <InkCard
              key={cat.id}
              cat={cat}
              active={activeCard === i}
              onEnter={() => setActiveCard(i)}
              onLeave={() => setActiveCard(null)}
            />
          ))}
        </div>
      </div>

      {/* Process */}
      <div className="pkg-process">
        <SectionTag>The Process</SectionTag>
        <h2>FROM SPEC TO<br />PRESS-READY.</h2>
        <div className="pkg-steps">
          {INK_PROCESS_STEPS.map((s, i) => (
            <div key={s.num} className="pkg-step">
              {i < 3 && <div className="pkg-step__arrow" />}
              <div className="pkg-step__num">{s.num}</div>
              <div className="pkg-step__title">{s.title}</div>
              <p className="pkg-step__text">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance */}
      <div className="pkg-compliance">
        <div className="pkg-compliance__inner">
          <div>
            <SectionTag>Compliance Guide</SectionTag>
            <h2>WE HANDLE<br />THE PAPERWORK.</h2>
            <p className="pkg-compliance__sub">
              Every ink order ships with a full compliance documentation package — CoA,
              SDS, migration test reports, and regulatory declaration. No more chasing
              suppliers when your co-packer asks for it.
            </p>
            <div className="pkg-docs">
              <div className="pkg-docs__label">Included with every order</div>
              {['Certificate of Analysis (CoA)', 'Safety Data Sheet (SDS)',
                'Migration Test Report', 'Regulatory Declaration Letter',
                'Substrate Compatibility Guide'].map(item => (
                <div key={item} className="pkg-doc-row">
                  <span className="pkg-doc-check">✓</span>{item}
                </div>
              ))}
            </div>
          </div>
          <div className="reg-grid">
            {COMPLIANCE_DOCS.map(doc => <ComplianceCard key={doc.code} doc={doc} />)}
          </div>
        </div>
      </div>

      {/* Why */}
      <div className="pkg-why">
        <SectionTag>Why Us</SectionTag>
        <h2>INK SOURCED BY<br />FOOD PEOPLE.</h2>
        <div className="pkg-why__grid">
          {INK_WHY.map(item => (
            <div key={item.title} className="pkg-why__card">
              <div className="pkg-why__icon">{item.icon}</div>
              <div className="pkg-why__title">{item.title}</div>
              <p className="pkg-why__text">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Ticker />
      <Categories />
      <Process />
      <WhiteLabel />
      <ValueProps />
      <PackagingSolutions />
      <About />
      <CtaBand />
      <Contact />
      <Footer />
    </>
  );
}
