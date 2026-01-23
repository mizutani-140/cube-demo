/**
 * Retro Terminal Animation for Plan A
 * レトロコンピュータ風タイピングアニメーション
 *
 * Features:
 * - CRT scanlines effect
 * - Green phosphor text
 * - Character-by-character typing
 * - Blinking cursor
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';

// Terminal content - CUBE philosophy and concept
const TERMINAL_LINES = [
  { text: 'CUBE CORPORATE SYSTEM v2.013', delay: 0, type: 'header' },
  { text: '────────────────────────────────────', delay: 100, type: 'divider' },
  { text: '', delay: 200, type: 'blank' },
  { text: '>LOADING PHILOSOPHY...', delay: 300, type: 'command' },
  { text: '', delay: 800, type: 'blank' },
  { text: '>LIFE × ART × BUILD', delay: 1000, type: 'title' },
  { text: '', delay: 1500, type: 'blank' },
  { text: '>暮らしを、感性で組み立てる。', delay: 1700, type: 'statement' },
  { text: '', delay: 2500, type: 'blank' },
  { text: '>INITIALIZING VISION...', delay: 2800, type: 'command' },
  { text: '', delay: 3200, type: 'blank' },
  { text: '>すべての暮らしに、思想と美意識を。', delay: 3400, type: 'vision' },
  { text: '', delay: 4200, type: 'blank' },
  { text: '>SYSTEM READY_', delay: 4500, type: 'ready' },
];

// Typing speed configuration
const TYPING_SPEED = 35; // ms per character
const CURSOR_BLINK_SPEED = 530;

function useTypingAnimation(lines) {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const animationRef = useRef(null);

  useEffect(() => {
    // Cursor blink
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, CURSOR_BLINK_SPEED);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      setIsComplete(true);
      return;
    }

    const currentLine = lines[currentLineIndex];

    // Wait for delay before starting this line
    const delayTimeout = setTimeout(() => {
      if (currentCharIndex < currentLine.text.length) {
        // Type next character
        animationRef.current = setTimeout(() => {
          setDisplayedLines(prev => {
            const newLines = [...prev];
            if (!newLines[currentLineIndex]) {
              newLines[currentLineIndex] = { ...currentLine, displayedText: '' };
            }
            newLines[currentLineIndex] = {
              ...newLines[currentLineIndex],
              displayedText: currentLine.text.substring(0, currentCharIndex + 1),
            };
            return newLines;
          });
          setCurrentCharIndex(prev => prev + 1);
        }, TYPING_SPEED);
      } else {
        // Move to next line
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }
    }, currentLineIndex === 0 ? currentLine.delay : (currentCharIndex === 0 ? 100 : 0));

    return () => {
      clearTimeout(delayTimeout);
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [currentLineIndex, currentCharIndex, lines]);

  // Skip function - instantly complete all typing
  const skipToEnd = useCallback(() => {
    const completedLines = lines.map(line => ({
      ...line,
      displayedText: line.text,
    }));
    setDisplayedLines(completedLines);
    setCurrentLineIndex(lines.length);
    setIsComplete(true);
  }, [lines]);

  return { displayedLines, isComplete, showCursor, currentLineIndex, skipToEnd };
}

function TerminalLine({ line, isCurrentLine, showCursor }) {
  const getLineColor = (type) => {
    switch (type) {
      case 'header':
        return '#00ff41';
      case 'divider':
        return '#00aa2a';
      case 'command':
        return '#00ff41';
      case 'title':
        return '#00ff88';
      case 'statement':
        return '#88ffaa';
      case 'vision':
        return '#88ffaa';
      case 'business':
        return '#00cc44';
      case 'ready':
        return '#00ff41';
      default:
        return '#00ff41';
    }
  };

  const getLineStyle = (type) => {
    const base = {
      fontFamily: '"VT323", "Courier New", monospace',
      fontSize: '24px',
      lineHeight: '1.6',
      letterSpacing: '2px',
      textShadow: `0 0 10px ${getLineColor(type)}, 0 0 20px ${getLineColor(type)}50`,
      color: getLineColor(type),
      margin: 0,
      padding: '2px 0',
      whiteSpace: 'pre',
    };

    if (type === 'title') {
      return { ...base, fontSize: '32px', fontWeight: 'bold' };
    }
    if (type === 'statement' || type === 'vision') {
      return { ...base, fontSize: '22px' };
    }
    if (type === 'header') {
      return { ...base, fontSize: '20px' };
    }

    return base;
  };

  if (!line || !line.displayedText) return null;

  return (
    <div style={getLineStyle(line.type)}>
      {line.displayedText}
      {isCurrentLine && showCursor && (
        <span style={{
          backgroundColor: '#00ff41',
          color: '#000',
          animation: 'none',
        }}>▋</span>
      )}
    </div>
  );
}

function Scanlines() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `repeating-linear-gradient(
          0deg,
          rgba(0, 0, 0, 0.15),
          rgba(0, 0, 0, 0.15) 1px,
          transparent 1px,
          transparent 2px
        )`,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  );
}

function CRTOverlay() {
  return (
    <>
      {/* Vignette effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)',
          pointerEvents: 'none',
          zIndex: 11,
        }}
      />
      {/* Screen flicker - subtle */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 255, 65, 0.02)',
          pointerEvents: 'none',
          zIndex: 12,
          animation: 'flicker 0.1s infinite',
        }}
      />
    </>
  );
}

