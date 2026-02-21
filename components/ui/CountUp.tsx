"use client"

import { useEffect, useRef, useState } from "react"

interface CountUpProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
  format?: (n: number) => string
}

export function CountUp({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
  className = "",
  format = (n) => Math.round(n).toLocaleString("mr-IN"),
}: CountUpProps) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || hasAnimated) return

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) {
      setValue(end)
      setHasAnimated(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const start = 0
          const startTime = performance.now()
          const animate = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(start + (end - start) * eased)
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration, hasAnimated])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {format(value)}
      {suffix}
    </span>
  )
}
