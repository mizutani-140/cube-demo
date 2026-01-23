import { useState, useEffect } from 'react'
import PlanAApp from './designs/plan-a-business/PlanAApp'
import AnimationSelector from './designs/AnimationSelector'

function App() {
  const [showAnimationSelector, setShowAnimationSelector] = useState(false)
  const [skipIntro, setSkipIntro] = useState(false)

  // Toggle with keyboard shortcut (Press 'D' for Demo/Design selector)
  useEffect(() => {
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

  if (showAnimationSelector) {
    return (
      <AnimationSelector
        onSelect={(plan) => {
          console.log('Selected plan:', plan)
          // All plans skip intro after AnimationSelector preview (they already saw the animation)
          setSkipIntro(true)
          setShowAnimationSelector(false)
        }}
      />
    )
  }

  return (
    <>
      <PlanAApp key={skipIntro ? 'skip' : 'normal'} initialPage="cube" />
      {/* Design selector toggle hint */}
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
    </>
  )
}

export default App
