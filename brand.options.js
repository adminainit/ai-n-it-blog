export const fontOptions = [
  {
    name: 'Manrope',
    category: 'Sans serif',
    recommendation: 'Modern and confident. A strong default for technology and business writing.',
    fallback: 'ui-sans-serif, system-ui, sans-serif',
    googleFamily: 'Manrope:wght@400;500;600;700;800',
  },
  {
    name: 'Inter',
    category: 'Sans serif',
    recommendation: 'Neutral and highly readable for dense articles, navigation, and product-style layouts.',
    fallback: 'ui-sans-serif, system-ui, sans-serif',
    googleFamily: 'Inter:wght@400;500;600;700;800',
  },
  {
    name: 'DM Sans',
    category: 'Sans serif',
    recommendation: 'Friendly and contemporary, with a softer editorial personality.',
    fallback: 'ui-sans-serif, system-ui, sans-serif',
    googleFamily: 'DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700',
  },
  {
    name: 'Source Sans 3',
    category: 'Sans serif',
    recommendation: 'Calm, professional, and comfortable for long-form reading.',
    fallback: 'ui-sans-serif, system-ui, sans-serif',
    googleFamily: 'Source+Sans+3:wght@400;500;600;700;800',
  },
  {
    name: 'Work Sans',
    category: 'Sans serif',
    recommendation: 'Clear and practical for corporate, research, and knowledge-library sites.',
    fallback: 'ui-sans-serif, system-ui, sans-serif',
    googleFamily: 'Work+Sans:wght@400;500;600;700;800',
  },
  {
    name: 'Space Grotesk',
    category: 'Sans serif',
    recommendation: 'Distinctive and technical. Best for bold headings paired with a quieter body font.',
    fallback: 'ui-sans-serif, system-ui, sans-serif',
    googleFamily: 'Space+Grotesk:wght@400;500;600;700',
  },
  {
    name: 'Newsreader',
    category: 'Serif',
    recommendation: 'Editorial and authoritative. Designed for expressive headlines and thoughtful essays.',
    fallback: 'Georgia, Cambria, serif',
    googleFamily: 'Newsreader:opsz,wght@6..72,500;6..72,600;6..72,700',
  },
  {
    name: 'Lora',
    category: 'Serif',
    recommendation: 'Warm and approachable, suitable for human-centered technology stories.',
    fallback: 'Georgia, Cambria, serif',
    googleFamily: 'Lora:wght@400;500;600;700',
  },
  {
    name: 'Merriweather',
    category: 'Serif',
    recommendation: 'Traditional and readable, with strong credibility for research-led content.',
    fallback: 'Georgia, Cambria, serif',
    googleFamily: 'Merriweather:wght@400;500;600;700',
  },
  {
    name: 'Playfair Display',
    category: 'Serif',
    recommendation: 'High-contrast and premium. Use for headings with a simple sans-serif body.',
    fallback: 'Georgia, Cambria, serif',
    googleFamily: 'Playfair+Display:wght@500;600;700',
  },
  {
    name: 'Roboto Slab',
    category: 'Slab serif',
    recommendation: 'Structured and dependable, balancing editorial character with technical clarity.',
    fallback: 'Rockwell, Georgia, serif',
    googleFamily: 'Roboto+Slab:wght@400;500;600;700',
  },
  {
    name: 'IBM Plex Mono',
    category: 'Monospace',
    recommendation: 'Technical and precise. Best as an accent or heading font rather than long body copy.',
    fallback: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    googleFamily: 'IBM+Plex+Mono:wght@400;500;600',
  },
  {
    name: 'System UI',
    category: 'Offline system',
    recommendation: 'Fastest and fully offline. Uses the familiar interface font already installed on each device.',
    fallback: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    googleFamily: '',
  },
  {
    name: 'Georgia',
    category: 'Offline system',
    recommendation: 'A dependable offline serif with strong readability on nearly every platform.',
    fallback: 'Georgia, Cambria, "Times New Roman", serif',
    googleFamily: '',
  },
];

