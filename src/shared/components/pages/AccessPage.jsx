/**
 * ACCESS Page
 * CUBEの拠点情報
 */

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useBreakpoints } from '../../hooks/useBreakpoints';
import { useSEO, SEO_PRESETS } from '../../hooks';
import { colors } from '../../tokens';
import { company } from '../../data/corporate';
import { PageLayout, PageHero, Section, SectionTitle } from './PageLayout';

// Location data
const locations = [
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
    color: colors.gold,
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

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.5, delay: index * 0.15, ease: 'power2.out' }
    );
  }, [index]);

  return (
    <div
      ref={cardRef}
      style={{
        background: `linear-gradient(135deg, ${location.color}10 0%, #0f0f1a 100%)`,
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid ${location.color}30`,
      }}
    >
      {/* Google Map */}
      <div style={{
        aspectRatio: '16/9',
        background: `linear-gradient(135deg, ${location.color}15 0%, #0a0a12 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <iframe
          src={`https://www.google.com/maps?q=${encodeURIComponent(location.mapQuery)}&output=embed&hl=ja`}
          width="100%"
          height="100%"
          style={{
            border: 0,
            filter: 'grayscale(30%) contrast(1.1)',
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
          color: '#000',
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
              color: '#ffffff',
              fontSize: isMobile ? '18px' : '22px',
              fontWeight: 600,
              letterSpacing: '2px',
              margin: '0 0 6px 0',
            }}>
              {location.name}
            </h3>
            <p style={{
              color: 'rgba(255,255,255,0.5)',
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
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '9px',
            letterSpacing: '2px',
            marginBottom: '8px',
          }}>
            ADDRESS
          </p>
          <p style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '13px',
            lineHeight: 1.6,
            margin: '0 0 4px 0',
          }}>
            {location.address}
          </p>
          <p style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '10px',
          }}>
            {location.addressEn}
          </p>
        </div>

        {/* Access */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{
            color: 'rgba(255,255,255,0.4)',
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
                color: 'rgba(255,255,255,0.6)',
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
              color: 'rgba(255,255,255,0.4)',
              fontSize: '9px',
              letterSpacing: '2px',
              marginBottom: '6px',
            }}>
              HOURS
            </p>
            <p style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '11px',
              lineHeight: 1.5,
            }}>
              {location.hours}
            </p>
            {location.hoursNote && (
              <p style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '10px',
                marginTop: '4px',
              }}>
                {location.hoursNote}
              </p>
            )}
          </div>
          <div>
            <p style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: '9px',
              letterSpacing: '2px',
              marginBottom: '6px',
            }}>
              TEL
            </p>
            <p style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '11px',
            }}>
              {location.tel}
            </p>
          </div>
        </div>

        {/* Note */}
        {location.note && (
          <p style={{
            color: 'rgba(255,255,255,0.4)',
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

  // SEO設定
  useSEO(SEO_PRESETS.access);

  return (
    <PageLayout currentPage="access" onNavigate={onNavigate}>
      <PageHero
        title="ACCESS"
        titleJa="アクセス"
        subtitle="CUBEの各拠点へのアクセス情報"
      />

      <Section background="#0a0a12">
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

      {/* Company Overview */}
      <Section background="#0f0f18">
        <SectionTitle
          title="会社情報"
          titleJa="COMPANY INFO"
        />

        <div style={{
          background: '#0a0a12',
          borderRadius: '12px',
          padding: isMobile ? '30px 24px' : '40px',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: isMobile ? '24px' : '40px',
          }}>
            {[
              { label: '会社名', value: '株式会社CUBE' },
              { label: '設立', value: company.founded },
              { label: '資本金', value: company.capital },
              { label: '代表者', value: `${company.ceoTitle} ${company.ceo}` },
              { label: 'TEL', value: company.tel },
              { label: '本社所在地', value: company.headquarters.address },
              { label: '営業所', value: company.office.address },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  paddingBottom: '16px',
                }}
              >
                <p style={{
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '10px',
                  letterSpacing: '2px',
                  marginBottom: '8px',
                }}>
                  {item.label}
                </p>
                <p style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section background="#0a0a12">
        <div style={{
          textAlign: 'center',
          padding: isMobile ? '40px 20px' : '60px',
          background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, transparent 100%)',
          borderRadius: '12px',
          border: '1px solid rgba(212,175,55,0.2)',
        }}>
          <h3 style={{
            color: '#ffffff',
            fontSize: isMobile ? '20px' : '26px',
            fontWeight: 300,
            letterSpacing: '3px',
            margin: '0 0 16px 0',
          }}>
            ご来社をご希望の方
          </h3>
          <p style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '12px',
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
              color: '#0a0a12',
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
