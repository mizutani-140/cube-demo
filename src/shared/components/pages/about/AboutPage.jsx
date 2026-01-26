/**
 * ABOUT Page - Architectural Narrative
 *
 * Orchestrator that composes AboutHero, PhilosophySection,
 * TimelineSection, and CompanyInfoSection.
 */

import React from 'react';
import { useSEO, SEO_PRESETS } from '../../../hooks';
import { PageLayout } from '../PageLayout';
import { CompanyInfoSection } from '../../CompanyInfoSection';
import { AboutHero } from './AboutHero';
import { PhilosophySection } from './PhilosophySection';
import { TimelineSection } from './TimelineSection';

export default function AboutPage({ onNavigate }) {
  // SEO設定
  useSEO(SEO_PRESETS.about);

  return (
    <PageLayout currentPage="about" onNavigate={onNavigate}>
      <AboutHero />
      <PhilosophySection />
      <TimelineSection />
      <CompanyInfoSection />
    </PageLayout>
  );
}
