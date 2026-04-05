// ═══════════════════════════════════════
//  STATE
// ═══════════════════════════════════════
const S = {
  page: 'home',
  // navigation data
  slug: null, malId: null, ytId: null,
  q: '', src: 'all',
  cat: '', ltTab: 'bo-lt',
  epIdx: 0, svIdx: 0, epNum: 1, dub: 0,
  // user data
  wl: JSON.parse(localStorage.getItem('lp_wl')||'[]'),
  hist: JSON.parse(localStorage.getItem('lp_h')||'[]'),
};

const inWL = id => S.wl.some(m=>m.uid===String(id));

window.toggleWL = function(raw){
  const m = typeof raw==='string' ? JSON.parse(raw) : raw;
  const k = String(m.uid);
  if(inWL(k)){ S.wl=S.wl.filter(x=>x.uid!==k); showToast('💔 Đã xóa khỏi yêu thích'); }
  else { S.wl.unshift(m); showToast('❤️ Đã thêm vào yêu thích'); }
  localStorage.setItem('lp_wl', JSON.stringify(S.wl));
  const fb = document.getElementById('fav-btn');
  if(fb){ const on=inWL(k); fb.className='fav-btn'+(on?' on':''); fb.textContent=on?'❤️':'🤍'; }
};

function addHist(m){
  S.hist = [m, ...S.hist.filter(x=>x.uid!==m.uid)].slice(0,80);
  localStorage.setItem('lp_h', JSON.stringify(S.hist));
}

let _toast;
function showToast(msg){
  clearTimeout(_toast);
  const el = document.getElementById('toast');
  el.textContent = msg; el.style.display = 'flex';
  _toast = setTimeout(()=>{ el.style.display='none'; }, 2600);
}

window.go = function(page, opts){
  opts = opts||{};
  S.page = page;
  ['slug','malId','ytId','q','src','cat','ltTab'].forEach(k=>{ if(opts[k]!==undefined) S[k]=opts[k]; });
  S.epIdx=0; S.svIdx=0; S.epNum=1; S.dub=0;
  window.scrollTo({top:0,behavior:'smooth'});
  render();
};
