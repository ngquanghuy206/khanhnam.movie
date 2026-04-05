// ═══════════════════════════════════════
//  BADGE + TEXT
// ═══════════════════════════════════════
function kkBadge(m){
  const t = m.type||'';
  const lang = (m.lang||'').toLowerCase();
  const isLT = lang.includes('lồng')||lang.includes('long')||lang.includes('thuyết');
  if(isLT) return '<span class="c-badge cb-lt">🔊 LỒNG TIẾNG</span>';
  if(t==='series')   return '<span class="c-badge cb-bo">PHIM BỘ</span>';
  if(t==='single')   return '<span class="c-badge cb-le">PHIM LẺ</span>';
  if(t==='hoathinh') return '<span class="c-badge cb-hh">HOẠT HÌNH</span>';
  return '<span class="c-badge cb-vn">🇻🇳</span>';
}
function kkTxt(m){
  const t=m.type||'';
  if(t==='series')   return 'PHIM BỘ';
  if(t==='single')   return 'PHIM LẺ';
  if(t==='hoathinh') return 'HOẠT HÌNH';
  return 'PHIM VIỆT';
}

// ═══════════════════════════════════════
//  CARD BUILDERS
// ═══════════════════════════════════════
function CardKK(m){
  const title = esc(m.name||m.title||'?');
  const sub   = esc(m.origin_name||'');
  const year  = m.year||'';
  const slug  = m.slug||'';
  const po    = fixImg(m.poster_url||m.thumb_url)||PH();
  const ep    = m.episode_current||'';
  return `<div class="card" onclick="go('det-kk',{slug:'${slug}'})">
    <div class="c-poster">
      <img src="${po}" alt="${title}" loading="lazy" onerror="this.src='${PH()}'">
      ${kkBadge(m)}
      ${ep?`<span class="c-ep">${esc(ep)}</span>`:''}
      <div class="c-ov"><div class="c-play" onclick="event.stopPropagation();go('play-kk',{slug:'${slug}'})">▶</div></div>
    </div>
    <div class="c-info">
      <div class="c-title">${title}</div>
      ${sub&&sub!==title?`<div class="c-sub">${sub}</div>`:''}
      <div class="c-sub">${year}</div>
    </div>
  </div>`;
}

function CardAnime(m){
  const d     = m.node||m;
  const title = esc(d.title||'?');
  const eng   = esc(d.title_english||'');
  const year  = d.year||'';
  const rat   = d.score?d.score.toFixed(1):'';
  const id    = d.mal_id;
  const imgs  = d.images||{};
  const po    = (imgs.jpg&&(imgs.jpg.large_image_url||imgs.jpg.image_url))||(imgs.webp&&imgs.webp.image_url)||PH();
  const eps   = d.episodes?d.episodes+'ep':'';
  return `<div class="card" onclick="go('det-ani',{malId:${id}})">
    <div class="c-poster">
      <img src="${po}" alt="${title}" loading="lazy" onerror="this.src='${PH()}'">
      <span class="c-badge cb-ani">ANIME</span>
      ${rat?`<span class="c-rat">⭐${rat}</span>`:''}
      ${eps?`<span class="c-ep">${eps}</span>`:''}
      <div class="c-ov"><div class="c-play" onclick="event.stopPropagation();go('play-ani',{malId:${id}})">▶</div></div>
    </div>
    <div class="c-info">
      <div class="c-title">${title}</div>
      ${eng&&eng!==title?`<div class="c-sub">${eng}</div>`:''}
      <div class="c-sub">${year}</div>
    </div>
  </div>`;
}

function CardYT(v){
  const id    = v.videoId||'';
  const title = esc(v.title||'');
  const ch    = esc(v.author||'');
  const dur   = fmtSec(v.lengthSeconds||0);
  const thumb = ytThumb(v);
  return `<div class="yt-card" onclick="go('play-yt',{ytId:'${id}'})">
    <div class="yt-thumb">
      <img src="${esc(thumb)}" alt="${title}" loading="lazy" onerror="this.src='${PH(210,118)}'">
      ${dur?`<span class="yt-dur">${dur}</span>`:''}
    </div>
    <div class="yt-info">
      <div class="yt-title">${title}</div>
      <div class="yt-ch">📺 ${ch}</div>
    </div>
  </div>`;
}

