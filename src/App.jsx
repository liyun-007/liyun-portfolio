import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  BriefcaseBusiness,
  ChartNoAxesCombined,
  CircleCheck,
  Mail,
  MapPin,
  MousePointer2,
  Phone,
  RotateCcw,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import CircularGallery from './CircularGallery.jsx';
import CountUp from './CountUp.jsx';
import Masonry from './Masonry.jsx';

const STORAGE_KEY = 'li-yun-portfolio-content';

const assetBase = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.replace(/\/$/, '');

function resolveAssetPath(value) {
  return typeof value === 'string' && value.startsWith('/assets/') ? `${assetBase}${value}` : value;
}

function resolveAssetPaths(value) {
  if (Array.isArray(value)) return value.map(resolveAssetPaths);
  if (!value || typeof value !== 'object') return resolveAssetPath(value);

  return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, resolveAssetPaths(entry)]));
}

const iconMap = {
  mouse: MousePointer2,
  chart: ChartNoAxesCombined,
  sparkles: Sparkles,
  briefcase: BriefcaseBusiness,
  check: CircleCheck,
};

const contacts = [
  { icon: Phone, label: '电话', value: '136 3907 9654', href: 'tel:13639079654' },
  { icon: Mail, label: '邮箱', value: 'xxde_youxiang@163.com', href: 'mailto:xxde_youxiang@163.com' },
  { icon: MapPin, label: '城市', value: '贵阳', href: '#contact' },
];

const metrics = [
  { value: '9年', label: '设计工作经验' },
  { value: '4年+', label: 'UI / 产品界面经验' },
  { value: '900+', label: '高保真页面独立输出' },
  { value: '30%', label: '协作开发效率提升' },
];

const projects = [
  {
    title: '企业内部业务系统 UI',
    tag: 'Web / OA / CRM / 供应链',
    image: '/assets/project-enterprise-dashboard.png',
    summary: '覆盖工作台、列表页、表单页、审批页等核心场景，统一控件、图标和字体规范，帮助业务流程更清晰地落地。',
  },
  {
    title: '移动端小程序体验',
    tag: '审批 / 商城 / 业务处理',
    image: '/assets/project-mobile-workflow.png',
    summary: '围绕轻量化和高便捷性优化滑动、下拉刷新、扫码等交互，让移动端与 Web 端在风格和效率上保持一致。',
  },
  {
    title: '数据可视化大屏',
    tag: 'Dashboard / BI / Report',
    image: '/assets/project-data-screen.png',
    summary: '针对销售额、用户量、业务状态等指标选择图表类型，设计钻取、筛选、联动等数据探索体验。',
  },
  {
    title: '电商视觉与旺铺装修',
    tag: 'Alibaba / 首页 / 详情页',
    image: '/assets/project-ecommerce-visual.png',
    summary: '负责客户沟通、需求拆解、首页与详情页视觉设计，曾独立完成 50+ 项旺铺视觉装修项目。',
  },
];

const heroGallery = [
  { title: '品牌海报', tag: 'Poster / Visual', image: '/assets/hero-scroll-cards/hero-card-01.webp' },
  { title: '文化品牌', tag: 'Brand / Culture', image: '/assets/hero-scroll-cards/hero-card-02.webp' },
  { title: '餐饮活动', tag: 'Food / Campaign', image: '/assets/hero-scroll-cards/hero-card-03.webp' },
  { title: '酒类详情', tag: 'Liquor / Detail', image: '/assets/hero-scroll-cards/hero-card-04.webp' },
  { title: '旅游小程序', tag: 'Travel / Mini Program', image: '/assets/hero-scroll-cards/hero-card-05.webp' },
  { title: '官网首页', tag: 'Web / Homepage', image: '/assets/hero-scroll-cards/hero-card-06.webp' },
  { title: '行程设计', tag: 'Travel / Itinerary', image: '/assets/hero-scroll-cards/hero-card-07.webp' },
  { title: '营销视觉', tag: 'Campaign / Visual', image: '/assets/hero-scroll-cards/hero-card-08.webp' },
  { title: '公益移动端', tag: 'Mobile / Charity', image: '/assets/hero-scroll-cards/hero-card-09.webp' },
  { title: 'APP 界面', tag: 'APP / Interface', image: '/assets/hero-scroll-cards/hero-card-10.webp' },
];

const strengths = [
  {
    icon: MousePointer2,
    title: '界面体验落地',
    text: '从流程梳理、原型、高保真到开发还原，能够把业务需求转化为清晰可执行的设计方案。',
    keywords: ['流程梳理', '原型设计', '高保真输出', '开发还原', '体验落地'],
  },
  {
    icon: ChartNoAxesCombined,
    title: '复杂信息组织',
    text: '熟悉后台系统、数据大屏、报表和审批场景，擅长在复杂信息中建立优先级与视觉秩序。',
    keywords: ['后台系统', '数据大屏', '报表设计', '审批流程', '视觉秩序'],
  },
  {
    icon: Sparkles,
    title: '视觉与品牌综合能力',
    text: '兼具 UI、电商视觉、平面排版和品牌设计经验，能在一致风格下处理多终端设计资产。',
    keywords: ['UI 设计', '电商视觉', '平面排版', '品牌设计', '多端资产'],
  },
  {
    icon: BriefcaseBusiness,
    title: '跨团队协作',
    text: '有设计管理和新人培训经历，能与产品、开发及业务团队沟通推进版本迭代和体验优化。',
    keywords: ['产品沟通', '开发协作', '版本迭代', '新人培训', '体验优化'],
  },
  {
    icon: CircleCheck,
    title: '完整项目主导能力',
    text: '能够从需求沟通、信息架构、视觉规范到交付验收完整推进项目，保证设计质量与落地效率。',
    keywords: ['需求沟通', '信息架构', '视觉规范', '交付验收', '落地效率'],
  },
];

const strengthKeywordMap = Object.fromEntries(strengths.map((item) => [item.title, item.keywords]));

const profileFields = [
  { label: '当前身份', value: 'UI 设计师' },
  { label: '设计方向', value: 'APP / Web / 小程序 / 数据可视化' },
  { label: '电话', value: '136****9654' },
  { label: '邮箱', value: 'xxde_youxiang@163.com' },
];

const buildingTags = ['APP', '企业后台系统', '小程序体验', '数据可视化大屏', '电商视觉设计'];

