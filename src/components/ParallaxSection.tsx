'use client'
import { useEffect, useRef } from 'react'

export default function ParallaxSection({ children, speed = 0.3, className = '' }: {
  children: React.ReactNode
  speed?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const centerY = rect.top + rect.height / 2 - window.innerHeight / 2
      el.style.transform = `translateY(${centerY * speed}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])

  return (
    <div ref={ref} className={`parallax-slow ${className}`}>
      {children}
    </div>
  )
}
