/* ═══════════════════════════════════════════════
   CampaignOS — Constants & Benchmark Data
   ═══════════════════════════════════════════════ */

// Campaign Types
export const CAMPAIGN_TYPES = [
  { id: 'meta', label: 'Meta Ads', icon: 'Facebook' },
  { id: 'google', label: 'Google PPC', icon: 'Search' },
  { id: 'email', label: 'Email', icon: 'Mail' },
  { id: 'tiktok', label: 'TikTok', icon: 'Video' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'Linkedin' },
  { id: 'seo', label: 'SEO', icon: 'TrendingUp' },
  { id: 'influencer', label: 'Influencer', icon: 'Users' },
  { id: 'display', label: 'Display', icon: 'Monitor' },
  { id: 'youtube', label: 'YouTube', icon: 'Play' },
  { id: 'push', label: 'Push Notifications', icon: 'Bell' },
];

// Campaign Goals
export const CAMPAIGN_GOALS = [
  'Sales',
  'Lead Generation',
  'Brand Awareness',
  'Follower Growth',
  'Traffic',
  'App Downloads',
  'Events',
];

// Channels for Planner
export const CHANNELS = [
  'Social Ads',
  'Google PPC',
  'Email',
  'SEO',
  'Influencer',
  'Video',
  'Display',
  'Push Notifications',
  'Affiliate',
  'Content Marketing',
];

// Experience Levels
export const EXPERIENCE_LEVELS = [
  { id: 'beginner', label: 'Beginner', description: 'New to digital marketing' },
  { id: 'intermediate', label: 'Intermediate', description: 'Run some campaigns before' },
  { id: 'advanced', label: 'Advanced', description: 'Experienced marketer' },
];

// Industry Benchmarks (Phase 1: hardcoded curated data)
export const BENCHMARKS = {
  meta: {
    ctr: { avg: 1.72, good: 2.5, great: 4.0 },
    cpc: { avg: 1.72, good: 1.20, great: 0.80 },
    cpa: { avg: 18.68, good: 12.00, great: 8.00 },
    roas: { avg: 2.5, good: 4.0, great: 6.0 },
  },
  google: {
    ctr: { avg: 3.17, good: 5.0, great: 8.0 },
    cpc: { avg: 2.69, good: 1.80, great: 1.00 },
    cpa: { avg: 48.96, good: 30.00, great: 15.00 },
    roas: { avg: 2.0, good: 3.5, great: 5.0 },
  },
  email: {
    openRate: { avg: 21.33, good: 30.0, great: 45.0 },
    ctr: { avg: 2.62, good: 4.0, great: 6.0 },
    unsubRate: { avg: 0.26, good: 0.15, great: 0.08 },
  },
  tiktok: {
    ctr: { avg: 0.84, good: 1.5, great: 3.0 },
    cpc: { avg: 1.00, good: 0.60, great: 0.30 },
    cpa: { avg: 10.00, good: 6.00, great: 3.00 },
  },
  linkedin: {
    ctr: { avg: 0.44, good: 0.8, great: 1.5 },
    cpc: { avg: 5.26, good: 3.50, great: 2.00 },
    cpa: { avg: 75.00, good: 50.00, great: 30.00 },
  },
};

// Consultant Chat — Suggested Starter Questions
export const STARTER_QUESTIONS = [
  { category: 'Paid Ads', text: 'My CTR is 1.2% on Facebook — is that good and how do I improve it?' },
  { category: 'Strategy', text: "What's the right budget split between prospecting and retargeting?" },
  { category: 'Creatives', text: 'How do I write a Meta ad headline that actually stops the scroll?' },
  { category: 'Strategy', text: 'When should I scale a campaign vs. kill it?' },
  { category: 'Email', text: 'How do I build a proper email welcome sequence for a new subscriber?' },
  { category: 'Analytics', text: 'What KPIs should I report to a client each week?' },
  { category: 'Budgeting', text: "I have $500/month — what's the best way to start advertising?" },
  { category: 'Strategy', text: 'How do I calculate the right A/B test sample size?' },
];

export const CONSULTANT_CATEGORIES = [
  'Paid Ads',
  'Email',
  'SEO',
  'Analytics',
  'Strategy',
  'Creatives',
  'Budgeting',
];

// Learning Hub — Curriculum
export const CURRICULUM = [
  {
    id: 'foundations',
    title: 'Foundations',
    icon: 'BookOpen',
    topics: [
      { id: 'what-is-dm', title: 'What is Digital Marketing?', time: '8 min', difficulty: 'Beginner' },
      { id: 'marketing-funnel', title: 'The Marketing Funnel', time: '10 min', difficulty: 'Beginner' },
      { id: 'kpis-101', title: 'KPIs & Metrics 101', time: '12 min', difficulty: 'Beginner' },
      { id: 'campaign-objectives', title: 'Setting Campaign Objectives', time: '10 min', difficulty: 'Beginner' },
    ],
  },
  {
    id: 'channels',
    title: 'Channels Deep Dive',
    icon: 'Radio',
    topics: [
      { id: 'social-ads', title: 'Social Media Ads (Meta/TikTok/LinkedIn)', time: '15 min', difficulty: 'Intermediate' },
      { id: 'google-ads', title: 'Google Ads & PPC', time: '15 min', difficulty: 'Intermediate' },
      { id: 'email-marketing', title: 'Email Marketing', time: '12 min', difficulty: 'Intermediate' },
      { id: 'seo-content', title: 'SEO & Content Marketing', time: '15 min', difficulty: 'Intermediate' },
    ],
  },
  {
    id: 'strategy',
    title: 'Advanced Strategy',
    icon: 'Target',
    topics: [
      { id: 'audience-targeting', title: 'Audience Targeting & Segmentation', time: '12 min', difficulty: 'Advanced' },
      { id: 'ab-testing', title: 'A/B Testing & Experimentation', time: '12 min', difficulty: 'Intermediate' },
      { id: 'cro', title: 'CRO & Landing Pages', time: '10 min', difficulty: 'Advanced' },
      { id: 'attribution', title: 'Attribution Models', time: '10 min', difficulty: 'Advanced' },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics & Growth',
    icon: 'BarChart3',
    topics: [
      { id: 'dashboards', title: 'Reading Your Dashboards', time: '10 min', difficulty: 'Intermediate' },
      { id: 'budget-optimization', title: 'Budget Optimization', time: '12 min', difficulty: 'Advanced' },
      { id: 'scaling', title: 'Scaling Campaigns', time: '10 min', difficulty: 'Advanced' },
      { id: 'reporting', title: 'Reporting to Stakeholders', time: '8 min', difficulty: 'Intermediate' },
    ],
  },
];

// Creative Types
export const CREATIVE_TYPES = [
  'Ad Copy',
  'Email Subject Lines',
  'Video Script',
  'Image Brief',
  'Push Notification',
];

// Target Platforms for Creatives
export const CREATIVE_PLATFORMS = [
  'Meta',
  'Google Responsive Search',
  'TikTok',
  'LinkedIn',
  'YouTube',
  'Display',
];

// Brand Voice Tones
export const VOICE_TONES = [
  'Professional',
  'Playful',
  'Bold',
  'Empathetic',
  'Luxurious',
  'Urgent',
  'Conversational',
  'Authoritative',
];