// ═══════════════════════════════════════
//  SKELETON LOADERS
// ═══════════════════════════════════════
function skRow(n=10){
  return '<div class="row">' + Array(n).fill(`<div class="sk sk-p"></div>`).join('') + '</div>';
}
function skYTRow(n=8){
  return '<div class="row">' + Array(n).fill(`<div class="sk sk-yt"></div>`).join('') + '</div>';
}
function skGrid(n=20){
  return '<div class="grid">' + Array(n).fill(`<div class="sk sk-p" style="height:${232}px"></div>`).join('') + '</div>';
}

// ═══════════════════════════════════════
//  NAV
// ═══════════════════════════════════════
function renderNav(){
  const p = S.page;
  const isOn = (pg, cat) => (p===pg && (!cat||S.cat===cat)) ? 'on' : '';
  return `<div id="nav">
    <div class="logo" onclick="go('home')">KHANHNAM<b>.MOVIE</b></div>
    <ul class="nav-links">
      <li><a class="${isOn('home')}" onclick="go('home')">Trang chủ</a></li>
      <li><a class="${isOn('cat','phim-moi')}" onclick="go('cat',{cat:'phim-moi'})">Phim mới</a></li>
      <li><a class="${isOn('cat','phim-le')}" onclick="go('cat',{cat:'phim-le'})">Phim lẻ</a></li>
      <li><a class="${isOn('cat','phim-bo')}" onclick="go('cat',{cat:'phim-bo'})">Phim bộ</a></li>
      <li><a class="${p==='lt'?'on':''}" onclick="go('lt')" style="color:${p==='lt'?'var(--gold)':''}">🔊 Lồng tiếng</a></li>
      <li><a class="${isOn('cat','anime')}" onclick="go('cat',{cat:'anime'})">Anime 🎌</a></li>
      <li><a class="${isOn('cat','yt')}" onclick="go('cat',{cat:'yt'})" style="color:${isOn('cat','yt')?'':S.cat==='yt'?'var(--yt)':''}">🔴 YouTube</a></li>
      <li><a onclick="go('watchlist')">Yêu thích</a></li>
    </ul>
    <div class="nav-right">
      <div class="search-wrap" id="sw">
        <div class="search-box">
          <span style="color:var(--mu);font-size:14px">🔍</span>
          <input type="text" placeholder="Tìm phim, anime, YT..." id="nav-q"
            value="${p==='search'?esc(S.q):''}"
            autocomplete="off"
            oninput="navInput(this.value)"
            onkeydown="if(event.key==='Enter'){go('search',{q:this.value});closeNav()}"
            onfocus="navInput(this.value)"/>
        </div>
        <div id="drop"></div>
      </div>
      <div style="width:34px;height:34px;border-radius:50%;background:var(--red);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;cursor:pointer;color:#fff;flex-shrink:0" onclick="go('watchlist')">
        ${S.wl.length||'👤'}
      </div>
    </div>
  </div>`;
}

// ═══════════════════════════════════════
//  FOOTER
// ═══════════════════════════════════════
function renderFooter(){
  return `<footer>
    <div class="ft-row">
      <div>
        <div class="ft-logo">KHANHNAM<b>.MOVIE</b></div>
        <div class="ft-tag">Phim Việt · Anime · YouTube — Hoàn toàn miễn phí</div>
        <div class="ft-src">
          <span class="ft-chip" style="background:rgba(16,185,129,.15);color:var(--green)">🇻🇳 KKPhim</span>
          <span class="ft-chip" style="background:rgba(168,85,247,.15);color:var(--purple)">🎌 Jikan/MAL</span>
          <span class="ft-chip" style="background:rgba(255,0,0,.15);color:var(--yt)">🔴 YouTube</span>
          <span class="ft-chip" style="background:rgba(59,130,246,.15);color:var(--blue)">📺 VidSrc</span>
        </div>
      </div>
      <div class="ft-cols">
        <div class="ft-col"><h4>Phim Việt</h4><ul>
          <li><a onclick="go('cat',{cat:'phim-moi'})">Phim mới</a></li>
          <li><a onclick="go('cat',{cat:'phim-le'})">Phim lẻ</a></li>
          <li><a onclick="go('cat',{cat:'phim-bo'})">Phim bộ</a></li>
          <li><a onclick="go('lt')" style="color:var(--gold)">🔊 Lồng tiếng</a></li>
          <li><a onclick="go('cat',{cat:'hoat-hinh'})">Hoạt hình</a></li>
        </ul></div>
        <div class="ft-col"><h4>Anime</h4><ul>
          <li><a onclick="go('cat',{cat:'anime'})">Top Anime</a></li>
          <li><a onclick="go('cat',{cat:'anime-now'})">Đang chiếu</a></li>
        </ul></div>
        <div class="ft-col"><h4>YouTube</h4><ul>
          <li><a onclick="go('cat',{cat:'yt'})">Tìm kiếm YT</a></li>
        </ul></div>
        <div class="ft-col"><h4>Tài khoản</h4><ul>
          <li><a onclick="go('watchlist')">Yêu thích</a></li>
          <li><a onclick="go('watchlist')">Lịch sử xem</a></li>
        </ul></div>
      </div>
    </div>
    <div class="ft-bot">
      <div>© 2026 KHANHNAM.MOVIE</div>
      <div>KKPhim · Jikan · Invidious · VidSrc</div>
    </div>
  </footer>`;
}

