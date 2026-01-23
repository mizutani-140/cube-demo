/**
 * CONTACT Page - Editorial Design
 * 一緒につくるところから、始めませんか。
 *
 * Aesthetic: Japanese spatial harmony meets editorial form design
 * Vertical text accents, asymmetric layout, refined typography
 */

import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useBreakpoints } from '../../hooks/useBreakpoints';
import { useSEO, SEO_PRESETS } from '../../hooks';
import { colors, typography, spacing } from '../../tokens';
import { company, contactCategories } from '../../data/corporate';
import { PageLayout } from './PageLayout';

// ============================================
// Contact Hero - Editorial Style
// ============================================

function ContactHero() {
  const { isMobile, isTablet } = useBreakpoints();
  const heroRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-letter',
        { opacity: 0, y: 100 },
        { opacity: 0.03, y: 0, duration: 1.2, ease: 'power3.out' }
      );
      gsap.fromTo('.hero-vertical',
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.8, delay: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo('.hero-title',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: 'power2.out' }
      );
      gsap.fromTo('.hero-copy',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: 'power2.out' }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      style={{
        position: 'relative',
        minHeight: isMobile ? '60vh' : '70vh',
        display: 'flex',
        alignItems: 'center',
        background: colors.bg.primary,
        overflow: 'hidden',
        padding: isMobile ? '120px 20px 80px' : '140px 80px 100px',
      }}
    >
      {/* Large decorative letter */}
      <div
        className="hero-letter"
        style={{
          position: 'absolute',
          right: isMobile ? '-10%' : '5%',
          top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: typography.fontFamily.display,
          fontSize: isMobile ? '50vw' : '35vw',
          fontWeight: 200,
          color: colors.text.primary,
          opacity: 0.03,
          lineHeight: 0.8,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        C
      </div>

      {/* Vertical Japanese text (hidden on desktop due to nav) */}
      {isMobile && (
        <div
          className="hero-vertical"
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            writingMode: 'vertical-rl',
            fontFamily: typography.fontFamily.japanese,
            fontSize: '12px',
            letterSpacing: '0.3em',
            color: colors.text.tertiary,
            zIndex: 2,
          }}
        >
          お問い合わせ
        </div>
      )}

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
        <div
          className="hero-title"
          style={{ marginBottom: isMobile ? '32px' : '48px' }}
        >
          <span
            style={{
              display: 'block',
              fontFamily: typography.fontFamily.mono,
              fontSize: '11px',
              letterSpacing: '0.2em',
              color: colors.gold,
              marginBottom: '20px',
            }}
          >
            CONTACT
          </span>
          <h1
            style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: isMobile ? '28px' : isTablet ? '36px' : '44px',
              fontWeight: 400,
              color: colors.text.primary,
              lineHeight: 1.4,
              letterSpacing: '0.05em',
              margin: 0,
            }}
          >
            一緒につくるところから、
            <br />
            始めませんか。
          </h1>
        </div>

        <p
          className="hero-copy"
          style={{
            fontFamily: typography.fontFamily.body,
            fontSize: isMobile ? '13px' : '15px',
            color: colors.text.secondary,
            lineHeight: 2,
            maxWidth: '500px',
          }}
        >
          プロジェクトの大小に関わらず、まずはお気軽にご相談ください。
          <br />
          企画段階からの壁打ちも歓迎いたします。
        </p>
      </div>

      {/* Decorative line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '40%',
          height: '1px',
          background: `linear-gradient(90deg, ${colors.gold} 0%, transparent 100%)`,
        }}
      />
    </section>
  );
}

// ============================================
// Elegant Form Input Component
// ============================================

function FormInput({ label, required, type = 'text', name, value, onChange, placeholder, rows, autoComplete }) {
  const [focused, setFocused] = useState(false);
  const isTextarea = type === 'textarea';
  const inputId = `form-${name}`;

  // Determine autocomplete value based on field name
  const getAutoComplete = () => {
    if (autoComplete) return autoComplete;
    const autoCompleteMap = {
      name: 'name',
      email: 'email',
      phone: 'tel',
      company: 'organization',
    };
    return autoCompleteMap[name] || 'off';
  };

  const baseStyle = {
    width: '100%',
    padding: isTextarea ? '20px 0' : '16px 0',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${focused ? colors.gold : colors.ui.border}`,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.body,
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.4s ease',
    resize: isTextarea ? 'none' : undefined,
  };

  return (
    <div style={{ marginBottom: '40px' }}>
      <label
        htmlFor={inputId}
        style={{
          display: 'block',
          fontFamily: typography.fontFamily.mono,
          fontSize: '10px',
          letterSpacing: '0.15em',
          color: focused ? colors.gold : colors.text.tertiary,
          marginBottom: '12px',
          transition: 'color 0.3s ease',
          textTransform: 'uppercase',
        }}
      >
        {label}
        {required && (
          <span style={{ color: colors.gold, marginLeft: '8px' }}>*</span>
        )}
      </label>
      {isTextarea ? (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows || 5}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={baseStyle}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={getAutoComplete()}
          spellCheck={type === 'email' ? false : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={baseStyle}
        />
      )}
    </div>
  );
}

// ============================================
// Form Select Component
// ============================================

function FormSelect({ label, required, name, value, onChange, options }) {
  const [focused, setFocused] = useState(false);
  const selectId = `form-${name}`;

  return (
    <div style={{ marginBottom: '40px' }}>
      <label
        htmlFor={selectId}
        style={{
          display: 'block',
          fontFamily: typography.fontFamily.mono,
          fontSize: '10px',
          letterSpacing: '0.15em',
          color: focused ? colors.gold : colors.text.tertiary,
          marginBottom: '12px',
          transition: 'color 0.3s ease',
          textTransform: 'uppercase',
        }}
      >
        {label}
        {required && (
          <span style={{ color: colors.gold, marginLeft: '8px' }}>*</span>
        )}
      </label>
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '16px 0',
          background: 'transparent',
          backgroundColor: colors.bg.primary,
          border: 'none',
          borderBottom: `1px solid ${focused ? colors.gold : colors.ui.border}`,
          color: value ? colors.text.primary : colors.text.tertiary,
          fontFamily: typography.fontFamily.body,
          fontSize: '15px',
          outline: 'none',
          cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23${colors.gold.slice(1)}' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0 center',
          transition: 'border-color 0.4s ease',
        }}
      >
        {options.map((opt, i) => (
          <option key={i} value={opt.value} style={{ backgroundColor: colors.bg.secondary, color: colors.text.primary }}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ============================================
// Contact Form - Editorial Style
// ============================================

function ContactForm() {
  const { isMobile } = useBreakpoints();
  const formRef = useRef();
  const [formData, setFormData] = useState({
    category: '',
    company: '',
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  useEffect(() => {
    gsap.fromTo(formRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.2 }
    );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://formspree.io/f/meeaeylr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          category: '',
          company: '',
          name: '',
          email: '',
          phone: '',
          message: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: '', label: '選択してください' },
    { value: 'design', label: '設計・工事のご相談' },
    { value: 'consulting', label: '開業支援・コンサルティング' },
    { value: 'collaboration', label: 'コラボレーション' },
    { value: 'recruit', label: '採用について' },
    { value: 'other', label: 'その他' },
  ];

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <FormSelect
        label="Inquiry Type"
        name="category"
        value={formData.category}
        onChange={handleChange}
        options={categoryOptions}
        required
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '0' : '40px',
        }}
      >
        <FormInput
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="株式会社○○…"
        />
        <FormInput
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="山田 太郎…"
          required
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '0' : '40px',
        }}
      >
        <FormInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@email.com…"
          required
        />
        <FormInput
          label="Phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="03-0000-0000…"
        />
      </div>

      <FormInput
        label="Message"
        type="textarea"
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="お問い合わせ内容をご記入ください…"
        rows={6}
        required
      />

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div
          style={{
            padding: '20px',
            marginBottom: '24px',
            background: 'rgba(95, 173, 139, 0.1)',
            border: '1px solid rgba(95, 173, 139, 0.3)',
            borderRadius: '4px',
          }}
        >
          <p
            style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: '14px',
              color: '#5FAD8B',
              margin: 0,
              textAlign: 'center',
            }}
          >
            お問い合わせありがとうございます。<br />
            担当者より折り返しご連絡いたします。
          </p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div
          style={{
            padding: '20px',
            marginBottom: '24px',
            background: 'rgba(231, 76, 60, 0.1)',
            border: '1px solid rgba(231, 76, 60, 0.3)',
            borderRadius: '4px',
          }}
        >
          <p
            style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: '14px',
              color: '#e74c3c',
              margin: 0,
              textAlign: 'center',
            }}
          >
            送信に失敗しました。<br />
            時間をおいて再度お試しください。
          </p>
        </div>
      )}

      {/* Submit button - Editorial style */}
      <button
        type="submit"
        disabled={isSubmitting}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          width: '100%',
          padding: '24px 40px',
          background: isSubmitting ? colors.ui.border : (isHovered ? colors.gold : 'transparent'),
          border: `1px solid ${isSubmitting ? colors.ui.border : colors.gold}`,
          color: isSubmitting ? colors.text.tertiary : (isHovered ? colors.bg.primary : colors.gold),
          fontFamily: typography.fontFamily.mono,
          fontSize: '12px',
          letterSpacing: '0.2em',
          fontWeight: 500,
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden',
          opacity: isSubmitting ? 0.7 : 1,
        }}
      >
        <span style={{ position: 'relative', zIndex: 1 }}>
          {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
        </span>
      </button>
    </form>
  );
}

