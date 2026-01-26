/**
 * FAQSection - Editorial Style FAQ Accordion
 * Extracted from ContactPage.jsx
 */

import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBreakpoints } from '../../../hooks/useBreakpoints';
import { typography } from '../../../tokens';
import { useTheme } from '../../../contexts';

gsap.registerPlugin(ScrollTrigger);

export function FAQSection() {
  const { colors } = useTheme();
  const { isMobile, isTablet } = useBreakpoints();
  const sectionRef = useRef();
  const [openIndex, setOpenIndex] = useState(null);
  const answerRefs = useRef([]);
  const iconRefs = useRef([]);
  const prevOpenRef = useRef(null);

  const faqs = [
    {
      q: '小規模な案件でも相談できますか？',
      a: 'はい、規模の大小に関わらずご相談いただけます。小さな改装工事から店舗設計まで、幅広く対応しております。まずはお気軽にお声がけください。',
    },
    {
      q: '予算の目安はどのくらいですか？',
      a: '案件の内容により大きく異なります。まずはご要望をお聞かせいただき、概算見積もりをご提示いたします。予算に合わせたご提案も可能です。',
    },
    {
      q: '打ち合わせは何回くらいありますか？',
      a: '基本的に企画・設計・施工の各段階で打ち合わせを行います。プロジェクトの規模やご要望により、回数は柔軟に調整いたします。',
    },
    {
      q: 'エリアの制限はありますか？',
      a: '東京都を中心に、関東近郊であれば対応可能です。遠方の場合もプロジェクト内容によってはご対応できますので、まずはご相談ください。',
    },
  ];

  // GSAP height animation for accordion
  useEffect(() => {
    const prev = prevOpenRef.current;
    prevOpenRef.current = openIndex;

    // Close previous
    if (prev !== null && prev !== openIndex && answerRefs.current[prev]) {
      gsap.to(answerRefs.current[prev], { height: 0, duration: 0.4, ease: 'power2.inOut' });
      if (iconRefs.current[prev]) {
        gsap.to(iconRefs.current[prev], { rotation: 0, duration: 0.3, ease: 'power2.out' });
      }
    }

    // Open current
    if (openIndex !== null && answerRefs.current[openIndex]) {
      gsap.to(answerRefs.current[openIndex], { height: 'auto', duration: 0.4, ease: 'power2.inOut' });
      if (iconRefs.current[openIndex]) {
        gsap.to(iconRefs.current[openIndex], { rotation: 45, duration: 0.3, ease: 'power2.out' });
      }
    }
  }, [openIndex]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header scroll reveal
      gsap.fromTo('.faq-header',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      // FAQ items stagger reveal
      gsap.fromTo('.faq-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: isMobile ? '80px 20px' : '120px 80px',
        background: colors.bg.secondary,
        position: 'relative',
      }}
    >
      {/* Header */}
      <div
        className="faq-header"
        style={{
          marginBottom: isMobile ? '48px' : '80px',
        }}
      >
        <span
          style={{
            fontFamily: typography.fontFamily.mono,
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: colors.gold,
          }}
        >
          FAQ
        </span>
        <h2
          style={{
            fontFamily: typography.fontFamily.display,
            fontSize: isMobile ? '32px' : isTablet ? '40px' : '52px',
            fontWeight: 300,
            color: colors.text.primary,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            margin: '16px 0 0 0',
          }}
        >
          Questions
        </h2>
        <p
          style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: '14px',
            color: colors.text.tertiary,
            letterSpacing: '0.1em',
            marginTop: '16px',
          }}
        >
          よくあるご質問
        </p>
      </div>

      {/* FAQ Items */}
      <div style={{ maxWidth: '900px' }}>
        {faqs.map((item, i) => (
          <div
            key={i}
            className="faq-item"
            style={{
              borderTop: i === 0 ? `1px solid ${colors.ui.border}` : 'none',
              borderBottom: `1px solid ${colors.ui.border}`,
            }}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '28px 0',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                <span
                  style={{
                    fontFamily: typography.fontFamily.display,
                    fontSize: '18px',
                    color: colors.gold,
                    fontWeight: 400,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontFamily: typography.fontFamily.japanese,
                    fontSize: isMobile ? '14px' : '16px',
                    color: colors.text.primary,
                    letterSpacing: '0.02em',
                  }}
                >
                  {item.q}
                </span>
              </div>
              <span
                ref={el => iconRefs.current[i] = el}
                style={{
                  fontFamily: typography.fontFamily.display,
                  fontSize: '24px',
                  color: colors.gold,
                  display: 'inline-block',
                }}
              >
                +
              </span>
            </button>
            <div
              ref={el => answerRefs.current[i] = el}
              style={{
                height: 0,
                overflow: 'hidden',
              }}
            >
              <p
                style={{
                  fontFamily: typography.fontFamily.body,
                  fontSize: '14px',
                  color: colors.text.secondary,
                  lineHeight: 2,
                  padding: '0 0 28px 48px',
                }}
              >
                {item.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