const careerPath = [
  {
    date: '2024.03 - 至今',
    company: '贵州西洋实业有限公司',
    role: 'UI 设计师',
    summary: '负责 OA、客户管理、供应链、小程序、数据大屏等企业内部业务 UI 设计与设计规范维护。',
  },
  {
    date: '2022.03 - 2023.06',
    company: '贵州省房地产业协会',
    role: 'UI 设计师',
    summary: '负责 B 端 APP 与后台页面视觉设计，独立完成 100+ 页高保真输出并推进版本迭代。',
  },
  {
    date: '2020.04 - 2021.12',
    company: '贵州黔大鹏网络科技有限公司',
    role: '设计经理 / 主管',
    summary: '负责项目管理、团队工作规划、新人培训和重点项目视觉设计。',
  },
];

const workMasonry = [
  { title: 'WORK 01', tag: 'APP / Interface', image: '/assets/works-gallery/work-01.webp', size: 'tall' },
  { title: 'WORK 02', tag: 'Visual / Campaign', image: '/assets/works-gallery/work-02.webp', size: 'medium' },
  { title: 'WORK 03', tag: 'Product / Service', image: '/assets/works-gallery/work-03.webp', size: 'wide' },
  { title: 'WORK 04', tag: 'UI / Visual', image: '/assets/works-gallery/work-04.webp', size: 'medium' },
  { title: 'WORK 05', tag: 'APP / Interface', image: '/assets/works-gallery/work-05.webp', size: 'short' },
  { title: 'WORK 06', tag: 'Visual / Campaign', image: '/assets/works-gallery/work-06.webp', size: 'tall' },
  { title: 'WORK 07', tag: 'Product / Service', image: '/assets/works-gallery/work-07.webp', size: 'medium' },
  { title: 'WORK 08', tag: 'UI / Visual', image: '/assets/works-gallery/work-08.webp', size: 'wide' },
  { title: 'WORK 09', tag: 'APP / Interface', image: '/assets/works-gallery/work-09.webp', size: 'short' },
  { title: 'WORK 10', tag: 'Visual / Campaign', image: '/assets/works-gallery/work-10.webp', size: 'tall' },
  { title: 'WORK 11', tag: 'Product / Service', image: '/assets/works-gallery/work-11.webp', size: 'medium' },
  { title: 'WORK 12', tag: 'UI / Visual', image: '/assets/works-gallery/work-12.webp', size: 'wide' },
  { title: 'WORK 13', tag: 'APP / Interface', image: '/assets/works-gallery/work-13.webp', size: 'medium' },
  { title: 'WORK 14', tag: 'Visual / Campaign', image: '/assets/works-gallery/work-14.webp', size: 'short' },
  { title: 'WORK 15', tag: 'Product / Service', image: '/assets/works-gallery/work-15.webp', size: 'tall' },
  { title: 'WORK 16', tag: 'UI / Visual', image: '/assets/works-gallery/work-16.webp', size: 'medium' },
  { title: 'WORK 17', tag: 'APP / Interface', image: '/assets/works-gallery/work-17.webp', size: 'wide' },
  { title: 'WORK 18', tag: 'Visual / Campaign', image: '/assets/works-gallery/work-18.webp', size: 'short' },
  { title: 'WORK 19', tag: 'Product / Service', image: '/assets/works-gallery/work-19.webp', size: 'tall' },
  { title: 'WORK 20', tag: 'UI / Visual', image: '/assets/works-gallery/work-20.webp', size: 'medium' },
  { title: 'WORK 21', tag: 'APP / Interface', image: '/assets/works-gallery/work-21.webp', size: 'wide' },
  { title: 'WORK 22', tag: 'Visual / Campaign', image: '/assets/works-gallery/work-22.webp', size: 'medium' },
  { title: 'WORK 23', tag: 'Product / Service', image: '/assets/works-gallery/work-23.webp', size: 'short' },
  { title: 'WORK 24', tag: 'UI / Visual', image: '/assets/works-gallery/work-24.webp', size: 'tall' },
  { title: 'WORK 25', tag: 'APP / Interface', image: '/assets/works-gallery/work-25.webp', size: 'medium' },
  { title: 'WORK 26', tag: 'Visual / Campaign', image: '/assets/works-gallery/work-26.webp', size: 'wide' },
  { title: 'WORK 27', tag: 'Product / Service', image: '/assets/works-gallery/work-27.webp', size: 'short' },
  { title: 'WORK 28', tag: 'UI / Visual', image: '/assets/works-gallery/work-28.webp', size: 'tall' },
  { title: 'WORK 29', tag: 'APP / Interface', image: '/assets/works-gallery/work-29.webp', size: 'medium' },
  { title: 'WORK 30', tag: 'Visual / Campaign', image: '/assets/works-gallery/work-30.webp', size: 'wide' },
  { title: 'WORK 31', tag: 'Product / Service', image: '/assets/works-gallery/work-31.webp', size: 'medium' },
  { title: 'WORK 32', tag: 'UI / Visual', image: '/assets/works-gallery/work-32.webp', size: 'short' },
  { title: 'WORK 33', tag: 'APP / Interface', image: '/assets/works-gallery/work-33.webp', size: 'tall' },
];

