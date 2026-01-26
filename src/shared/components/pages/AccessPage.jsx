/**
 * ACCESS Page
 * CUBEの拠点情報
 */

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBreakpoints } from '../../hooks/useBreakpoints';
import { useSEO, SEO_PRESETS } from '../../hooks';
import { colors as defaultColors, typography } from '../../tokens';
import { PageLayout, PageHero, Section, SectionTitle } from './PageLayout';
import { useTheme } from '../../contexts';
import { prefersReducedMotion } from '../../animations/gsapSetup';
import { CompanyInfoSection } from '../CompanyInfoSection';

gsap.registerPlugin(ScrollTrigger);

// Location data (colors are applied via theme)
const getLocations = (goldColor) => [
  {
    id: 'office',
    name: 'CUBE 本社',
    nameJa: '本社',
    address: '東京都目黒区上目黒4-18-25 グレースビル1階',
    addressEn: '4-18-25 Kamimeguro, Meguro-ku, Tokyo',
    access: [
      '東急東横線・東京メトロ日比谷線「中目黒駅」徒歩8分',
      '東急東横線「祐天寺駅」徒歩10分',
    ],
    hours: '平日 10:00 - 18:00',
    tel: '03-6712-2354',
    note: '※ご来社の際は事前にご連絡ください',
    color: goldColor,
    mapQuery: '東京都目黒区上目黒4-18-25',
  },
  {
    id: 'yutenji-office',
    name: 'CUBE 祐天寺オフィス',
    nameJa: '祐天寺オフィス',
    address: '東京都目黒区祐天寺2-12-11 泉ホームズ102号室',
    addressEn: '2-12-11 Yutenji, Meguro-ku, Tokyo',
    access: [
      '東急東横線「祐天寺駅」徒歩3分',
    ],
    hours: '平日 10:00 - 18:00',
    tel: '03-6712-2354',
    note: '※ご来社の際は事前にご連絡ください',
    color: '#8A9BAD',
    mapQuery: '東京都目黒区祐天寺2-12-11',
  },
  {
    id: 'lambchan',
    name: 'Lamb CHAN',
    nameJa: '羊料理専門店',
    address: '東京都目黒区上目黒4-9-4',
    addressEn: '4-9-4 Kamimeguro, Meguro-ku, Tokyo',
    access: [
      '東急東横線・東京メトロ日比谷線「中目黒駅」徒歩5分',
    ],
    hours: '[火〜土] 17:00〜26:00 [日] 17:00〜24:00',
    hoursNote: 'フードL.O. 22:30 / 定休日：月曜日',
    tel: '03-5734-1814',
    note: null,
    color: '#e74c3c',
    mapQuery: '東京都目黒区上目黒4-9-4',
  },
  {
    id: 'gallery',
    name: 'LIFE NOSTALGIA',
    nameJa: '貸しギャラリー',
    address: '東京都世田谷区下馬2-44-11',
    addressEn: '2-44-11 Shimouma, Setagaya-ku, Tokyo',
    access: [
      '東急田園都市線「三軒茶屋駅」徒歩10分',
    ],
    hours: '展示期間中のみ営業',
    tel: '03-5787-6672',
    note: '※展示スケジュールはNEWSをご確認ください',
    color: '#5FAD8B',
    mapQuery: '東京都世田谷区下馬2-44-11',
  },
];

// ============================================
// Location Card
// ============================================

