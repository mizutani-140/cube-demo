/**
 * CUBE Corporate Data
 * 株式会社CUBE - コーポレートサイト用データ
 */

// Brand concept
export const brand = {
  name: '株式会社CUBE',
  nameEn: 'CUBE Inc.',
  concept: 'LIFE × ART × BUILD',
  tagline: 'Life is designed.',
  taglineJa: '暮らしを、感性で組み立てる。',
  subTagline: '衣・食・住を、空間から編集する。',
  description: '株式会社CUBEは、内装設計・デザイン・施工を軸に、飲食店、ギャラリー、移動型店舗まで複合的に事業を展開する空間デザインカンパニーです。',
  aboutCopy: 'CUBEは、会社というより、編集体です。',
};

// Company info
export const company = {
  name: '株式会社CUBE',
  founded: '2013年9月25日',
  capital: '1,600万円',
  ceo: '嶋村 慶太',
  ceoTitle: '代表取締役',
  representative: '嶋村 慶太',
  employees: '15名',
  philosophy: '暮らしを、感性で組み立てる。CUBEは、空間を通じて人々の生活に思想と美意識を届けます。',
  businessHours: '平日 10:00 - 19:00',
  headquarters: {
    label: '本社',
    address: '東京都目黒区上目黒4-18-25 グレースビル1階',
    addressEn: '4-18-25 Kamimeguro, Meguro-ku, Tokyo',
  },
  office: {
    label: '祐天寺オフィス',
    address: '東京都目黒区祐天寺2-12-11 泉ホームズ102号室',
  },
  tel: '03-6712-2354',
  email: 'info@cube-group.co.jp',
  website: 'https://www.cube-group.co.jp',
};

// Vision & Mission
export const vision = {
  vision: 'すべての暮らしに、思想と美意識を。',
  visionEn: 'Thought and aesthetics in every life.',
  mission: [
    '手ざわりのある空間をつくる',
    '生活を"デザイン"で再発明する',
    '作り手と使い手の"共創関係"を育てる',
  ],
  values: [
    { label: '再編集する力', desc: '廃材や古着に新たな価値を与える' },
    { label: '街を舞台にする視点', desc: '地域に根差した店舗・ギャラリー展開' },
    { label: '持続可能な仕組み', desc: 'オーガニックや無農薬を取り入れた継続可能な事業設計' },
    { label: 'つなぎ手としての役割', desc: '人・場所・技術を結び、共創する仕組みを構築' },
  ],
};

// Business units (for Plan A) - 6 cube faces
export const businesses = [
  {
    id: 'works',
    titleJa: '実績・作品',
    titleEn: 'Works',
    shortTitle: 'WORKS',
    description: 'CUBEの実績は、完成した「空間」だけではありません。そこで生まれる体験、時間、記憶まで。',
    points: [
      '店舗・オフィス設計',
      'リノベーション',
      '空間デザイン',
    ],
    color: '#A89060',
    icon: 'WORKS',
    image: '/portfolio/knot.jpg',
    isExternal: false,
  },
  {
    id: 'about',
    titleJa: '会社概要',
    titleEn: 'About CUBE',
    shortTitle: 'ABOUT',
    description: 'CUBEは、「LIFE × ART × BUILD」を核に、暮らし・感性・創造を掛け合わせた新しい空間と体験をつくる、ライフスタイル創造企業です。',
    points: [
      '2013年設立',
      '目黒区を拠点',
      '100年ビジョン',
    ],
    color: '#8B5A2B',
    icon: 'ABOUT',
    image: '/About_CUBE.png',
    isExternal: false,
  },
  {
    id: 'access',
    titleJa: 'アクセス',
    titleEn: 'Access',
    shortTitle: 'ACCESS',
    description: '東京都目黒区を拠点に活動しています。お気軽にお越しください。',
    points: [
      '目黒区上目黒',
      '祐天寺駅より徒歩',
      '駐車場あり',
    ],
    color: '#2E7DA8',
    icon: 'ACCESS',
    image: '/Access.png',
    isExternal: false,
  },
  {
    id: 'contact',
    titleJa: 'お問い合わせ',
    titleEn: 'Contact',
    shortTitle: 'CONTACT',
    description: '設計・工事のご相談、求人・コラボレーションなど、お気軽にお問い合わせください。',
    points: [
      '設計・工事相談',
      '求人・採用',
      'コラボレーション',
    ],
    color: '#8A9199',
    icon: 'CONTACT',
    image: '/Contact.png',
    isExternal: false,
  },
  {
    id: 'lambchan',
    titleJa: '飲食店｜LambCHAN',
    titleEn: 'Restaurant',
    shortTitle: 'Lamb CHAN',
    description: 'CUBEが運営する羊料理専門店。空間と食の実験場として、内装・音・温度・サービスまで含めて「体験」として設計しています。',
    points: [
      '羊料理専門店',
      '空間体験',
      '祐天寺',
    ],
    color: '#C0392B',
    icon: 'FOOD',
    image: '/portfolio/lamb-chan.jpg',
    isExternal: false,
    isComingSoon: true,
  },
  {
    id: 'lifenostalgia',
    titleJa: '貸しギャラリー｜Life Nostalgia',
    titleEn: 'Gallery',
    shortTitle: 'LIFE NOSTALGIA',
    description: 'アート・デザイン・プロダクトが交差するための貸しギャラリー。展示される側も、訪れる側も、空間の一部になる。',
    points: [
      'アート展示',
      'プロダクト展示',
      '貸しスペース',
    ],
    color: '#2E8B57',
    icon: 'ART',
    image: '/LIFE NOSTALGIA.jpg',
    isExternal: false,
    isComingSoon: true,
  },
];

// Timeline (for Plan C)
export const timeline = [
  { year: '2013', title: '創業', desc: 'ビルメンテナンス、清掃事業からスタート' },
  { year: '2014-2018', title: '職人集団へ', desc: '内装・大工・電気・空調工事へ拡張' },
  { year: '2018-2025', title: 'ライフスタイル事業', desc: 'LambCHAN、Life Nostalgia開業' },
  { year: '2025-', title: 'CUBE VILLAGE構想', desc: '有機農業×店舗×アート×建築の複合拠点' },
  { year: '2050-', title: '街を耕す', desc: '編集型不動産による街の再価値化' },
];

// Contact categories
export const contactCategories = [
  {
    title: '設計・工事のご相談',
    items: ['店舗・オフィス', '企画段階からの相談', '小規模案件も可'],
  },
  {
    title: '求人・コラボレーション',
    items: ['設計・施工', '飲食', 'プロジェクト単位'],
  },
];

// Instagram accounts
export const instagram = [
  { name: 'LambCHAN', handle: '@lambchan_tokyo' },
  { name: 'Life Nostalgia', handle: '@life_nostalgia' },
  { name: 'CUBE Works', handle: '@cube_works' },
];

// Brand keywords
export const keywords = [
  { word: 'LIFESTYLE', meaning: '暮らしをデザインする' },
  { word: 'REUSE', meaning: '価値の再編集＝新しい美' },
  { word: 'ART × LIFE', meaning: '思想を持ったプロダクト' },
  { word: 'EDIT LOCAL', meaning: '地域とつながり、育てる' },
  { word: 'HANDS-ON', meaning: '現場から生まれる品質と関係性' },
];
