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

// Portfolio projects (for Plan B)
export const projects = [
  {
    id: 'lamb-chan',
    title: 'Lamb CHAN',
    titleEn: 'Lamb CHAN',
    titleJa: 'ラムチャン',
    category: 'RESTAURANT',
    year: '2023',
    location: '東京都目黒区祐天寺',
    description: '空間と食の実験場。羊料理専門店として、内装・音・温度・サービスまで含めて「体験」として設計。温かみのある素材と照明で、落ち着いた大人の空間を演出。',
    tags: ['飲食店', '自社運営', 'ブランディング'],
    color: '#e74c3c',
    image: '/portfolio/lamb-chan.jpg',
    gallery: [
      '/portfolio/lamb-chan.jpg',
      '/portfolio/lamb-chan-2.jpg',
      '/portfolio/lamb-chan-3.jpg',
      '/portfolio/lamb-chan-4.jpg',
    ],
  },
  {
    id: 'knot',
    title: 'Knot 三宿',
    titleEn: 'Knot Mishuku',
    titleJa: 'ノット三宿',
    category: 'COMMERCIAL',
    year: '2021',
    location: '東京都世田谷区三宿',
    description: '人と人、空間と時間が交差する場所。結び目（Knot）をコンセプトに、異なる要素が自然に混ざり合う商業空間を設計。',
    tags: ['商業施設', '店舗', 'コンセプト設計'],
    color: '#8A9BAD',
    image: '/portfolio/knot.jpg',
    gallery: [
      '/portfolio/knot.jpg',
      '/portfolio/knot-2.jpg',
      '/portfolio/knot-3.jpg',
      '/portfolio/knot-4.jpg',
    ],
  },
  {
    id: 'yurinan-harajuku',
    title: 'YURINAN 原宿',
    titleEn: 'YURINAN Harajuku',
    titleJa: '有隣庵 原宿',
    category: 'RETAIL',
    year: '2021',
    location: '東京都渋谷区原宿',
    description: '日本の伝統と現代の美意識を融合。原宿の活気あふれる街並みの中に、静謐な和の空間を創出。',
    tags: ['店舗', '和モダン', '原宿'],
    color: '#C7B99A',
    image: '/portfolio/yurinan-harajuku.jpg',
    gallery: [
      '/portfolio/yurinan-harajuku.jpg',
      '/portfolio/yurinan-harajuku-2.jpg',
      '/portfolio/yurinan-harajuku-3.jpg',
      '/portfolio/yurinan-harajuku-4.jpg',
    ],
  },
  {
    id: 'yurinan-kamakura',
    title: 'YURINAN 鎌倉',
    titleEn: 'YURINAN Kamakura',
    titleJa: '有隣庵 鎌倉',
    category: 'RETAIL',
    year: '2024',
    location: '神奈川県鎌倉市',
    description: '土地の記憶を継承し新たな価値を創出。鎌倉の歴史ある街並みに溶け込みながら、新しい体験を提供する空間。',
    tags: ['店舗', '古都', 'リノベーション'],
    color: '#5FAD8B',
    image: '/portfolio/yurinan-kamakura.jpg',
    gallery: [
      '/portfolio/yurinan-kamakura.jpg',
      '/portfolio/yurinan-kamakura-2.jpg',
      '/portfolio/yurinan-kamakura-3.jpg',
      '/portfolio/yurinan-kamakura-4.jpg',
    ],
  },
  {
    id: 'sot-catstreet',
    title: 'sot キャットストリート',
    titleEn: 'sot Cat Street',
    titleJa: 'ソット キャットストリート',
    category: 'RETAIL',
    year: '2024',
    location: '東京都渋谷区神宮前',
    description: '革の温もりと職人の技を空間で表現。レザーブランド「sot」の世界観を、素材感と光のコントラストで演出。',
    tags: ['店舗', 'ブランドショップ', 'レザー'],
    color: '#8B7355',
    image: '/portfolio/sot-catstreet.jpg',
    gallery: [
      '/portfolio/sot-catstreet.jpg',
      '/portfolio/sot-catstreet-2.jpg',
      '/portfolio/sot-catstreet-3.jpg',
    ],
  },
  {
    id: 'sot-marunouchi',
    title: 'sot 新丸ビル',
    titleEn: 'sot Shin-Marunouchi',
    titleJa: 'ソット 新丸ビル',
    category: 'RETAIL',
    year: '2020',
    location: '東京都千代田区丸の内',
    description: '都市の空気感と有機的な温もりを融合。ビジネス街の洗練さの中に、手仕事の温かみを感じる空間設計。',
    tags: ['店舗', 'ブランドショップ', '商業ビル'],
    color: '#C8CDD5',
    image: '/portfolio/sot-marunouchi.jpg',
    gallery: [
      '/portfolio/sot-marunouchi.jpg',
      '/portfolio/sot-marunouchi-2.jpg',
      '/portfolio/sot-marunouchi-3.jpg',
      '/portfolio/sot-marunouchi-4.jpg',
    ],
  },
  {
    id: 'carbo',
    title: 'カルボ渋谷',
    titleEn: 'CARBO Shibuya',
    titleJa: 'カルボ渋谷',
    category: 'RESTAURANT',
    year: '2024',
    location: '東京都渋谷区',
    description: '料理の力強さと繊細さを空間で体現。炭火焼きをコンセプトに、ダイナミックでありながら繊細な空間を創造。',
    tags: ['飲食店', 'イタリアン', '渋谷'],
    color: '#4A4A4A',
    image: '/portfolio/carbo.jpg',
    gallery: [
      '/portfolio/carbo.jpg',
      '/portfolio/carbo-2.jpg',
      '/portfolio/carbo-3.jpg',
      '/portfolio/carbo-4.jpg',
    ],
  },
  {
    id: 'la-bretxa',
    title: 'LA BRETXA',
    titleEn: 'LA BRETXA',
    titleJa: 'ラブレチャ',
    category: 'RESTAURANT',
    year: '2022',
    location: '東京都',
    description: 'そよ風のように爽やかで開放的な空間。バスク地方の市場をイメージした、活気と温かみのあるダイニング。',
    tags: ['飲食店', 'ダイニング', 'バスク'],
    color: '#E8D4B8',
    image: '/portfolio/la-bretxa.jpg',
    gallery: [
      '/portfolio/la-bretxa.jpg',
      '/portfolio/la-bretxa-2.jpg',
      '/portfolio/la-bretxa-3.jpg',
      '/portfolio/la-bretxa-4.jpg',
    ],
  },
  {
    id: 'pablo',
    title: 'パブロ',
    titleEn: 'Pablo',
    titleJa: 'パブロ',
    category: 'BAR',
    year: '2021',
    location: '東京都',
    description: '大人のためのアーティスティックな空間。芸術家パブロ・ピカソへのオマージュを込めた、創造性あふれるバー。',
    tags: ['バー', 'アート', 'ナイトライフ'],
    color: '#2C3E50',
    image: '/portfolio/pablo.jpg',
    gallery: [
      '/portfolio/pablo.jpg',
      '/portfolio/pablo-2.jpg',
    ],
  },
  {
    id: 'ael',
    title: 'Ael',
    titleEn: 'Ael',
    titleJa: 'アエル',
    category: 'BEAUTY',
    year: '2024',
    location: '東京都',
    description: '出会いを生む、洗練された場所。「会える」という言葉を込めた、美と癒しの空間。',
    tags: ['美容室', 'サロン', 'ビューティー'],
    color: '#D4A5A5',
    image: '/portfolio/ael.jpg',
    gallery: [
      '/portfolio/ael.jpg',
      '/portfolio/ael-2.jpg',
      '/portfolio/ael-3.jpg',
      '/portfolio/ael-4.jpg',
    ],
  },
  {
    id: 't-residence',
    title: 'T Residence',
    titleEn: 'T Residence',
    titleJa: 'T邸',
    category: 'RESIDENTIAL',
    year: '2023',
    location: '東京都世田谷区',
    description: '暮らしに寄り添う住宅リノベーション。家族の日常に溶け込む、機能的で温かみのある住空間を実現。',
    tags: ['住宅', 'リノベーション', '世田谷'],
    color: '#A8C69F',
    image: '/portfolio/t-residence.jpg',
    gallery: [
      '/portfolio/t-residence.jpg',
      '/portfolio/t-residence-2.jpg',
      '/portfolio/t-residence-3.jpg',
      '/portfolio/t-residence-4.jpg',
    ],
  },
  {
    id: 'y-residence',
    title: 'Y Residence',
    titleEn: 'Y Residence',
    titleJa: 'Y邸',
    category: 'RESIDENTIAL',
    year: '2023',
    location: '東京都目黒区',
    description: '自然を感じる都市の住まい。都会の喧騒の中にも、緑と光を取り込んだ穏やかな暮らしを設計。',
    tags: ['住宅', 'リノベーション', '目黒'],
    color: '#7BA3A8',
    image: '/portfolio/y-residence.jpg',
    gallery: [
      '/portfolio/y-residence.jpg',
      '/portfolio/y-residence-2.jpg',
      '/portfolio/y-residence-3.jpg',
      '/portfolio/y-residence-4.jpg',
    ],
  },
  {
    id: 'harebozu',
    title: '晴れ坊主',
    titleEn: 'Harebozu',
    titleJa: '晴れ坊主',
    category: 'RESTAURANT',
    year: '2023',
    location: '東京都',
    description: '晴れやかな気持ちになれる空間。日本の食文化と現代的なデザインが融合した、温かみのある飲食空間。',
    tags: ['飲食店', '和食', 'デザイン'],
    color: '#F5A623',
    image: '/portfolio/harebozu.jpg',
    gallery: [
      '/portfolio/harebozu.jpg',
      '/portfolio/harebozu-2.jpg',
      '/portfolio/harebozu-3.jpg',
    ],
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

// Navigation items
export const navigation = [
  { id: 'works', label: 'WORKS', labelJa: '実績' },
  { id: 'about', label: 'ABOUT', labelJa: '会社概要' },
  { id: 'news', label: 'NEWS', labelJa: 'お知らせ' },
  { id: 'contact', label: 'CONTACT', labelJa: 'お問い合わせ' },
  { id: 'access', label: 'ACCESS', labelJa: 'アクセス' },
  { id: 'lambchan', label: 'LambCHAN', labelJa: '飲食店' },
  { id: 'lifenostalgia', label: 'LIFE NOSTALGIA', labelJa: 'ギャラリー' },
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

// News items
export const news = [
  {
    id: 'news-1',
    date: '2025-01-15',
    title: '有機農業事業の本格始動について',
    excerpt: '2025年7月より、千葉県にて有機・無農薬野菜の栽培を開始いたします。',
    content: '2025年7月より、千葉県にて有機・無農薬野菜の栽培を開始いたします。持続可能な農業を通じて、食と暮らしの新しい関係を提案していきます。',
    category: 'news',
  },
  {
    id: 'news-2',
    date: '2025-01-10',
    title: 'Life Nostalgia 新展示のお知らせ',
    excerpt: '1月15日より、アーティスト山田太郎氏による個展「余白の記憶」を開催。',
    content: '1月15日より、アーティスト山田太郎氏による個展「余白の記憶」を開催いたします。空間と作品が対話する、特別な体験をお届けします。',
    category: 'event',
  },
  {
    id: 'news-3',
    date: '2024-12-20',
    title: 'LambCHAN 年末年始営業のご案内',
    excerpt: '12/30〜1/3は休業とさせていただきます。新年は1/4より通常営業。',
    content: '誠に勝手ながら、12月30日から1月3日まで休業とさせていただきます。新年は1月4日より通常営業いたします。',
    category: 'news',
  },
  {
    id: 'news-4',
    date: '2024-12-01',
    title: '渋谷区オフィスプロジェクト完了',
    excerpt: 'スタートアップ企業様のオフィス空間デザインが完成しました。',
    content: '渋谷区のスタートアップ企業様のオフィス空間デザインプロジェクトが完成いたしました。創造性を刺激する開放的なワークスペースを実現しました。',
    category: 'release',
  },
  {
    id: 'news-5',
    date: '2024-11-15',
    title: '求人情報：設計スタッフ募集',
    excerpt: '空間設計・デザインに興味のある方を募集しています。',
    content: 'CUBEでは、空間設計・デザインに情熱を持つ新しい仲間を募集しています。経験よりも、「暮らしを良くしたい」という想いを大切にしています。',
    category: 'news',
  },
];

// FAQ items
export const faq = [
  {
    question: '相談は無料ですか？',
    answer: 'はい、初回のご相談は無料で承っております。プロジェクトの規模や内容に関わらず、まずはお気軽にお問い合わせください。',
  },
  {
    question: '対応エリアはどこまでですか？',
    answer: '東京都・神奈川県・埼玉県・千葉県を中心に対応しておりますが、プロジェクトの内容によっては全国対応も可能です。',
  },
  {
    question: '小規模な案件も対応可能ですか？',
    answer: 'はい、規模の大小に関わらず対応いたします。小さなリノベーションから大規模な店舗設計まで、お気軽にご相談ください。',
  },
  {
    question: '設計から施工まで一貫してお願いできますか？',
    answer: 'はい、企画・設計から施工・アフターフォローまで一貫して対応いたします。ワンストップでのサービス提供が私たちの強みです。',
  },
  {
    question: '予算の目安を教えてください。',
    answer: '案件の規模や内容によって大きく異なりますが、まずはご予算をお聞かせいただき、最適なプランをご提案いたします。',
  },
];