function LocationCard({ location, index }) {
  const cardRef = useRef();
  const { isMobile } = useBreakpoints();
  const { colors, isDark } = useTheme();

  useEffect(() => {
    if (!cardRef.current) return;

    const reducedMotion = prefersReducedMotion();

    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        {
          opacity: 0,
          y: 50,
          rotationX: reducedMotion ? 0 : 5,
          transformPerspective: 800,
          transformOrigin: 'center bottom',
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: reducedMotion ? 0.3 : 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
          },
          delay: index * 0.1,
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={cardRef}
      style={{
        background: `linear-gradient(135deg, ${location.color}10 0%, ${colors.bg.secondary} 100%)`,
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid ${location.color}30`,
      }}
    >
      {/* Google Map */}
      <div style={{
        aspectRatio: '16/9',
        background: `linear-gradient(135deg, ${location.color}15 0%, ${colors.bg.primary} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <iframe
          src={`https://www.google.com/maps?q=${encodeURIComponent(location.mapQuery)}&output=embed&hl=ja`}
          width="100%"
          height="100%"
          style={{
            border: 0,
            filter: isDark ? 'grayscale(30%) contrast(1.1)' : 'grayscale(10%) contrast(1.05)',
          }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`${location.name}の地図`}
        />

        {/* Location badge */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          background: location.color,
          color: isDark ? '#000' : '#fff',
          fontSize: '9px',
          padding: '4px 12px',
          letterSpacing: '1px',
          fontWeight: 600,
          zIndex: 1,
        }}>
          {location.name}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: isMobile ? '24px' : '32px' }}>
        {/* Name */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '20px',
        }}>
          <div>
            <h3 style={{
              color: colors.text.primary,
              fontSize: isMobile ? '18px' : '22px',
              fontWeight: 600,
              letterSpacing: '2px',
              margin: '0 0 6px 0',
            }}>
              {location.name}
            </h3>
            <p style={{
              color: colors.text.tertiary,
              fontSize: '11px',
              letterSpacing: '1px',
            }}>
              {location.nameJa}
            </p>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: `${location.color}20`,
            border: `1px solid ${location.color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: location.color,
            fontSize: '16px',
          }}>
            ◎
          </div>
        </div>

        {/* Address */}
        <div style={{
          background: colors.ui.hoverBg,
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <p style={{
            color: colors.text.muted,
            fontSize: '9px',
            letterSpacing: '2px',
            marginBottom: '8px',
          }}>
            ADDRESS
          </p>
          <p style={{
            color: colors.text.primary,
            fontSize: '13px',
            lineHeight: 1.6,
            margin: '0 0 4px 0',
          }}>
            {location.address}
          </p>
          <p style={{
            color: colors.text.muted,
            fontSize: '10px',
          }}>
            {location.addressEn}
          </p>
        </div>

        {/* Access */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{
            color: colors.text.muted,
            fontSize: '9px',
            letterSpacing: '2px',
            marginBottom: '10px',
          }}>
            ACCESS
          </p>
          {location.access.map((item, i) => (
            <p
              key={i}
              style={{
                color: colors.text.secondary,
                fontSize: '12px',
                lineHeight: 1.7,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                marginBottom: '6px',
              }}
            >
              <span style={{ color: location.color }}>・</span>
              {item}
            </p>
          ))}
        </div>

        {/* Hours & Tel */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '16px',
        }}>
          <div>
            <p style={{
              color: colors.text.muted,
              fontSize: '9px',
              letterSpacing: '2px',
              marginBottom: '6px',
            }}>
              HOURS
            </p>
            <p style={{
              color: colors.text.secondary,
              fontSize: '11px',
              lineHeight: 1.5,
            }}>
              {location.hours}
            </p>
            {location.hoursNote && (
              <p style={{
                color: colors.text.tertiary,
                fontSize: '10px',
                marginTop: '4px',
              }}>
                {location.hoursNote}
              </p>
            )}
          </div>
          <div>
            <p style={{
              color: colors.text.muted,
              fontSize: '9px',
              letterSpacing: '2px',
              marginBottom: '6px',
            }}>
              TEL
            </p>
            <p style={{
              color: colors.text.secondary,
              fontSize: '11px',
            }}>
              {location.tel}
            </p>
          </div>
        </div>

        {/* Note */}
        {location.note && (
          <p style={{
            color: colors.text.muted,
            fontSize: '10px',
            fontStyle: 'italic',
          }}>
            {location.note}
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================
// Main Access Page
// ============================================

export default function AccessPage({ onNavigate }) {
  const { isMobile } = useBreakpoints();
  const { colors, isDark } = useTheme();

  // SEO設定
  useSEO(SEO_PRESETS.access);

  const locations = getLocations(colors.gold);

  // Theme-aware backgrounds
  const sectionBg = colors.bg.primary;

  return (
    <PageLayout currentPage="access" onNavigate={onNavigate}>
      <PageHero
        title="ACCESS"
        titleJa="アクセス"
        subtitle="CUBEの各拠点へのアクセス情報"
      />

      <Section background={sectionBg}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: isMobile ? '24px' : '32px',
        }}>
          {locations.map((location, index) => (
            <LocationCard key={location.id} location={location} index={index} />
          ))}
        </div>
      </Section>

      <CompanyInfoSection animationDirection="left" />

      {/* CTA */}
      <Section background={sectionBg}>
        <div style={{
          textAlign: 'center',
          padding: isMobile ? '40px 20px' : '60px',
          background: `linear-gradient(135deg, ${colors.gold}20 0%, ${colors.bg.secondary} 100%)`,
          borderRadius: '12px',
          border: `1px solid ${colors.gold}40`,
        }}>
          <h3 style={{
            fontFamily: typography.fontFamily.japanese,
            color: colors.text.primary,
            fontSize: isMobile ? '20px' : '26px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            margin: '0 0 16px 0',
          }}>
            ご来社をご希望の方
          </h3>
          <p style={{
            fontFamily: typography.fontFamily.body,
            color: colors.text.secondary,
            fontSize: '14px',
            lineHeight: 1.8,
            marginBottom: '30px',
            maxWidth: '400px',
            margin: '0 auto 30px',
          }}>
            打ち合わせやご相談でご来社いただく場合は、<br />
            事前にご連絡をお願いいたします。
          </p>
          <button
            onClick={() => onNavigate('contact')}
            style={{
              background: colors.gold,
              border: 'none',
              color: colors.bg.primary,
              padding: '14px 40px',
              fontSize: '11px',
              letterSpacing: '2px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            CONTACT US
          </button>
        </div>
      </Section>
    </PageLayout>
  );
}
