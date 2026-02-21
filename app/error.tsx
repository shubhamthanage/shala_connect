"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4" role="img" aria-label="चेतावनी">⚠️</div>
        <h1 className="text-2xl font-extrabold text-text-900 font-heading mb-2">
          काहीतरी चुकीचे झाले
        </h1>
        <p className="text-text-500 font-body mb-6">
          अप्रत्याशित त्रुटी आली. आम्ही त्रुटी नोंदवत आहोत. कृपया पुन्हा प्रयत्न करा किंवा मुख्य पृष्ठावर जा.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-full bg-gradient-to-br from-saffron to-saffron-bright text-white font-semibold shadow-saffron-glow hover:shadow-saffron-hover transition-all font-body"
          >
            पुन्हा प्रयत्न करा
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-full border-[1.5px] border-border-2 bg-white text-text-700 font-semibold hover:border-saffron hover:text-saffron transition-colors font-body"
          >
            मुख्य पृष्ठ
          </Link>
        </div>
      </div>
    </div>
  )
}
