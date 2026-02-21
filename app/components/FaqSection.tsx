"use client"

import { useState } from "react"

const FAQS = [
  {
    q: "शाळाConnect वापरायला तांत्रिक ज्ञान लागते का?",
    a: "नाही. शाळाConnect पूर्णपणे मराठीत आहे. Smartphone वापरता येत असेल तर हे अ‍ॅप वापरता येते. आम्ही मोफत training देतो आणि video tutorials मराठीत आहेत.",
  },
  {
    q: "जुना Excel डेटा import करता येईल का?",
    a: "होय. विद्यार्थी यादी, शिक्षकांची माहिती — Excel / CSV मधून import होते. आमची team onboarding मध्ये मदत करते. १ दिवसात setup पूर्ण.",
  },
  {
    q: "Internet नसल्यास हजेरी घेता येईल का?",
    a: "होय! Pro आणि Enterprise मध्ये ऑफलाईन मोड आहे. Net नसताना हजेरी घ्या — नेटवर्क आल्यावर auto-sync होते.",
  },
  {
    q: "WhatsApp सूचनांसाठी अतिरिक्त खर्च येतो का?",
    a: "Starter मध्ये महिन्याला १,००० WhatsApp messages मोफत. Pro मध्ये अमर्यादित. जास्त लागल्यास ₹०.१३–०.१६ / message.",
  },
  {
    q: "सरकारी (ZP) शाळांसाठी विशेष सुविधा आहे का?",
    a: "होय. ZP शाळांसाठी ५०% सवलत. U-DISE, RTE, शिष्यवृत्ती formats तयार आहेत. BEO/DEO dashboard — जिल्ह्यातील सर्व शाळांचा एकत्र आढावा.",
  },
]

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="bg-navy-2 py-20 md:py-24 px-6 md:px-16">
      <div className="max-w-[860px] mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-5 h-0.5 bg-saffron rounded" />
            <span className="text-[10px] font-extrabold tracking-[3px] uppercase text-saffron">FAQ</span>
            <div className="w-5 h-0.5 bg-saffron rounded" />
          </div>
          <h2 className="text-3xl md:text-[40px] font-extrabold text-white font-[family-name:var(--font-noto-devanagari)]">
            वारंवार <span className="text-saffron">विचारले जाणारे प्रश्न</span>
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${open === i ? "border-saffron/40 bg-white/[0.09]" : "border-white/10 bg-white/[0.05] hover:bg-white/[0.07]"}`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
              >
                <span className={`font-semibold text-sm md:text-base leading-snug font-[family-name:var(--font-noto-devanagari)] transition-colors ${open === i ? "text-white" : "text-white/75"}`}>
                  {faq.q}
                </span>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all ${open === i ? "bg-saffron text-white rotate-45" : "bg-white/10 text-white/50"}`}>
                  +
                </span>
              </button>
              {open === i && (
                <div className="px-5 pb-5">
                  <div className="h-px bg-white/10 mb-4" />
                  <p className="text-sm text-white/60 leading-relaxed font-[family-name:var(--font-noto-devanagari)]">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
