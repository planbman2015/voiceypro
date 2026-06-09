export type VoiceProfile = {
  id: string;
  user_id: string;
  name: string;
  headline: string;
  bio: string;
  avatar_url: string;
  elevenlabs_voice_link: string;
  voice_style_tags: string[];
  languages: string[];
  accent: string;
  gender: string;
  age_range: string;
  genres: string[];
  commercial_use: boolean;
  pricing_text: string;
  pricing_min: number;
  pricing_max: number;
  availability: 'available' | 'busy' | 'unavailable';
  social_links: Record<string, string>;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string;
  views: number;
  contact_clicks: number;
  is_featured: boolean;
  is_verified: boolean;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

export const DEMO_VOICES: VoiceProfile[] = [
  {
    id: 'demo-1',
    user_id: 'demo-user-1',
    name: 'Marcus Cole',
    headline: 'Commercial & Documentary ElevenLabs Voice | Deep, Authoritative Narration',
    bio: 'With over 12 years in professional voice work, I specialize in commercial campaigns, documentary narration, and corporate content. My ElevenLabs Professional Voice Clone captures every nuance of my natural delivery — warm, measured, and built for trust.',
    avatar_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    elevenlabs_voice_link: 'https://elevenlabs.io/voice-lab/share/demo1',
    voice_style_tags: ['Authoritative', 'Warm', 'Deep'],
    languages: ['English'],
    accent: 'American',
    gender: 'male',
    age_range: '35-50',
    genres: ['Commercial', 'Documentary', 'Corporate', 'Narration'],
    commercial_use: true,
    pricing_text: 'Starting at $150/project',
    pricing_min: 150,
    pricing_max: 800,
    availability: 'available',
    social_links: { linkedin: 'https://linkedin.com', website: 'https://example.com' },
    status: 'approved',
    rejection_reason: '',
    views: 1247,
    contact_clicks: 89,
    is_featured: true,
    is_verified: true,
    is_visible: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'demo-2',
    user_id: 'demo-user-2',
    name: 'Sophia Laurent',
    headline: 'ASMR & Meditation ElevenLabs Voice | Soft, Soothing Presence',
    bio: 'I create immersive audio experiences for wellness brands, meditation apps, and e-learning platforms. My Professional Voice Clone on ElevenLabs faithfully reproduces my signature soft, close-mic delivery that listeners love.',
    avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    elevenlabs_voice_link: 'https://elevenlabs.io/voice-lab/share/demo2',
    voice_style_tags: ['Warm', 'Smooth', 'Conversational'],
    languages: ['English', 'French'],
    accent: 'British',
    gender: 'female',
    age_range: '25-35',
    genres: ['ASMR', 'Meditation', 'E-Learning', 'Narration'],
    commercial_use: true,
    pricing_text: 'From $100/project',
    pricing_min: 100,
    pricing_max: 500,
    availability: 'available',
    social_links: { tiktok: 'https://tiktok.com', instagram: 'https://instagram.com' },
    status: 'approved',
    rejection_reason: '',
    views: 2103,
    contact_clicks: 156,
    is_featured: true,
    is_verified: true,
    is_visible: true,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'demo-3',
    user_id: 'demo-user-3',
    name: 'James Ryder',
    headline: 'Character & Animation ElevenLabs Voice | Range from Hero to Villain',
    bio: 'Gaming veteran with 200+ character roles. My ElevenLabs Professional Voice Clone lets game studios and animation studios prototype characters instantly using my versatile voice library before committing to full productions.',
    avatar_url: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
    elevenlabs_voice_link: 'https://elevenlabs.io/voice-lab/share/demo3',
    voice_style_tags: ['Gravelly', 'Deep', 'Energetic'],
    languages: ['English'],
    accent: 'American',
    gender: 'male',
    age_range: '30-45',
    genres: ['Character', 'Animation', 'Gaming', 'Commercial'],
    commercial_use: true,
    pricing_text: 'Custom quotes for projects',
    pricing_min: 200,
    pricing_max: 2000,
    availability: 'available',
    social_links: { website: 'https://example.com', imdb: 'https://imdb.com' },
    status: 'approved',
    rejection_reason: '',
    views: 876,
    contact_clicks: 67,
    is_featured: true,
    is_verified: true,
    is_visible: true,
    created_at: '2024-02-10T00:00:00Z',
    updated_at: '2024-02-10T00:00:00Z',
  },
  {
    id: 'demo-4',
    user_id: 'demo-user-4',
    name: 'Aisha Mensah',
    headline: 'Audiobook & Podcast ElevenLabs Voice | African-American Storytelling Tradition',
    bio: 'Award-winning audiobook narrator and podcast host. My ElevenLabs Professional Voice Clone captures my expressive, story-driven style with perfect tonal fidelity — ideal for long-form content where consistency matters.',
    avatar_url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    elevenlabs_voice_link: 'https://elevenlabs.io/voice-lab/share/demo4',
    voice_style_tags: ['Warm', 'Bright', 'Conversational'],
    languages: ['English'],
    accent: 'American',
    gender: 'female',
    age_range: '28-40',
    genres: ['Narration', 'Podcast', 'Audiobook', 'E-Learning'],
    commercial_use: true,
    pricing_text: '$0.10 per word (min $75)',
    pricing_min: 75,
    pricing_max: 600,
    availability: 'busy',
    social_links: { linkedin: 'https://linkedin.com', podcast: 'https://example.com' },
    status: 'approved',
    rejection_reason: '',
    views: 1589,
    contact_clicks: 112,
    is_featured: false,
    is_verified: true,
    is_visible: true,
    created_at: '2024-02-20T00:00:00Z',
    updated_at: '2024-02-20T00:00:00Z',
  },
  {
    id: 'demo-5',
    user_id: 'demo-user-5',
    name: 'Lars Eriksson',
    headline: 'Nordic ElevenLabs Voice | Corporate, Tech & Scandinavian Accent',
    bio: 'Based in Stockholm, I provide professional Scandinavian-accented English for global tech brands, fintech companies, and international e-learning platforms. My ElevenLabs clone is optimized for corporate and B2B content.',
    avatar_url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    elevenlabs_voice_link: 'https://elevenlabs.io/voice-lab/share/demo5',
    voice_style_tags: ['Authoritative', 'Smooth', 'Conversational'],
    languages: ['English', 'Swedish'],
    accent: 'Scandinavian',
    gender: 'male',
    age_range: '30-45',
    genres: ['Corporate', 'E-Learning', 'Commercial', 'Documentary'],
    commercial_use: true,
    pricing_text: '€120–€400 per project',
    pricing_min: 130,
    pricing_max: 440,
    availability: 'available',
    social_links: { linkedin: 'https://linkedin.com' },
    status: 'approved',
    rejection_reason: '',
    views: 723,
    contact_clicks: 44,
    is_featured: false,
    is_verified: true,
    is_visible: true,
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
  },
  {
    id: 'demo-6',
    user_id: 'demo-user-6',
    name: 'Carmen Reyes',
    headline: 'Bilingual ElevenLabs Voice | Spanish & English Commercial Specialist',
    bio: 'Fluent native speaker in both English and Spanish, I deliver polished commercial and brand content for companies targeting US-Hispanic and Latin American markets. My ElevenLabs Professional Voice Clone is available in both languages.',
    avatar_url: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=400',
    elevenlabs_voice_link: 'https://elevenlabs.io/voice-lab/share/demo6',
    voice_style_tags: ['Warm', 'Energetic', 'Bright'],
    languages: ['English', 'Spanish'],
    accent: 'Latin American',
    gender: 'female',
    age_range: '25-38',
    genres: ['Commercial', 'Narration', 'Corporate', 'Podcast'],
    commercial_use: true,
    pricing_text: '$120 base / project',
    pricing_min: 120,
    pricing_max: 700,
    availability: 'available',
    social_links: { instagram: 'https://instagram.com', fiverr: 'https://fiverr.com' },
    status: 'approved',
    rejection_reason: '',
    views: 1342,
    contact_clicks: 98,
    is_featured: false,
    is_verified: true,
    is_visible: true,
    created_at: '2024-03-10T00:00:00Z',
    updated_at: '2024-03-10T00:00:00Z',
  },
];

export const ACCENTS = [
  'American', 'British', 'Australian', 'Canadian', 'Irish', 'Scottish',
  'Scandinavian', 'Latin American', 'French', 'German', 'Spanish', 'Italian',
  'Japanese', 'Indian', 'South African', 'New Zealand', 'Other'
];

export const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Portuguese', 'Italian',
  'Japanese', 'Korean', 'Mandarin', 'Arabic', 'Russian', 'Hindi', 'Swedish', 'Other'
];

export const GENRES = [
  'Commercial', 'Narration', 'Character', 'ASMR', 'Corporate', 'Podcast',
  'Documentary', 'E-Learning', 'Audiobook', 'Animation', 'Gaming', 'Meditation'
];

export const VOICE_STYLES = [
  'Warm', 'Authoritative', 'Conversational', 'Energetic', 'Smooth',
  'Gravelly', 'Bright', 'Deep', 'Playful', 'Serious', 'Friendly', 'Professional'
];
