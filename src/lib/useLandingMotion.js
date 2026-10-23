import { useEffect, useState } from 'react'

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Adds `is-visible` to every [data-reveal] element as it scrolls into view.
export function useReveal(rootRef) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const targets = root.querySelectorAll('[data-reveal]')
    if (reducedMotion() || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [rootRef])
}

// Writes the page scroll (px) and progress (0–1) into CSS variables on the root element,
// once per animation frame. CSS turns them into the progress bar and hero parallax.
export function useScrollVars(rootRef) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      root.style.setProperty('--scroll-y', String(window.scrollY))
      root.style.setProperty('--scroll-progress', String(max > 0 ? window.scrollY / max : 0))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [rootRef])
}

// Index of the "How it works" step closest to the middle of the screen.
export function useActiveStep(stepRefs) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const steps = stepRefs.current.filter(Boolean)
    if (!steps.length || !('IntersectionObserver' in window)) return
    // On phones the sticky phone covers the top of the screen, so steps are read lower down.
    const narrow = window.matchMedia('(max-width: 899px)').matches
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.step))
        }
      },
      { rootMargin: narrow ? '-62% 0px -28% 0px' : '-45% 0px -45% 0px' },
    )
    steps.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [stepRefs])
  return active
}
