"use client"

import { useState, useEffect } from "react"

const STORAGE_KEY = "shalaconnect-onboarding-complete"

export function WelcomeTour() {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (typeof window === "undefined") return
    const done = localStorage.getItem(STORAGE_KEY)
    if (!done) setVisible(true)
  }, [])

  const steps = [
    {
      title: "शाळाConnect मध्ये स्वागत आहे! 🎉",
      desc: "तुमची शाळा डिजिटल करण्यासाठी आम्ही तुम्हाला मदत करू. पहिल्या काही पायऱ्या पूर्ण करा.",
      cta: "पुढे",
    },
    {
      title: "१. वर्ग जोडा",
      desc: "प्रथम तुमचे वर्ग (इ.१वी अ, इ.२वी ब इ.) जोडा. हे विद्यार्थी आणि हजेरी साठी आवश्यक आहे.",
      cta: "वर्ग जोडा",
      href: "/dashboard/headmaster/classes/add",
    },
    {
      title: "२. शिक्षक आणि वापरकर्ते जोडा",
      desc: "शिक्षकांना invite करा. ते स्वतःच लॉगिन करून हजेरी घेऊ शकतील.",
      cta: "वापरकर्ते जोडा",
      href: "/dashboard/headmaster/users/add",
    },
    {
      title: "३. विद्यार्थी नोंदणी करा",
      desc: "Excel मधून import करा किंवा एक-एक करून नोंदणी करा.",
      cta: "विद्यार्थी पहा",
      href: "/dashboard/headmaster/students",
    },
    {
      title: "सर्व तयार! 🚀",
      desc: "आता तुम्ही हजेरी घेऊ शकता, शुल्क व्यवस्थापित करू शकता आणि अहवाल तयार करू शकता.",
      cta: "सुरू करा",
    },
  ]

  const current = steps[step]
  if (!visible || !current) return null

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      localStorage.setItem(STORAGE_KEY, "1")
      setVisible(false)
    }
  }

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY, "1")
    setVisible(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-2xl shadow-sh-xl max-w-md w-full p-6 md:p-8 border border-border-school animate-scale-in"
        role="dialog"
        aria-labelledby="tour-title"
        aria-describedby="tour-desc"
      >
        <h2 id="tour-title" className="text-xl font-bold text-text-900 font-heading mb-3">
          {current.title}
        </h2>
        <p id="tour-desc" className="text-text-500 text-sm font-body mb-6 leading-relaxed">
          {current.desc}
        </p>

        <div className="flex gap-2 mb-4">
          {steps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStep(i)}
              className={`h-2 rounded-full transition-all ${
                i === step ? "w-6 bg-saffron" : "w-2 bg-border-school"
              }`}
              aria-label={`स्टेप ${i + 1}`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSkip}
            className="px-4 py-2.5 rounded-xl text-text-500 text-sm font-semibold hover:bg-cream font-body transition-colors"
          >
            वगळा
          </button>
          {current.href ? (
            <a
              href={current.href}
              onClick={handleNext}
              className="btn-primary px-6 py-2.5 text-sm flex-1 text-center"
            >
              {current.cta}
            </a>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary px-6 py-2.5 text-sm flex-1"
            >
              {current.cta}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