const defaultPortfolioContent = {
  heroCardVersion: 2,
  projectsVersion: 2,
  strengthsVersion: 2,
  hero: {
    video: '/assets/hero-video-02.mp4',
    poster: '/assets/hero-video-02-poster.jpg',
    label: 'PORTFOLIO',
    nameEn: 'LI YUN',
    signature: '/assets/LiYun-20260618.svg',
    spark: '/assets/hero-spark.svg',
    nameCn: '李云',
    description: '把复杂业务界面\n设计成可理解、可协作、可落地的产品体验',
  },
  experience: {
    titleEn: 'WORK EXPERIENCE',
    titleCn: '个人经历',
    image: '/assets/experience-room.png',
    label: 'About Me',
    heading: 'Hi, I am Li Yun!',
    intro: '我拥有 9 年设计从业经验，其中 4 年聚焦 UI 设计，覆盖 APP、小程序、Web 后台、数据可视化大屏等界面场景；同时具备电商视觉、平面视觉、品牌设计和团队管理经验。',
    profileFields,
    metrics,
    buildingTags,
    careerPath,
  },
  heroGallery,
  projects: {
    titleEnPrefix: 'OUR',
    titleEn: 'WORKS',
    titleCn: '作品展示',
    items: workMasonry,
  },
  strengths: {
    titleEn: 'CORE STRENGTHS',
    titleCn: '个人优势',
    items: strengths.map((item, index) => ({
      icon: ['mouse', 'chart', 'sparkles', 'briefcase', 'check'][index] || 'check',
      title: item.title,
      text: item.text,
      keywords: item.keywords,
    })),
  },
  contact: {
    eyebrow: 'CONTACT ME',
    heading: 'NEW\nPRODUCT\nEXPERIENCE',
    image: '/assets/contact-person-1212.png',
    stats: [
      { value: '9年', label: '设计经验' },
      { value: '900+', label: '页面输出' },
    ],
    text: '如果你正在寻找一位有经验、有创意、有责任心的 UI 设计师，可以通过电话或邮箱与我联系。\n我擅长把复杂业务需求整理成清晰、可协作、可落地的产品界面。',
    email: 'xxde_youxiang@163.com',
    phone: '136 3907 9654',
    phoneHref: 'tel:13639079654',
    meta: 'UI 设计师 · 贵阳 · APP / Web / 小程序 / 数据可视化',
  },
};
function mergePortfolioContent(savedContent) {
  if (!savedContent || typeof savedContent !== 'object') {
    return defaultPortfolioContent;
  }

  const savedHero = savedContent.hero && typeof savedContent.hero === 'object' ? { ...savedContent.hero } : {};
  if (savedHero.poster === '/assets/project-data-screen.png') {
    savedHero.poster = defaultPortfolioContent.hero.poster;
  }

  const shouldUseLatestHeroCards =
    savedContent.heroCardVersion !== defaultPortfolioContent.heroCardVersion || !Array.isArray(savedContent.heroGallery);
  const shouldUseLatestProjects =
    savedContent.projectsVersion !== defaultPortfolioContent.projectsVersion ||
    !savedContent.projects ||
    !Array.isArray(savedContent.projects.items);
  const shouldUseLatestStrengths =
    savedContent.strengthsVersion !== defaultPortfolioContent.strengthsVersion ||
    !savedContent.strengths ||
    !Array.isArray(savedContent.strengths.items);

  return {
    ...defaultPortfolioContent,
    ...savedContent,
    heroCardVersion: defaultPortfolioContent.heroCardVersion,
    projectsVersion: defaultPortfolioContent.projectsVersion,
    strengthsVersion: defaultPortfolioContent.strengthsVersion,
    hero: { ...defaultPortfolioContent.hero, ...savedHero },
    experience: { ...defaultPortfolioContent.experience, ...savedContent.experience },
    heroGallery: shouldUseLatestHeroCards ? defaultPortfolioContent.heroGallery : savedContent.heroGallery,
    projects: {
      ...defaultPortfolioContent.projects,
      ...savedContent.projects,
      items: shouldUseLatestProjects ? defaultPortfolioContent.projects.items : savedContent.projects.items,
    },
    strengths: {
      ...defaultPortfolioContent.strengths,
      ...savedContent.strengths,
      items: shouldUseLatestStrengths ? defaultPortfolioContent.strengths.items : savedContent.strengths.items,
    },
    contact: { ...defaultPortfolioContent.contact, ...savedContent.contact },
  };
}

function loadPortfolioContent() {
  try {
    return mergePortfolioContent(JSON.parse(window.localStorage.getItem(STORAGE_KEY)));
  } catch {
    return defaultPortfolioContent;
  }
}

function savePortfolioContent(content) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