// ═══════════════════════════════════════
//  NAV SCROLL EFFECT
// ═══════════════════════════════════════
function setupNavScroll(){
  const nav=document.getElementById('nav'); if(!nav) return;
  window.removeEventListener('scroll',window._ns);
  window._ns=()=>nav.style.background=window.scrollY>40?'rgba(7,9,15,.99)':'rgba(7,9,15,.96)';
  window.addEventListener('scroll',window._ns); window._ns();
}

// ═══════════════════════════════════════
//  NAV SEARCH DROPDOWN
// ═══════════════════════════════════════
let _navT;
window.navInput = async function(q){
  const drop=document.getElementById('drop'); if(!drop) return;
  if(!q.trim()){ drop.className=''; drop.innerHTML=''; return; }
  clearTimeout(_navT);
  drop.className='show';
  drop.innerHTML='<div style="padding:12px;text-align:center"><span class="spin"></span></div>';
  _navT=setTimeout(async function(){
    try{
      const [kkR,jkR,ytR]=await Promise.all([
        kkSearch(q,1).catch(()=>null),
        jkSearch(q,1).catch(()=>null),
        ytSearch(q,1).catch(()=>[]),
      ]);
      const ki=(kkR?kkI(kkR):[]).slice(0,4);
      const ji=(jkR?(jkR.data||[]):[]).slice(0,3);
      const yi=(ytR||[]).slice(0,3);
      if(!ki.length&&!ji.length&&!yi.length){ drop.className=''; drop.innerHTML=''; return; }
      let html='';
      if(ki.length){
        html+='<div class="drop-sep">🇻🇳 Phim Việt (KKPhim)</div>';
        html+=ki.map(m=>`<div class="drop-item" onclick="go('det-kk',{slug:'${m.slug}'});closeNav()">
          <img src="${fixImg(m.thumb_url||m.poster_url)||PH(32,48)}" onerror="this.src='${PH(32,48)}'">
          <div><div class="di-title">${esc(m.name||m.title||'')}</div>
          <div class="di-sub"><span class="tag vn">KKPhim</span>${esc(m.year||'')}</div></div>
        </div>`).join('');
      }
      if(ji.length){
        html+='<div class="drop-sep">🎌 Anime (Jikan/MAL)</div>';
        html+=ji.map(m=>{ const imgs=m.images||{}; const po2=(imgs.jpg&&imgs.jpg.image_url)||(imgs.webp&&imgs.webp.image_url)||PH(32,48);
          return `<div class="drop-item" onclick="go('det-ani',{malId:${m.mal_id}});closeNav()">
            <img src="${po2}" onerror="this.src='${PH(32,48)}'">
            <div><div class="di-title">${esc(m.title||'')}</div>
            <div class="di-sub"><span class="tag ani">Anime</span>${esc(m.year||'')}</div></div>
          </div>`;}).join('');
      }
      if(yi.length){
        html+='<div class="drop-sep">🔴 YouTube</div>';
        html+=yi.map(v=>`<div class="drop-item yt-row" onclick="go('play-yt',{ytId:'${esc(v.videoId||'')}'}); closeNav()">
          <img src="${esc(ytThumb(v))}" onerror="this.src='${PH(54,34)}'">
          <div><div class="di-title">${esc(v.title||'')}</div>
          <div class="di-sub"><span class="tag yt">YouTube</span>${esc(v.author||'')}</div></div>
        </div>`).join('');
      }
      html+=`<div class="drop-more" onclick="go('search',{q:'${esc(q)}'});closeNav()">Xem tất cả kết quả cho "${esc(q)}" →</div>`;
      drop.innerHTML=html; drop.className='show';
    }catch(e){ drop.className=''; drop.innerHTML=''; }
  },360);
};

window.closeNav=()=>{ const d=document.getElementById('drop'); if(d){d.className='';d.innerHTML='';} };
document.addEventListener('click',e=>{ const sw=document.getElementById('sw'); if(sw&&!sw.contains(e.target)) closeNav(); });
