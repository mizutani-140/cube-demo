/**
 * ContactForm - Editorial Style Contact Form
 * Extracted from ContactPage.jsx
 */

import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useBreakpoints } from '../../../hooks/useBreakpoints';
import { typography } from '../../../tokens';
import { useTheme } from '../../../contexts';
import { useMagneticButton } from '../../../animations';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';

export function ContactForm() {
  const { colors, isDark } = useTheme();
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
  const { ref: magneticRef } = useMagneticButton({ strength: 0.2, radius: 120 });

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

      {/* Submit button - Editorial style with magnetic effect */}
      <div ref={magneticRef} style={{ width: '100%' }}>
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
            transition: 'background 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            overflow: 'hidden',
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          <span style={{ position: 'relative', zIndex: 1 }}>
            {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
          </span>
        </button>
      </div>
    </form>
  );
}
