import React, { useState, useEffect, useRef } from 'react';

/**
 * Plan C v5: 「デジタルネイチャー」- 完璧な立方体版
 *
 * コンセプト: Digital Nature / Colorful Life
 * - 14x14x14グリッドの表面キューブをアイソメトリック投影で描画
 * - 高速な組み立てアニメーション（約2秒で完成）
 * - 虹色のカラーパレットでデジタルと自然の融合を表現
 * - 完成後は微細な呼吸アニメーション
 *
 * カラー: 多彩なレインボーグラデーション
 * 印象: 生命力、多様性、デジタルネイチャー
 */

const DataConstructionAnimation = ({ onReady, onTransition }) => {
  const [phase, setPhase] = useState('assembling');
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // カラーパレット
  const allColors = [
    '#FF6B6B', '#E74C3C', '#FF4757', '#FF6348', '#EA5455',
    '#FF9F43', '#FFA502', '#FFBE76', '#F39C12', '#FF7F50',
    '#FFEAA7', '#FFD93D', '#FFC312', '#F9CA24', '#FDCB6E',
    '#96CEB4', '#26DE81', '#2ECC71', '#00B894', '#55E6C1',
    '#20BF6B', '#A3CB38', '#1ABC9C', '#00D2D3',
    '#4ECDC4', '#00CEC9', '#48DBFB', '#0ABDE3', '#7ED6DF',
    '#45B7D1', '#54A0FF', '#74B9FF', '#70A1FF',
    '#3498DB', '#686DE0', '#4834D4',
    '#DDA0DD', '#BB8FCE', '#A55EEA', '#8E44AD', '#9B59B6',
    '#D980FA', '#E056FD', '#BE2EDD',
    '#FF6B9D', '#FD79A8', '#FC427B', '#F78FB3', '#FF9FF3',
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    // メインページの3Dキューブと同じ見た目サイズに調整
    // Three.js: CUBE_SIZE = 2.2, camera distance = 6, FOV = 45
    // 画面の約35-40%程度の高さになるように調整
    const targetCubeHeight = Math.min(height, width) * 0.38;
    const gridSize = 14;
    const cubeSize = targetCubeHeight / (gridSize * 1.8);
    const spacing = cubeSize * 1.15;

    // 正確なアイソメトリック立方体を描画するクラス
    class MiniCube {
      constructor(targetX, targetY, targetZ, color, delay) {
        this.targetX = targetX;
        this.targetY = targetY;
        this.targetZ = targetZ;

        const offsetRange = 100;
        this.x = targetX + (Math.random() - 0.5) * offsetRange;
        this.y = targetY + (Math.random() - 0.5) * offsetRange;

        this.color = color;
        this.delay = delay;
        this.arrived = false;
        this.alpha = 0;

        // 各面の色を計算
        this.topColor = color;
        this.leftColor = this.adjustBrightness(color, -30);
        this.rightColor = this.adjustBrightness(color, -55);
      }

      adjustBrightness(hex, amount) {
        const num = parseInt(hex.slice(1), 16);
        let r = (num >> 16) + amount;
        let g = ((num >> 8) & 0x00FF) + amount;
        let b = (num & 0x0000FF) + amount;
        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));
        return `rgb(${r},${g},${b})`;
      }

      update(time, currentPhase) {
        if (currentPhase === 'assembling') {
          if (time > this.delay) {
            const ease = 0.06;
            this.x += (this.targetX - this.x) * ease;
            this.y += (this.targetY - this.y) * ease;
            this.alpha = Math.min(1, this.alpha + 0.035);

            if (Math.abs(this.x - this.targetX) < 0.5 &&
                Math.abs(this.y - this.targetY) < 0.5) {
              this.arrived = true;
              this.x = this.targetX;
              this.y = this.targetY;
            }
          }
        } else if (currentPhase === 'complete') {
          const breathe = Math.sin(time * 1.2 + this.delay * 8) * 0.5;
          this.x = this.targetX + breathe * 0.15;
          this.y = this.targetY + breathe * 0.1;
        } else if (currentPhase === 'transition') {
          this.alpha *= 0.94;
        }
      }

      draw(ctx, size) {
        if (this.alpha <= 0.01) return;

        ctx.globalAlpha = this.alpha;

        const x = this.x;
        const y = this.y;

        // アイソメトリック投影の正確な計算
        const cos30 = Math.cos(Math.PI / 6);
        const sin30 = Math.sin(Math.PI / 6);

        const w = size * cos30;
        const h = size * sin30;
        const d = size;

        // 上面の4頂点
        const topPoints = [
          { x: x, y: y - h },
          { x: x + w, y: y },
          { x: x, y: y + h },
          { x: x - w, y: y }
        ];

        // 左面の4頂点
        const leftPoints = [
          { x: x - w, y: y },
          { x: x, y: y + h },
          { x: x, y: y + h + d },
          { x: x - w, y: y + d }
        ];

        // 右面の4頂点
        const rightPoints = [
          { x: x, y: y + h },
          { x: x + w, y: y },
          { x: x + w, y: y + d },
          { x: x, y: y + h + d }
        ];

        // 上面を描画
        ctx.fillStyle = this.topColor;
        ctx.beginPath();
        ctx.moveTo(topPoints[0].x, topPoints[0].y);
        ctx.lineTo(topPoints[1].x, topPoints[1].y);
        ctx.lineTo(topPoints[2].x, topPoints[2].y);
        ctx.lineTo(topPoints[3].x, topPoints[3].y);
        ctx.closePath();
        ctx.fill();

        // 左面を描画
        ctx.fillStyle = this.leftColor;
        ctx.beginPath();
        ctx.moveTo(leftPoints[0].x, leftPoints[0].y);
        ctx.lineTo(leftPoints[1].x, leftPoints[1].y);
        ctx.lineTo(leftPoints[2].x, leftPoints[2].y);
        ctx.lineTo(leftPoints[3].x, leftPoints[3].y);
        ctx.closePath();
        ctx.fill();

        // 右面を描画
        ctx.fillStyle = this.rightColor;
        ctx.beginPath();
        ctx.moveTo(rightPoints[0].x, rightPoints[0].y);
        ctx.lineTo(rightPoints[1].x, rightPoints[1].y);
        ctx.lineTo(rightPoints[2].x, rightPoints[2].y);
        ctx.lineTo(rightPoints[3].x, rightPoints[3].y);
        ctx.closePath();
        ctx.fill();

        ctx.globalAlpha = 1;
      }
    }

    const cubes = [];

    // アイソメトリック座標変換
    const cos30 = Math.cos(Math.PI / 6);
    const sin30 = Math.sin(Math.PI / 6);

    const isoTransform = (gx, gy, gz) => {
      const isoX = (gx - gz) * spacing * cos30;
      const isoY = (gx + gz) * spacing * sin30 - gy * spacing;
      return { x: centerX + isoX, y: centerY + isoY - 40 };
    };

    // キューブ生成
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        for (let x = 0; x < gridSize; x++) {
          const isVisible =
            x === 0 || x === gridSize - 1 ||
            y === 0 || y === gridSize - 1 ||
            z === 0 || z === gridSize - 1;

          if (isVisible) {
            const pos = isoTransform(x, y, z);
            const color = allColors[Math.floor(Math.random() * allColors.length)];
            const delay = (y * 0.03 + (x + z) * 0.006) + Math.random() * 0.1;

            cubes.push(new MiniCube(pos.x, pos.y, y, color, delay));
          }
        }
      }
    }

    // Zソート
    cubes.sort((a, b) => {
      if (a.targetZ !== b.targetZ) return a.targetZ - b.targetZ;
      return a.targetY - b.targetY;
    });

    let time = 0;
    let currentPhase = 'assembling';
    let readyCalled = false;

    const animate = () => {
      ctx.fillStyle = '#08080f';
      ctx.fillRect(0, 0, width, height);

      let allArrived = true;
      cubes.forEach(cube => {
        cube.update(time, currentPhase);
        cube.draw(ctx, cubeSize);
        if (!cube.arrived && currentPhase === 'assembling') {
          allArrived = false;
        }
      });

      if (allArrived && currentPhase === 'assembling' && time > 2) {
        currentPhase = 'complete';
        setPhase('complete');
        if (onReady && !readyCalled) {
          readyCalled = true;
          onReady();
        }
      }

      time += 0.016;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationRef.current);
  }, [onReady]);

  const handleClick = () => {
    if (phase === 'complete') {
      setPhase('transition');
      // トランジションアニメーション後にコールバック
      setTimeout(() => {
        if (onTransition) {
          onTransition();
        }
      }, 800);
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#08080f',
        overflow: 'hidden',
        position: 'relative',
        cursor: phase === 'complete' ? 'pointer' : 'default',
        fontFamily: "'Inter', 'Noto Sans JP', sans-serif"
      }}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />

      {/* ヘッダー */}
      <header
        style={{
          position: 'absolute',
          top: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.3)',
            fontSize: '10px',
            letterSpacing: '4px',
          }}
        >
          DIGITAL NATURE
        </p>
      </header>

      {phase === 'assembling' && (
        <div
          style={{
            position: 'absolute',
            bottom: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: '11px',
              letterSpacing: '4px'
            }}
          >
            ASSEMBLING...
          </div>
        </div>
      )}

      {phase === 'complete' && (
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            textAlign: 'center',
            animation: 'fadeIn 1.5s ease-out'
          }}
        >
          <h1
            style={{
              fontSize: '42px',
              fontWeight: '200',
              background: 'linear-gradient(90deg, #FF6B6B, #FF9F43, #FFEAA7, #26DE81, #4ECDC4, #54A0FF, #A55EEA, #FF6B9D)',
              backgroundSize: '300% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '14px',
              margin: 0,
              animation: 'rainbowMove 5s linear infinite'
            }}
          >
            CUBE
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.35)',
              fontSize: '9px',
              letterSpacing: '2px',
              marginTop: '10px'
            }}
          >
            LIFE × ART × BUILD
          </p>
          <div
            style={{
              marginTop: '24px',
              color: 'rgba(255, 255, 255, 0.25)',
              fontSize: '9px',
              letterSpacing: '2px'
            }}
          >
            CLICK TO ENTER
          </div>
        </div>
      )}

      {phase === 'transition' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#0a0a12',
            zIndex: 100,
            animation: 'fadeIn 0.8s ease-out forwards'
          }}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes rainbowMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>
    </div>
  );
};

export default DataConstructionAnimation;
