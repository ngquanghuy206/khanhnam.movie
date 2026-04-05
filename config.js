// ═══════════════════════════════════════════════════
//  API SOURCES:
//  🇻🇳 KKPhim   → phimapi.com      (Phim Việt)
//  🎌  Jikan    → api.jikan.moe    (Anime)
//  🔴  YouTube  → Invidious API    (YT search, no key)
//  📺  VidSrc   → vidsrc.icu       (Anime player)
//
//  CORS: auto proxy khi mở file local
// ═══════════════════════════════════════════════════

const KK   = 'https://phimapi.com';
const JK   = 'https://api.jikan.moe/v4';
const VS   = 'https://vidsrc.icu/embed';
const KIMG = 'https://phimimg.com';

// Invidious instances (fallback list)
const INV_HOSTS = [
  'https://inv.nadeko.net',
  'https://invidious.privacydev.net',
  'https://yt.artemislena.eu',
];