// Character cube transition - characters converge to form cube then fly towards user
function CharacterCubeTransition({ onComplete, displayedLines }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Phase timing - elegant but not too slow
  const CONVERGE_DURATION = 1400; // ms - characters converge to cube
  const HOLD_DURATION = 500; // ms - hold cube formation before flying
  const FLY_DURATION = 600; // ms - cube flies towards user

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    // Extract all characters from displayed lines
    const characters = [];
    const colors = ['#00ff41', '#00ff88', '#88ffaa', '#00ffff', '#ffff00', '#ff6b6b', '#54a0ff'];

    // Get text container position (approximate)
    const containerTop = height * 0.25;
    const containerLeft = width * 0.15;
    const lineHeight = 38;
    const charWidth = 14;

    (displayedLines || []).forEach((line, lineIndex) => {
      if (!line || !line.displayedText) return;
      const text = line.displayedText;
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === ' ') continue;
        characters.push({
          char,
          // Starting position (where text was displayed)
          startX: containerLeft + i * charWidth,
          startY: containerTop + lineIndex * lineHeight,
          // Current position
          x: containerLeft + i * charWidth,
          y: containerTop + lineIndex * lineHeight,
          // Cube target position (will be set)
          cubeX: 0,
          cubeY: 0,
          // Flying velocity
          vx: 0,
          vy: 0,
          // Visual properties
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 16 + Math.random() * 8,
          rotation: 0,
          scale: 1,
        });
      }
    });

    // If no characters, complete immediately
    if (characters.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    // Generate cube formation positions - larger, clearer wireframe cube
    const cubeSize = 160; // Larger cube for better visibility

    // Define cube edges (12 edges of a cube)
    const cubeEdges = [
      // Bottom face edges
      [[-1, -1, -1], [1, -1, -1]],
      [[1, -1, -1], [1, -1, 1]],
      [[1, -1, 1], [-1, -1, 1]],
      [[-1, -1, 1], [-1, -1, -1]],
      // Top face edges
      [[-1, 1, -1], [1, 1, -1]],
      [[1, 1, -1], [1, 1, 1]],
      [[1, 1, 1], [-1, 1, 1]],
      [[-1, 1, 1], [-1, 1, -1]],
      // Vertical edges
      [[-1, -1, -1], [-1, 1, -1]],
      [[1, -1, -1], [1, 1, -1]],
      [[1, -1, 1], [1, 1, 1]],
      [[-1, -1, 1], [-1, 1, 1]],
    ];

    // 8 vertices for reference
    const cubeVertices = [
      [-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1],
      [-1, 1, -1], [1, 1, -1], [1, 1, 1], [-1, 1, 1],
    ];

    // Base rotation angles for nice 3D view
    const baseRotX = 0.5;
    const baseRotY = 0.8;

    // 3D rotation function with dynamic rotation
    const rotate3D = (x, y, z, rotY = baseRotY, rotX = baseRotX) => {
      // Rotate around Y axis
      let rx = x * Math.cos(rotY) - z * Math.sin(rotY);
      let rz = x * Math.sin(rotY) + z * Math.cos(rotY);
      // Rotate around X axis
      let ry = y * Math.cos(rotX) - rz * Math.sin(rotX);
      rz = y * Math.sin(rotX) + rz * Math.cos(rotX);
      return { x: rx, y: ry, z: rz };
    };

    // Project 3D point to 2D
    const project3D = (x, y, z, rotYOffset = 0) => {
      const rotated = rotate3D(x, y, z, baseRotY + rotYOffset, baseRotX);
      const perspective = 2.2 / (3 - rotated.z * 0.4);
      return {
        x: centerX + rotated.x * cubeSize * perspective,
        y: centerY - rotated.y * cubeSize * perspective,
        z: rotated.z,
        scale: perspective,
      };
    };

    // Distribute characters evenly along cube edges
    const charsPerEdge = Math.max(4, Math.ceil(characters.length / 12));
    let charIndex = 0;

    cubeEdges.forEach((edge, edgeIndex) => {
      const [start, end] = edge;
      const edgeChars = Math.min(charsPerEdge, characters.length - charIndex);

      for (let i = 0; i < edgeChars && charIndex < characters.length; i++) {
        const t = edgeChars > 1 ? i / (edgeChars - 1) : 0.5;

        // Interpolate position along edge
        const x = start[0] + (end[0] - start[0]) * t;
        const y = start[1] + (end[1] - start[1]) * t;
        const z = start[2] + (end[2] - start[2]) * t;

        const projected = project3D(x, y, z);

        characters[charIndex].cubeX = projected.x;
        characters[charIndex].cubeY = projected.y;
        characters[charIndex].z = projected.z;
        characters[charIndex].edgeIndex = edgeIndex;
        characters[charIndex].cubePos = { x, y, z }; // Store 3D position for rotation

        charIndex++;
      }
    });

    // Any remaining characters go to random positions along edges
    while (charIndex < characters.length) {
      const edgeIndex = charIndex % 12;
      const edge = cubeEdges[edgeIndex];
      const t = Math.random();
      const x = edge[0][0] + (edge[1][0] - edge[0][0]) * t;
      const y = edge[0][1] + (edge[1][1] - edge[0][1]) * t;
      const z = edge[0][2] + (edge[1][2] - edge[0][2]) * t;

      const projected = project3D(x, y, z);

      characters[charIndex].cubeX = projected.x;
      characters[charIndex].cubeY = projected.y;
      characters[charIndex].z = projected.z;
      characters[charIndex].edgeIndex = edgeIndex;
      characters[charIndex].cubePos = { x, y, z };

      charIndex++;
    }

    // Function to draw cube wireframe
    const drawCubeWireframe = (ctx, rotYOffset, alpha, lineColor = '#00ff41') => {
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = alpha;

      // Draw edges
      cubeEdges.forEach(edge => {
        const start = project3D(edge[0][0], edge[0][1], edge[0][2], rotYOffset);
        const end = project3D(edge[1][0], edge[1][1], edge[1][2], rotYOffset);

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      });

      // Draw vertices as small dots
      ctx.fillStyle = lineColor;
      cubeVertices.forEach(v => {
        const projected = project3D(v[0], v[1], v[2], rotYOffset);
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const startTime = performance.now();
    const totalDuration = CONVERGE_DURATION + HOLD_DURATION + FLY_DURATION;

    // Current rotation offset for animation
    let rotationOffset = 0;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;

      // Clear canvas completely for clean rendering
      ctx.fillStyle = '#050805';
      ctx.fillRect(0, 0, width, height);

      ctx.font = 'bold 16px "VT323", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (elapsed < CONVERGE_DURATION) {
        // Phase 1: Converge to cube (slower, more elegant)
        const progress = elapsed / CONVERGE_DURATION;
        // Smooth ease out
        const eased = 1 - Math.pow(1 - progress, 3);

        // Draw target wireframe as guide (fading in)
        if (progress > 0.3) {
          const wireframeAlpha = (progress - 0.3) / 0.7 * 0.3;
          drawCubeWireframe(ctx, 0, wireframeAlpha, '#00ff4140');
        }

        // Draw characters moving to their positions
        characters.forEach((c, i) => {
          // Staggered animation - characters arrive at different times based on their edge
          const edgeDelay = (c.edgeIndex || 0) / 12 * 0.4;
          const adjustedProgress = Math.max(0, Math.min(1, (progress - edgeDelay) / (1 - edgeDelay)));
          const staggerEased = 1 - Math.pow(1 - adjustedProgress, 3);

          c.x = c.startX + (c.cubeX - c.startX) * staggerEased;
          c.y = c.startY + (c.cubeY - c.startY) * staggerEased;

          // Trail effect - draw multiple fading copies
          if (staggerEased > 0.1 && staggerEased < 0.95) {
            ctx.save();
            ctx.globalAlpha = 0.15;
            ctx.fillStyle = c.color;
            const trailX = c.startX + (c.cubeX - c.startX) * (staggerEased - 0.1);
            const trailY = c.startY + (c.cubeY - c.startY) * (staggerEased - 0.1);
            ctx.fillText(c.char, trailX, trailY);
            ctx.restore();
          }

          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.fillStyle = c.color;
          ctx.globalAlpha = 0.5 + staggerEased * 0.5;
          ctx.shadowColor = c.color;
          ctx.shadowBlur = staggerEased * 12;
          ctx.fillText(c.char, 0, 0);
          ctx.restore();
        });

      } else if (elapsed < CONVERGE_DURATION + HOLD_DURATION) {
        // Phase 2: Hold and rotate the formed cube with wireframe
        const holdProgress = (elapsed - CONVERGE_DURATION) / HOLD_DURATION;
        rotationOffset = holdProgress * Math.PI * 0.25; // Gentle rotation

        // Draw wireframe first (behind characters)
        drawCubeWireframe(ctx, rotationOffset, 0.4, '#00ff41');

        // Draw characters at their rotated cube positions
        characters.forEach((c, i) => {
          if (c.cubePos) {
            // Recalculate position with rotation
            const projected = project3D(c.cubePos.x, c.cubePos.y, c.cubePos.z, rotationOffset);
            c.x = projected.x;
            c.y = projected.y;
          }

          // Gentle breathing effect
          const breathe = 1 + Math.sin(holdProgress * Math.PI * 3 + i * 0.2) * 0.05;

          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.scale(breathe, breathe);
          ctx.fillStyle = c.color;
          ctx.globalAlpha = 1;
          ctx.shadowColor = c.color;
          ctx.shadowBlur = 15;
          ctx.fillText(c.char, 0, 0);
          ctx.restore();
        });

        // Draw "CUBE" text in center during hold
        const textAlpha = Math.sin(holdProgress * Math.PI) * 0.6;
        ctx.save();
        ctx.globalAlpha = textAlpha;
        ctx.fillStyle = '#00ff41';
        ctx.font = 'bold 24px "VT323", monospace';
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 20;
        ctx.fillText('CUBE', centerX, centerY);
        ctx.restore();

      } else {
        // Phase 3: Characters disperse and fly towards user
        const flyElapsed = elapsed - CONVERGE_DURATION - HOLD_DURATION;
        const progress = flyElapsed / FLY_DURATION;
        const eased = progress * progress * progress; // ease in cubic - accelerate

        // Fading wireframe
        if (progress < 0.4) {
          drawCubeWireframe(ctx, rotationOffset, (1 - progress / 0.4) * 0.3, '#00ff41');
        }

        characters.forEach((c, i) => {
          // Each character has unique random direction for dispersion
          if (!c.flyAngle) {
            c.flyAngle = Math.random() * Math.PI * 2;
            c.flySpeed = 0.5 + Math.random() * 1.5;
            c.rotSpeed = (Math.random() - 0.5) * 10;
          }

          // Disperse outward from cube position
          const disperseX = Math.cos(c.flyAngle) * eased * 400 * c.flySpeed;
          const disperseY = Math.sin(c.flyAngle) * eased * 400 * c.flySpeed;

          // Scale up dramatically (flying towards camera)
          const scale = 1 + eased * 18;

          c.x = c.cubeX + disperseX;
          c.y = c.cubeY + disperseY;
          c.scale = scale;
          c.rotation = eased * c.rotSpeed;

          // Fade out as they get very close
          const alpha = Math.max(0, 1 - eased * 1.3);

          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate(c.rotation);
          ctx.scale(c.scale, c.scale);
          ctx.fillStyle = c.color;
          ctx.globalAlpha = alpha;
          ctx.fillText(c.char, 0, 0);
          ctx.restore();
        });

        // White flash at the end
        if (progress > 0.65) {
          const flashAlpha = (progress - 0.65) / 0.35;
          ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
          ctx.fillRect(0, 0, width, height);
        }
      }

      if (elapsed < totalDuration) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        if (onComplete) onComplete();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [onComplete, displayedLines]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    />
  );
}

export default function RetroTerminalAnimation({ onComplete, onNavigate, onReady, onTransition }) {
  const { displayedLines, isComplete, showCursor, currentLineIndex, skipToEnd } = useTypingAnimation(TERMINAL_LINES);
  const [showEnterPrompt, setShowEnterPrompt] = useState(false);
  const [isWarping, setIsWarping] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isComplete) {
      const timeout = setTimeout(() => {
        setShowEnterPrompt(true);
        // Notify that animation is ready (for AnimationSelector)
        if (onReady) onReady();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isComplete, onReady]);

  const executeTransition = useCallback(() => {
    // Support both onNavigate (from PlanAApp) and onTransition (from AnimationSelector)
    if (onNavigate) {
      onNavigate({ id: 'interior' });
    } else if (onTransition) {
      onTransition();
    }
  }, [onNavigate, onTransition]);

  const handleTransition = useCallback(() => {
    if (isWarping) return;

    if (!isComplete) {
      // Skip typing and then start transition
      skipToEnd();
      // Small delay to let state update, then start warp
      setTimeout(() => setIsWarping(true), 50);
    } else {
      setIsWarping(true);
    }
  }, [isWarping, isComplete, skipToEnd]);

  const handleClick = useCallback(() => {
    handleTransition();
  }, [handleTransition]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleTransition();
    }
  }, [handleTransition]);

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0a0f0a',
        background: 'radial-gradient(ellipse at center, #0a150a 0%, #050805 100%)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* Character cube transition effect */}
      {isWarping && <CharacterCubeTransition onComplete={executeTransition} displayedLines={displayedLines} />}

      {/* CRT effects */}
      <Scanlines />
      <CRTOverlay />

      {/* Terminal content */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '800px',
          padding: '40px',
          zIndex: 5,
        }}
      >
        {/* Terminal content - no border */}
        <div>
          {/* Lines */}
          <div style={{ minHeight: '280px' }}>
            {displayedLines.map((line, index) => (
              <TerminalLine
                key={index}
                line={line}
                isCurrentLine={index === currentLineIndex - 1}
                showCursor={showCursor && index === currentLineIndex - 1}
              />
            ))}

            {/* Cursor on current typing line */}
            {!isComplete && currentLineIndex < TERMINAL_LINES.length && (
              <div style={{
                fontFamily: '"VT323", "Courier New", monospace',
                fontSize: '24px',
                color: '#00ff41',
              }}>
                {showCursor && <span style={{ backgroundColor: '#00ff41', color: '#000' }}>▋</span>}
              </div>
            )}
          </div>

          {/* Enter prompt */}
          {showEnterPrompt && (
            <div
              style={{
                marginTop: '40px',
                animation: 'fadeIn 0.5s ease-in',
              }}
            >
              <div
                style={{
                  fontFamily: '"VT323", "Courier New", monospace',
                  fontSize: '18px',
                  color: '#00ff41',
                  textAlign: 'center',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  letterSpacing: '3px',
                }}
              >
                {'>>> PRESS ENTER OR CLICK TO CONTINUE <<<'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer branding */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 5,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: '"VT323", "Courier New", monospace',
            fontSize: '14px',
            color: '#00aa2a',
            letterSpacing: '4px',
          }}
        >
          CUBE CORPORATION © 2013 - 2026
        </div>
        <div
          style={{
            fontFamily: '"VT323", "Courier New", monospace',
            fontSize: '12px',
            color: '#006618',
            letterSpacing: '2px',
            marginTop: '8px',
          }}
        >
          TOKYO • MEGURO
        </div>
      </div>

      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.98; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          color-scheme: dark;
        }

        body {
          background: #050805;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