function getStrengthKeywords(item) {
  if (Array.isArray(item.keywords) && item.keywords.length > 0) {
    return item.keywords.map((keyword) => String(keyword).trim()).filter(Boolean);
  }

  if (strengthKeywordMap[item.title]) {
    return strengthKeywordMap[item.title];
  }

  return item.text
    .split(/[锛屻€傘€侊紱;,.]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function CurvedLoop({
  marqueeText = '',
  speed = 2,
  className,
  curveAmount = 400,
  direction = 'left',
  interactive = true,
}) {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return `${hasTrailing ? marqueeText.replace(/\s+$/, '') : marqueeText}\u00A0`;
  }, [marqueeText]);
  const measureRef = useRef(null);
  const textPathRef = useRef(null);
  const pathRef = useRef(null);
  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);
  const uid = useId();
  const pathId = `curve-${uid}`;
  const pathD = curveAmount === 0 ? 'M-100,58 L1540,58' : `M-100,40 Q500,${40 + curveAmount} 1540,40`;
  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef(direction);
  const velRef = useRef(0);
  const ready = spacing > 0;
  const totalText = ready ? Array(Math.ceil(1800 / spacing) + 2).fill(text).join('') : text;

  useEffect(() => {
    if (measureRef.current) {
      setSpacing(measureRef.current.getComputedTextLength());
    }
  }, [text, className]);

  useEffect(() => {
    if (!spacing || !textPathRef.current) return;
    const initial = -spacing;
    textPathRef.current.setAttribute('startOffset', `${initial}px`);
    setOffset(initial);
  }, [spacing]);

  useEffect(() => {
    if (!spacing || !ready) return;
    let frame = 0;
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === 'right' ? speed : -speed;
        const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
        let nextOffset = currentOffset + delta;

        if (nextOffset <= -spacing) nextOffset += spacing;
        if (nextOffset > 0) nextOffset -= spacing;

        textPathRef.current.setAttribute('startOffset', `${nextOffset}px`);
        setOffset(nextOffset);
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed, ready]);

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    dirRef.current = velRef.current > 0 ? 'right' : 'left';
  };

  return (
    <div
      className="curved-loop-jacket"
      style={{ visibility: ready ? 'visible' : 'hidden', cursor: interactive ? (dragRef.current ? 'grabbing' : 'grab') : 'auto' }}
      onPointerDown={(event) => {
        if (!interactive) return;
        dragRef.current = true;
        lastXRef.current = event.clientX;
        velRef.current = 0;
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!interactive || !dragRef.current || !textPathRef.current) return;
        const dx = event.clientX - lastXRef.current;
        lastXRef.current = event.clientX;
        velRef.current = dx;

        const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
        let nextOffset = currentOffset + dx;
        if (nextOffset <= -spacing) nextOffset += spacing;
        if (nextOffset > 0) nextOffset -= spacing;

        textPathRef.current.setAttribute('startOffset', `${nextOffset}px`);
        setOffset(nextOffset);
      }}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <svg className="curved-loop-svg" viewBox="0 0 1440 80" aria-hidden="true">
        <text ref={measureRef} xmlSpace="preserve" style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}>
          {text}
        </text>
        <defs>
          <path ref={pathRef} id={pathId} d={pathD} fill="none" stroke="transparent" />
        </defs>
        {ready && (
          <text fontWeight="bold" xmlSpace="preserve" className={className}>
            <textPath ref={textPathRef} href={`#${pathId}`} startOffset={`${offset}px`} xmlSpace="preserve">
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
}

function useVariableAnimationFrame(callback) {
  useEffect(() => {
    let frameId;
    const loop = () => {
      callback();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [callback]);
}

function useMousePositionRef(containerRef) {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (x, y) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = { x: x - rect.left, y: y - rect.top };
        return;
      }
      positionRef.current = { x, y };
    };

    const handleMouseMove = (event) => updatePosition(event.clientX, event.clientY);
    const handleTouchMove = (event) => {
      const touch = event.touches[0];
      if (touch) updatePosition(touch.clientX, touch.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [containerRef]);

  return positionRef;
}

function VariableProximity({
  label,
  fromFontVariationSettings = "'wght' 420, 'opsz' 16",
  toFontVariationSettings = "'wght' 1000, 'opsz' 72",
  containerRef,
  radius = 220,
  falloff = 'linear',
  className = '',
}) {
  const letterRefs = useRef([]);
  const mousePositionRef = useMousePositionRef(containerRef);
  const lastPositionRef = useRef({ x: null, y: null });

  const parsedSettings = useMemo(() => {
    const parseSettings = (settingsStr) =>
      new Map(
        settingsStr
          .split(',')
          .map((setting) => setting.trim())
          .map((setting) => {
            const [name, value] = setting.split(' ');
            return [name.replace(/['"]/g, ''), parseFloat(value)];
          }),
      );
    const fromSettings = parseSettings(fromFontVariationSettings);
    const toSettings = parseSettings(toFontVariationSettings);
    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue,
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const calculateFalloff = useCallback(
    (distance) => {
      const normalized = Math.min(Math.max(1 - distance / radius, 0), 1);
      if (falloff === 'exponential') return normalized ** 2;
      if (falloff === 'gaussian') return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
      return normalized;
    },
    [falloff, radius],
  );

  useVariableAnimationFrame(
    useCallback(() => {
      if (!containerRef?.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const { x, y } = mousePositionRef.current;
      if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) return;
      lastPositionRef.current = { x, y };

      letterRefs.current.forEach((letterRef) => {
        if (!letterRef) return;
        const rect = letterRef.getBoundingClientRect();
        const letterCenterX = rect.left + rect.width / 2 - containerRect.left;
        const letterCenterY = rect.top + rect.height / 2 - containerRect.top;
        const distance = Math.sqrt((x - letterCenterX) ** 2 + (y - letterCenterY) ** 2);

        if (distance >= radius) {
          letterRef.style.fontVariationSettings = fromFontVariationSettings;
          return;
        }

        const falloffValue = calculateFalloff(distance);
        letterRef.style.fontVariationSettings = parsedSettings
          .map(({ axis, fromValue, toValue }) => `'${axis}' ${fromValue + (toValue - fromValue) * falloffValue}`)
          .join(', ');
      });
    }, [calculateFalloff, containerRef, fromFontVariationSettings, mousePositionRef, parsedSettings, radius]),
  );

  let letterIndex = 0;
  return (
    <span className={`${className} variable-proximity`} aria-label={label}>
      {label.split(' ').map((word, wordIndex) => (
        <span className="variable-word" key={`${word}-${wordIndex}`}>
          {word.split('').map((letter) => {
            const currentIndex = letterIndex++;
            return (
              <span
                aria-hidden="true"
                className="variable-letter"
                key={`${letter}-${currentIndex}`}
                ref={(element) => {
                  letterRefs.current[currentIndex] = element;
                }}
              >
                {letter}
              </span>
            );
          })}
          {wordIndex < label.split(' ').length - 1 && <span aria-hidden="true">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

function AdminPage({ content, setContent }) {
  const [draft, setDraft] = useState(content);
  const [saveState, setSaveState] = useState('未保存');

  const markChanged = () => setSaveState('有未保存修改');

  const updateSection = (section, key, value) => {
    setDraft((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: value,
      },
    }));
    markChanged();
  };

  const updateNestedArrayItem = (section, arrayKey, index, key, value) => {
    setDraft((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [arrayKey]: current[section][arrayKey].map((item, itemIndex) =>
          itemIndex === index ? { ...item, [key]: value } : item,
        ),
      },
    }));
    markChanged();
  };

  const updateTopArrayItem = (arrayKey, index, key, value) => {
    setDraft((current) => ({
      ...current,
      [arrayKey]: current[arrayKey].map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    }));
    markChanged();
  };

  const addNestedArrayItem = (section, arrayKey, item) => {
    setDraft((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [arrayKey]: [...current[section][arrayKey], item],
      },
    }));
    markChanged();
  };

  const removeNestedArrayItem = (section, arrayKey, index) => {
    setDraft((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [arrayKey]: current[section][arrayKey].filter((_, itemIndex) => itemIndex !== index),
      },
    }));
    markChanged();
  };

  const addTopArrayItem = (arrayKey, item) => {
    setDraft((current) => ({
      ...current,
      [arrayKey]: [...current[arrayKey], item],
    }));
    markChanged();
  };

  const removeTopArrayItem = (arrayKey, index) => {
    setDraft((current) => ({
      ...current,
      [arrayKey]: current[arrayKey].filter((_, itemIndex) => itemIndex !== index),
    }));
    markChanged();
  };

  const updateTags = (value) => {
    updateSection(
      'experience',
      'buildingTags',
      value
        .split('\n')
        .map((tag) => tag.trim())
        .filter(Boolean),
    );
  };

  const uploadImage = (event, applyValue) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      applyValue(reader.result);
      event.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const saveDraft = () => {
    const nextContent = mergePortfolioContent(draft);
    savePortfolioContent(nextContent);
    setContent(nextContent);
    setDraft(nextContent);
    setSaveState('已保存到本地');
  };

  const resetDraft = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setContent(defaultPortfolioContent);
    setDraft(defaultPortfolioContent);
    setSaveState('已恢复默认内容');
  };

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/">
          LY Admin
        </a>
        <nav>
          <a href="#admin-hero">首页</a>
          <a href="#admin-experience">经历</a>
          <a href="#admin-gallery">首屏卡片</a>
          <a href="#admin-projects">作品</a>
          <a href="#admin-strengths">优势</a>
          <a href="#admin-contact">联系</a>
        </nav>
        <div className="admin-actions">
          <button type="button" onClick={saveDraft}>保存修改</button>
          <button type="button" className="ghost" onClick={resetDraft}>恢复默认</button>
          <a href="/" target="_blank" rel="noreferrer">预览网站</a>
          <span>{saveState}</span>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <p>PORTFOLIO CMS</p>
          <h1>作品集内容后台</h1>
          <span>修改后点击保存，前台刷新即可生效。图片可填写路径，也可上传为本地预览数据。</span>
        </header>

        <section className="admin-card" id="admin-hero">
          <h2>首屏 Hero</h2>
          <div className="admin-grid">
            <label>背景视频<input value={draft.hero.video} onChange={(event) => updateSection('hero', 'video', event.target.value)} /></label>
            <label>视频封面<input value={draft.hero.poster} onChange={(event) => updateSection('hero', 'poster', event.target.value)} /></label>
            <label>主标题<input value={draft.hero.label} onChange={(event) => updateSection('hero', 'label', event.target.value)} /></label>
            <label>英文名<input value={draft.hero.nameEn} onChange={(event) => updateSection('hero', 'nameEn', event.target.value)} /></label>
            <label>签名 SVG<input value={draft.hero.signature} onChange={(event) => updateSection('hero', 'signature', event.target.value)} /></label>
            <label>符号 SVG<input value={draft.hero.spark} onChange={(event) => updateSection('hero', 'spark', event.target.value)} /></label>
          </div>
          <label>首页描述<textarea value={draft.hero.description} onChange={(event) => updateSection('hero', 'description', event.target.value)} /></label>
        </section>

        <section className="admin-card" id="admin-experience">
          <h2>个人经历</h2>
          <div className="admin-grid">
            <label>英文标题<input value={draft.experience.titleEn} onChange={(event) => updateSection('experience', 'titleEn', event.target.value)} /></label>
            <label>中文标题<input value={draft.experience.titleCn} onChange={(event) => updateSection('experience', 'titleCn', event.target.value)} /></label>
            <label>
              人物/头像图片
              <input value={draft.experience.image} onChange={(event) => updateSection('experience', 'image', event.target.value)} />
              <input type="file" accept="image/*" onChange={(event) => uploadImage(event, (value) => updateSection('experience', 'image', value))} />
            </label>
            <label>小标签<input value={draft.experience.label} onChange={(event) => updateSection('experience', 'label', event.target.value)} /></label>
            <label>标题<input value={draft.experience.heading} onChange={(event) => updateSection('experience', 'heading', event.target.value)} /></label>
          </div>
          <label>个人介绍<textarea value={draft.experience.intro} onChange={(event) => updateSection('experience', 'intro', event.target.value)} /></label>
          <EditablePairs title="个人信息" items={draft.experience.profileFields} onChange={(index, key, value) => updateNestedArrayItem('experience', 'profileFields', index, key, value)} onAdd={() => addNestedArrayItem('experience', 'profileFields', { label: '新字段', value: '内容' })} onRemove={(index) => removeNestedArrayItem('experience', 'profileFields', index)} />
          <EditablePairs title="项目数据" items={draft.experience.metrics} firstKey="value" secondKey="label" firstLabel="数值" secondLabel="说明" onChange={(index, key, value) => updateNestedArrayItem('experience', 'metrics', index, key, value)} onAdd={() => addNestedArrayItem('experience', 'metrics', { value: '0+', label: '新数据' })} onRemove={(index) => removeNestedArrayItem('experience', 'metrics', index)} />
          <label>NOW BUILDING 标签，每行一个<textarea value={draft.experience.buildingTags.join('\n')} onChange={(event) => updateTags(event.target.value)} /></label>
          <EditableCareer items={draft.experience.careerPath} onChange={(index, key, value) => updateNestedArrayItem('experience', 'careerPath', index, key, value)} onAdd={() => addNestedArrayItem('experience', 'careerPath', { date: '时间', company: '公司名称', role: '职位', summary: '经历描述' })} onRemove={(index) => removeNestedArrayItem('experience', 'careerPath', index)} />
        </section>

        <EditableProjects id="admin-gallery" title="首屏横向卡片" items={draft.heroGallery} onChange={(index, key, value) => updateTopArrayItem('heroGallery', index, key, value)} onUpload={(index, value) => updateTopArrayItem('heroGallery', index, 'image', value)} onAdd={() => addTopArrayItem('heroGallery', { title: '新卡片', tag: 'Tag', image: '/assets/project-enterprise-dashboard.png' })} onRemove={(index) => removeTopArrayItem('heroGallery', index)} />
        <EditableProjects id="admin-projects" title="作品瀑布流" items={draft.projects.items} showSize onChange={(index, key, value) => updateNestedArrayItem('projects', 'items', index, key, value)} onUpload={(index, value) => updateNestedArrayItem('projects', 'items', index, 'image', value)} onAdd={() => addNestedArrayItem('projects', 'items', { title: '新作品', tag: 'Project', image: '/assets/project-data-screen.png', size: 'medium' })} onRemove={(index) => removeNestedArrayItem('projects', 'items', index)} />

        <section className="admin-card" id="admin-strengths">
          <h2>个人优势</h2>
          <div className="admin-grid">
            <label>英文标题<input value={draft.strengths.titleEn} onChange={(event) => updateSection('strengths', 'titleEn', event.target.value)} /></label>
            <label>中文标题<input value={draft.strengths.titleCn} onChange={(event) => updateSection('strengths', 'titleCn', event.target.value)} /></label>
          </div>
          <div className="admin-list">
            {draft.strengths.items.map((item, index) => (
              <article className="admin-list-item" key={`${item.title}-${index}`}>
                <div className="admin-row-title">
                  <strong>优势 {index + 1}</strong>
                  <button type="button" onClick={() => removeNestedArrayItem('strengths', 'items', index)}>删除</button>
                </div>
                <div className="admin-grid">
                  <label>
                    图标
                    <select value={item.icon} onChange={(event) => updateNestedArrayItem('strengths', 'items', index, 'icon', event.target.value)}>
                      <option value="mouse">交互</option>
                      <option value="chart">数据</option>
                      <option value="sparkles">视觉</option>
                      <option value="briefcase">协作</option>
                      <option value="check">交付</option>
                    </select>
                  </label>
                  <label>标题<input value={item.title} onChange={(event) => updateNestedArrayItem('strengths', 'items', index, 'title', event.target.value)} /></label>
                </div>
                <label>描述<textarea value={item.text} onChange={(event) => updateNestedArrayItem('strengths', 'items', index, 'text', event.target.value)} /></label>
              </article>
            ))}
            <button type="button" className="admin-add" onClick={() => addNestedArrayItem('strengths', 'items', { icon: 'check', title: '新优势', text: '能力描述' })}>新增优势</button>
          </div>
        </section>

        <section className="admin-card" id="admin-contact">
          <h2>联系方式</h2>
          <div className="admin-grid">
            <label>Eyebrow<input value={draft.contact.eyebrow} onChange={(event) => updateSection('contact', 'eyebrow', event.target.value)} /></label>
            <label>
              人物图片
              <input value={draft.contact.image} onChange={(event) => updateSection('contact', 'image', event.target.value)} />
              <input type="file" accept="image/*" onChange={(event) => uploadImage(event, (value) => updateSection('contact', 'image', value))} />
            </label>
            <label>邮箱<input value={draft.contact.email} onChange={(event) => updateSection('contact', 'email', event.target.value)} /></label>
            <label>电话<input value={draft.contact.phone} onChange={(event) => updateSection('contact', 'phone', event.target.value)} /></label>
          </div>
          <label>大标题，换行分隔<textarea value={draft.contact.heading} onChange={(event) => updateSection('contact', 'heading', event.target.value)} /></label>
          <label>联系文案<textarea value={draft.contact.text} onChange={(event) => updateSection('contact', 'text', event.target.value)} /></label>
          <label>底部说明<input value={draft.contact.meta} onChange={(event) => updateSection('contact', 'meta', event.target.value)} /></label>
          <EditablePairs title="联系页数据" items={draft.contact.stats} firstKey="value" secondKey="label" firstLabel="数值" secondLabel="说明" onChange={(index, key, value) => updateNestedArrayItem('contact', 'stats', index, key, value)} onAdd={() => addNestedArrayItem('contact', 'stats', { value: '0+', label: '新数据' })} onRemove={(index) => removeNestedArrayItem('contact', 'stats', index)} />
        </section>
      </div>
    </main>
  );
}

function EditablePairs({ title, items, firstKey = 'label', secondKey = 'value', firstLabel = '名称', secondLabel = '内容', onChange, onAdd, onRemove }) {
  return (
    <section className="admin-subsection">
      <div className="admin-row-title">
        <h3>{title}</h3>
        <button type="button" onClick={onAdd}>新增</button>
      </div>
      <div className="admin-list">
        {items.map((item, index) => (
          <article className="admin-list-item" key={`${item[firstKey]}-${index}`}>
            <div className="admin-grid">
              <label>{firstLabel}<input value={item[firstKey]} onChange={(event) => onChange(index, firstKey, event.target.value)} /></label>
              <label>{secondLabel}<input value={item[secondKey]} onChange={(event) => onChange(index, secondKey, event.target.value)} /></label>
            </div>
            <button type="button" className="admin-inline-remove" onClick={() => onRemove(index)}>删除</button>
          </article>
        ))}
      </div>
    </section>
  );
}

function EditableCareer({ items, onChange, onAdd, onRemove }) {
  return (
    <section className="admin-subsection">
      <div className="admin-row-title">
        <h3>职业经历</h3>
        <button type="button" onClick={onAdd}>新增</button>
      </div>
      <div className="admin-list">
        {items.map((item, index) => (
          <article className="admin-list-item" key={`${item.date}-${index}`}>
            <div className="admin-grid">
              <label>时间<input value={item.date} onChange={(event) => onChange(index, 'date', event.target.value)} /></label>
              <label>公司<input value={item.company} onChange={(event) => onChange(index, 'company', event.target.value)} /></label>
              <label>职位<input value={item.role} onChange={(event) => onChange(index, 'role', event.target.value)} /></label>
            </div>
            <label>经历描述<textarea value={item.summary} onChange={(event) => onChange(index, 'summary', event.target.value)} /></label>
            <button type="button" className="admin-inline-remove" onClick={() => onRemove(index)}>删除</button>
          </article>
        ))}
      </div>
    </section>
  );
}

function EditableProjects({ id, title, items, showSize = false, onChange, onUpload, onAdd, onRemove }) {
  const uploadImage = (event, index) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onUpload(index, reader.result);
      event.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="admin-card" id={id}>
      <h2>{title}</h2>
      <div className="admin-project-list">
        {items.map((item, index) => (
          <article className="admin-project-item" key={`${item.title}-${index}`}>
            <img src={item.image} alt="" />
            <div>
              <div className="admin-row-title">
                <strong>卡片 {index + 1}</strong>
                <button type="button" onClick={() => onRemove(index)}>删除</button>
              </div>
              <div className="admin-grid">
                <label>标题<input value={item.title} onChange={(event) => onChange(index, 'title', event.target.value)} /></label>
                <label>标签<input value={item.tag} onChange={(event) => onChange(index, 'tag', event.target.value)} /></label>
                {showSize && (
                  <label>
                    卡片尺寸
                    <select value={item.size || 'medium'} onChange={(event) => onChange(index, 'size', event.target.value)}>
                      <option value="short">short</option>
                      <option value="medium">medium</option>
                      <option value="wide">wide</option>
                      <option value="tall">tall</option>
                    </select>
                  </label>
                )}
              </div>
              <label>图片地址<input value={item.image} onChange={(event) => onChange(index, 'image', event.target.value)} /></label>
              <label>上传图片<input type="file" accept="image/*" onChange={(event) => uploadImage(event, index)} /></label>
            </div>
          </article>
        ))}
      </div>
      <button type="button" className="admin-add" onClick={onAdd}>新增卡片</button>
    </section>
  );
}
function App() {
  const isAdminPage = window.location.pathname === '/admin';
  const [content, setContent] = useState(loadPortfolioContent);
  const [isNavFloating, setIsNavFloating] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [isLoaderDone, setIsLoaderDone] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const contactTitleRef = useRef(null);

  if (isAdminPage) {
    return <AdminPage content={content} setContent={setContent} />;
  }

  const siteContent = useMemo(() => resolveAssetPaths(content), [content]);

  useLayoutEffect(() => {
    const canControlScrollRestoration = 'scrollRestoration' in window.history;
    const previousScrollRestoration = canControlScrollRestoration ? window.history.scrollRestoration : null;
    const shouldStartAtTop = !window.location.hash;

    if (canControlScrollRestoration) {
      window.history.scrollRestoration = 'manual';
    }

    if (shouldStartAtTop) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      });
    }

    return () => {
      if (canControlScrollRestoration) {
        window.history.scrollRestoration = previousScrollRestoration;
      }
    };
  }, []);

  useEffect(() => {
    document.body.classList.add('loading-open');

    return () => {
      document.body.classList.remove('loading-open');
    };
  }, []);

  const finishLoader = useCallback(() => {
    setIsLoaderDone(true);
    window.setTimeout(() => {
      setShowLoader(false);
      document.body.classList.remove('loading-open');
    }, 680);
  }, []);

  const updatePreviewScale = useCallback((nextScale) => {
    setPreviewScale((currentScale) => {
      const resolvedScale = typeof nextScale === 'function' ? nextScale(currentScale) : nextScale;
      return Math.min(2.2, Math.max(0.75, Number(resolvedScale.toFixed(2))));
    });
  }, []);

  const heroGalleryItems = useMemo(
    () => siteContent.heroGallery.map((item) => ({ ...item, text: item.title })),
    [siteContent.heroGallery],
  );

  const masonryItems = useMemo(() => {
    const orderPattern = [0, 5, 2, 8, 3, 10, 1, 7, 4, 11, 6, 9, 12, 15, 13, 17, 14, 16];
    const ratioPattern = [0.72, 1.06, 0.84, 1.22, 0.64, 0.95, 1.34, 0.78, 1.12, 0.68, 0.9, 1.28];
    const orderedProjects = orderPattern
      .filter((projectIndex) => projectIndex < siteContent.projects.items.length)
      .map((projectIndex) => ({ project: siteContent.projects.items[projectIndex], projectIndex }));
    const remainingProjects = siteContent.projects.items
      .map((project, projectIndex) => ({ project, projectIndex }))
      .filter(({ projectIndex }) => !orderPattern.includes(projectIndex));

    return [...orderedProjects, ...remainingProjects].map(({ project, projectIndex }, index) => ({
      id: `work-${projectIndex}`,
      title: project.title,
      img: project.image,
      ratio: ratioPattern[index % ratioPattern.length],
      size: project.size,
      source: project,
    }));
  }, [siteContent.projects.items]);

  useEffect(() => {
    const updateNavState = () => {
      const hero = document.getElementById('home');
      const heroHeight = hero?.offsetHeight || window.innerHeight;
      setIsNavFloating(window.scrollY >= heroHeight - 96);
    };

    updateNavState();
    window.addEventListener('scroll', updateNavState, { passive: true });
    window.addEventListener('resize', updateNavState);

    return () => {
      window.removeEventListener('scroll', updateNavState);
      window.removeEventListener('resize', updateNavState);
    };
  }, []);

  useEffect(() => {
    if (!previewItem) return;

    setPreviewScale(1);

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setPreviewItem(null);
        return;
      }

      if (event.key === '+' || event.key === '=') {
        updatePreviewScale((scale) => scale + 0.1);
        return;
      }

      if (event.key === '-') {
        updatePreviewScale((scale) => scale - 0.1);
        return;
      }

      if (event.key === '0') {
        updatePreviewScale(1);
      }
    };

    document.body.classList.add('preview-open');
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.classList.remove('preview-open');
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [previewItem, updatePreviewScale]);

  useEffect(() => {
    const revealTargets = document.querySelectorAll(
      [
        '.hero-content',
        '.hero-gallery',
        '.experience-title',
        '.profile-visual',
        '.profile-copy',
        '.career-item',
        '.experience-loop',
        '.works-title',
        '.works-divider',
        '.strengths-title',
        '.strength-card',
        '.contact-copy',
        '.contact-stats',
        '.contact-person',
        '.contact-panel',
      ].join(','),
    );

    revealTargets.forEach((target, index) => {
      if (!target.classList.contains('reveal-item')) {
        target.classList.add('reveal-item');
      }
      target.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 70}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    );

    revealTargets.forEach((target) => observer.observe(target));

    requestAnimationFrame(() => {
      const hashTarget = window.location.hash ? document.querySelector(window.location.hash) : null;
      hashTarget?.scrollIntoView({ behavior: 'instant' });

      requestAnimationFrame(() => {
        revealTargets.forEach((target) => {
          const rect = target.getBoundingClientRect();
          const isInView = rect.top < window.innerHeight * 0.92 && rect.bottom > window.innerHeight * 0.08;
          if (isInView) {
            target.classList.add('reveal-visible');
            observer.unobserve(target);
          }
        });
      });
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="site-shell">
      {showLoader && (
        <div className={`page-loader${isLoaderDone ? ' page-loader-done' : ''}`} aria-label="页面加载中">
          <div className="loader-count">
            <CountUp from={0} to={100} duration={1.6} className="count-up-text" onEnd={finishLoader} />
            <em>%</em>
          </div>
        </div>
      )}

      <nav className={`nav${isNavFloating ? ' nav-floating' : ''}`}>
        <a className="brand" href="#home" aria-label="返回首页">
          <span>LY</span>
          <strong>Li Yun</strong>
        </a>
        <div className="nav-links" aria-label="页面导航">
          <a href="#experience">经历</a>
          <a href="#projects">项目</a>
          <a href="#strengths">优势</a>
          <a href="#contact">联系</a>
        </div>
      </nav>

      <section className="hero" id="home">
        <video
          className="hero-video"
          src={siteContent.hero.video}
          poster={siteContent.hero.poster}
          autoPlay
          muted
          loop
          preload="auto"
          playsInline
        />
        <div className="hero-overlay" />

        <div className="container hero-content">
          <div className="portfolio-line">
            <span>{siteContent.hero.label}</span>
            <img src={siteContent.hero.spark} alt="" aria-hidden="true" />
          </div>
          <div className="hero-name-row">
            <span className="hero-name-en">{siteContent.hero.nameEn}</span>
            <img src={siteContent.hero.signature} alt={siteContent.hero.nameEn} />
          </div>
          <h1>{siteContent.hero.nameCn}</h1>
          <p className="hero-kicker">
            {siteContent.hero.description.split('\n').map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </p>
        </div>

        <div className="container hero-gallery" aria-label="作品预览轮播">
          <CircularGallery
            items={heroGalleryItems}
            bend={2}
            borderRadius={0.08}
            scrollEase={0.1}
            scrollSpeed={3}
            autoSpeed={0.018}
            onItemClick={setPreviewItem}
          />
        </div>
      </section>

      <section className="section experience" id="experience">
        <div className="container experience-layout">
          <div className="experience-title">
            <span>{siteContent.experience.titleEn}</span>
            <i aria-hidden="true">↘</i>
            <strong>{siteContent.experience.titleCn}</strong>
          </div>

          <div className="experience-main">
            <div className="profile-visual" aria-label="李云 UI 设计师身份视觉">
              <div
                className="portrait-frame chroma-portrait"
                onPointerMove={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  const x = event.clientX - rect.left;
                  const y = event.clientY - rect.top;
                  const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10;
                  const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -10;
                  event.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                  event.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                  event.currentTarget.style.setProperty('--rotate-x', `${rotateX}deg`);
                  event.currentTarget.style.setProperty('--rotate-y', `${rotateY}deg`);
                  event.currentTarget.style.setProperty('--tooltip-x', `${x + 18}px`);
                  event.currentTarget.style.setProperty('--tooltip-y', `${y + 18}px`);
                  event.currentTarget.dataset.active = 'true';
                }}
                onPointerLeave={(event) => {
                  event.currentTarget.dataset.active = 'false';
                  event.currentTarget.style.setProperty('--rotate-x', '0deg');
                  event.currentTarget.style.setProperty('--rotate-y', '0deg');
                }}
              >
                <img src={siteContent.experience.image} alt="个人经历视觉展示" />
                <p className="tilted-portrait-overlay">UI设计师 - 李云 LiYun</p>
                <span className="tilted-portrait-caption">UI设计师 - 李云 LiYun</span>
              </div>
            </div>

            <div className="profile-copy">
              <p className="section-label">{siteContent.experience.label}</p>
              <h2>{siteContent.experience.heading}</h2>
              <p>{siteContent.experience.intro}</p>

              <div className="profile-info-grid">
                {siteContent.experience.profileFields.map((item) => (
                  <div className="profile-field" key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>

              <div className="metric-grid">
                {siteContent.experience.metrics.slice(0, 3).map((item) => (
                  <div className="metric" key={item.label}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="building-row">
                <span>NOW BUILDING</span>
                <div>
                  {siteContent.experience.buildingTags.map((tag) => (
                    <em key={tag}>{tag}</em>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="career-path">
            <p>Career Path</p>
            <div className="career-line" />
            <div className="career-grid">
              {siteContent.experience.careerPath.map((item) => (
                <article className="career-item" key={`${item.date}-${item.company}`}>
                  <span>{item.date}</span>
                  <h3>{item.company}</h3>
                  <strong>{item.role}</strong>
                  <p>{item.summary}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="experience-loop" aria-label="设计方向滚动展示">
            <CurvedLoop
              marqueeText="Welcome ✦ everyone ✦ Welcome ✦ everyone ✦"
              speed={1.35}
              curveAmount={0}
              direction="left"
              interactive
              className="experience-loop-text"
            />
          </div>
        </div>
      </section>

      <section className="section projects" id="projects">
        <div className="container works-layout">
          <div className="experience-title works-title">
            <span>
              <em>{siteContent.projects.titleEnPrefix}</em> {siteContent.projects.titleEn}
            </span>
            <i aria-hidden="true">↘</i>
            <strong>{siteContent.projects.titleCn}</strong>
          </div>

          <div className="works-orb" aria-hidden="true" />
          <div className="works-divider" />

          <Masonry
            items={masonryItems}
            onPreview={setPreviewItem}
            animateFrom="bottom"
            hoverScale={0.95}
            stagger={0.05}
          />
          <div className="works-masonry legacy-works-masonry">
            {siteContent.projects.items.map((project, index) => (
              <button
                className={`work-card work-card-${project.size}`}
                key={`${project.title}-${index}`}
                type="button"
                onClick={() => setPreviewItem(project)}
                aria-label={`预览 ${project.title}`}
              >
                <img src={project.image} alt={project.title} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section strengths" id="strengths">
        <div className="container strengths-layout">
          <div className="experience-title strengths-title">
            <span>{siteContent.strengths.titleEn}</span>
            <i aria-hidden="true">↘</i>
            <strong>{siteContent.strengths.titleCn}</strong>
          </div>
          <div className="strength-grid">
            {siteContent.strengths.items.map((item, index) => {
              const Icon = iconMap[item.icon] || CircleCheck;
              const keywords = getStrengthKeywords(item);
              return (
                <article
                  className={`strength-card strength-card-${index + 1}`}
                  key={item.title}
                >
                  <div className="strength-card-meta">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <em>{index < 2 ? 'CORE' : 'SYSTEM'}</em>
                  </div>
                  <div className="strength-icon">
                    <Icon size={25} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <div className="strength-keywords" aria-hidden="true">
                    {keywords.map((keyword, keywordIndex) => (
                      <span
                        className={`strength-keyword strength-keyword-${(keywordIndex % 6) + 1}`}
                        key={`${keyword}-${keywordIndex}`}
                        style={{ '--fall-delay': `${keywordIndex * 72}ms` }}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <div className="strength-shape" aria-hidden="true" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="contact-finale" id="contact">
        <div className="container contact-inner">
          <div className="contact-copy">
            <p className="contact-eyebrow">{siteContent.contact.eyebrow}</p>
            <h2 ref={contactTitleRef} className="contact-variable-title">
              {siteContent.contact.heading.split('\n').map((line) => (
                <span key={line}>
                  <VariableProximity
                    label={line}
                    containerRef={contactTitleRef}
                    radius={260}
                    falloff="linear"
                    className="contact-variable-line"
                    fromFontVariationSettings="'wght' 420, 'opsz' 18"
                    toFontVariationSettings="'wght' 1000, 'opsz' 80"
                  />
                  <br />
                </span>
              ))}
            </h2>
            <div className="contact-stats" aria-label="联系与经验数据">
              {siteContent.contact.stats.map((item) => (
                <div key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-person" aria-hidden="true">
            <img src={siteContent.contact.image} alt="" />
          </div>

          <div className="contact-panel">
            <p>{siteContent.contact.text}</p>
            <div className="final-actions">
              <a className="primary-action" href={`mailto:${siteContent.contact.email}`}>
                <Mail size={20} />
                {siteContent.contact.email}
              </a>
              <a className="secondary-action" href={siteContent.contact.phoneHref}>
                <Phone size={19} />
                {siteContent.contact.phone}
              </a>
            </div>
            <p className="final-meta">{siteContent.contact.meta}</p>
          </div>
        </div>
      </section>

      {previewItem && (
        <div
          className="image-preview"
          role="dialog"
          aria-modal="true"
          aria-label={`${previewItem.title} 图片预览`}
          onClick={() => setPreviewItem(null)}
        >
          <div className="preview-toolbar" onClick={(event) => event.stopPropagation()}>
            <button type="button" aria-label="缩小图片" onClick={() => updatePreviewScale((scale) => scale - 0.1)}>
              <ZoomOut size={20} />
            </button>
            <span>{Math.round(previewScale * 100)}%</span>
            <button type="button" aria-label="放大图片" onClick={() => updatePreviewScale((scale) => scale + 0.1)}>
              <ZoomIn size={20} />
            </button>
            <button type="button" aria-label="重置缩放" onClick={() => updatePreviewScale(1)}>
              <RotateCcw size={19} />
            </button>
            <button
              className="preview-close"
              type="button"
              aria-label="关闭预览"
              onClick={() => setPreviewItem(null)}
            >
              <X size={22} />
            </button>
          </div>
          <figure
            className="preview-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="preview-image-viewport">
              <img
                src={previewItem.image}
                alt={previewItem.title}
                style={{ transform: `scale(${previewScale})` }}
                onDoubleClick={() => updatePreviewScale(previewScale === 1 ? 1.35 : 1)}
              />
            </div>
          </figure>
        </div>
      )}
    </main>
  );
}

export default App;
