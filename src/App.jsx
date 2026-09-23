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
  'FDA-Registered Facilities', 'NSF International Audited',
  'cGMP Certified Production', 'Blind Ship — Your Brand Only',
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
    name: 'Gummies, Capsules and Softgels',
    count: '75+ SKUs',
    desc: 'Nootropics, creatine, collagen, and immune blends in gummy, capsule, and softgel formats. Private label from 1000 units, produced in FDA-registered, cGMP-certified facilities.',
    tags: ['Gummies', 'Capsules', 'Nootropics', 'Creatine'],
  },
  {
    icon: '🌾',
    name: 'Better-For-You Food',
    count: '30+ SKUs',
    desc: 'Functional snacks, protein bars, and specialty food components for retail and foodservice channels.',
    tags: ['Snacks', 'Bars', 'Foodservice'],
  },
  {
    icon: '🏋',
    name: 'Sports Nutrition',
    count: '40+ SKUs',
    desc: 'Pre-workout, BCAA, creatine, protein, and recovery blends — stock formulas ready to private label at low MOQ.',
    tags: ['Pre-Workout', 'BCAA', 'Creatine', 'Protein'],
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
    title: 'We Ship Invisibly',
    text: 'Orders route straight to the manufacturer and ship blind — your brand on the box, your name on the packing slip. Your customer never sees ours, and neither does your competition.',
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
    title: 'Invisible Drop-Ship',
    text: 'Zero stock commitment, and every order ships blind — no manufacturer name, logo, or invoice ever reaches your customer.',
  },
  {
    icon: '🏷️',
    title: 'White Label Ready',
    text: 'Launch your nutrition brand quickly. We handle supplier coordination, compliance docs, and branded packaging — nothing in the box points back to the factory.',
  },
  {
    icon: '✅',
    title: 'FDA Registered. cGMP Certified.',
    text: 'Production runs in FDA-registered, NSF International–audited, cGMP-certified facilities, with current SDS, CoA, and NA/EU regulatory docs on every product.',
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
  {
    icon: '🎯',
    title: 'Low MOQ to Launch',
    text: 'Start from as little as 1000 units on stock formulas. Test the market, build traction, then scale to custom formulation. No large upfront commitment required.',
  },
];

const SUPPLIERS = [
  'Gemini Nutraceuticals', 'NutraStar', 'Robinson Pharma',
  'Glanbia Nutritionals', 'Iovate Health', 'Prinova Group',
];

