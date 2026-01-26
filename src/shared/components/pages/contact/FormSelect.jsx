/**
 * FormSelect - Form Select Component
 * Extracted from ContactPage.jsx
 */

import React, { useState } from 'react';
import { typography } from '../../../tokens';
import { useTheme } from '../../../contexts';

export function FormSelect({ label, required, name, value, onChange, options }) {
  const { colors } = useTheme();
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
