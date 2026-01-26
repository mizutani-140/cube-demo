/**
 * splitText - Unicode-aware text splitting utility
 *
 * Splits text into individual characters or words for animation.
 * Handles Japanese text (character-level) and English text (word-level).
 * Preserves accessibility via aria-label on the container.
 */

/**
 * Detect if a character is CJK (Chinese/Japanese/Korean)
 */
function isCJK(char) {
  const code = char.codePointAt(0);
  return (
    (code >= 0x3000 && code <= 0x9FFF) ||   // CJK Unified, Hiragana, Katakana, etc.
    (code >= 0xF900 && code <= 0xFAFF) ||   // CJK Compatibility Ideographs
    (code >= 0xFF00 && code <= 0xFFEF) ||   // Fullwidth Forms
    (code >= 0x20000 && code <= 0x2A6DF)    // CJK Extension B
  );
}

/**
 * Detect if a string is primarily CJK
 */
function isPrimarilyCJK(text) {
  const chars = [...text.replace(/\s/g, '')];
  if (chars.length === 0) return false;
  const cjkCount = chars.filter(isCJK).length;
  return cjkCount / chars.length > 0.3;
}

/**
 * Split text content of a DOM element into individually wrapped spans.
 *
 * @param {HTMLElement} element - The element whose text to split
 * @param {Object} options
 * @param {'chars'|'words'|'auto'} options.type - Split mode. 'auto' uses chars for CJK, words for Latin.
 * @param {string} options.charClass - CSS class for each character/word span
 * @returns {{ chars: HTMLElement[], revert: () => void }}
 */
export function splitText(element, options = {}) {
  if (!element) return { chars: [], revert: () => {} };

  const {
    type = 'auto',
    charClass = 'split-char',
  } = options;

  const originalHTML = element.innerHTML;
  const text = element.textContent || '';

  // Set aria-label to preserve accessibility
  element.setAttribute('aria-label', text);

  let splitMode = type;
  if (type === 'auto') {
    splitMode = isPrimarilyCJK(text) ? 'chars' : 'words';
  }

  const chars = [];

  if (splitMode === 'chars') {
    // Character-level split (for Japanese text)
    const characters = [...text];
    element.innerHTML = '';

    characters.forEach((char) => {
      if (char === ' ' || char === '\n') {
        element.appendChild(document.createTextNode(char));
        return;
      }
      const span = document.createElement('span');
      span.className = charClass;
      span.textContent = char;
      span.style.display = 'inline-block';
      span.setAttribute('aria-hidden', 'true');
      element.appendChild(span);
      chars.push(span);
    });
  } else {
    // Word-level split (for English text)
    const words = text.split(/(\s+)/);
    element.innerHTML = '';

    words.forEach((word) => {
      if (/^\s+$/.test(word)) {
        element.appendChild(document.createTextNode(word));
        return;
      }
      const span = document.createElement('span');
      span.className = charClass;
      span.textContent = word;
      span.style.display = 'inline-block';
      span.setAttribute('aria-hidden', 'true');
      element.appendChild(span);
      chars.push(span);
    });
  }

  const revert = () => {
    element.innerHTML = originalHTML;
    element.removeAttribute('aria-label');
  };

  return { chars, revert };
}

export default splitText;
