import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface AnimatedCounterProps {
  start?: number
  end: number
  duration?: number
  suffix?: string
  decimals?: number
  className?: string
}

export function AnimatedCounter({
  start = 0,
  end,
  duration = 1.8,
  suffix = '',
  decimals = 0,
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(start)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true

    const startTime = performance.now()
    const durationMs = duration * 1000

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / durationMs, 1)

      const eased = 1 - Math.pow(1 - progress, 3)
      const currentValue = start + (end - start) * eased

      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, start, end, duration])

  const formatted = decimals > 0 ? count.toFixed(decimals) : Math.round(count)

  return (
    <span ref={ref} className={className}>
      {formatted}{suffix}
    </span>
  )
}
