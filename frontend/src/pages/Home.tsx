import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Sparkles, ShieldCheck, FileSearch, Users, Zap, Globe, Bot, Brain,
  Link2, Layers, Tags, FileText, UserCheck, ChevronRight, CheckCircle2, XCircle,
  AlertTriangle, Database, ShoppingCart, MessageSquare, DollarSign, Clock,
  TrendingUp,
} from 'lucide-react';

// ================================================================
// Shared animation components
// ================================================================

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ================================================================
// HERO SECTION
// ================================================================

function HeroSection() {
  const [step, setStep] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s < 2 ? s + 1 : s));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-500/[0.07] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/[0.05] rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-nexora-950)_70%)]" />
      </div>

      <motion.div style={{ opacity, y }} className="relative app-container py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-xs font-medium mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Agentic Product Intelligence Engine
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight"
            >
              Your Product Data.{' '}
              <span className="gradient-text">Ready for Every Channel, Search Engine & AI Agent.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-lg text-nexora-300 leading-relaxed max-w-xl"
            >
              NEXORA transforms incomplete industrial product information into verified, structured and commerce-ready product intelligence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-electric-500 to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-electric-500/25 hover:shadow-electric-500/40 transition-all hover:scale-[1.02]"
              >
                Start Product Analysis <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/platform"
                className="inline-flex items-center gap-2 px-6 py-3 border border-nexora-600 text-nexora-200 hover:text-white hover:border-nexora-400 font-medium rounded-xl transition-all"
              >
                See How NEXORA Works
              </Link>
            </motion.div>
          </div>

          {/* Right: Interactive product transform */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="relative"
          >
            <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-electric-500/10 to-transparent rounded-bl-full" />

              {/* Step indicators */}
              <div className="flex items-center gap-3 mb-6">
                {['Raw SKU', 'AI Analysis', 'Verified Product'].map((label, i) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                      step >= i ? 'bg-electric-500 text-white' : 'bg-nexora-700 text-nexora-400'
                    }`}>
                      {step > i ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs font-medium hidden sm:inline transition-colors ${step >= i ? 'text-white' : 'text-nexora-500'}`}>
                      {label}
                    </span>
                    {i < 2 && <ChevronRight className="w-3.5 h-3.5 text-nexora-600 hidden sm:inline" />}
                  </div>
                ))}
              </div>

              {/* Raw input */}
              <div className={`transition-all duration-500 ${step >= 0 ? 'opacity-100' : 'opacity-30'}`}>
                <div className="text-xs text-nexora-500 font-medium uppercase tracking-wider mb-2">Input</div>
                <div className="font-mono text-sm sm:text-base text-amber-400 bg-nexora-900/80 px-4 py-3 rounded-lg border border-nexora-700">
                  3/8 CPLG BRS 150#
                </div>
              </div>

              {/* Analysis animation */}
              {step >= 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.5 }}
                  className="mt-4 flex items-center gap-2 text-electric-400 text-sm"
                >
                  <div className="w-4 h-4 border-2 border-electric-400 border-t-transparent rounded-full animate-spin" />
                  Analyzing with 8 specialized agents...
                </motion.div>
              )}

              {/* Verified output */}
              {step >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-5"
                >
                  <div className="text-xs text-nexora-500 font-medium uppercase tracking-wider mb-3">NEXORA Output</div>
                  <div className="space-y-2">
                    {[
                      { label: 'Product Type', value: 'Coupling', conf: 99 },
                      { label: 'Material', value: 'Brass', conf: 99 },
                      { label: 'Connection Size', value: '3/8 in', conf: 98 },
                      { label: 'Pressure Rating', value: '150 psi', conf: 97 },
                      { label: 'Confidence', value: '97%', conf: 97 },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-nexora-900/50">
                        <span className="text-xs text-nexora-400">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{item.value}</span>
                          {item.label !== 'Confidence' && (
                            <div className={`w-1.5 h-1.5 rounded-full ${item.conf >= 95 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified & Commerce-Ready
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// ================================================================
// TRUST BAR
// ================================================================

const trustItems = [
  { icon: Bot, label: 'AI-Powered' },
  { icon: ShieldCheck, label: 'LOV-Constrained' },
  { icon: FileSearch, label: 'Evidence-Backed' },
  { icon: Users, label: 'Human-in-the-Loop' },
  { icon: Zap, label: 'Enterprise-Ready' },
  { icon: Globe, label: 'API-Ready' },
];

function TrustBar() {
  return (
    <AnimatedSection>
      <div className="border-y border-white/[0.06] bg-nexora-900/30">
        <div className="app-container py-8">
          <p className="text-center text-xs text-nexora-500 font-medium uppercase tracking-widest mb-6">
            Built for Industrial Product Data
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {trustItems.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 p-3">
                <Icon className="w-5 h-5 text-electric-400" />
                <span className="text-xs text-nexora-300 font-medium text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

// ================================================================
// BEFORE / AFTER
// ================================================================

function BeforeAfterSection() {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <section className="section-padding">
      <div className="app-container">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            From fragmented product data to{' '}
            <span className="gradient-text">verified product intelligence.</span>
          </h2>
        </AnimatedSection>

        {/* Mobile Toggle */}
        <div className="flex lg:hidden justify-center mb-6">
          <div className="inline-flex rounded-lg bg-nexora-800 p-1">
            <button
              onClick={() => setShowAfter(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${!showAfter ? 'bg-nexora-600 text-white' : 'text-nexora-400'}`}
            >
              Before
            </button>
            <button
              onClick={() => setShowAfter(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${showAfter ? 'bg-electric-500 text-white' : 'text-nexora-400'}`}
            >
              After
            </button>
          </div>
        </div>

        <AnimatedSection>
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-1">
            {/* BEFORE */}
            <div className={`${showAfter ? 'hidden lg:block' : ''}`}>
              <div className="glass-card p-6 lg:rounded-r-none h-full">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <h3 className="text-lg font-semibold text-white">Before</h3>
                  <span className="ml-auto text-xs font-mono bg-red-500/10 text-red-400 px-2 py-1 rounded">Quality: 42%</span>
                </div>

                <div className="font-mono text-sm text-amber-400 bg-nexora-900 px-4 py-3 rounded-lg mb-4">
                  3/8 CPLG BRS 150#
                </div>

                <div className="space-y-2.5">
                  {[
                    { label: 'Manufacturer', value: '—', issue: true },
                    { label: 'Brand', value: '— Unbranded —', issue: true },
                    { label: 'Category', value: '—', issue: true },
                    { label: 'Material', value: 'BRS', issue: true },
                    { label: 'Size', value: '3/8', issue: false },
                    { label: 'Pressure', value: '150#', issue: true },
                    { label: 'Description', value: '—', issue: true },
                  ].map(({ label, value, issue }) => (
                    <div key={label} className="flex items-center justify-between py-1.5">
                      <span className="text-xs text-nexora-500">{label}</span>
                      <span className={`text-sm font-mono ${issue ? 'text-nexora-500' : 'text-nexora-200'}`}>{value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-1.5">
                  {['Missing attributes', 'Non-standard units', 'Abbreviated values', 'Unknown taxonomy', 'No manufacturer evidence'].map(issue => (
                    <div key={issue} className="flex items-center gap-2 text-xs text-red-400/70">
                      <AlertTriangle className="w-3 h-3" />
                      {issue}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AFTER */}
            <div className={`${!showAfter ? 'hidden lg:block' : ''}`}>
              <div className="glass-card p-6 lg:rounded-l-none border-electric-500/20 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">After NEXORA</h3>
                  <span className="ml-auto text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">Quality: 96%</span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { label: 'Product Name', value: '3/8 in Brass Coupling' },
                    { label: 'Manufacturer', value: 'Industrial Fittings Corp' },
                    { label: 'Brand', value: 'ProFit' },
                    { label: 'Category', value: 'Pipe Fittings > Couplings' },
                    { label: 'Fitting Type', value: 'Coupling' },
                    { label: 'Material', value: 'Brass' },
                    { label: 'Size', value: '3/8 in' },
                    { label: 'Pressure Rating', value: '150 psi' },
                    { label: 'Connection Type', value: 'Threaded' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-1.5">
                      <span className="text-xs text-nexora-400">{label}</span>
                      <span className="text-sm font-medium text-white">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-1.5">
                  {['All attributes verified', 'Standardized UOM', 'Canonical values', 'Full taxonomy', 'Source evidence available'].map(item => (
                    <div key={item} className="flex items-center gap-2 text-xs text-emerald-400/70">
                      <CheckCircle2 className="w-3 h-3" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ================================================================
// CORE VALUE PROPOSITION
// ================================================================

const valuePropCards = [
  {
    icon: Sparkles,
    title: 'Generate',
    desc: 'AI extracts and generates product information from raw descriptions, documents and manufacturer sources.',
    color: 'text-electric-400',
    bg: 'bg-electric-500/10',
  },
  {
    icon: ShieldCheck,
    title: 'Validate',
    desc: 'Deterministic rules validate every generated field against controlled vocabularies, UOM standards and category rules.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: FileSearch,
    title: 'Explain',
    desc: 'Every important value shows its source, reasoning path and confidence. No black-box outputs.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
];

function ValuePropSection() {
  return (
    <section className="section-padding bg-nexora-900/30">
      <div className="app-container">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            AI generates. Rules verify. Evidence explains.
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {valuePropCards.map((card) => {
            const Icon = card.icon;
            return (
              <AnimatedSection key={card.title}>
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="glass-card p-6 h-full hover:border-white/[0.12] transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-nexora-400 leading-relaxed">{card.desc}</p>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ================================================================
// PLATFORM SECTION
// ================================================================

const platformSteps = [
  { num: '01', title: 'Data Ingestion', desc: 'Excel, CSV, PDF, images, technical documents, URLs, product descriptions and manufacturer part numbers.', icon: Database },
  { num: '02', title: 'Product Understanding', desc: 'Extract MPN, manufacturer, brand, product type and key entities from raw product data.', icon: Brain },
  { num: '03', title: 'Intelligent Enrichment', desc: 'Retrieve missing information from trusted manufacturer sources and documentation.', icon: Sparkles },
  { num: '04', title: 'Validation Engine', desc: 'Validate LOV, UOM, taxonomy, attribute constraints, character limits and source evidence.', icon: ShieldCheck },
  { num: '05', title: 'Commerce Activation', desc: 'Generate product titles, descriptions, structured attributes and export-ready records.', icon: Zap },
];

function PlatformSection() {
  return (
    <section className="section-padding">
      <div className="app-container">
        <AnimatedSection className="text-center mb-14">
          <p className="text-sm text-electric-400 font-medium uppercase tracking-widest mb-3">The Platform</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            The NEXORA Platform
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platformSteps.map((step) => {
            const Icon = step.icon;
            return (
              <AnimatedSection key={step.num}>
                <div className="glass-card p-6 h-full group hover:border-electric-500/20 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-nexora-700 group-hover:text-electric-500/30 transition-colors">{step.num}</span>
                    <Icon className="w-5 h-5 text-electric-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-nexora-400 leading-relaxed">{step.desc}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ================================================================
// AGENTIC AI SECTION
// ================================================================

const agentSteps = [
  { name: 'Understand', icon: Brain, color: 'from-blue-500 to-cyan-500' },
  { name: 'Resolve', icon: Link2, color: 'from-cyan-500 to-teal-500' },
  { name: 'Classify', icon: Layers, color: 'from-teal-500 to-green-500' },
  { name: 'Extract', icon: Tags, color: 'from-green-500 to-emerald-500' },
  { name: 'Enrich', icon: Sparkles, color: 'from-emerald-500 to-yellow-500' },
  { name: 'Generate', icon: FileText, color: 'from-yellow-500 to-orange-500' },
  { name: 'Validate', icon: ShieldCheck, color: 'from-orange-500 to-red-500' },
  { name: 'Review', icon: UserCheck, color: 'from-red-500 to-violet-500' },
];

function AgenticAISection() {
  return (
    <section className="section-padding bg-nexora-900/30">
      <div className="app-container">
        <AnimatedSection className="text-center mb-14">
          <p className="text-sm text-electric-400 font-medium uppercase tracking-widest mb-3">Multi-Agent Architecture</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            A team of specialized AI agents for every product.
          </h2>
        </AnimatedSection>

        <AnimatedSection>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {agentSteps.map((agent, i) => {
              const Icon = agent.icon;
              return (
                <motion.div
                  key={agent.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${agent.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm text-nexora-300 font-medium">{agent.name}</span>
                  {i < agentSteps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-nexora-600 hidden sm:block absolute" style={{ display: 'none' }} />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Flow line */}
          <div className="hidden sm:flex items-center justify-center mt-8 gap-1">
            <div className="text-xs font-mono text-nexora-600 px-3 py-1 rounded bg-nexora-800">RAW PRODUCT</div>
            <div className="flex-1 h-px bg-gradient-to-r from-electric-500/50 to-violet-500/50 max-w-md" />
            <div className="text-xs font-mono text-emerald-400 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">VERIFIED</div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ================================================================
// EVIDENCE SECTION
// ================================================================

function EvidenceSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="section-padding">
      <div className="app-container">
        <AnimatedSection className="text-center mb-12">
          <p className="text-sm text-electric-400 font-medium uppercase tracking-widest mb-3">Traceability</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Every attribute has a reason.
          </h2>
        </AnimatedSection>

        <AnimatedSection>
          <div className="max-w-2xl mx-auto">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs text-nexora-500 font-mono">PDSH4816AF</span>
                  <h3 className="text-lg font-semibold text-white">Professional Series Dishwasher</h3>
                </div>
                <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">N-Score: 96</span>
              </div>

              {/* Clickable attribute */}
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-nexora-900/80 border border-nexora-700 hover:border-electric-500/30 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-nexora-400">Voltage Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">120 V</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <ChevronRight className={`w-4 h-4 text-nexora-500 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                </div>
              </button>

              {/* Evidence Panel */}
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 p-4 rounded-lg bg-nexora-850 border border-nexora-700 space-y-3">
                      {[
                        { label: 'Source', value: 'Manufacturer Documentation' },
                        { label: 'Evidence', value: '"Voltage: 120V, 60Hz"' },
                        { label: 'Extraction', value: 'Attribute Extraction Agent' },
                        { label: 'Normalization', value: 'UOM Standard (V → V)' },
                        { label: 'Validation', value: '✓ Passed (LOV + UOM)' },
                        { label: 'Confidence', value: '98%' },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-start justify-between gap-4">
                          <span className="text-xs text-nexora-500 shrink-0">{label}</span>
                          <span className="text-xs text-nexora-200 text-right">{value}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-nexora-700">
                        <span className="text-xs text-emerald-400 font-medium">✓ Verified — Full provenance available</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ================================================================
// AI COMMERCE SECTION
// ================================================================

function AICommerceSection() {
  return (
    <section className="section-padding bg-nexora-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <p className="text-sm text-electric-400 font-medium uppercase tracking-widest mb-3">The Future</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Products are becoming machine-readable.</h2>
        </AnimatedSection>

        <AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-nexora-400" /> Human Shopping
              </h3>
              <div className="space-y-3">
                {['Browse catalogs', 'Read descriptions', 'Compare manually', 'Click to purchase'].map((step, i) => (
                  <div key={step} className="flex items-center gap-3 text-sm text-nexora-400">
                    <span className="w-6 h-6 rounded-full bg-nexora-700 flex items-center justify-center text-xs text-nexora-400">{i + 1}</span>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 border-electric-500/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Bot className="w-5 h-5 text-electric-400" /> AI Agent Shopping
              </h3>
              <div className="space-y-3">
                {['Query structured data', 'Reason over attributes', 'Compare specifications', 'Select & purchase'].map((step, i) => (
                  <div key={step} className="flex items-center gap-3 text-sm text-electric-300">
                    <span className="w-6 h-6 rounded-full bg-electric-500/20 flex items-center justify-center text-xs text-electric-400">{i + 1}</span>
                    {step}
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-lg bg-nexora-900/80 border border-nexora-700">
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-nexora-300 italic">"Find me a 3/8 inch brass coupling rated for 150 psi."</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ================================================================
// ROI CALCULATOR
// ================================================================

function ROICalculator() {
  const [skus, setSkus] = useState(10000);
  const [manualTime, setManualTime] = useState(15);
  const [costPerHour, setCostPerHour] = useState(35);

  const hoursSaved = Math.round(skus * manualTime / 60 * 0.89);
  const costSaved = Math.round(hoursSaved * costPerHour);
  const timeReduction = 89;

  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <p className="text-sm text-electric-400 font-medium uppercase tracking-widest mb-3">ROI Calculator</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Estimate your savings</h2>
          <p className="text-sm text-nexora-400 mt-2">Illustrative estimates — not actual NEXORA customer results</p>
        </AnimatedSection>

        <AnimatedSection>
          <div className="max-w-3xl mx-auto glass-card p-6 sm:p-8">
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="text-xs text-nexora-400 font-medium block mb-2">Number of SKUs</label>
                <input
                  type="number"
                  value={skus}
                  onChange={e => setSkus(Number(e.target.value))}
                  className="w-full bg-nexora-900 border border-nexora-700 rounded-lg px-3 py-2 text-white text-sm focus:border-electric-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-nexora-400 font-medium block mb-2">Manual Time per SKU (min)</label>
                <input
                  type="number"
                  value={manualTime}
                  onChange={e => setManualTime(Number(e.target.value))}
                  className="w-full bg-nexora-900 border border-nexora-700 rounded-lg px-3 py-2 text-white text-sm focus:border-electric-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-nexora-400 font-medium block mb-2">Avg. Employee Cost ($/hr)</label>
                <input
                  type="number"
                  value={costPerHour}
                  onChange={e => setCostPerHour(Number(e.target.value))}
                  className="w-full bg-nexora-900 border border-nexora-700 rounded-lg px-3 py-2 text-white text-sm focus:border-electric-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-xl bg-nexora-900/50">
                <Clock className="w-5 h-5 text-electric-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{hoursSaved.toLocaleString()}</div>
                <div className="text-xs text-nexora-400 mt-1">Hours Saved</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-nexora-900/50">
                <DollarSign className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">${costSaved.toLocaleString()}</div>
                <div className="text-xs text-nexora-400 mt-1">Est. Savings</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-nexora-900/50">
                <TrendingUp className="w-5 h-5 text-violet-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{timeReduction}%</div>
                <div className="text-xs text-nexora-400 mt-1">Time Reduction</div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ================================================================
// CTA SECTION
// ================================================================

function CTASection() {
  return (
    <section className="section-padding">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <div className="glass-card p-10 sm:p-16 glow-blue">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              From Raw Product Data to Verified Commerce Intelligence.
            </h2>
            <p className="text-nexora-300 mb-8 max-w-lg mx-auto">
              Start transforming your industrial product catalog with AI-powered intelligence, deterministic validation and complete evidence traceability.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-electric-500 to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-electric-500/25 hover:shadow-electric-500/40 transition-all hover:scale-[1.02]"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-nexora-600 text-nexora-200 hover:text-white hover:border-nexora-400 font-medium rounded-xl transition-all"
              >
                Request Demo
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ================================================================
// HOME PAGE
// ================================================================

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <BeforeAfterSection />
      <ValuePropSection />
      <PlatformSection />
      <AgenticAISection />
      <EvidenceSection />
      <AICommerceSection />
      <ROICalculator />
      <CTASection />
    </>
  );
}
