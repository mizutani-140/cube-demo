/**
 * useSEO Hook
 * ページごとのSEO設定を管理するカスタムフック
 *
 * 機能:
 * - ページタイトルの動的更新
 * - meta description の更新
 * - canonical URL の管理
 * - Open Graph / Twitter Card の更新
 * - パンくずリスト構造化データの動的更新
 */

import { useEffect } from 'react';

// 会社情報
const SITE_NAME = '株式会社CUBE';
const SITE_URL = 'https://www.cube-group.co.jp';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;
const BREADCRUMB_SCRIPT_ID = 'dynamic-breadcrumb-jsonld';

/**
 * ページごとのSEO設定を適用するフック
 *
 * @param {Object} options - SEO設定オプション
 * @param {string} options.title - ページタイトル
 * @param {string} options.description - ページの説明文
 * @param {string} options.path - ページのパス (例: '/works')
 * @param {string} options.image - OGP画像URL
 * @param {string} options.type - ページタイプ ('website' | 'article')
 * @param {string} options.breadcrumbName - パンくずリストに表示するページ名
 * @param {Array} options.breadcrumbParents - 親パンくず [{name, path}, ...]
 */
export function useSEO({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  breadcrumbName,
  breadcrumbParents,
} = {}) {
  useEffect(() => {
    // ページタイトルの更新
    const fullTitle = title
      ? `${title}｜${SITE_NAME}`
      : `${SITE_NAME}｜内装設計・デザイン・施工｜東京都目黒区`;

    document.title = fullTitle;

    // meta description の更新
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && description) {
      metaDescription.setAttribute('content', description);
    }

    // canonical URL の更新
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `${SITE_URL}${path}`);
    }

    // Open Graph tags の更新
    updateMetaTag('og:title', title || SITE_NAME);
    updateMetaTag('og:description', description);
    updateMetaTag('og:url', `${SITE_URL}${path}`);
    updateMetaTag('og:image', image);
    updateMetaTag('og:type', type);

    // Twitter Card tags の更新
    updateMetaTag('twitter:title', title || SITE_NAME, 'name');
    updateMetaTag('twitter:description', description, 'name');
    updateMetaTag('twitter:image', image, 'name');

    // パンくずリスト構造化データの更新
    updateBreadcrumb(path, breadcrumbName || title, breadcrumbParents);

    // クリーンアップ
    return () => {
      const script = document.getElementById(BREADCRUMB_SCRIPT_ID);
      if (script) script.remove();
    };
  }, [title, description, path, image, type, breadcrumbName, breadcrumbParents]);
}

/**
 * meta タグを更新するヘルパー関数
 */
function updateMetaTag(name, content, attr = 'property') {
  if (!content) return;

  const selector = attr === 'property'
    ? `meta[property="${name}"]`
    : `meta[name="${name}"]`;

  const tag = document.querySelector(selector);
  if (tag) {
    tag.setAttribute('content', content);
  }
}

/**
 * パンくずリスト構造化データを動的に更新する
 */
function updateBreadcrumb(path, pageName, parents) {
  // 既存のスクリプトを削除
  const existing = document.getElementById(BREADCRUMB_SCRIPT_ID);
  if (existing) existing.remove();

  // ホームの場合は index.html の静的パンくずに任せる
  if (path === '/') return;

  const items = [
    { name: 'ホーム', item: `${SITE_URL}/` },
  ];

  // 親パンくずを追加
  if (parents) {
    parents.forEach((p) => {
      items.push({ name: p.name, item: `${SITE_URL}${p.path}` });
    });
  }

  // 現在のページ
  if (pageName) {
    items.push({ name: pageName, item: `${SITE_URL}${path}` });
  }

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };

  const script = document.createElement('script');
  script.id = BREADCRUMB_SCRIPT_ID;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(breadcrumbData);
  document.head.appendChild(script);
}

/**
 * ページ別のSEO設定プリセット
 */
export const SEO_PRESETS = {
  home: {
    title: null, // デフォルトタイトルを使用
    description: '株式会社CUBEは、LIFE × ART × BUILDをコンセプトに、内装設計・デザイン・施工を手がける空間デザインカンパニーです。飲食店、オフィス、店舗、住宅のリノベーションから、ギャラリー運営まで。',
    path: '/',
  },
  works: {
    title: '実績・作品',
    description: 'CUBEの内装設計・空間デザインの実績をご紹介。飲食店、店舗、オフィス、住宅など、様々なプロジェクトを手がけています。',
    path: '/works',
    breadcrumbName: '実績・作品',
  },
  about: {
    title: '会社概要',
    description: '株式会社CUBEの会社概要。2013年設立、東京都目黒区を拠点に内装設計・デザイン・施工を行う空間デザインカンパニーです。',
    path: '/about',
    breadcrumbName: '会社概要',
  },
  news: {
    title: 'お知らせ',
    description: '株式会社CUBEからのお知らせ、イベント情報、プロジェクト完成報告などを掲載しています。',
    path: '/news',
    breadcrumbName: 'お知らせ',
  },
  contact: {
    title: 'お問い合わせ',
    description: '株式会社CUBEへのお問い合わせ。設計・工事のご相談、求人・コラボレーションなど、お気軽にご連絡ください。',
    path: '/contact',
    breadcrumbName: 'お問い合わせ',
  },
  access: {
    title: 'アクセス',
    description: '株式会社CUBEへのアクセス。東京都目黒区上目黒4-18-25 グレースビル1階。祐天寺駅より徒歩圏内。',
    path: '/access',
    breadcrumbName: 'アクセス',
  },
  lambchan: {
    title: 'Lamb CHAN｜羊料理専門店',
    description: 'CUBEが運営する羊料理専門店Lamb CHAN。空間と食の実験場として、内装・音・温度・サービスまで含めて「体験」として設計。',
    path: '/lambchan',
    breadcrumbName: 'Lamb CHAN',
  },
  lifenostalgia: {
    title: 'Life Nostalgia｜貸しギャラリー',
    description: 'アート・デザイン・プロダクトが交差するための貸しギャラリー。展示される側も、訪れる側も、空間の一部になる。',
    path: '/lifenostalgia',
    breadcrumbName: 'Life Nostalgia',
  },
};

/**
 * プロジェクト詳細ページ用のSEO設定を生成
 */
export function getProjectSEO(project) {
  if (!project) return {};

  return {
    title: `${project.title}｜実績`,
    description: project.description,
    path: `/works/${project.id}`,
    image: project.image ? `${SITE_URL}${project.image}` : DEFAULT_IMAGE,
    type: 'article',
    breadcrumbName: project.title,
    breadcrumbParents: [{ name: '実績・作品', path: '/works' }],
  };
}

export default useSEO;
