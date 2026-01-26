import { useState, useEffect, lazy, Suspense } from 'react'
import PlanAApp from './designs/plan-a-business/PlanAApp'

const AnimationSelector = import.meta.env.DEV
  ? lazy(() => import('./designs/AnimationSelector'))
  : null;

function App() {
  const [showAnimationSelector, setShowAnimationSelector] = useState(false)
  const [skipIntro, setSkipIntro] = useState(false)

  // Toggle with keyboard shortcut (Press 'D' for Demo/Design selector) — dev only
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const handleKeyDown = (e) => {
      if (e.key === 'd' || e.key === 'D') {
        if (!e.target.closest('input, textarea')) {
          setShowAnimationSelector(prev => !prev)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (import.meta.env.DEV && showAnimationSelector && AnimationSelector) {
    return (
      <Suspense fallback={null}>
        <AnimationSelector
          onSelect={(plan) => {
            console.log('Selected plan:', plan)
            setSkipIntro(true)
            setShowAnimationSelector(false)
          }}
        />
      </Suspense>
    )
  }

  return (
    <>
      <PlanAApp key={skipIntro ? 'skip' : 'normal'} initialPage="cube" />
      {import.meta.env.DEV && (
        <div
          style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            fontSize: '10px',
            color: 'rgba(255, 255, 255, 0.2)',
            fontFamily: 'monospace',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          Press 'D' for Animation Designs
        </div>
      )}
    </>
  )
}

export default App
