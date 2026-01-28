// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Works Page — Card Animation E2E Tests
 *
 * Verifies that cards slide in from off-screen left/right edges
 * using GSAP ScrollTrigger, with correct data-direction attributes
 * and visual animation behavior.
 */

// Navigate directly to the Works page via ?page= query parameter
const WORKS_URL = '/?page=works';

test.describe('Works page card animations', () => {

  test('cards render with alternating data-direction attributes', async ({ page }) => {
    await page.goto(WORKS_URL);
    await page.waitForSelector('.works-card', { timeout: 15_000 });

    const directions = await page.$$eval('.works-card', cards =>
      cards.map(card => card.getAttribute('data-direction'))
    );

    expect(directions.length).toBeGreaterThan(0);

    directions.forEach((dir, i) => {
      const expected = i % 2 === 0 ? 'left' : 'right';
      expect(dir).toBe(expected);
    });
  });

  test('GSAP sets initial transform on cards for slide-in animation', async ({ page }) => {
    await page.goto(WORKS_URL);
    await page.waitForSelector('.works-card', { timeout: 15_000 });

    // Verify GSAP has processed the cards by checking that
    // inline style transforms were applied (gsap.set writes to element.style)
    const cardTransforms = await page.$$eval('.works-card', cards =>
      cards.map(card => ({
        hasInlineTransform: card.style.transform !== '',
        direction: card.getAttribute('data-direction'),
      }))
    );

    expect(cardTransforms.length).toBeGreaterThan(0);

    // All cards should have been processed by GSAP (inline transform set)
    cardTransforms.forEach(card => {
      expect(card.hasInlineTransform).toBe(true);
      expect(['left', 'right']).toContain(card.direction);
    });
  });

  test('cards become visible after scrolling into viewport', async ({ page }) => {
    await page.goto(WORKS_URL);
    await page.waitForSelector('.works-card', { timeout: 15_000 });

    // Scroll down to trigger card reveal animations
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));

    // Wait for GSAP animations to complete
    await page.waitForTimeout(2000);

    const visibleCards = await page.$$eval('.works-card', cards =>
      cards.filter(card => {
        const style = window.getComputedStyle(card);
        return parseFloat(style.opacity) > 0.8;
      }).length
    );

    expect(visibleCards).toBeGreaterThan(0);
  });

  test('cards have translateX applied (off-screen initial position)', async ({ page }) => {
    // Use a very short viewport to keep cards below fold
    await page.setViewportSize({ width: 1280, height: 200 });
    await page.goto(WORKS_URL);
    await page.waitForSelector('.works-card', { timeout: 15_000 });

    // Allow GSAP to set initial positions
    await page.waitForTimeout(500);

    const transforms = await page.$$eval('.works-card', cards =>
      cards.map(card => {
        const style = window.getComputedStyle(card);
        return style.transform;
      })
    );

    // Cards below the fold should have a non-identity transform matrix
    const hasOffset = transforms.some(t => t !== 'none' && t !== 'matrix(1, 0, 0, 1, 0, 0)');
    expect(hasOffset).toBe(true);
  });

  test('cards animate to final position after scroll', async ({ page }) => {
    await page.goto(WORKS_URL);
    await page.waitForSelector('.works-card', { timeout: 15_000 });

    // Scroll to mid-page and wait for animations
    await page.evaluate(() => window.scrollTo({ top: 800, behavior: 'instant' }));
    await page.waitForTimeout(2500);

    const finalStates = await page.$$eval('.works-card', cards =>
      cards.map(card => {
        const rect = card.getBoundingClientRect();
        const style = window.getComputedStyle(card);
        return {
          opacity: parseFloat(style.opacity),
          inViewport: rect.top < window.innerHeight && rect.bottom > 0,
          transform: style.transform,
        };
      })
    );

    // Cards that are in viewport should be fully visible and at rest
    const inViewCards = finalStates.filter(s => s.inViewport);
    expect(inViewCards.length).toBeGreaterThan(0);

    inViewCards.forEach(card => {
      expect(card.opacity).toBeGreaterThanOrEqual(0.9);
    });
  });

  test('filter switch triggers re-animation of cards', async ({ page }) => {
    await page.goto(WORKS_URL);
    await page.waitForSelector('.works-card', { timeout: 15_000 });

    // Wait for initial animations to settle
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(2000);

    // Count initial cards
    const initialCount = await page.locator('.works-card').count();

    // Click a filter button (not ALL — pick the second filter)
    const filterButtons = page.locator('.filter-btn');
    const filterCount = await filterButtons.count();
    if (filterCount > 1) {
      await filterButtons.nth(1).click();
      await page.waitForTimeout(1500);

      // Cards should still be visible after filter animation
      const cardsAfterFilter = await page.$$eval('.works-card', cards =>
        cards.map(card => ({
          opacity: parseFloat(window.getComputedStyle(card).opacity),
        }))
      );

      // After animation settles, visible cards should have opacity near 1
      const visibleAfter = cardsAfterFilter.filter(c => c.opacity > 0.8);
      expect(visibleAfter.length).toBeGreaterThan(0);
    }
  });

  test('section has overflowX hidden to prevent scrollbar', async ({ page }) => {
    await page.goto(WORKS_URL);
    await page.waitForSelector('.works-card', { timeout: 15_000 });

    const hasOverflowHidden = await page.$$eval('.works-card', cards => {
      // Walk up from a card to find the section parent
      let el = cards[0]?.parentElement;
      while (el && el.tagName !== 'SECTION') {
        el = el.parentElement;
      }
      if (!el) return false;
      return window.getComputedStyle(el).overflowX === 'hidden';
    });

    expect(hasOverflowHidden).toBe(true);
  });
});

test.describe('Works page card animations — mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('cards render and animate on mobile viewport', async ({ page }) => {
    await page.goto(WORKS_URL);
    await page.waitForSelector('.works-card', { timeout: 15_000 });

    await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }));
    await page.waitForTimeout(2000);

    const cards = await page.$$eval('.works-card', cards =>
      cards.map(card => ({
        direction: card.getAttribute('data-direction'),
        opacity: parseFloat(window.getComputedStyle(card).opacity),
      }))
    );

    expect(cards.length).toBeGreaterThan(0);

    // At least some cards in viewport should be visible
    const visible = cards.filter(c => c.opacity > 0.5);
    expect(visible.length).toBeGreaterThan(0);

    // Directions should alternate
    cards.forEach((card, i) => {
      expect(card.direction).toBe(i % 2 === 0 ? 'left' : 'right');
    });
  });
});