export const themePresets = [
  {
    id: 'editorial-intelligence',
    name: 'Editorial intelligence',
    description: 'Deep ink, teal, and coral with an editorial headline voice.',
    bestFor: 'Thought leadership and AI analysis',
    primary: '#071a2b',
    secondary: '#149e92',
    accent: '#ff825c',
    headingFont: 'Newsreader',
    bodyFont: 'Manrope',
  },
  {
    id: 'executive-clarity',
    name: 'Executive clarity',
    description: 'Measured navy and blue with restrained, highly readable typography.',
    bestFor: 'Corporate insights and advisory content',
    primary: '#102a43',
    secondary: '#2f80ed',
    accent: '#f2c94c',
    headingFont: 'Roboto Slab',
    bodyFont: 'Source Sans 3',
  },
  {
    id: 'midnight-signal',
    name: 'Midnight signal',
    description: 'A dark technical foundation with luminous aqua and amber signals.',
    bestFor: 'Automation, engineering, and emerging tech',
    primary: '#0b132b',
    secondary: '#5bc0be',
    accent: '#f6ae2d',
    headingFont: 'Space Grotesk',
    bodyFont: 'Inter',
  },
  {
    id: 'human-future',
    name: 'Human future',
    description: 'Warm plum and rose tones for an optimistic, people-centered voice.',
    bestFor: 'Workplace change and human-centered innovation',
    primary: '#312244',
    secondary: '#9f86c0',
    accent: '#f2c6de',
    headingFont: 'Playfair Display',
    bodyFont: 'DM Sans',
  },
  {
    id: 'warm-authority',
    name: 'Warm authority',
    description: 'Earthy charcoal, terracotta, and sand with classic editorial warmth.',
    bestFor: 'Leadership essays and independent commentary',
    primary: '#3a2d28',
    secondary: '#c86b46',
    accent: '#f1d7b5',
    headingFont: 'Lora',
    bodyFont: 'Work Sans',
  },
  {
    id: 'offline-essential',
    name: 'Offline essential',
    description: 'A crisp graphite palette using only fonts already installed on the device.',
    bestFor: 'Private networks, travel, and zero-dependency use',
    primary: '#1f2937',
    secondary: '#0f9f8f',
    accent: '#e5e7eb',
    headingFont: 'Georgia',
    bodyFont: 'System UI',
  },
];

export const typographyScalePresets = [
  {
    id: 'compact',
    name: 'Compact',
    description: 'A restrained hierarchy for information-dense homepages and smaller screens.',
    sizes: { body: 15, eyebrow: 10, button: 13, heroTitle: 72, heroBody: 16, sectionTitle: 40, cardTitle: 24 },
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'The recommended all-purpose scale with clear hierarchy and comfortable reading.',
    sizes: { body: 16, eyebrow: 11, button: 14, heroTitle: 86, heroBody: 18, sectionTitle: 48, cardTitle: 26 },
  },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Larger display headlines and generous reading text for a magazine-style voice.',
    sizes: { body: 17, eyebrow: 11, button: 14, heroTitle: 92, heroBody: 19, sectionTitle: 52, cardTitle: 28 },
  },
  {
    id: 'accessible',
    name: 'Accessible',
    description: 'Larger body, label, button, and card text while keeping display headings controlled.',
    sizes: { body: 18, eyebrow: 12, button: 16, heroTitle: 80, heroBody: 20, sectionTitle: 48, cardTitle: 30 },
  },
];

export const typographySizeLimits = {
  body: { min: 14, max: 20 },
  eyebrow: { min: 10, max: 14 },
  button: { min: 12, max: 18 },
  heroTitle: { min: 48, max: 104 },
  heroBody: { min: 14, max: 24 },
  sectionTitle: { min: 28, max: 64 },
  cardTitle: { min: 20, max: 36 },
};

export function getTypographyScalePreset(id = 'balanced') {
  return typographyScalePresets.find(preset => preset.id === id) || typographyScalePresets[1];
}

export function getFontOption(name) {
  return fontOptions.find(option => option.name === name) || fontOptions[0];
}

export function fontStack(name) {
  const option = getFontOption(name);
  return option.googleFamily ? `'${option.name}', ${option.fallback}` : option.fallback;
}

export function googleFontsStylesheet(selectedFonts = [], includeAll = false) {
  const selected = includeAll
    ? fontOptions
    : fontOptions.filter(option => selectedFonts.includes(option.name) || ['IBM Plex Mono', 'Newsreader'].includes(option.name));
  const families = [...new Set(selected.map(option => option.googleFamily).filter(Boolean))];
  return families.length ? `https://fonts.googleapis.com/css2?${families.map(family => `family=${family}`).join('&')}&display=swap` : '';
}