// ============================================
// Contact Sidebar Info
// ============================================

function ContactSidebar({ onNavigate }) {
  const { isMobile } = useBreakpoints();
  const sidebarRef = useRef();

  useEffect(() => {
    gsap.fromTo(sidebarRef.current?.children || [],
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
    );
  }, []);

  return (
    <div ref={sidebarRef}>
      {/* Categories */}
      <div style={{ marginBottom: '60px' }}>
        <h3
          style={{
            fontFamily: typography.fontFamily.mono,
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: colors.gold,
            marginBottom: '32px',
          }}
        >
          WHAT WE DO
        </h3>
        {contactCategories.map((cat, i) => (
          <div key={i} style={{ marginBottom: '32px' }}>
            <h4
              style={{
                fontFamily: typography.fontFamily.japanese,
                fontSize: '14px',
                color: colors.text.primary,
                marginBottom: '16px',
                letterSpacing: '0.05em',
              }}
            >
              {cat.title}
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {cat.items.map((item, j) => (
                <span
                  key={j}
                  style={{
                    fontFamily: typography.fontFamily.body,
                    fontSize: '11px',
                    color: colors.text.tertiary,
                    padding: '6px 14px',
                    border: `1px solid ${colors.ui.border}`,
                    borderRadius: '2px',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Contact Info Card */}
      <div
        style={{
          position: 'relative',
          padding: '40px',
          background: colors.bg.secondary,
          border: `1px solid ${colors.ui.border}`,
        }}
      >
        {/* Decorative corner */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '60px',
            height: '60px',
            borderRight: `1px solid ${colors.gold}`,
            borderTop: `1px solid ${colors.gold}`,
          }}
        />

        <p
          style={{
            fontFamily: typography.fontFamily.mono,
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: colors.text.tertiary,
            marginBottom: '16px',
          }}
        >
          PHONE
        </p>
        <p
          style={{
            fontFamily: typography.fontFamily.display,
            fontSize: '24px',
            color: colors.text.primary,
            letterSpacing: '0.05em',
            marginBottom: '24px',
          }}
        >
          {company.tel}
        </p>
        <p
          style={{
            fontFamily: typography.fontFamily.body,
            fontSize: '12px',
            color: colors.text.tertiary,
            lineHeight: 1.8,
            marginBottom: '32px',
          }}
        >
          平日 10:00 - 18:00
          <br />
          ※土日祝・年末年始を除く
        </p>

        <button
          onClick={() => onNavigate('access')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'transparent',
            border: 'none',
            color: colors.gold,
            fontFamily: typography.fontFamily.mono,
            fontSize: '11px',
            letterSpacing: '0.15em',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <span>ACCESS MAP</span>
          <span style={{ fontSize: '14px' }}>→</span>
        </button>
      </div>
    </div>
  );
}

// ============================================
// FAQ Section - Editorial Style
// ============================================

function FAQSection() {
  const { isMobile, isTablet } = useBreakpoints();
  const sectionRef = useRef();
  const [openIndex, setOpenIndex] = useState(null);

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

  useEffect(() => {
    const ctx = gsap.context(() => {
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
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          marginBottom: isMobile ? '48px' : '80px',
          gap: '24px',
        }}
      >
        <div>
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
        </div>
        <p
          style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: '14px',
            color: colors.text.tertiary,
            letterSpacing: '0.1em',
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
                style={{
                  fontFamily: typography.fontFamily.display,
                  fontSize: '24px',
                  color: colors.gold,
                  transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                }}
              >
                +
              </span>
            </button>
            <div
              style={{
                maxHeight: openIndex === i ? '200px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.4s ease',
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

// ============================================
// Main Contact Page
// ============================================

export default function ContactPage({ onNavigate }) {
  const { isMobile, isTablet } = useBreakpoints();

  // SEO設定
  useSEO(SEO_PRESETS.contact);

  return (
    <PageLayout currentPage="contact" onNavigate={onNavigate}>
      <ContactHero />

      {/* Main Form Section */}
      <section
        style={{
          padding: isMobile ? '60px 20px' : '100px 80px',
          background: colors.bg.primary,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '350px 1fr',
            gap: isMobile ? '60px' : '80px',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          {/* Sidebar */}
          <ContactSidebar onNavigate={onNavigate} />

          {/* Form */}
          <div
            style={{
              position: 'relative',
              padding: isMobile ? '40px 24px' : '60px',
              background: colors.bg.tertiary,
              border: `1px solid ${colors.ui.border}`,
            }}
          >
            {/* Form header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '48px',
              }}
            >
              <h3
                style={{
                  fontFamily: typography.fontFamily.mono,
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  color: colors.gold,
                }}
              >
                INQUIRY FORM
              </h3>
              <div
                style={{
                  width: '60px',
                  height: '1px',
                  background: colors.ui.border,
                }}
              />
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <FAQSection />

      {/* Bottom CTA */}
      <section
        style={{
          padding: isMobile ? '80px 20px' : '120px 80px',
          background: colors.bg.primary,
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '1px',
            height: '60px',
            background: colors.gold,
          }}
        />
        <p
          style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: isMobile ? '16px' : '20px',
            color: colors.text.secondary,
            letterSpacing: '0.1em',
            lineHeight: 2,
            marginTop: '40px',
          }}
        >
          暮らしと、食と、空間を。
          <br />
          CUBEと一緒に、つくりませんか。
        </p>
      </section>
    </PageLayout>
  );
}
