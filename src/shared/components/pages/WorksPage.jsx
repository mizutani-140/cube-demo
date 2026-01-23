/**
 * WORKS Page - Anime.js v4 Case Study Format
 *
 * Redesigned Works page with filterable card grid and case study modal.
 * Uses Anime.js v4 for all animations: page load, scroll reveals,
 * filter transitions, hover effects, and modal interactions.
 *
 * 「空間は、記憶になる。」- Space becomes memory.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { projects } from '../../data/corporate';
import { PageLayout } from './PageLayout';
import { WorksHero } from './works/WorksHero';
import { CategoryFilter } from './works/CategoryFilter';
import { WorksGrid } from './works/WorksGrid';
import { CaseStudyModal } from './works/CaseStudyModal';
import { typography } from '../../tokens';
import { useSEO, SEO_PRESETS } from '../../hooks';

/**
 * Normalize category for filtering
 * Maps various category values to standard filter categories
 */
function normalizeCategory(category) {
  // Direct match for standard categories
  const standardCategories = ['RESTAURANT', 'COMMERCIAL', 'RETAIL', 'RESIDENTIAL', 'BAR', 'BEAUTY'];
  if (standardCategories.includes(category)) {
    return category;
  }
  return category;
}

/**
 * Calculate project counts by category
 */
function calculateProjectCounts(projectList) {
  const counts = {
    total: projectList.length,
    RESTAURANT: 0,
    COMMERCIAL: 0,
    RETAIL: 0,
    RESIDENTIAL: 0,
    BAR: 0,
    BEAUTY: 0,
  };

  projectList.forEach((project) => {
    const normalizedCategory = normalizeCategory(project.category);
    if (counts[normalizedCategory] !== undefined) {
      counts[normalizedCategory]++;
    }
  });

  return counts;
}

/**
 * Main Works Page Component
 */
export default function WorksPage({ onNavigate }) {
  // SEO設定
  useSEO(SEO_PRESETS.works);

  // State
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate filtered projects
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'ALL') return projects;

    return projects.filter((project) => {
      const normalizedCategory = normalizeCategory(project.category);
      return normalizedCategory === activeFilter;
    });
  }, [activeFilter]);

  // Calculate project counts for filter
  const projectCounts = useMemo(() => {
    return calculateProjectCounts(projects);
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((category) => {
    setActiveFilter(category);
  }, []);

  // Handle project click - open modal
  const handleProjectClick = useCallback((project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  }, []);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    // Delay clearing selected project for exit animation
    setTimeout(() => {
      setSelectedProject(null);
    }, 300);
  }, []);

  return (
    <PageLayout currentPage="works" onNavigate={onNavigate}>
      {/* Hero Section */}
      <WorksHero />

      {/* Filter Section */}
      <CategoryFilter
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        projectCounts={projectCounts}
      />

      {/* Project Grid */}
      <WorksGrid
        projects={filteredProjects}
        onProjectClick={handleProjectClick}
        activeFilter={activeFilter}
      />

      {/* Case Study Modal */}
      <CaseStudyModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </PageLayout>
  );
}
