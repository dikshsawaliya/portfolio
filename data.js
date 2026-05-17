const ADMIN_PIN = '2580';

const projectDefaults = [
  {
    id:'d1',
    title:'AI Voice Recognition SDK',
    desc:'Architected and shipped a cross-platform voice recognition SDK with a React Native wrapper that cut integration time by ~40% for partner teams across 3 product domains.',
    tags:['Kotlin','React Native','Voice SDK','AI/ML'],
    domain:'SDK · Cross-Platform',
    year:'2024'
  },
  {
    id:'d2',
    title:'Yatra.com Android — Stability',
    desc:'Drove crash-free sessions to 99.4%+ on a travel app serving millions. Implemented Firebase Crashlytics alerting, fixed ANRs, and resolved memory leaks using LeakCanary.',
    tags:['Kotlin','Firebase','LeakCanary','Crashlytics'],
    domain:'Travel · Android',
    year:'2023'
  },
  {
    id:'d3',
    title:'Barcode Scanner SDK — Denso',
    desc:'Led SDK integration for Denso retail hardware achieving <200ms scan-to-result latency with full compatibility across 5+ hardware SKUs.',
    tags:['Kotlin','SDK','Hardware Integration','Retail'],
    domain:'Retail · Android',
    year:'2024'
  },
  {
    id:'d4',
    title:'GettingRipped — Fitness App',
    desc:'Developed and published an end-to-end fitness application on Huawei AppGallery using Huawei HMS Core during an Android internship.',
    tags:['Kotlin','HMS Core','Huawei AppGallery'],
    domain:'Health · Android',
    year:'2021'
  },
  {
    id:'d5',
    title:'AR Zombie Survival — Jio Glasses',
    desc:'Built a zombie survival AR game for Jio smart glasses using Unity + Jio SDK, optimised for constrained XR hardware.',
    tags:['Unity','C#','Jio SDK','AR/XR'],
    domain:'Gaming · AR',
    year:'2022'
  }
];

