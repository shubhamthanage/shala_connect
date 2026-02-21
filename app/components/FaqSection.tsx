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
    <section id="faq" className="bg-white py-14 sm:py-20 md:py-[88px] px-4 sm:px-6 md:px-[60px] scroll-mt-20">
      <div className="max-w-[760px] mx-auto">
        <div className="text-center mb-12">
          <span className="section-label mb-3 inline-block">FAQ</span>
          <h2 className="text-3xl md:text-[40px] font-extrabold text-text-900 font-heading">
            वारंवार <span className="text-saffron">विचारले जाणारे प्रश्न</span>
          </h2>
        </div>

        <div className="flex flex-col gap-2.5 mt-12">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border-[1.5px] transition-all duration-200 overflow-hidden ${open === i ? "border-saffron bg-cream" : "border-border-school bg-cream hover:border-border-2"}`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-inset rounded-2xl"
              >
                <span className={`font-semibold text-sm md:text-base leading-snug font-body transition-colors ${open === i ? "text-text-900" : "text-text-900"}`}>
                  {faq.q}
                </span>
                <span className={`w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0 text-[13px] font-bold transition-all border ${open === i ? "bg-saffron text-white border-saffron rotate-180" : "bg-white text-saffron border-border-school"}`}>
                  ▼
                </span>
              </button>
              {open === i && (
                <div className="px-5 pb-5">
                  <p className="text-[13px] text-text-500 leading-relaxed font-body">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