const COUNTRY_OPTIONS = ['US', 'EU', 'Canada', 'UK', 'Australia', 'Asia', 'Other'];

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
          components — made in FDA-registered, cGMP-certified facilities, shipped
          blind under your brand. Your customers see you. They never see us.
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
          Curated by food &amp; beverage industry professionals and produced in
          FDA-registered, cGMP-certified facilities. Every SKU is drop-ship enabled
          and ships unbranded-to-us — no warehousing, no upfront capital, just your
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

        <div className="process-intro">
          <div className="process-intro__label">New here? Here's the short version.</div>
          <p>
            You sell the product. We make it and ship it. You never buy stock, never
            rent a warehouse, and never touch a pallet.
          </p>
          <p>
            Pick products from our catalog, put your own label on them, and list them
            wherever you sell. When a customer orders, that order comes to us, the
            product is made in an FDA-registered, cGMP-certified facility, and it goes
            out in packaging that carries <strong>your</strong> brand and nobody else's.
            No factory name, no our-name-on-the-invoice, no clue that we exist.
          </p>
          <p>
            You pay the wholesale price, keep the difference, and look like a company
            with its own plant. That's the whole model — the four steps below are just
            the detail.
          </p>
        </div>
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
            line in weeks, not months, with zero upfront inventory commitment. We
            stay invisible: the co-manufacturer is never named to your customers,
            your competitors, or your marketplace listings.
          </p>
          <ul className="wl-list">
            {[
              'Minimum order from 1 unit on select lines',
              'Custom label design support available',
              'Blind shipping — your brand on the box and the packing slip',
              'No manufacturer marks, inserts, or return addresses',
              'Produced in FDA-registered, NSF International–audited, cGMP-certified facilities',
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
              ['Blind / Unbranded Shipping', '✓'],
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
            <p className="wl-suppliers__note">
              Shown here so you know who stands behind the product. Never printed on
              your packaging, paperwork, or shipping labels.
            </p>
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
            Everything we ship is produced in FDA-registered facilities that are
            audited by NSF International and run to cGMP (Current Good Manufacturing
            Practice) standards — third-party verified, batch-documented, and held to
            the same bar as the national brands on the shelf next to you.
          </p>
          <p>
            And we stay out of the frame. UptimePartsHub is a silent partner: our
            name, our manufacturers' names, and our paperwork never appear on your
            products, your packaging, your packing slips, or in front of your
            customers. To the market, you built it.
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
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '', website: '',
    country: '', interest: 'dropship', message: '',
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(errs => {
      if (!errs[name]) return errs;
      const next = { ...errs };
      delete next[name];
      return next;
    });
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim())    next.name    = 'Please enter your full name.';
    if (!form.company.trim()) next.company = 'Please enter your company name.';
    if (!form.email.trim())   next.email   = 'Please enter your email address.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Please enter a valid email address.';
    if (!form.country)        next.country = 'Please select your country / market.';
    if (!form.message.trim()) next.message = 'Please tell us about your brand and what you need.';
    return next;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(false);
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
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
            Every enquiry is confidential — we never reference our partners' brands publicly,
            and we never appear in front of your customers.
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
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-field">
                  <label>Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your name"
                    aria-invalid={!!errors.name} className={errors.name ? 'has-error' : ''} />
                  {errors.name && <p className="form-error">{errors.name}</p>}
                </div>
                <div className="form-field">
                  <label>Company</label>
                  <input name="company" value={form.company} onChange={handleChange} placeholder="Your brand / company"
                    aria-invalid={!!errors.company} className={errors.company ? 'has-error' : ''} />
                  {errors.company && <p className="form-error">{errors.company}</p>}
                </div>
              </div>
              <div className="form-field">
                <label>Email Address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@yourcompany.com"
                  aria-invalid={!!errors.email} className={errors.email ? 'has-error' : ''} />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Phone (optional)</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555 000 0000" />
                </div>
                <div className="form-field">
                  <label>Website (optional)</label>
                  <input type="url" name="website" value={form.website} onChange={handleChange} placeholder="https://yourbrand.com" />
                </div>
              </div>
              <div className="form-field">
                <label>Country / Market</label>
                <select name="country" value={form.country} onChange={handleChange}
                  aria-invalid={!!errors.country} className={errors.country ? 'has-error' : ''}>
                  <option value="">Select your country / market…</option>
                  {COUNTRY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.country && <p className="form-error">{errors.country}</p>}
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
                <label>Message</label>
                <textarea name="message" value={form.message} onChange={handleChange}
                  placeholder="Tell us about your brand, what products you are looking for, and your target market (minimum 50 words)"
                  rows={4} aria-invalid={!!errors.message} className={errors.message ? 'has-error' : ''} />
                <p className="form-note">Required — please provide as much detail as possible.</p>
                {errors.message && <p className="form-error">{errors.message}</p>}
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
        <p>Partner access is free. FDA-registered, cGMP-certified production, shipped blind under your name.</p>
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
            Performance nutrition supply for brands that move. FDA-registered,
            NSF International–audited, cGMP-certified production — shipped under
            your name, never ours.
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
  { num: '04', title: 'Drop-Ship to Printer',    text: 'We ship direct to your end customer, contract manufacturer, or your own location - wherever fits your supply chain. Blind-shipped under your name if you want it that way. No stock, no hassle.' },
];

const INK_WHY = [
  { icon: '🎓', title: 'F&B Industry Roots',    text: 'Our team comes from food, beverage, and nutrition — we understand what\'s actually at stake with packaging compliance.' },
  { icon: '📄', title: 'Docs on Every Order',   text: 'CoA, SDS, migration test data, and regulatory declaration shipped with every ink order. No chasing paperwork.' },
  { icon: '🌍', title: 'NA & EU Coverage',      text: 'Dual-compliant sourcing across FDA and EU frameworks. One supplier for both markets.' },
  { icon: '📦', title: 'Zero Stock, Zero Trace', text: 'Same drop-ship model as our nutrition supply — no minimum inventory, no warehouse cost, and blind shipping so the source stays yours alone.' },
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
              ['cGMP Certified', '#c8f542'],
              ['PPWR 2025 Ready', '#ff9f42'],
              ['CoA on Every Order', '#42d4f5'],
              ['Blind Shipping', '#42d4f5'],
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
