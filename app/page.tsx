"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import FaqSection from "./components/FaqSection"
import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { CountUp } from "@/components/ui/CountUp"

// Nav order matches page section order (top to bottom)
const NAV_LINKS = [
  { href: "#roles", label: "भूमिका" },
  { href: "#how-it-works", label: "कसे वापरावे" },
  { href: "#features", label: "वैशिष्ट्ये" },
  { href: "#pricing", label: "किंमत" },
  { href: "#faq", label: "मदत" },
]

// Scroll threshold: become solid before white sections (hero ~600–900px + stats ~80px)
const LIGHT_SECTION_THRESHOLD = 600

const SECTION_IDS = ["roles", "how-it-works", "features", "pricing", "faq"] as const

export default function Home() {
  const [overLightSection, setOverLightSection] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  useEffect(() => {
    const onScroll = () => setOverLightSection(window.scrollY > LIGHT_SECTION_THRESHOLD)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveSection(e.target.id)
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    )
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [mobileMenuOpen])

  return (
    <div className="min-h-screen bg-navy">
      {/* Navbar — transparent over hero, fully opaque over light sections (text always readable) */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-[60px] h-[64px] sm:h-[70px] flex items-center justify-between gap-3 transition-all duration-500 ease-out safe-area-padding ${
        overLightSection
          ? "bg-navy border-b border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.25)]"
          : "bg-navy/90 backdrop-blur-md border-b border-white/[0.06]"
      }`}>
        <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-navy rounded-lg min-w-0 shrink">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-lg sm:text-xl shadow-saffron-glow shrink-0">
            🏫
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-white text-base sm:text-xl font-heading truncate">
              शाळा<span className="text-saffron-bright">Connect</span>
            </div>
            <div className="text-[8px] sm:text-[9px] text-white/35 tracking-[2.5px] uppercase font-semibold hidden sm:block">
              Maharashtra Edu Platform
            </div>
          </div>
        </Link>
        <div className="hidden md:flex gap-7 md:gap-[28px]">
          {NAV_LINKS.map((l) => {
            const isActive = activeSection === l.href.slice(1)
            return (
              <Link
                key={l.href + l.label}
                href={l.href}
                className={`nav-link transition-colors relative ${isActive ? "nav-link-active" : ""}`}
              >
                {l.label}
              </Link>
            )
          })}
        </div>
        {/* Mobile: hamburger only — Login/Register in overlay */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex gap-2.5 items-center">
            <Link href="/login" className="btn-ghost-dark px-5 py-2.5 text-sm">
              लॉगिन
            </Link>
            <Link href="/register" className="btn-primary px-5 py-2.5 text-sm">
              मोफत सुरू करा →
            </Link>
          </div>
          <button
            type="button"
            aria-label="मेनू उघडा"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex flex-col items-center justify-center gap-1.5 bg-white/10 border border-white/15 text-white hover:bg-white/15 active:bg-white/20 transition-colors touch-manipulation"
          >
            <span className={`w-5 h-0.5 bg-current transition-transform duration-200 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-5 h-0.5 bg-current transition-opacity duration-200 ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`w-5 h-0.5 bg-current transition-transform duration-200 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay — tap outside to close */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy/97 backdrop-blur-2xl md:hidden animate-fade-in"
          aria-hidden="true"
          onClick={() => setMobileMenuOpen(false)}
          style={{ paddingTop: "max(env(safe-area-inset-top), 24px)" }}
        >
          <div className="pt-20 px-6 pb-8 flex flex-col gap-1 max-h-[calc(100vh-120px)] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                onClick={() => setMobileMenuOpen(false)}
                className="nav-link text-lg py-4 px-4 -mx-4 rounded-xl border-b border-white/10 min-h-[48px] flex items-center touch-manipulation"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-white/15">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-ghost-dark justify-center py-4 text-base min-h-[52px] font-semibold rounded-xl touch-manipulation"
              >
                लॉगिन
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary justify-center py-4 text-base min-h-[52px] font-semibold rounded-xl touch-manipulation shadow-saffron-glow"
              >
                मोफत सुरू करा →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <header className="min-h-screen min-h-[100dvh] bg-navy relative overflow-hidden pt-[64px] sm:pt-[70px] flex flex-col">
        {/* Background canvas — mesh, grid, chakra, lines, noise (per design.html) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* hc-mesh */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 900px 700px at 70% 50%, rgba(244,106,10,0.10) 0%, transparent 70%), radial-gradient(ellipse 600px 500px at 10% 80%, rgba(21,128,61,0.08) 0%, transparent 70%), radial-gradient(ellipse 400px 400px at 50% 20%, rgba(14,165,233,0.05) 0%, transparent 70%)",
            }}
          />
          {/* hc-grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
            }}
          />
          {/* hc-chakra — large spinning Dharmachakra (spin60 from design.html) */}
          <div
            className="absolute right-[-120px] top-1/2 w-[700px] h-[700px] opacity-[0.028] flex items-center justify-center animate-spin60"
            aria-hidden
          >
            <span className="text-white text-[700px] leading-none block">☸</span>
          </div>
          {/* hc-lines — three animated sweep lines (lineSweep per design.html) */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute h-px bg-gradient-to-r from-transparent via-saffron/20 to-transparent animate-line-sweep origin-left"
              style={{ top: "28%", width: "40%", left: "-10%" }}
            />
            <div
              className="absolute h-px bg-gradient-to-r from-transparent via-saffron/20 to-transparent animate-line-sweep origin-right"
              style={{ top: "55%", width: "30%", right: "-5%", left: "auto", animationDelay: "3s" }}
            />
            <div
              className="absolute h-px bg-gradient-to-r from-transparent via-saffron/20 to-transparent animate-line-sweep origin-left"
              style={{ top: "72%", width: "25%", left: "20%", animationDelay: "5s" }}
            />
          </div>
          {/* hc-noise — SVG noise overlay */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="flex-1 flex items-center px-4 sm:px-6 md:px-12 lg:px-16 pb-12 sm:pb-16 relative z-10 gap-8 lg:gap-12 max-w-[1400px] mx-auto w-full">
          <div className="flex-1 max-w-[590px] min-w-0">
            <div className="inline-flex items-center gap-2.5 bg-saffron/10 border border-saffron/30 px-3 sm:px-4 py-2 rounded-full mb-4 sm:mb-6 animate-hero-fade-up-1">
              <div className="w-2 h-2 rounded-full bg-green-bright shadow-[0_0_0_3px_rgba(34,197,94,0.25)] animate-pulse shrink-0" />
              <span className="text-[11px] sm:text-xs font-semibold text-saffron-bright font-body">
                महाराष्ट्र #१ शाळा व्यवस्थापन प्लॅटफॉर्म
              </span>
            </div>
            <h1 className="font-black text-white text-[28px] xs:text-[34px] sm:text-[42px] md:text-[52px] lg:text-[58px] leading-[1.15] mb-4 sm:mb-6 font-heading animate-hero-fade-up-2">
              <span className="bg-gradient-to-br from-saffron-bright to-gold-light bg-clip-text text-transparent">
                डिजिटल शाळा
              </span>
              <br />
              आता मराठीत
              <br />
              सोपे, जलद, स्मार्ट
            </h1>
            <p className="text-[15px] sm:text-[17px] text-white leading-relaxed mb-6 sm:mb-8 max-w-[510px] font-body animate-hero-fade-up-3">
              मुख्याध्यापक, शिक्षक, कारकून, विद्यार्थी आणि पालक - पाचही जणांसाठी एकच अ‍ॅप. हजेरीपासून दाखल्यापर्यंत, फीपासून निकालापर्यंत सर्व डिजिटल.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-3.5 mb-8 sm:mb-10 animate-hero-fade-up-4">
              <Link
                href="/register"
                className="btn-primary px-6 sm:px-8 py-3.5 sm:py-4 text-[14px] sm:text-[15px] min-h-[48px] justify-center touch-manipulation text-white"
              >
                🚀 ३० दिवस मोफत वापरा
              </Link>
              <button className="btn-ghost-dark px-6 sm:px-8 py-3.5 sm:py-4 text-[14px] sm:text-[15px] min-h-[48px] justify-center border-2 border-white/40 touch-manipulation">
                ▶ डेमो पहा
              </button>
            </div>
            <div className="flex gap-5 flex-wrap animate-hero-fade-up-5">
              <div className="flex items-center gap-2">
                <span className="text-[17px]">🔒</span>
                <div className="text-xs text-white/40 font-body">
                  <strong className="block text-white/72 text-[13px]">१०० % सुरक्षित</strong>
                  SSL Encrypted
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[17px]">🇮🇳</span>
                <div className="text-xs text-white/40 font-body">
                  <strong className="block text-white/72 text-[13px]">भारतात बनवले</strong>
                  Pune, Maharashtra
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[17px]">📴</span>
                <div className="text-xs text-white/40 font-body">
                  <strong className="block text-white/72 text-[13px]">ऑफलाईन काम</strong>
                  Net नसताना ही
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard preview card — dashBob + fadeLeft + inset highlight per design.html */}
          <div className="hidden lg:flex flex-1 justify-end items-center animate-hero-fade-left">
            <div className="w-[470px] bg-white/[0.048] backdrop-blur-[28px] border border-white/10 rounded-3xl p-6 animate-dash-bob shadow-[0_28px_72px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.09)]">
              {/* Live activity strip — WhatsApp & Fee integrated, no overlap */}
              <div className="flex gap-2 mb-4">
                <div className="flex-1 flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 border-l-2 border-saffron">
                  <span className="text-sm">📱</span>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-white font-body truncate">WhatsApp गेला</div>
                    <div className="text-[9px] text-white/50 font-body">२,४७ पालकांना</div>
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 border-l-2 border-green-bright">
                  <span className="text-sm">✅</span>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-white font-body truncate">फी जमा ₹४,५००</div>
                    <div className="text-[9px] text-white/50 font-body">Razorpay यशस्वी</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-base">
                    👨‍💼
                  </div>
                  <div>
                    <div className="font-bold text-white text-[13px] font-body">मुख्य डॅशबोर्ड</div>
                    <div className="text-[10px] text-white/40 font-body">पुणे विद्यामंदिर</div>
                  </div>
                </div>
                <div className="bg-green-bright/15 border border-green-bright/30 px-2.5 py-1 rounded-full text-[10px] font-bold text-green-bright">
                  🟢 Live
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5 mb-3">
                {[
                  { ico: "👨‍🎓", n: "१,२४७", l: "विद्यार्थी", grad: "from-saffron to-gold" },
                  { ico: "👩‍🏫", n: "४८", l: "शिक्षक", grad: "from-green-mid to-green-bright" },
                  { ico: "💰", n: "₹२.४L", l: "आजची फी", grad: "from-sky to-sky" },
                  { ico: "📝", n: "८", l: "परीक्षा बाकी", grad: "from-purple-500 to-pink-500" },
                ].map((s, i) => (
                  <div key={i} className="bg-white/[0.055] border border-white/10 rounded-2xl p-3 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${s.grad} rounded-t-2xl`} />
                    <span className="text-base block mb-1">{s.ico}</span>
                    <div className="font-extrabold text-white text-xl font-heading">{s.n}</div>
                    <div className="text-[10px] text-white/40 font-body">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white/[0.055] border border-white/10 rounded-xl p-3 mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-semibold text-white/65 font-body">📋 आजची हजेरी</span>
                  <span className="text-xs font-bold text-green-bright font-body">८७% · १,०८५/१,२४७</span>
                </div>
                <div className="h-1.5 bg-white/[0.07] rounded overflow-hidden">
                  <div className="h-full w-[87%] bg-gradient-to-r from-green-mid to-green-bright rounded animate-bar-fill" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-white/[0.035] rounded-lg px-3 py-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-saffron shadow-[0_0_5px_rgba(244,106,10,0.2)]" />
                  <span className="text-[11px] text-white font-body">⚠️ इ.७वी ब — ३ विद्यार्थी गैरहजर, WhatsApp गेले</span>
                </div>
                <div className="flex items-center gap-2 bg-white/[0.035] rounded-lg px-3 py-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-bright" />
                  <span className="text-[11px] text-white font-body">✅ वार्षिक परीक्षा वेळापत्रक सर्व पालकांना पाठवले</span>
                </div>
                <div className="flex items-center gap-2 bg-white/[0.035] rounded-lg px-3 py-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky" />
                  <span className="text-[11px] text-white font-body">💰 आजचे फी कलेक्शन ९२% पूर्ण — ₹२.४ लाख</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Band — CountUp when in view */}
      <div className="bg-gradient-to-r from-saffron to-gold py-6 px-12 md:px-16 flex justify-center">
        <div className="max-w-[1400px] w-full flex flex-wrap justify-center gap-8 md:gap-0">
          {[
            { n: "५०,०००+", l: "शाळा वापरतात", countUp: { end: 50000, suffix: "+", prefix: "", format: (n: number) => Math.round(n).toLocaleString("mr-IN") } },
            { n: "२५ लाख+", l: "विद्यार्थी", countUp: { end: 25, suffix: " लाख+", prefix: "", format: (n: number) => Math.round(n).toLocaleString("mr-IN") } },
            { n: "९९.९%", l: "Uptime गॅरंटी", countUp: { end: 99.9, suffix: "%", prefix: "", format: (n: number) => n.toLocaleString("mr-IN", { minimumFractionDigits: 1 }) } },
            { n: "३६", l: "जिल्हे सक्रिय", countUp: { end: 36, suffix: "", prefix: "", format: (n: number) => Math.round(n).toLocaleString("mr-IN") } },
            { n: "4.9 ★", l: "App Store Rating", countUp: { end: 4.9, suffix: " ★", prefix: "", format: (n: number) => n.toFixed(1) } },
          ].map((item, i) => (
            <div key={i} className="flex-1 min-w-[120px] text-center relative last:after:hidden md:after:content-[''] md:after:absolute md:after:right-0 md:after:top-[15%] md:after:bottom-[15%] md:after:w-px md:after:bg-white/30">
              <div className="font-extrabold text-white text-2xl md:text-3xl font-[family-name:var(--font-noto-devanagari)]">
                {item.countUp ? (
                  <CountUp
                    end={item.countUp.end}
                    duration={2200}
                    format={item.countUp.format}
                    suffix={item.countUp.suffix}
                    prefix={item.countUp.prefix}
                  />
                ) : (
                  item.n
                )}
              </div>
              <div className="text-xs text-white/80 mt-1 font-[family-name:var(--font-noto-devanagari)]">{item.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Roles Section — section divider */}
      <div className="h-px bg-gradient-to-r from-saffron/5 via-border/40 to-saffron/5" aria-hidden />
      <ScrollReveal>
      <section id="roles" className="bg-white py-20 md:py-24 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-0.5 bg-saffron rounded" />
            <span className="text-[10px] font-extrabold tracking-[3px] uppercase text-saffron">वापरकर्ते</span>
          </div>
          <h2 className="text-3xl md:text-[40px] font-extrabold text-text-900 mb-4 font-[family-name:var(--font-noto-devanagari)]">
            प्रत्येकासाठी <span className="text-saffron">वेगळा अनुभव</span>
          </h2>
          <p className="text-base text-text-500 leading-relaxed max-w-[560px] mb-12 font-[family-name:var(--font-noto-devanagari)]">
            पाच भूमिका, पाच वेगळे डॅशबोर्ड — योग्य माहिती, योग्य व्यक्तीला, योग्य वेळी
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-[18px] mt-[50px]">
            {[
              { emoji: "👨‍💼", name: "मुख्याध्यापक", desc: "संपूर्ण शाळेचे नियंत्रण, अहवाल, परवानग्या", tag: "१५+ मॉड्यूल्स", hoverBorder: "hover:border-saffron", hoverShadow: "hover:shadow-[0_20px_50px_rgba(244,106,10,0.16)]" },
              { emoji: "👩‍🏫", name: "शिक्षक", desc: "हजेरी, गुण, गृहपाठ, विद्यार्थी प्रगती", tag: "२०+ मॉड्यूल्स", hoverBorder: "hover:border-green-mid", hoverShadow: "hover:shadow-[0_20px_50px_rgba(21,128,61,0.14)]" },
              { emoji: "🧑‍💻", name: "कारकून", desc: "दाखले, शुल्क, दस्तऐवज, सरकारी अहवाल", tag: "१८+ मॉड्यूल्स", hoverBorder: "hover:border-sky", hoverShadow: "hover:shadow-[0_20px_50px_rgba(14,165,233,0.14)]" },
              { emoji: "👦", name: "विद्यार्थी", desc: "वेळापत्रक, गृहपाठ, निकाल, ई-लायब्ररी", tag: "१२+ मॉड्यूल्स", hoverBorder: "hover:border-violet-400", hoverShadow: "hover:shadow-[0_20px_50px_rgba(139,92,246,0.14)]" },
              { emoji: "👨‍👩‍👦", name: "पालक", desc: "हजेरी, गुण, शुल्क, शिक्षक भेट बुकिंग", tag: "१०+ मॉड्यूल्स", hoverBorder: "hover:border-pink-400", hoverShadow: "hover:shadow-[0_20px_50px_rgba(236,72,153,0.14)]" },
            ].map((role, i) => {
              const overlayGradients = [
                "linear-gradient(160deg,rgba(244,106,10,0.05),transparent)",
                "linear-gradient(160deg,rgba(21,128,61,0.05),transparent)",
                "linear-gradient(160deg,rgba(14,165,233,0.05),transparent)",
                "linear-gradient(160deg,rgba(139,92,246,0.05),transparent)",
                "linear-gradient(160deg,rgba(236,72,153,0.05),transparent)",
              ]
              return (
              <div
                key={i}
                className={`rounded-[20px] p-6 md:p-7 text-center border-[1.5px] border-border-school bg-white hover:-translate-y-2 hover:scale-[1.02] transition-role-card cursor-pointer relative overflow-hidden group ${role.hoverBorder} ${role.hoverShadow}`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[20px]" style={{ background: overlayGradients[i] }} />
                <span className="text-4xl md:text-5xl block mb-3 drop-shadow-sm relative z-10">{role.emoji}</span>
                <div className="font-bold text-text-900 text-base mb-2 font-[family-name:var(--font-noto-devanagari)] relative z-10">{role.name}</div>
                <div className="text-xs text-text-500 leading-relaxed mb-4 font-[family-name:var(--font-noto-devanagari)] relative z-10">{role.desc}</div>
                <span className="inline-block px-3 py-1.5 rounded-full text-[10px] font-bold bg-cream text-text-500 border border-border-school font-[family-name:var(--font-noto-devanagari)] relative z-10">
                  {role.tag}
                </span>
              </div>
            )})}
          </div>
        </div>
        </section>
      </ScrollReveal>

      {/* How it works — section divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" aria-hidden />
      <ScrollReveal>
      <section id="how-it-works" className="bg-cream py-20 md:py-24 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-0.5 bg-saffron rounded" />
            <span className="text-[10px] font-extrabold tracking-[3px] uppercase text-saffron">कसे वापरावे</span>
          </div>
          <h2 className="text-3xl md:text-[40px] font-extrabold text-text-900 mb-4 font-[family-name:var(--font-noto-devanagari)]">
            ४ सोप्या पायऱ्या, <span className="text-saffron">शाळा डिजिटल</span>
          </h2>
          <p className="text-base text-text-500 leading-relaxed max-w-[560px] mb-12 font-[family-name:var(--font-noto-devanagari)]">
            तांत्रिक ज्ञान नको. मराठीत सर्व. पहिल्याच दिवशी वापर सुरू.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-saffron via-gold to-green-mid hidden md:block -z-0" />
            {[
              { num: "१", title: "नोंदणी करा", desc: "शाळेचे नाव, जिल्हा, वर्ग संख्या — ५ मिनिटांत खाते. मोफत ३० दिवस.", shadow: "shadow-[0_6px_20px_rgba(244,106,10,0.38)]", style: "linear-gradient(135deg,#F46A0A,#F59E0B)" },
              { num: "२", title: "माहिती भरा", desc: "Excel मधून विद्यार्थी import करा. शिक्षकांना invite करा.", shadow: "shadow-[0_6px_20px_rgba(245,158,11,0.38)]", style: "linear-gradient(135deg,#F59E0B,#FCD34D)" },
              { num: "३", title: "वापर सुरू करा", desc: "हजेरी घ्या, फी घ्या, सूचना पाठवा. सर्व automatic.", shadow: "shadow-[0_6px_20px_rgba(14,165,233,0.38)]", style: "#0EA5E9" },
              { num: "४", title: "रिपोर्ट पहा", desc: "U-DISE, RTE, मासिक अहवाल — एका क्लिकमध्ये.", shadow: "shadow-[0_6px_20px_rgba(22,163,74,0.38)]", style: "linear-gradient(135deg,#16A34A,#22C55E)" },
            ].map((step, i) => (
              <div key={i} className="text-center relative z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg mx-auto mb-5 border-[3px] border-white text-white ${step.shadow}`}
                  style={{ background: step.style }}
                >
                  {step.num}
                </div>
                <div className="font-bold text-text-900 text-[15px] mb-2 font-[family-name:var(--font-noto-devanagari)]">{step.title}</div>
                <div className="text-xs text-text-500 leading-relaxed font-[family-name:var(--font-noto-devanagari)]">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
        </section>
      </ScrollReveal>

      {/* Features Grid — वैशिष्ट्ये — section divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" aria-hidden />
      <ScrollReveal>
        <section id="features" className="bg-white py-14 sm:py-20 md:py-[88px] px-4 sm:px-6 md:px-[60px] scroll-mt-20">
        <div className="max-w-[1400px] mx-auto">
          <span className="section-label mb-3 block">मुख्य वैशिष्ट्ये</span>
          <h2 className="text-3xl md:text-[40px] font-extrabold text-text-900 mb-4 font-heading">
            शाळेचे <span className="text-saffron">संपूर्ण डिजिटलायझेशन</span>
          </h2>
          <p className="text-base text-text-500 leading-relaxed max-w-[560px] mb-12 font-body">
            एकाच प्लॅटफॉर्मवर सर्व — कागद नाही, वेळ वाचतो, अचूकता वाढते
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-[22px] mt-[52px]">
            {/* AI Card - feat-dark: navy gradient + saffron glow pulse per design.html */}
            <div className="rounded-[20px] p-7 bg-gradient-to-br from-navy-2 to-slate-2 border border-white/10 shadow-sh-md hover:shadow-sh-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-saffron/10 blur-3xl -translate-y-10 translate-x-10 pointer-events-none animate-glow-pulse" />
              <div className="w-[52px] h-[52px] rounded-[13px] flex items-center justify-center text-2xl mb-4 bg-saffron/20 relative z-10">🤖</div>
              <span className="inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-[1.5px] uppercase bg-saffron/20 text-saffron-bright border border-saffron/30 mb-3 font-sora">AI-POWERED</span>
              <h3 className="font-bold text-white text-[19px] mb-2 font-body">मराठी AI सहाय्यक</h3>
              <p className="text-[13px] text-white/55 leading-relaxed mb-5 font-body">
                मराठीत बोला — AI तुमचे काम करेल. रिपोर्ट तयार करा, प्रश्न विचारा.
              </p>
              <ul className="flex flex-col gap-2">
                {["मराठी व्हॉईस कमांड", "Auto रिपोर्ट जनरेशन", "विद्यार्थी प्रगती अंदाज", "ChatBot पालकांसाठी"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-white font-body">
                    <span className="text-green-bright font-extrabold text-[11px] flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Attendance Card */}
            <div className="rounded-[20px] p-7 bg-cream border-[1.5px] border-border-school hover:shadow-sh-md hover:-translate-y-1 hover:border-border-2 transition-all duration-300">
              <div className="w-[52px] h-[52px] rounded-[13px] flex items-center justify-center text-2xl mb-4 bg-saffron-pale">📋</div>
              <span className="inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-[1.5px] uppercase bg-saffron-pale text-saffron mb-3 font-sora">हजेरी</span>
              <h3 className="font-bold text-text-900 text-[19px] mb-2 font-body">स्मार्ट हजेरी प्रणाली</h3>
              <p className="text-[13px] text-text-500 leading-relaxed mb-5 font-body">
                QR कोड, बायोमेट्रिक किंवा मॅन्युअल — गैरहजर तर तात्काळ WhatsApp.
              </p>
              <ul className="flex flex-col gap-2">
                {["QR स्कॅन हजेरी", "गैरहजर → WhatsApp तात्काळ", "मासिक PDF अहवाल", "RTE ८०% नियम चेक"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-text-500 font-body">
                    <span className="text-green-mid font-extrabold text-[11px] flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Fee Card */}
            <div className="rounded-[20px] p-7 bg-cream border-[1.5px] border-border-school hover:shadow-sh-md hover:-translate-y-1 hover:border-border-2 transition-all duration-300">
              <div className="w-[52px] h-[52px] rounded-[13px] flex items-center justify-center text-2xl mb-4 bg-green-pale">💰</div>
              <span className="inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-[1.5px] uppercase bg-green-pale text-green-mid mb-3 font-sora">शुल्क</span>
              <h3 className="font-bold text-text-900 text-[19px] mb-2 font-body">ऑनलाईन फी व्यवस्थापन</h3>
              <p className="text-[13px] text-text-500 leading-relaxed mb-5 font-body">
                UPI, नेटबँकिंग, कार्ड. थकित फी auto-reminder. Razorpay सुरक्षित.
              </p>
              <ul className="flex flex-col gap-2">
                {["Razorpay / UPI / QR", "Auto reminder SMS", "RTE मोफत प्रवेश track", "शुल्क माफी व्यवस्थापन"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-text-500 font-body">
                    <span className="text-green-mid font-extrabold text-[11px] flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Exam Card */}
            <div className="rounded-[20px] p-7 bg-cream border-[1.5px] border-border-school hover:shadow-sh-md hover:-translate-y-1 hover:border-border-2 transition-all duration-300">
              <div className="w-[52px] h-[52px] rounded-[13px] flex items-center justify-center text-2xl mb-4" style={{ background: "rgba(14,165,233,0.15)" }}>📊</div>
              <span className="inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-[1.5px] uppercase bg-sky/10 text-sky mb-3 font-sora">परीक्षा</span>
              <h3 className="font-bold text-text-900 text-[19px] mb-2 font-body">परीक्षा व निकाल</h3>
              <p className="text-[13px] text-text-500 leading-relaxed mb-5 font-body">
                गुण प्रविष्टी ते मराठी रिपोर्ट कार्ड — एका क्लिकमध्ये. e-signature सहित.
              </p>
              <ul className="flex flex-col gap-2">
                {["ऑनलाईन गुण प्रविष्टी", "मराठी रिपोर्ट कार्ड PDF", "SSC / CBSE पॅटर्न", "प्रगतिपुस्तक e-sign"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-text-500 font-body">
                    <span className="text-green-mid font-extrabold text-[11px] flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Admin Docs Card */}
            <div className="rounded-[20px] p-7 bg-cream border-[1.5px] border-border-school hover:shadow-sh-md hover:-translate-y-1 hover:border-border-2 transition-all duration-300">
              <div className="w-[52px] h-[52px] rounded-[13px] flex items-center justify-center text-2xl mb-4 bg-violet-100">📁</div>
              <span className="inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-[1.5px] uppercase bg-violet-100 text-violet-600 mb-3 font-sora">प्रशासन</span>
              <h3 className="font-bold text-text-900 text-[19px] mb-2 font-body">सरकारी दस्तऐवज केंद्र</h3>
              <p className="text-[13px] text-text-500 leading-relaxed mb-5 font-body">
                TC, बोनाफाईड, जन्म दाखला — डिजिटल सहीसकट तत्काळ. U-DISE auto.
              </p>
              <ul className="flex flex-col gap-2">
                {["TC / बोनाफाईड auto", "DigiLocker इंटीग्रेशन", "U-DISE एक्सपोर्ट", "शिष्यवृत्ती ट्रॅकिंग"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-text-500 font-body">
                    <span className="text-green-mid font-extrabold text-[11px] flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* eLearning Card */}
            <div className="rounded-[20px] p-7 bg-cream border-[1.5px] border-border-school hover:shadow-sh-md hover:-translate-y-1 hover:border-border-2 transition-all duration-300">
              <div className="w-[52px] h-[52px] rounded-[13px] flex items-center justify-center text-2xl mb-4 bg-rose-100">📚</div>
              <span className="inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-[1.5px] uppercase bg-rose-100 text-rose-600 mb-3 font-sora">शिक्षण</span>
              <h3 className="font-bold text-text-900 text-[19px] mb-2 font-body">ई-लर्निंग & गृहपाठ</h3>
              <p className="text-[13px] text-text-500 leading-relaxed mb-5 font-body">
                व्हिडिओ धडे, गृहपाठ, ऑनलाईन क्विझ — बालभारती पुस्तकांसह.
              </p>
              <ul className="flex flex-col gap-2">
                {["PDF / Video धडे", "ऑनलाईन गृहपाठ submit", "मराठी विषय साहित्य", "बालभारती लिंक"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-text-500 font-body">
                    <span className="text-green-mid font-extrabold text-[11px] flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        </section>
      </ScrollReveal>

      {/* Testimonials — decorative quote already present — section divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" aria-hidden />
      <ScrollReveal>
        <section className="bg-cream py-14 sm:py-20 md:py-[88px] px-4 sm:px-6 md:px-[60px] scroll-mt-20 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <span className="section-label mb-3 block">अभिप्राय</span>
          <h2 className="text-3xl md:text-[40px] font-extrabold text-text-900 mb-12 font-heading">
            शाळा काय म्हणतात <span className="text-saffron">आमच्याबद्दल</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-[22px] mt-[52px]">
            {[
              {
                stars: 5,
                text: "शाळाConnect वापरायला लागल्यापासून हजेरीचे रजिस्टर भरणे बंद झाले. पालकांना WhatsApp आपोआप जातो. खूप सोपे आहे, नवीन शिक्षकांनाही शिकायला वेळ नाही लागला.",
                name: "सुलभा देशमुख",
                role: "शिक्षक, इ.७वी | पुणे विद्यामंदिर",
                emoji: "👩‍🏫",
                iconBg: "bg-saffron-pale",
              },
              {
                stars: 5,
                text: "U-DISE अहवाल बनवायला आधी आठवडा लागायचा. आता एका क्लिकमध्ये PDF तयार होतो. मुख्याध्यापकांना approval द्यायला खूप सोपे झाले.",
                name: "महेश जाधव",
                role: "कारकून | जि.प. शाळा, नाशिक",
                emoji: "🧑‍💻",
                iconBg: "bg-green-pale",
              },
              {
                stars: 5,
                text: "माझ्या मुलाची हजेरी, गृहपाठ, परीक्षा — सगळे फोनवर दिसते. फी भरायला बँकेत जावे लागत नाही. शाळाConnect म्हणजे खूप मोठी सुविधा आहे.",
                name: "रजनी पाटील",
                role: "पालक, इ.८वी | औरंगाबाद",
                emoji: "👨‍👩‍👦",
                iconBg: "bg-violet-100",
              },
            ].map((t, i) => (
              <div key={i} className="bg-white border-[1.5px] border-border-school rounded-[20px] p-6 md:p-7 flex flex-col gap-4 hover:shadow-sh-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <span className="absolute -top-4 right-5 text-[110px] text-saffron/10 font-serif leading-none">&quot;</span>
                <div className="text-gold text-sm tracking-wider">{"★".repeat(t.stars)}</div>
                <p className="text-[13px] text-text-500 leading-relaxed flex-1 font-body italic relative z-10">{t.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border-school">
                  <div className={`w-[42px] h-[42px] rounded-full flex items-center justify-center text-lg flex-shrink-0 border-2 border-border-school ${t.iconBg}`}>{t.emoji}</div>
                  <div>
                    <div className="font-bold text-text-900 text-[13px] font-body">{t.name}</div>
                    <div className="text-[11px] text-text-300 font-body">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </section>
      </ScrollReveal>

      {/* Pricing — section divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" aria-hidden />
      <ScrollReveal>
        <section id="pricing" className="bg-cream-2 py-14 sm:py-20 md:py-[88px] px-4 sm:px-6 md:px-[60px] scroll-mt-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <span className="section-label mb-3 inline-block">किंमत</span>
            <h2 className="text-3xl md:text-[40px] font-extrabold text-text-900 mb-3 font-heading">
              परवडणारी, <span className="text-saffron">पारदर्शी किंमत</span>
            </h2>
            <p className="text-base text-text-500 font-body">लपवलेले शुल्क नाही. कधीही रद्द करता येते.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-[22px] max-w-[980px] mx-auto mt-[52px] items-start">
            {/* Starter */}
            <div className="rounded-[24px] p-8 border-[1.5px] border-border-school bg-white hover:shadow-sh-md transition-all duration-300">
              <div className="font-bold text-saffron text-[11px] font-extrabold tracking-[2.5px] uppercase mb-4 font-sora">स्टार्टर</div>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-[22px] font-semibold text-text-900 align-top mt-1.5">₹</span>
                <span className="text-[46px] font-extrabold text-text-900 leading-none">९९९</span>
              </div>
              <div className="text-xs text-text-300 mb-6 font-body">दर महिना · ५०० विद्यार्थ्यांपर्यंत</div>
              <div className="h-px bg-border-school mb-6" />
              <ul className="flex flex-col gap-2 mb-8">
                {["हजेरी + SMS सूचना", "फी व्यवस्थापन", "मराठी रिपोर्ट कार्ड", "WhatsApp (१,०००/महिना)", "Email सपोर्ट"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-text-500 font-body">
                    <span className="text-green-mid font-extrabold text-[11px] flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block text-center px-6 py-3.5 rounded-xl border-[1.5px] border-border-2 bg-white font-semibold text-sm text-text-900 hover:border-saffron hover:text-saffron transition-all font-body shadow-sh-sm">
                सुरू करा →
              </Link>
            </div>

            {/* Pro - best: navy gradient + border glow pulse per design.html */}
            <div className="rounded-[24px] p-8 border-2 border-saffron bg-gradient-to-br from-navy-2 to-slate-2 relative shadow-sh-xl md:scale-[1.04] md:-mt-2 animate-pro-glow">
              <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-gradient-to-r from-saffron to-gold text-white text-[11px] font-bold px-5 py-1.5 rounded-b-xl whitespace-nowrap shadow-saffron-glow">
                ⭐ सर्वात लोकप्रिय
              </div>
              <div className="font-bold text-saffron-bright text-[11px] font-extrabold tracking-[2.5px] uppercase mb-4 mt-6 font-sora">प्रो</div>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-[22px] font-semibold text-white align-top mt-1.5">₹</span>
                <span className="text-[46px] font-extrabold text-white leading-none">४,९९९</span>
              </div>
              <div className="text-xs text-white/50 mb-6 font-body">६ महिने · अमर्यादित विद्यार्थी</div>
              <div className="h-px bg-white/10 mb-6" />
              <ul className="flex flex-col gap-2 mb-8">
                {["सर्व Starter सुविधा", "AI मराठी सहाय्यक", "ई-लर्निंग मॉड्यूल", "U-DISE / RTE अहवाल", "बस GPS ट्रॅकिंग", "WhatsApp अमर्यादित", "फोन सपोर्ट"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-white/65 font-body">
                    <span className="text-saffron-bright font-extrabold text-[11px] flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block text-center px-6 py-3.5 rounded-xl bg-gradient-to-br from-saffron to-saffron-bright text-white font-semibold text-sm shadow-saffron-glow hover:shadow-saffron-hover hover:-translate-y-0.5 transition-all font-body">
                सुरू करा →
              </Link>
            </div>

            {/* Enterprise */}
            <div className="rounded-[24px] p-8 border-[1.5px] border-border-school bg-white hover:shadow-sh-md transition-all duration-300">
              <div className="font-bold text-saffron text-[11px] font-extrabold tracking-[2.5px] uppercase mb-4 font-sora">एंटरप्राइज</div>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-[22px] font-semibold text-text-900 align-top mt-1.5">₹</span>
                <span className="text-[46px] font-extrabold text-text-900 leading-none">७,९९९</span>
              </div>
              <div className="text-xs text-text-300 mb-6 font-body">१२ महिने · Multi-school</div>
              <div className="h-px bg-border-school mb-6" />
              <ul className="flex flex-col gap-2 mb-8">
                {["सर्व Pro सुविधा", "Alumni नेटवर्क", "DigiLocker", "Custom ब्रँडिंग", "Dedicated Manager", "API Access"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-text-500 font-body">
                    <span className="text-green-mid font-extrabold text-[11px] flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block text-center px-6 py-3.5 rounded-xl border-[1.5px] border-border-2 bg-white font-semibold text-sm text-text-900 hover:border-saffron hover:text-saffron transition-all font-body shadow-sh-sm">
                सुरू करा →
              </Link>
            </div>
          </div>

          <p className="text-center mt-8 text-sm text-text-500 font-body">
            🎓 सरकारी शाळांना ५०% सवलत &nbsp;|&nbsp; 🆓 ३० दिवस मोफत — कार्ड नको &nbsp;|&nbsp; ❌ कधीही रद्द करा
          </p>
        </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <FaqSection />
      </ScrollReveal>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-saffron via-amber-500 to-gold py-14 sm:py-20 px-4 sm:px-6 md:px-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(255,255,255,0.12),transparent)] pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-[42px] font-extrabold text-white mb-3 sm:mb-4 font-heading leading-tight">
            तुमची शाळा डिजिटल करायला<br className="hidden md:block" /> आजच सुरुवात करा
          </h2>
          <p className="text-[15px] sm:text-[17px] text-white/90 mb-6 sm:mb-8 font-body">
            ३० दिवस मोफत. क्रेडिट कार्ड नको. रद्द करणे मोफत.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-3.5 justify-center items-center">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-white text-saffron font-bold text-[15px] sm:text-base hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all font-body min-h-[48px] flex items-center justify-center touch-manipulation"
            >
              🚀 मोफत नोंदणी करा →
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-full border-2 border-white text-white font-bold text-[15px] sm:text-base hover:bg-white/10 active:bg-white/15 transition-colors font-body min-h-[48px] flex items-center justify-center touch-manipulation"
            >
              आधीच खाते आहे? लॉगिन
            </Link>
          </div>
        </div>
      </section>

      {/* Footer — 4-column matching design.html */}
      <footer className="bg-navy safe-area-padding">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 pt-16 pb-7">
          <div className="grid grid-cols-1 md:grid-cols-[2.2fr_1fr_1fr_1fr] gap-10 md:gap-12 mb-12">
            {/* Brand column */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-lg shrink-0">
                  🏫
                </div>
                <div>
                  <div className="font-extrabold text-white text-lg font-heading">
                    शाळा<span className="text-saffron-bright">Connect</span>
                  </div>
                  <div className="text-[9px] text-white tracking-[2px] uppercase font-semibold">Maharashtra Edu Platform</div>
                </div>
              </div>
              <p className="text-[13px] text-white leading-relaxed max-w-[260px] font-body mb-5">
                महाराष्ट्रातील शाळांसाठी संपूर्ण डिजिटल व्यवस्थापन. मराठीत सोपे, जलद आणि सुरक्षित.
              </p>
              <div className="flex gap-2">
                {["𝕏", "📘", "▶", "📸"].map((icon, i) => (
                  <button key={i} className="w-[34px] h-[34px] rounded-full bg-white/[0.06] border border-white/[0.09] flex items-center justify-center text-sm hover:bg-saffron hover:border-saffron hover:text-white hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            {/* Product links */}
            <div>
              <div className="text-[12px] font-bold text-white mb-4 tracking-[0.5px]">उत्पादन</div>
              <ul className="flex flex-col gap-2.5">
                {[
                  { label: "भूमिका", href: "#roles" },
                  { label: "वैशिष्ट्ये", href: "#features" },
                  { label: "किंमत", href: "#pricing" },
                  { label: "मदत केंद्र", href: "#faq" },
                  { label: "ताजे अपडेट्स", href: "#" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[12px] text-white hover:text-saffron-bright transition-colors font-body">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Support links */}
            <div>
              <div className="text-[12px] font-bold text-white mb-4 tracking-[0.5px]">सपोर्ट</div>
              <ul className="flex flex-col gap-2.5">
                {[
                  { label: "दस्तऐवज", href: "#" },
                  { label: "WhatsApp सपोर्ट", href: "#" },
                  { label: "Privacy Policy", href: "#" },
                  { label: "नियम व अटी", href: "#" },
                  { label: "सुरक्षा", href: "#" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[12px] text-white hover:text-saffron-bright transition-colors font-body">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Company links */}
            <div>
              <div className="text-[12px] font-bold text-white mb-4 tracking-[0.5px]">कंपनी</div>
              <ul className="flex flex-col gap-2.5">
                {[
                  { label: "आमच्याबद्दल", href: "#" },
                  { label: "ब्लॉग", href: "#" },
                  { label: "करिअर", href: "#" },
                  { label: "संपर्क", href: "#" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[12px] text-white hover:text-saffron-bright transition-colors font-body">
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/login" className="text-[12px] text-white hover:text-saffron-bright transition-colors font-body">लॉगिन</Link>
                </li>
                <li>
                  <Link href="/register" className="text-[12px] text-white hover:text-saffron-bright transition-colors font-body">नोंदणी</Link>
                </li>
              </ul>
            </div>
          </div>
          {/* Bottom bar */}
          <div className="border-t border-white/[0.07] pt-5 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-[11px] text-white font-body">
              © 2026 शाळाConnect · सर्व हक्क राखीव
            </p>
            <div className="flex items-center gap-2">
              <div className="flex flex-col w-5 h-3.5 rounded overflow-hidden border border-white/12">
                <div className="flex-1 bg-saffron" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-green-mid" />
              </div>
              <p className="text-[11px] text-white font-body">
                Proudly Made in India 🇮🇳 · 🔒 SSL · DPDP Compliant
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
