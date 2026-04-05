// ═══════════════════════════════════════
//  UTILS & CORS
// ═══════════════════════════════════════
function isLocal(){ return /^(file|content|null):/.test(location.protocol); }
function px(url){ return isLocal() ? 'https://corsproxy.io/?' + encodeURIComponent(url) : url; }
function kkUrl(p){ return px(KK + p); }
function jkUrl(p){ return px(JK + p); }

function fixImg(u){
  if(!u) return null;
  if(u.startsWith('http')) return u;
  if(u.startsWith('upload/')) return KIMG + '/' + u;
  return KIMG + '/upload/vod/' + u;
}
const PH = (w,h) => `https://placehold.co/${w||155}x${h||232}/111820/64748b?text=...`;
const esc = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

// ── CACHE ──
const CACHE = new Map();
async function get(url, bust){
  if(!bust && CACHE.has(url)) return CACHE.get(url);
  const r = await fetch(url, {headers:{'Accept':'application/json'}});
  if(!r.ok) throw new Error('HTTP ' + r.status);
  const d = await r.json();
  if(!bust) CACHE.set(url, d);
  return d;
}

// ═══════════════════════════════════════
//  KKPHIM API
// ═══════════════════════════════════════
const kkNew    = p    => get(kkUrl('/danh-sach/phim-moi-cap-nhat?page='+(p||1)));
const kkCat    = (t,p)=> get(kkUrl('/v1/api/danh-sach/'+t+'?page='+(p||1)+'&limit=24'));
const kkDetail = s    => get(kkUrl('/phim/'+s), true);
const kkSearch = (q,p)=> get(kkUrl('/v1/api/tim-kiem?keyword='+encodeURIComponent(q)+'&limit=24&page='+(p||1)));

// Lồng tiếng: KKPhim có endpoint riêng
const KK_LT_URL = (p) => kkUrl('/v1/api/danh-sach/phim-bo?lang=long-tieng&page='+(p||1)+'&limit=24');
const KK_TM_URL = (p) => kkUrl('/v1/api/danh-sach/phim-bo?lang=thuyet-minh&page='+(p||1)+'&limit=24');
const KK_LT_LE  = (p) => kkUrl('/v1/api/danh-sach/phim-le?lang=long-tieng&page='+(p||1)+'&limit=24');

function kkI(d){ return (d&&d.data&&d.data.items)||(d&&d.items)||[]; }
function kkP(d){ return (d&&d.data&&d.data.params&&d.data.params.pagination&&d.data.params.pagination.totalPages)||1; }

// ═══════════════════════════════════════
//  JIKAN / MAL API
// ═══════════════════════════════════════
const jkTop    = p   => get(jkUrl('/top/anime?page='+(p||1)+'&limit=24'));
const jkSeason = ()  => get(jkUrl('/seasons/now?limit=24'));
const jkSearch = (q,p) => get(jkUrl('/anime?q='+encodeURIComponent(q)+'&page='+(p||1)+'&limit=24'));
const jkDetail = id  => get(jkUrl('/anime/'+id+'/full'));

// ═══════════════════════════════════════
//  YOUTUBE VIA INVIDIOUS
// ═══════════════════════════════════════
async function ytSearch(q, page){
  page = page||1;
  for(const host of INV_HOSTS){
    try{
      const url = px(host+'/api/v1/search?q='+encodeURIComponent(q)+'&page='+page+'&type=video');
      const d = await get(url, true);
      if(Array.isArray(d) && d.length) return d.filter(v=>v.type==='video'&&v.videoId);
    }catch(e){ continue; }
  }
  return [];
}

function ytThumb(v){
  if(!v.videoThumbnails || !v.videoThumbnails.length) return PH(210,118);
  return v.videoThumbnails.find(t=>t.quality==='medium')?.url
    || v.videoThumbnails.find(t=>t.quality==='default')?.url
    || `https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg`;
}

function fmtSec(s){
  if(!s) return '';
  const m=Math.floor(s/60);
  const sc=s%60;
  return m+':'+(sc<10?'0':'')+sc;
}

// VidSrc
const vsAnime = (id,ep,dub) => `${VS}/anime/${id}/${ep||1}/${dub||0}`;