const navData = {
  logo: 'DS',
  logoHref: '#home',
  links: [
    { href: '#skills', label: 'Skills' },
    { href: '#journey', label: 'Journey' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' }
  ],
  socials: [
    { href: 'https://github.com/dikshsawaliya', label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/diksh-sawaliya-6111381a7/', label: 'LinkedIn' }
  ]
};

const heroData = {
  pill: 'Senior Android & Cross-Platform Engineer',
  nameHtml: 'Diksh<br><span class="hl">Sawaliya</span>',
  subtitle: 'Building production apps that serve millions — from AI-powered SDKs to 60fps Compose UIs. 3+ years across travel, fintech, retail, and networking.',
  buttons: [
    { href: '#projects', text: 'View Projects →', primary: true },
    { href: '#contact', text: 'Get in Touch', primary: false }
  ],
  stats: [
    { value: '3+', label: 'Years experience' },
    { value: '4+', label: 'Production apps' },
    { value: '99.4%', label: 'Crash-free sessions' },
    { value: '~40%', label: 'Integration time saved' },
    { value: '100k+', label: 'Active users reached' }
  ]
};

const skillsData = {
  label: '01 — Stack',
  title: 'Skills & Technologies',
  groups: [
    { category: 'Languages', tags: ['Kotlin', 'Java', 'TypeScript', 'HTML', 'CSS', 'XML'] },
    { category: 'Android', tags: ['Jetpack Compose', 'MVVM', 'Coroutines', 'Flows', 'Room', 'WorkManager', 'Retrofit', 'OkHttp', 'Realm', 'Firestore'] },
    { category: 'Cross-Platform', tags: ['React Native', 'Redux', 'Zustand', 'Reanimated', 'Axios'] },
    { category: 'SDK & Infrastructure', tags: ['SDK Dev', 'Voice Recognition', 'Barcode Scanner', 'Firebase Crashlytics', 'Gradle', 'LeakCanary'] },
    { category: 'Tooling & Testing', tags: ['Android Studio', 'Git & GitHub', 'Postman', 'Figma', 'Selenium', 'Appium', 'REST APIs'] },
    { category: 'AR / XR', tags: ['Unity', 'Unreal Engine', 'Jio SDK', 'Meta VR'] }
  ]
};

const journeyData = {
  label: '02 — Evolution',
  title: 'My Tech Journey',
  intro: 'Most engineers pick a lane and stay there. I\'ve deliberately jumped across worlds — from game engines to spatial computing to native Android to cross-platform SDKs. Each leap wasn\'t a detour; it was compound interest on curiosity.',
  eras: [
    {
      className: 'e-game',
      year: '2021 – 2022',
      badge: 'Game Development',
      title: 'Started where imagination meets interactivity',
      body: 'My first serious engineering work was in game development — a domain that demands real-time systems, physics, rendering pipelines, and player psychology all at once. Building a zombie survival AR game for Jio Glasses at Shortgun taught me performance budgets, frame timing, and how to ship something that has to feel good — not just work correctly.',
      tags: ['Unity', 'C#', 'Jio SDK', 'Game Physics', 'XR Hardware']
    },
    {
      className: 'e-ar',
      year: '2022',
      badge: 'AR / VR',
      title: 'Went deeper into spatial computing',
      body: 'I didn\'t stop at games — I pushed into full augmented and virtual reality. At CSKAA, I built a Meta University virtual education environment and a photorealistic 3D Car Visualizer. This era sharpened my understanding of 3D rendering, scene graphs, and how humans interact with space. The best technology disappears — the interface becomes the experience.',
      tags: ['Unreal Engine', 'Meta VR SDK', '3D Rendering', 'Scene Design']
    },
    {
      className: 'e-android',
      year: '2021 – 2023',
      badge: 'Native Android',
      title: 'Grounded in the platform that runs the world',
      body: 'Parallel to game and AR work, I went deep into native Android — starting with Huawei HMS Core at my internship, shipping a fitness app end-to-end on AppGallery. Then at Hughes Systique, I scaled up: architecting MVVM + Coroutines + Flows across 4 production apps, lifting Yatra.com\'s crash-free sessions to 99.4%+, and delivering 60fps Compose UIs for 100k+ active users. Android became my deepest craft.',
      tags: ['Kotlin', 'Jetpack Compose', 'MVVM', 'Coroutines', 'Flows', 'Room', 'Firebase', 'LeakCanary']
    },
    {
      className: 'e-cross',
      year: '2023 – 2024',
      badge: 'Cross-Platform',
      title: 'Bridged native precision with platform reach',
      body: 'A natural Android engineer could have stopped there. I didn\'t. I learned React Native to understand how product teams build across iOS and Android simultaneously — and immediately put it to use by building a React Native wrapper around a native voice SDK, cutting partner integration time by 40%. Knowing both worlds lets me make smarter architectural choices.',
      tags: ['React Native', 'TypeScript', 'Redux', 'Zustand', 'Reanimated', 'Axios']
    },
    {
      className: 'e-sdk',
      year: '2024 – Present',
      badge: 'SDK & AI',
      title: 'Now building the tools other engineers build on',
      body: 'The current frontier: SDK architecture and AI integration. I\'ve shipped an AI-powered voice recognition SDK, a barcode scanner SDK for industrial hardware, and automated CI pipelines that cut QA cycles by 30%. Every chapter — games, AR, Android, cross-platform — fed into this. I understand latency, device constraints, and production-grade reliability from every angle. What\'s next? Whatever the hardest problem is.',
      tags: ['SDK Architecture', 'Voice AI', 'Barcode Integration', 'Gradle', 'Appium', 'CI/CD']
    }
  ]
};

const experienceData = {
  label: '03 — Work History',
  title: 'Experience',
  items: [
    {
      company: 'Hughes Systique Corporation',
      role: 'Engineer',
      period: 'Jan 2023 – Present',
      loc: 'Gurgaon, India',
      open: true,
      bullets: [
        'Architected and shipped an AI-powered voice recognition SDK with a React Native wrapper, cutting cross-platform integration time by ~40% for partner teams across 3 domains',
        'Reduced app crash rate to 99.4%+ crash-free sessions on Yatra.com Android via structured Firebase Crashlytics alerting, targeted ANR fixes, and memory leak resolution using LeakCanary',
        'Led barcode scanner SDK integration for Denso retail hardware, achieving <200ms scan-to-result latency with full compatibility across 5+ hardware SKUs',
        'Built scalable MVVM architecture with Coroutines, Flows, and Repository Pattern across 4+ production apps — reducing codebase coupling and improving feature delivery speed',
        'Automated regression testing with Selenium + Appium, cutting manual QA cycle time by ~30% and enabling CI-gated deployments',
        'Delivered animated, high-performance UIs using Jetpack Compose and Reanimated for apps with 100k+ active users, maintaining 60fps on mid-range devices',
        'Integrated RESTful APIs via Retrofit, OkHttp, and Axios with real-time Firestore sync, supporting live data flows across travel and networking products'
      ]
    },
    {
      company: 'Shortgun',
      role: 'Game Developer',
      period: 'Jun 2022 – Dec 2022',
      loc: 'Mumbai, India',
      bullets: ['Developed a zombie survival AR game for Jio Glasses using Unity + Jio SDK, delivering immersive gameplay optimised for constrained XR hardware']
    },
    {
      company: 'CSKAA',
      role: 'AR/VR Developer',
      period: 'Jun 2022 – Sep 2022',
      loc: 'Noida, India',
      bullets: ['Built a Meta University virtual education environment and a 3D Car Visualizer with realistic rendering — shipped to internal stakeholders on schedule']
    },
    {
      company: 'Huawei',
      role: 'Android Developer Intern',
      period: 'Jun 2021 – Sep 2021',
      bullets: ['Developed and published GettingRipped fitness app on Huawei AppGallery end-to-end using Huawei HMS Core, gaining hands-on deployment experience']
    }
  ]
};

const contactData = {
  label: '05 — Get In Touch',
  title: 'Let\'s Work Together',
  lead: 'Open to senior Android and cross-platform roles. If you\'re building something ambitious — let\'s talk.',
  details: [
    { href: 'mailto:diksh101sawaliya@gmail.com', text: 'diksh101sawaliya@gmail.com', icon: '✉' },
    { href: 'tel:+918800869633', text: '+91 88008 69633', icon: '✆' },
    { href: 'https://github.com/dikshsawaliya', text: 'GitHub', icon: '🐙' },
    { href: 'https://www.linkedin.com/in/diksh-sawaliya-6111381a7/', text: 'LinkedIn', icon: '🔗' },
    { href: '#contact', text: 'Gurgaon, India', icon: '⌖' }
  ],
  note: 'Submit the form and your email client will open with a prepared message addressed directly to me.',
  form: {
    name: 'Your Name',
    email: 'Email',
    message: 'Message',
    submit: 'Send Message →',
    placeholders: {
      name: 'Jane Smith',
      email: 'jane@company.com',
      message: 'Tell me about the opportunity...'
    }
  }
};

const projectsData = {
  label: '04 — Featured Work',
  title: 'Projects'
};

const footerData = {
  copyright: '© 2026 Diksh Sawaliya',
  status: 'Open to opportunities'
};
