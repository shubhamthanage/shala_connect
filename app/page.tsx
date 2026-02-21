import Link from "next/link"
import FaqSection from "./components/FaqSection"

export default function Home() {
  return (
    <div className="min-h-screen bg-navy">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 h-[70px] flex items-center justify-between transition-all bg-navy/95 backdrop-blur-xl border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-xl shadow-lg shadow-saffron/40">
            🏫
          </div>
          <div>
            <div className="font-extrabold text-white text-xl font-[family-name:var(--font-noto-devanagari)]">
              शाळा<span className="text-saffron-bright">Connect</span>
            </div>
            <div className="text-[9px] text-white/35 tracking-[2.5px] uppercase font-semibold">
              Maharashtra Edu Platform
            </div>
          </div>
        </Link>
        <div className="hidden md:flex gap-7">
          <Link href="#features" className="text-sm font-medium text-white/65 hover:text-white transition-colors font-[family-name:var(--font-noto-devanagari)]">
            वैशिष्ट्ये
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium text-white/65 hover:text-white transition-colors font-[family-name:var(--font-noto-devanagari)]">
            कसे वापरावे
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-white/65 hover:text-white transition-colors font-[family-name:var(--font-noto-devanagari)]">
            किंमत
          </Link>
          <Link href="#features" className="text-sm font-medium text-white/65 hover:text-white transition-colors font-[family-name:var(--font-noto-devanagari)]">
            भूमिका
          </Link>
          <Link href="#" className="text-sm font-medium text-white/65 hover:text-white transition-colors font-[family-name:var(--font-noto-devanagari)]">
            मदत
          </Link>
        </div>
        <div className="flex gap-2.5 items-center">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-full bg-white/10 border border-white/15 text-white text-sm font-semibold hover:bg-white/15 transition-colors font-[family-name:var(--font-noto-devanagari)]"
          >
            लॉगिन
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-full bg-gradient-to-br from-saffron to-saffron-bright text-white text-sm font-semibold shadow-lg shadow-saffron/30 hover:shadow-xl hover:shadow-saffron/45 hover:-translate-y-0.5 transition-all font-[family-name:var(--font-noto-devanagari)]"
          >
            मोफत सुरू करा →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="min-h-screen bg-navy relative overflow-hidden pt-[70px] flex flex-col">
        {/* Background canvas */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 900px 700px at 70% 50%, rgba(244,106,10,0.10) 0%, transparent 70%), radial-gradient(ellipse 600px 500px at 10% 80%, rgba(21,128,61,0.08) 0%, transparent 70%), radial-gradient(ellipse 400px 400px at 50% 20%, rgba(14,165,233,0.05) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
            }}
          />
        </div>

        {/* Floating badges - desktop only */}
        <div className="hidden xl:block absolute top-[18%] right-[470px] z-10 bg-white rounded-2xl px-4 py-3 flex items-center gap-2.5 shadow-lg border-l-4 border-saffron">
          <span className="text-lg">📱</span>
          <div>
            <div className="text-xs font-bold text-text-900 font-[family-name:var(--font-noto-devanagari)]">WhatsApp गेला</div>
            <div className="text-[10px] text-text-300">२,४७ पालकांना — आत्ता</div>
          </div>
        </div>
        <div className="hidden xl:block absolute bottom-[25%] right-[470px] z-10 bg-white rounded-2xl px-4 py-3 flex items-center gap-2.5 shadow-lg border-l-4 border-green-school">
          <span className="text-lg">✅</span>
          <div>
            <div className="text-xs font-bold text-text-900 font-[family-name:var(--font-noto-devanagari)]">फी जमा — ₹४,५००</div>
            <div className="text-[10px] text-text-300">Razorpay यशस्वी</div>
          </div>
        </div>

        <div className="flex-1 flex items-center px-12 md:px-16 pb-16 relative z-10 gap-12 max-w-[1400px] mx-auto w-full">
          <div className="flex-1 max-w-[590px]">
            <div className="inline-flex items-center gap-2.5 bg-saffron/10 border border-saffron/30 px-4 py-2 rounded-full mb-6">
              <div className="w-2 h-2 rounded-full bg-green-bright shadow-[0_0_0_3px_rgba(34,197,94,0.25)] animate-pulse" />
              <span className="text-xs font-semibold text-saffron-bright font-[family-name:var(--font-noto-devanagari)]">
                महाराष्ट्र #१ शाळा व्यवस्थापन प्लॅटफॉर्म
              </span>
            </div>
            <h1 className="font-black text-white text-[42px] md:text-[58px] leading-[1.13] mb-6 font-[family-name:var(--font-noto-devanagari)]">
              <span className="bg-gradient-to-br from-saffron-bright to-gold-light bg-clip-text text-transparent">
                डिजिटल शाळा
              </span>
              <br />
              आता <span className="relative">मराठीत
                <span className="absolute bottom-[-3px] left-0 right-0 h-[3px] bg-gradient-to-r from-green-mid to-green-bright rounded" />
              </span>
              <br />
              सोपे, जलद, स्मार्ट
            </h1>
            <p className="text-[17px] text-white/58 leading-relaxed mb-8 max-w-[510px] font-[family-name:var(--font-noto-devanagari)]">
              मुख्याध्यापक, शिक्षक, कारकून, विद्यार्थी आणि पालक — पाचही जणांसाठी एकच अॅप. हजेरीपासून दाखल्यापर्यंत, फीपासून निकालापर्यंत सर्व डिजिटल.
            </p>
            <div className="flex gap-3.5 flex-wrap mb-10">
              <Link
                href="/register"
                className="px-8 py-4 rounded-full bg-gradient-to-br from-saffron to-saffron-bright text-white font-semibold text-[15px] shadow-lg shadow-saffron/30 hover:shadow-xl hover:shadow-saffron/45 hover:-translate-y-0.5 transition-all font-[family-name:var(--font-noto-devanagari)]"
              >
                🚀 ३० दिवस मोफत वापरा
              </Link>
              <button className="px-8 py-4 rounded-full border-2 border-white/40 text-white font-semibold text-[15px] hover:bg-white/10 transition-colors font-[family-name:var(--font-noto-devanagari)]">
                ▶ डेमो पहा
              </button>
            </div>
            <div className="flex gap-5 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[17px]">🔒</span>
                <div className="text-xs text-white/40 font-[family-name:var(--font-noto-devanagari)]">
                  <strong className="block text-white/72 text-[13px]">१०० % सुरक्षित</strong>
                  SSL Encrypted
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[17px]">🇮🇳</span>
                <div className="text-xs text-white/40 font-[family-name:var(--font-noto-devanagari)]">
                  <strong className="block text-white/72 text-[13px]">भारतात बनवले</strong>
                  Pune, Maharashtra
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[17px]">📴</span>
                <div className="text-xs text-white/40 font-[family-name:var(--font-noto-devanagari)]">
                  <strong className="block text-white/72 text-[13px]">ऑफलाईन काम</strong>
                  Net नसताना ही
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard preview card */}
          <div className="hidden lg:flex flex-1 justify-end items-center">
            <div className="w-[470px] bg-white/[0.048] backdrop-blur-[28px] border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/50">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-base">
                    👨‍💼
                  </div>
                  <div>
                    <div className="font-bold text-white text-[13px] font-[family-name:var(--font-noto-devanagari)]">मुख्य डॅशबोर्ड</div>
                    <div className="text-[10px] text-white/40 font-[family-name:var(--font-noto-devanagari)]">पुणे विद्यामंदिर</div>
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
                    <div className="font-extrabold text-white text-xl font-[family-name:var(--font-noto-devanagari)]">{s.n}</div>
                    <div className="text-[10px] text-white/40 font-[family-name:var(--font-noto-devanagari)]">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white/[0.055] border border-white/10 rounded-xl p-3 mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-semibold text-white/65 font-[family-name:var(--font-noto-devanagari)]">📋 आजची हजेरी</span>
                  <span className="text-xs font-bold text-green-bright font-[family-name:var(--font-noto-devanagari)]">८७% · १,०८५/१,२४७</span>
                </div>
                <div className="h-1.5 bg-white/[0.07] rounded overflow-hidden">
                  <div className="h-full w-[87%] bg-gradient-to-r from-green-mid to-green-bright rounded" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-white/[0.035] rounded-lg px-3 py-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-saffron shadow-[0_0_5px_rgba(244,106,10,0.2)]" />
                  <span className="text-[11px] text-white/58 font-[family-name:var(--font-noto-devanagari)]">⚠️ इ.७वी ब — ३ विद्यार्थी गैरहजर, WhatsApp गेले</span>
                </div>
                <div className="flex items-center gap-2 bg-white/[0.035] rounded-lg px-3 py-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-bright" />
                  <span className="text-[11px] text-white/58 font-[family-name:var(--font-noto-devanagari)]">✅ वार्षिक परीक्षा वेळापत्रक सर्व पालकांना पाठवले</span>
                </div>
                <div className="flex items-center gap-2 bg-white/[0.035] rounded-lg px-3 py-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky" />
                  <span className="text-[11px] text-white/58 font-[family-name:var(--font-noto-devanagari)]">💰 आजचे फी कलेक्शन ९२% पूर्ण — ₹२.४ लाख</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Band */}
      <div className="bg-gradient-to-r from-saffron to-gold py-6 px-12 md:px-16 flex justify-center">
        <div className="max-w-[1400px] w-full flex flex-wrap justify-center gap-8 md:gap-0">
          {[
            { n: "५०,०००+", l: "शाळा वापरतात" },
            { n: "२५ लाख+", l: "विद्यार्थी" },
            { n: "९९.९%", l: "Uptime गॅरंटी" },
            { n: "३६", l: "जिल्हे सक्रिय" },
            { n: "4.9 ★", l: "App Store Rating" },
          ].map((item, i) => (
            <div key={i} className="flex-1 min-w-[120px] text-center relative last:after:hidden md:after:content-[''] md:after:absolute md:after:right-0 md:after:top-[15%] md:after:bottom-[15%] md:after:w-px md:after:bg-white/30">
              <div className="font-extrabold text-white text-2xl md:text-3xl font-[family-name:var(--font-noto-devanagari)]">{item.n}</div>
              <div className="text-xs text-white/80 mt-1 font-[family-name:var(--font-noto-devanagari)]">{item.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Roles Section */}
      <section id="features" className="bg-navy-2 py-20 md:py-24 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-0.5 bg-saffron rounded" />
            <span className="text-[10px] font-extrabold tracking-[3px] uppercase text-saffron">वापरकर्ते</span>
          </div>
          <h2 className="text-3xl md:text-[40px] font-extrabold text-white mb-4 font-[family-name:var(--font-noto-devanagari)]">
            प्रत्येकासाठी <span className="text-saffron">वेगळा अनुभव</span>
          </h2>
          <p className="text-base text-white/55 leading-relaxed max-w-[560px] mb-12 font-[family-name:var(--font-noto-devanagari)]">
            पाच भूमिका, पाच वेगळे डॅशबोर्ड — योग्य माहिती, योग्य व्यक्तीला, योग्य वेळी
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
            {[
              { emoji: "👨‍💼", name: "मुख्याध्यापक", desc: "संपूर्ण शाळेचे नियंत्रण, अहवाल, परवानग्या", tag: "१५+ मॉड्यूल्स" },
              { emoji: "👩‍🏫", name: "शिक्षक", desc: "हजेरी, गुण, गृहपाठ, विद्यार्थी प्रगती", tag: "२०+ मॉड्यूल्स" },
              { emoji: "🧑‍💻", name: "कारकून", desc: "दाखले, शुल्क, दस्तऐवज, सरकारी अहवाल", tag: "१८+ मॉड्यूल्स" },
              { emoji: "👦", name: "विद्यार्थी", desc: "वेळापत्रक, गृहपाठ, निकाल, ई-लायब्ररी", tag: "१२+ मॉड्यूल्स" },
              { emoji: "👨‍👩‍👦", name: "पालक", desc: "हजेरी, गुण, शुल्क, शिक्षक भेट बुकिंग", tag: "१०+ मॉड्यूल्स" },
            ].map((role, i) => (
              <div
                key={i}
                className="rounded-[20px] p-6 md:p-7 text-center border border-white/10 bg-white/[0.07] hover:-translate-y-2 hover:scale-[1.02] hover:bg-white/[0.11] transition-all cursor-pointer"
              >
                <span className="text-4xl md:text-5xl block mb-3">{role.emoji}</span>
                <div className="font-bold text-white text-base mb-2 font-[family-name:var(--font-noto-devanagari)]">{role.name}</div>
                <div className="text-xs text-white/55 leading-relaxed mb-4 font-[family-name:var(--font-noto-devanagari)]">{role.desc}</div>
                <span className="inline-block px-3 py-1.5 rounded-full text-[10px] font-bold bg-white/10 text-white/60 border border-white/15 font-[family-name:var(--font-noto-devanagari)]">
                  {role.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-navy py-20 md:py-24 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-0.5 bg-saffron rounded" />
            <span className="text-[10px] font-extrabold tracking-[3px] uppercase text-saffron">कसे वापरावे</span>
          </div>
          <h2 className="text-3xl md:text-[40px] font-extrabold text-white mb-4 font-[family-name:var(--font-noto-devanagari)]">
            ४ सोप्या पायऱ्या, <span className="text-saffron">शाळा डिजिटल</span>
          </h2>
          <p className="text-base text-white/55 leading-relaxed max-w-[560px] mb-12 font-[family-name:var(--font-noto-devanagari)]">
            तांत्रिक ज्ञान नको. मराठीत सर्व. पहिल्याच दिवशी वापर सुरू.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-saffron via-gold to-green-mid hidden md:block -z-0 opacity-40" />
            {[
              { num: "१", title: "नोंदणी करा", desc: "शाळेचे नाव, जिल्हा, वर्ग संख्या — ५ मिनिटांत खाते. मोफत ३० दिवस.", color: "saffron" },
              { num: "२", title: "माहिती भरा", desc: "Excel मधून विद्यार्थी import करा. शिक्षकांना invite करा.", color: "gold" },
              { num: "३", title: "वापर सुरू करा", desc: "हजेरी घ्या, फी घ्या, सूचना पाठवा. सर्व automatic.", color: "sky" },
              { num: "४", title: "रिपोर्ट पहा", desc: "U-DISE, RTE, मासिक अहवाल — एका क्लिकमध्ये.", color: "green-mid" },
            ].map((step, i) => (
              <div key={i} className="text-center relative z-10 bg-white/[0.05] border border-white/10 rounded-2xl p-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg mx-auto mb-4 border-2 border-white/20 text-white shadow-lg`}
                  style={{
                    background: step.color === "saffron" ? "linear-gradient(135deg, #F46A0A, #F59E0B)" :
                      step.color === "gold" ? "linear-gradient(135deg, #F59E0B, #FCD34D)" :
                        step.color === "sky" ? "#0EA5E9" : "linear-gradient(135deg, #16A34A, #22C55E)",
                  }}
                >
                  {step.num}
                </div>
                <div className="font-bold text-white text-[15px] mb-2 font-[family-name:var(--font-noto-devanagari)]">{step.title}</div>
                <div className="text-xs text-white/55 leading-relaxed font-[family-name:var(--font-noto-devanagari)]">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-navy py-20 md:py-24 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-0.5 bg-saffron rounded" />
            <span className="text-[10px] font-extrabold tracking-[3px] uppercase text-saffron">मुख्य वैशिष्ट्ये</span>
          </div>
          <h2 className="text-3xl md:text-[40px] font-extrabold text-white mb-4 font-[family-name:var(--font-noto-devanagari)]">
            शाळेचे <span className="text-saffron">संपूर्ण डिजिटलायझेशन</span>
          </h2>
          <p className="text-base text-white/55 leading-relaxed max-w-[560px] mb-12 font-[family-name:var(--font-noto-devanagari)]">
            एकाच प्लॅटफॉर्मवर सर्व — कागद नाही, वेळ वाचतो, अचूकता वाढते
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* AI Card - dark featured card */}
            <div className="rounded-3xl p-7 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-white/10 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-saffron/10 blur-3xl -translate-y-10 translate-x-10 pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4" style={{ background: "rgba(244,106,10,0.2)" }}>🤖</div>
              <span className="inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-widest uppercase bg-saffron/20 text-saffron-bright border border-saffron/30 mb-3">AI-POWERED</span>
              <h3 className="font-bold text-white text-lg mb-2 font-[family-name:var(--font-noto-devanagari)]">मराठी AI सहाय्यक</h3>
              <p className="text-sm text-white/55 leading-relaxed mb-5 font-[family-name:var(--font-noto-devanagari)]">
                मराठीत बोला — AI तुमचे काम करेल. रिपोर्ट तयार करा, प्रश्न विचारा.
              </p>
              <ul className="flex flex-col gap-2">
                {["मराठी व्हॉईस कमांड", "Auto रिपोर्ट जनरेशन", "विद्यार्थी प्रगती अंदाज", "ChatBot पालकांसाठी"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-white/65 font-[family-name:var(--font-noto-devanagari)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Attendance Card */}
            <div className="rounded-3xl p-7 bg-white/[0.07] border border-white/10 hover:-translate-y-1 hover:bg-white/[0.11] transition-all">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4" style={{ background: "rgba(244,106,10,0.2)" }}>📋</div>
              <span className="inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-widest uppercase bg-saffron/20 text-saffron-bright border border-saffron/30 mb-3">हजेरी</span>
              <h3 className="font-bold text-white text-lg mb-2 font-[family-name:var(--font-noto-devanagari)]">स्मार्ट हजेरी प्रणाली</h3>
              <p className="text-sm text-white/55 leading-relaxed mb-5 font-[family-name:var(--font-noto-devanagari)]">
                QR कोड, बायोमेट्रिक किंवा मॅन्युअल — गैरहजर तर तात्काळ WhatsApp.
              </p>
              <ul className="flex flex-col gap-2">
                {["QR स्कॅन हजेरी", "गैरहजर → WhatsApp तात्काळ", "मासिक PDF अहवाल", "RTE ८०% नियम चेक"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-white/65 font-[family-name:var(--font-noto-devanagari)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Fee Card */}
            <div className="rounded-3xl p-7 bg-white/[0.07] border border-white/10 hover:-translate-y-1 hover:bg-white/[0.11] transition-all">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4" style={{ background: "rgba(22,163,74,0.2)" }}>💰</div>
              <span className="inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-widest uppercase bg-green-bright/20 text-green-bright border border-green-bright/30 mb-3">शुल्क</span>
              <h3 className="font-bold text-white text-lg mb-2 font-[family-name:var(--font-noto-devanagari)]">ऑनलाईन फी व्यवस्थापन</h3>
              <p className="text-sm text-white/55 leading-relaxed mb-5 font-[family-name:var(--font-noto-devanagari)]">
                UPI, नेटबँकिंग, कार्ड. थकित फी auto-reminder. Razorpay सुरक्षित.
              </p>
              <ul className="flex flex-col gap-2">
                {["Razorpay / UPI / QR", "Auto reminder SMS", "RTE मोफत प्रवेश track", "शुल्क माफी व्यवस्थापन"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-white/65 font-[family-name:var(--font-noto-devanagari)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-bright flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Exam Card */}
            <div className="rounded-3xl p-7 bg-white/[0.07] border border-white/10 hover:-translate-y-1 hover:bg-white/[0.11] transition-all">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4" style={{ background: "rgba(14,165,233,0.2)" }}>📊</div>
              <span className="inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-widest uppercase bg-sky/20 text-sky border border-sky/30 mb-3">परीक्षा</span>
              <h3 className="font-bold text-white text-lg mb-2 font-[family-name:var(--font-noto-devanagari)]">परीक्षा व निकाल</h3>
              <p className="text-sm text-white/55 leading-relaxed mb-5 font-[family-name:var(--font-noto-devanagari)]">
                गुण प्रविष्टी ते मराठी रिपोर्ट कार्ड — एका क्लिकमध्ये. e-signature सहित.
              </p>
              <ul className="flex flex-col gap-2">
                {["ऑनलाईन गुण प्रविष्टी", "मराठी रिपोर्ट कार्ड PDF", "SSC / CBSE पॅटर्न", "प्रगतिपुस्तक e-sign"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-white/65 font-[family-name:var(--font-noto-devanagari)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Admin Docs Card */}
            <div className="rounded-3xl p-7 bg-white/[0.07] border border-white/10 hover:-translate-y-1 hover:bg-white/[0.11] transition-all">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4" style={{ background: "rgba(139,92,246,0.2)" }}>📁</div>
              <span className="inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-widest uppercase bg-violet-400/20 text-violet-300 border border-violet-400/30 mb-3">प्रशासन</span>
              <h3 className="font-bold text-white text-lg mb-2 font-[family-name:var(--font-noto-devanagari)]">सरकारी दस्तऐवज केंद्र</h3>
              <p className="text-sm text-white/55 leading-relaxed mb-5 font-[family-name:var(--font-noto-devanagari)]">
                TC, बोनाफाईड, जन्म दाखला — डिजिटल सहीसकट तत्काळ. U-DISE auto.
              </p>
              <ul className="flex flex-col gap-2">
                {["TC / बोनाफाईड auto", "DigiLocker इंटीग्रेशन", "U-DISE एक्सपोर्ट", "शिष्यवृत्ती ट्रॅकिंग"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-white/65 font-[family-name:var(--font-noto-devanagari)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* eLearning Card */}
            <div className="rounded-3xl p-7 bg-white/[0.07] border border-white/10 hover:-translate-y-1 hover:bg-white/[0.11] transition-all">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4" style={{ background: "rgba(239,68,68,0.2)" }}>📚</div>
              <span className="inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-widest uppercase bg-red-400/20 text-red-300 border border-red-400/30 mb-3">शिक्षण</span>
              <h3 className="font-bold text-white text-lg mb-2 font-[family-name:var(--font-noto-devanagari)]">ई-लर्निंग & गृहपाठ</h3>
              <p className="text-sm text-white/55 leading-relaxed mb-5 font-[family-name:var(--font-noto-devanagari)]">
                व्हिडिओ धडे, गृहपाठ, ऑनलाईन क्विझ — बालभारती पुस्तकांसह.
              </p>
              <ul className="flex flex-col gap-2">
                {["PDF / Video धडे", "ऑनलाईन गृहपाठ submit", "मराठी विषय साहित्य", "बालभारती लिंक"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-white/65 font-[family-name:var(--font-noto-devanagari)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-navy-2 py-20 md:py-24 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-0.5 bg-saffron rounded" />
            <span className="text-[10px] font-extrabold tracking-[3px] uppercase text-saffron">अभिप्राय</span>
          </div>
          <h2 className="text-3xl md:text-[40px] font-extrabold text-white mb-12 font-[family-name:var(--font-noto-devanagari)]">
            शाळा काय म्हणतात <span className="text-saffron">आमच्याबद्दल</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                stars: 5,
                text: "शाळाConnect वापरायला लागल्यापासून हजेरीचे रजिस्टर भरणे बंद झाले. पालकांना WhatsApp आपोआप जातो. खूप सोपे आहे, नवीन शिक्षकांनाही शिकायला वेळ नाही लागला.",
                name: "सुलभा देशमुख",
                role: "शिक्षक, इ.७वी | पुणे विद्यामंदिर",
                emoji: "👩‍🏫",
                iconBg: "rgba(244,106,10,0.2)",
              },
              {
                stars: 5,
                text: "U-DISE अहवाल बनवायला आधी आठवडा लागायचा. आता एका क्लिकमध्ये PDF तयार होतो. मुख्याध्यापकांना approval द्यायला खूप सोपे झाले.",
                name: "महेश जाधव",
                role: "कारकून | जि.प. शाळा, नाशिक",
                emoji: "🧑‍💻",
                iconBg: "rgba(22,163,74,0.2)",
              },
              {
                stars: 5,
                text: "माझ्या मुलाची हजेरी, गृहपाठ, परीक्षा — सगळे फोनवर दिसते. फी भरायला बँकेत जावे लागत नाही. शाळाConnect म्हणजे खूप मोठी सुविधा आहे.",
                name: "रजनी पाटील",
                role: "पालक, इ.८वी | औरंगाबाद",
                emoji: "👨‍👩‍👦",
                iconBg: "rgba(139,92,246,0.2)",
              },
            ].map((t, i) => (
              <div key={i} className="bg-white/[0.07] border border-white/10 rounded-3xl p-7 flex flex-col gap-4">
                <div className="text-saffron text-lg tracking-wider">{"★".repeat(t.stars)}</div>
                <p className="text-sm text-white/65 leading-relaxed flex-1 font-[family-name:var(--font-noto-devanagari)]">{t.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0" style={{ background: t.iconBg }}>{t.emoji}</div>
                  <div>
                    <div className="font-bold text-white text-sm font-[family-name:var(--font-noto-devanagari)]">{t.name}</div>
                    <div className="text-[11px] text-white/40 font-[family-name:var(--font-noto-devanagari)]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-navy py-20 md:py-24 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-5 h-0.5 bg-saffron rounded" />
              <span className="text-[10px] font-extrabold tracking-[3px] uppercase text-saffron">किंमत</span>
              <div className="w-5 h-0.5 bg-saffron rounded" />
            </div>
            <h2 className="text-3xl md:text-[40px] font-extrabold text-white mb-3 font-[family-name:var(--font-noto-devanagari)]">
              परवडणारी, <span className="text-saffron">पारदर्शी किंमत</span>
            </h2>
            <p className="text-base text-white/55 font-[family-name:var(--font-noto-devanagari)]">लपवलेले शुल्क नाही. कधीही रद्द करता येते.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Starter */}
            <div className="rounded-3xl p-8 border border-white/10 bg-white/[0.07]">
              <div className="font-bold text-white/55 text-sm mb-4 font-[family-name:var(--font-noto-devanagari)]">स्टार्टर</div>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-2xl font-bold text-white">₹</span>
                <span className="text-5xl font-extrabold text-white leading-none">९९९</span>
              </div>
              <div className="text-xs text-white/40 mb-6 font-[family-name:var(--font-noto-devanagari)]">दर महिना · ५०० विद्यार्थ्यांपर्यंत</div>
              <div className="h-px bg-white/10 mb-6" />
              <ul className="flex flex-col gap-3 mb-8">
                {["हजेरी + SMS सूचना", "फी व्यवस्थापन", "मराठी रिपोर्ट कार्ड", "WhatsApp (१,०००/महिना)", "Email सपोर्ट"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/65 font-[family-name:var(--font-noto-devanagari)]">
                    <span className="w-5 h-5 rounded-full bg-saffron/20 flex items-center justify-center text-[10px] text-saffron-bright flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block text-center px-6 py-3.5 rounded-2xl border border-white/30 text-white font-bold text-sm hover:bg-white/10 transition-all font-[family-name:var(--font-noto-devanagari)]">
                सुरू करा →
              </Link>
            </div>

            {/* Pro - highlighted */}
            <div className="rounded-3xl p-8 border-2 border-saffron bg-navy relative shadow-2xl shadow-saffron/20 -mt-4 md:-mt-6">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-saffron to-gold text-white text-[10px] font-extrabold px-4 py-1.5 rounded-full whitespace-nowrap tracking-wide">
                ⭐ सर्वात लोकप्रिय
              </div>
              <div className="font-bold text-white/60 text-sm mb-4 font-[family-name:var(--font-noto-devanagari)]">प्रो</div>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-2xl font-bold text-white">₹</span>
                <span className="text-5xl font-extrabold text-white leading-none">४,९९९</span>
              </div>
              <div className="text-xs text-white/45 mb-6 font-[family-name:var(--font-noto-devanagari)]">६ महिने · अमर्यादित विद्यार्थी</div>
              <div className="h-px bg-white/10 mb-6" />
              <ul className="flex flex-col gap-3 mb-8">
                {["सर्व Starter सुविधा", "AI मराठी सहाय्यक", "ई-लर्निंग मॉड्यूल", "U-DISE / RTE अहवाल", "बस GPS ट्रॅकिंग", "WhatsApp अमर्यादित", "फोन सपोर्ट"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/80 font-[family-name:var(--font-noto-devanagari)]">
                    <span className="w-5 h-5 rounded-full bg-saffron/20 flex items-center justify-center text-[10px] text-saffron-bright flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block text-center px-6 py-3.5 rounded-2xl bg-gradient-to-r from-saffron to-saffron-bright text-white font-bold text-sm shadow-lg shadow-saffron/30 hover:shadow-xl hover:-translate-y-0.5 transition-all font-[family-name:var(--font-noto-devanagari)]">
                सुरू करा →
              </Link>
            </div>

            {/* Enterprise */}
            <div className="rounded-3xl p-8 border border-white/10 bg-white/[0.07]">
              <div className="font-bold text-white/55 text-sm mb-4 font-[family-name:var(--font-noto-devanagari)]">एंटरप्राइज</div>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-2xl font-bold text-white">₹</span>
                <span className="text-5xl font-extrabold text-white leading-none">७,९९९</span>
              </div>
              <div className="text-xs text-white/40 mb-6 font-[family-name:var(--font-noto-devanagari)]">१२ महिने · Multi-school</div>
              <div className="h-px bg-white/10 mb-6" />
              <ul className="flex flex-col gap-3 mb-8">
                {["सर्व Pro सुविधा", "Alumni नेटवर्क", "DigiLocker", "Custom ब्रँडिंग", "Dedicated Manager", "API Access"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/65 font-[family-name:var(--font-noto-devanagari)]">
                    <span className="w-5 h-5 rounded-full bg-saffron/20 flex items-center justify-center text-[10px] text-saffron-bright flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block text-center px-6 py-3.5 rounded-2xl border border-white/30 text-white font-bold text-sm hover:bg-white/10 transition-all font-[family-name:var(--font-noto-devanagari)]">
                सुरू करा →
              </Link>
            </div>
          </div>

          <p className="text-center mt-8 text-sm text-white/40 font-[family-name:var(--font-noto-devanagari)]">
            🎓 सरकारी शाळांना ५०% सवलत &nbsp;|&nbsp; 🆓 ३० दिवस मोफत — कार्ड नको &nbsp;|&nbsp; ❌ कधीही रद्द करा
          </p>
        </div>
      </section>

      <FaqSection />

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-saffron via-gold to-amber-500 py-20 px-6 md:px-16 text-center">
        <h2 className="text-3xl md:text-[42px] font-extrabold text-white mb-4 font-[family-name:var(--font-noto-devanagari)]">
          तुमची शाळा डिजिटल करायला<br className="hidden md:block" /> आजच सुरुवात करा
        </h2>
        <p className="text-[17px] text-white/85 mb-8 font-[family-name:var(--font-noto-devanagari)]">
          ३० दिवस मोफत. क्रेडिट कार्ड नको. रद्द करणे मोफत.
        </p>
        <div className="flex gap-3.5 justify-center flex-wrap">
          <Link
            href="/register"
            className="px-10 py-4 rounded-full bg-white text-saffron font-bold text-base hover:shadow-xl hover:-translate-y-1 transition-all font-[family-name:var(--font-noto-devanagari)]"
          >
            🚀 मोफत नोंदणी करा →
          </Link>
          <Link
            href="/login"
            className="px-10 py-4 rounded-full border-2 border-white text-white font-bold text-base hover:bg-white/10 transition-colors font-[family-name:var(--font-noto-devanagari)]"
          >
            आधीच खाते आहे? लॉगिन
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy py-12 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-lg">
              🏫
            </div>
            <div>
              <div className="font-extrabold text-white text-lg font-[family-name:var(--font-noto-devanagari)]">
                शाळा<span className="text-saffron-bright">Connect</span>
              </div>
              <div className="text-[10px] text-white/35">Maharashtra Edu Platform</div>
            </div>
          </div>
          <div className="flex gap-6">
            <Link href="/login" className="text-sm text-white/60 hover:text-white font-[family-name:var(--font-noto-devanagari)]">लॉगिन</Link>
            <Link href="/register" className="text-sm text-white/60 hover:text-white font-[family-name:var(--font-noto-devanagari)]">नोंदणी</Link>
            <Link href="#" className="text-sm text-white/60 hover:text-white font-[family-name:var(--font-noto-devanagari)]">मदत</Link>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-[11px] text-white/30 font-[family-name:var(--font-noto-devanagari)]">
            🔒 SSL Encrypted · DPDP Compliant · Made in India 🇮🇳
          </p>
        </div>
      </footer>
    </div>
  )
}
