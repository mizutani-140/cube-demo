/**
 * FormInput - Elegant Form Input Component
 * Extracted from ContactPage.jsx
 */

import React, { useState, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { typography } from '../../../tokens';
import { useTheme } from '../../../contexts';
import { prefersReducedMotion } from '../../../animations/gsapSetup';

export function FormInput({ label, required, type = 'text', name, value, onChange, placeholder, rows, autoComplete }) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const underlineRef = useRef();
  const labelRef = useRef();
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

  // Animate focus underline
  const handleFocus = useCallback(() => {
    setFocused(true);
    if (underlineRef.current && !prefersReducedMotion()) {
      gsap.to(underlineRef.current, { scaleX: 1, duration: 0.4, ease: 'power3.out' });
    }
    if (labelRef.current) {
      gsap.to(labelRef.current, { y: -4, color: colors.gold, duration: 0.3, ease: 'power2.out' });
    }
  }, [colors.gold]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    if (underlineRef.current) {
      gsap.to(underlineRef.current, { scaleX: 0, duration: 0.3, ease: 'power2.in' });
    }
    if (labelRef.current) {
      gsap.to(labelRef.current, { y: 0, color: colors.text.tertiary, duration: 0.3 });
    }
  }, [colors.text.tertiary]);

  const baseStyle = {
    width: '100%',
    padding: isTextarea ? '20px 0' : '16px 0',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${colors.ui.border}`,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.body,
    fontSize: '15px',
    outline: 'none',
    resize: isTextarea ? 'none' : undefined,
  };

  return (
    <div style={{ marginBottom: '40px', position: 'relative' }}>
      <label
        ref={labelRef}
        htmlFor={inputId}
        style={{
          display: 'block',
          fontFamily: typography.fontFamily.mono,
          fontSize: '10px',
          letterSpacing: '0.15em',
          color: colors.text.tertiary,
          marginBottom: '12px',
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
          onFocus={handleFocus}
          onBlur={handleBlur}
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
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={baseStyle}
        />
      )}
      {/* Animated focus underline */}
      <div
        ref={underlineRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: colors.gold,
          transformOrigin: 'left',
          transform: 'scaleX(0)',
        }}
      />
    </div>
  );
}
