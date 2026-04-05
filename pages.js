// ═══════════════════════════════════════
//  HOME PAGE
// ═══════════════════════════════════════
async function pgHome(){
  const app=document.getElementById('app');
  app.innerHTML = renderNav() + `<div class="page" id="hp">
    <div class="hero" style="display:flex;align-items:center;justify-content:center;background:var(--s1)">
      <div style="text-align:center"><div class="spin spin-lg" style="margin:0 auto 12px"></div><p style="font-size:13px;color:var(--mu)">Đang tải phim...</p></div>
    </div>
    <section class="sec"><div class="sec-head"><h2 class="sec-title">🆕 Phim Việt mới</h2></div>${skRow()}</section>
    <section class="sec"><div class="sec-head"><h2 class="sec-title">🔊 Lồng tiếng</h2></div>${skRow()}</section>
    <section class="sec"><div class="sec-head"><h2 class="sec-title">📺 Phim bộ</h2></div>${skRow()}</section>
    <section class="sec"><div class="sec-head"><h2 class="sec-title">🎬 Phim lẻ</h2></div>${skRow()}</section>
    <div class="div-row"><div class="div-line"></div><span class="div-label" style="background:rgba(255,0,0,.1);color:var(--yt)">🔴 YOUTUBE</span><div class="div-line"></div></div>
    <section class="sec"><div class="sec-head"><h2 class="sec-title">🔴 Phim hot trên YouTube</h2></div>${skYTRow()}</section>
    <div class="div-row"><div class="div-line"></div><span class="div-label" style="background:rgba(168,85,247,.1);color:var(--purple)">🎌 ANIME</span><div class="div-line"></div></div>
    <section class="sec"><div class="sec-head"><h2 class="sec-title">📅 Anime đang chiếu</h2></div>${skRow()}</section>
    <section class="sec"><div class="sec-head"><h2 class="sec-title">🏆 Top Anime</h2></div>${skRow()}</section>
  </div>`;
  setupNavScroll();

  let kkN,kkBo,kkLe,kkLT,jkS,jkT,ytV=[];
  try{
    [kkN,kkBo,kkLe,jkS,jkT] = await Promise.all([
      kkNew(1), kkCat('phim-bo',1), kkCat('phim-le',1), jkSeason(), jkTop(1)
    ]);
    try{ kkLT = await get(KK_LT_URL(1)); }catch(e){ kkLT=null; }
    try{ ytV = await ytSearch('phim chiếu rạp 2024 hay nhất',1); }catch(e){ ytV=[]; }
  }catch(e){
    const hp2=document.getElementById('hp');
    if(hp2) hp2.innerHTML=`<div style="padding:160px 0;text-align:center"><div style="font-size:36px">😞</div><div style="font-size:14px;color:var(--mu);margin-top:11px">Lỗi kết nối API. Kiểm tra mạng.</div><button class="btn btn-red" onclick="pgHome()" style="margin-top:14px">Thử lại</button></div>`+renderFooter();
    return;
  }

  const hp=document.getElementById('hp'); if(!hp) return;

  const newItems  = (kkN&&kkN.items||[]).slice(0,24);
  const boItems   = kkI(kkBo).slice(0,24);
  const leItems   = kkI(kkLe).slice(0,24);
  const ltItems   = kkI(kkLT).slice(0,24);
  const aniSItems = (jkS&&jkS.data||[]).slice(0,24);
  const aniTItems = (jkT&&jkT.data||[]).slice(0,24);

  // Hero slides: mix phim mới + anime top
  const featured = [...newItems.slice(0,4), ...aniTItems.slice(0,3)];
  const heroHTML = featured.map((m,i)=>{
    let bg,title,ori,year,ep,desc,srcBadge,bw,bi;
    if(m.slug){
      bg=fixImg(m.thumb_url)||fixImg(m.poster_url)||PH(1280,720);
      title=m.name||''; ori=m.origin_name||''; year=m.year||''; ep=m.episode_current||''; desc=m.content||m.description||'';
      srcBadge=`<span class="h-src" style="background:var(--green)">🇻🇳 ${kkTxt(m)}</span>`;
      bw=`go('play-kk',{slug:'${m.slug}'})`; bi=`go('det-kk',{slug:'${m.slug}'})`;
    }else{
      const imgs=m.images||{};
      bg=(imgs.jpg&&imgs.jpg.large_image_url)||(imgs.webp&&imgs.webp.large_image_url)||PH(1280,720);
      title=m.title||''; ori=m.title_english||''; year=m.year||''; ep=''; desc=m.synopsis||'';
      srcBadge=`<span class="h-src" style="background:var(--purple)">🎌 ANIME</span>`;
      bw=`go('play-ani',{malId:${m.mal_id}})`; bi=`go('det-ani',{malId:${m.mal_id}})`;
    }
    return `<div class="hslide${i===0?' on':''}">
      <div class="hbg" style="background-image:url('${esc(bg)}')"></div>
      <div class="hgrad"></div>
      <div class="hcont">
        ${srcBadge}
        <h1 class="h-title">${esc(title)}</h1>
        <div class="h-meta">
          ${year?`<span>${year}</span>`:''}
          ${ep?`<span class="h-chip">${esc(ep)}</span>`:''}
          ${ori&&ori!==title?`<span style="color:var(--mu)">${esc(ori)}</span>`:''}
        </div>
        <p class="h-desc">${esc(desc)}</p>
        <div class="h-btns">
          <button class="btn btn-red" onclick="${bw}">▶ Xem ngay</button>
          <button class="btn btn-ghost" onclick="${bi}">ℹ Chi tiết</button>
        </div>
      </div>
    </div>`;
  }).join('');
  const dotsHTML = featured.map((_,i)=>`<button class="hdot${i===0?' on':''}" onclick="setSlide(${i})"></button>`).join('');

  const ytHTML = ytV.length
    ? ytV.map(CardYT).join('')
    : `<div style="color:var(--mu);font-size:13px;padding:18px">YouTube không load. <a onclick="go('cat',{cat:'yt'})" style="color:var(--yt);cursor:pointer">Tìm thủ công →</a></div>`;

  hp.innerHTML = `
    <div class="hero" id="hero">${heroHTML}<div class="hdots">${dotsHTML}</div></div>
    <section class="sec">
      <div class="sec-head"><h2 class="sec-title">🆕 Phim Việt mới cập nhật</h2><a class="see-all" onclick="go('cat',{cat:'phim-moi'})">Tất cả →</a></div>
      <div class="row">${newItems.map(CardKK).join('')}</div>
    </section>
    <section class="sec" style="background:linear-gradient(180deg,transparent,var(--s1) 20%,var(--s1) 80%,transparent)">
      <div class="sec-head"><h2 class="sec-title">🔊 Lồng tiếng / Thuyết minh</h2><a class="see-all" onclick="go('lt')">Tất cả →</a></div>
      <div class="row">${ltItems.length ? ltItems.map(CardKK).join('') : newItems.slice(4,16).map(CardKK).join('')}</div>
    </section>
    <section class="sec">
      <div class="sec-head"><h2 class="sec-title">📺 Phim bộ Vietsub</h2><a class="see-all" onclick="go('cat',{cat:'phim-bo'})">Tất cả →</a></div>
      <div class="row">${boItems.map(CardKK).join('')}</div>
    </section>
    <section class="sec" style="background:linear-gradient(180deg,transparent,var(--s1) 20%,var(--s1) 80%,transparent)">
      <div class="sec-head"><h2 class="sec-title">🎬 Phim lẻ Vietsub</h2><a class="see-all" onclick="go('cat',{cat:'phim-le'})">Tất cả →</a></div>
      <div class="row">${leItems.map(CardKK).join('')}</div>
    </section>
    <div class="div-row"><div class="div-line"></div><span class="div-label" style="background:rgba(255,0,0,.1);color:var(--yt)">🔴 YOUTUBE</span><div class="div-line"></div></div>
    <section class="sec">
      <div class="sec-head"><h2 class="sec-title">🔴 Phim hot YouTube</h2><a class="see-all" onclick="go('cat',{cat:'yt'})">Tìm kiếm →</a></div>
      <div class="row">${ytHTML}</div>
    </section>
    <div class="div-row"><div class="div-line"></div><span class="div-label" style="background:rgba(168,85,247,.1);color:var(--purple)">🎌 ANIME</span><div class="div-line"></div></div>
    <section class="sec">
      <div class="sec-head"><h2 class="sec-title">📅 Anime đang chiếu</h2><a class="see-all" onclick="go('cat',{cat:'anime-now'})">Tất cả →</a></div>
      <div class="row">${aniSItems.map(CardAnime).join('')}</div>
    </section>
    <section class="sec">
      <div class="sec-head"><h2 class="sec-title">🏆 Top Anime mọi thời đại</h2><a class="see-all" onclick="go('cat',{cat:'anime'})">Tất cả →</a></div>
      <div class="row">${aniTItems.map(CardAnime).join('')}</div>
    </section>
    ${renderFooter()}`;

  // Hero carousel
  let idx=0;
  const slides=hp.querySelectorAll('.hslide'), dots=hp.querySelectorAll('.hdot');
  window.setSlide = i => {
    slides[idx]?.classList.remove('on'); dots[idx]?.classList.remove('on');
    idx=i;
    slides[idx]?.classList.add('on'); dots[idx]?.classList.add('on');
  };
  clearInterval(window._ht);
  window._ht = setInterval(()=>setSlide((idx+1)%slides.length), 5800);
}

// ═══════════════════════════════════════
//  LỒNG TIẾNG PAGE
// ═══════════════════════════════════════
async function pgLT(){
  const app=document.getElementById('app');
  app.innerHTML = renderNav() + `<div class="lt-page page">
    <h1>🔊 Lồng tiếng / Thuyết minh</h1>
    <p>Phim bộ và phim lẻ có lồng tiếng Việt Nam</p>
    <div class="lt-tabs">
      <button class="lt-tab ${S.ltTab==='bo-lt'?'on':''}" onclick="switchLT('bo-lt')">📺 Phim bộ lồng tiếng</button>
      <button class="lt-tab ${S.ltTab==='bo-tm'?'on':''}" onclick="switchLT('bo-tm')">📺 Phim bộ thuyết minh</button>
      <button class="lt-tab ${S.ltTab==='le-lt'?'on':''}" onclick="switchLT('le-lt')">🎬 Phim lẻ lồng tiếng</button>
      <button class="lt-tab ${S.ltTab==='search-lt'?'on':''}" onclick="switchLT('search-lt')">🔍 Tìm lồng tiếng</button>
    </div>
    <div id="lt-count" class="result-count">Đang tải...</div>
    <div id="lt-grid" class="grid">${skGrid(20)}</div>
    <div id="lt-more" style="text-align:center;margin-top:18px"></div>
  </div>`;
  setupNavScroll();
  await loadLT(1);
}

window.switchLT = function(tab){
  S.ltTab = tab;
  document.querySelectorAll('.lt-tab').forEach((el,i)=>{
    const tabs=['bo-lt','bo-tm','le-lt','search-lt'];
    el.className = 'lt-tab' + (tabs[i]===tab?' on':'');
  });
  loadLT(1);
};

let _ltPage=1;
window.loadLT = async function(p){
  p=p||1; _ltPage=p;
  const grid=document.getElementById('lt-grid');
  const count=document.getElementById('lt-count');
  const more=document.getElementById('lt-more');
  if(!grid) return;
  if(p===1) grid.innerHTML=skGrid(20);
  try{
    let items=[], total=1;
    if(S.ltTab==='bo-lt'){
      const d=await get(KK_LT_URL(p)); items=kkI(d); total=kkP(d);
      if(!items.length){ const d2=await kkSearch('lồng tiếng phim bộ',p); items=kkI(d2); total=kkP(d2); }
    } else if(S.ltTab==='bo-tm'){
      const d=await get(KK_TM_URL(p)); items=kkI(d); total=kkP(d);
      if(!items.length){ const d2=await kkSearch('thuyết minh phim bộ',p); items=kkI(d2); total=kkP(d2); }
    } else if(S.ltTab==='le-lt'){
      const d=await get(KK_LT_LE(p)); items=kkI(d); total=kkP(d);
      if(!items.length){ const d2=await kkSearch('lồng tiếng phim lẻ',p); items=kkI(d2); total=kkP(d2); }
    } else if(S.ltTab==='search-lt'){
      const [r1,r2]=await Promise.all([
        kkSearch('lồng tiếng',p).catch(()=>null),
        kkSearch('thuyết minh',p).catch(()=>null),
      ]);
      const i1=kkI(r1); const i2=kkI(r2);
      const seen=new Set();
      items=[...i1,...i2].filter(m=>{ if(seen.has(m.slug))return false; seen.add(m.slug); return true; });
      total=Math.max(kkP(r1),kkP(r2));
    }
    const cards=items.map(CardKK).join('');
    if(p===1){ grid.innerHTML=cards||'<div style="text-align:center;padding:48px;color:var(--mu)">Không có dữ liệu.</div>'; }
    else{ grid.insertAdjacentHTML('beforeend',cards); }
    if(count) count.textContent=`${items.length} phim · Trang ${p}${total>1?'/'+total:''}`;
    if(more) more.innerHTML=p<Math.min(total,20)?`<button class="btn btn-ghost" onclick="loadLT(${p+1})">Tải thêm ↓</button>`:'';
  }catch(e){
    if(grid) grid.innerHTML=`<div style="text-align:center;padding:48px;color:var(--mu)">Lỗi: ${esc(e.message)}</div>`;
  }
};

// ═══════════════════════════════════════
//  CATEGORY PAGE
// ═══════════════════════════════════════
const CAT_LABEL = {
  'phim-moi':'🆕 Phim mới', 'phim-le':'🎬 Phim lẻ', 'phim-bo':'📺 Phim bộ',
  'hoat-hinh':'🎌 Hoạt hình', 'tv-shows':'📡 TV Shows',
  'anime':'🏆 Top Anime', 'anime-now':'📅 Anime đang chiếu',
  'yt':'🔴 Tìm kiếm YouTube',
};

async function pgCat(){
  const app=document.getElementById('app');
  const isYT = S.cat==='yt';
  app.innerHTML = renderNav() + `<div class="cat-page page">
    <h1>${CAT_LABEL[S.cat]||S.cat}</h1>
    ${isYT?`<div class="big-search-wrap" style="margin-bottom:14px">
      <span>🔍</span>
      <input class="big-search" id="yt-q" type="text" placeholder="Tìm video YouTube..." autocomplete="off"
        oninput="ytLive(this.value)"
        onkeydown="if(event.key==='Enter'){clearTimeout(window._ytT);loadYT(this.value,1)}"/>
    </div>`:''}
    <div id="cat-count" class="result-count">Đang tải...</div>
    <div id="cat-grid" class="${isYT?'yt-grid':'grid'}">${isYT?skGrid(12).replace(/sk-p/g,'sk-yt'):skGrid(24)}</div>
    <div id="cat-more" style="text-align:center;margin-top:18px"></div>
  </div>`;
  setupNavScroll();
  if(isYT){
    const inp=document.getElementById('yt-q'); if(inp) inp.focus();
    await loadYT('phim hay vietsub 2024',1);
  } else {
    await loadCat(1);
  }
}

let _ytQ='', _ytPage=1;
window.loadYT = async function(q,p){
  _ytQ=q||_ytQ; _ytPage=p||1;
  const grid=document.getElementById('cat-grid'), count=document.getElementById('cat-count'), more=document.getElementById('cat-more');
  if(!grid) return;
  if(p===1) grid.innerHTML='<div class="yt-grid">'+Array(12).fill('<div class="sk sk-yt"></div>').join('')+'</div>';
  try{
    const vids=await ytSearch(_ytQ,_ytPage);
    const cards=vids.map(CardYT).join('');
    if(p===1){ grid.innerHTML=cards||'<div style="text-align:center;padding:48px;color:var(--mu)">Không tìm thấy.</div>'; }
    else{ grid.insertAdjacentHTML('beforeend',cards); }
    if(count) count.textContent=vids.length?`${vids.length} video cho "${_ytQ}"`:' ';
    if(more) more.innerHTML=vids.length>=5?`<button class="btn btn-ghost" onclick="loadYT('${esc(_ytQ)}',${_ytPage+1})">Tải thêm ↓</button>`:'';
  }catch(e){ if(grid) grid.innerHTML=`<div style="text-align:center;padding:48px;color:var(--mu)">Lỗi YouTube: ${esc(e.message)}</div>`; }
};
window.ytLive=function(q){ clearTimeout(window._ytT); if(!q.trim())return; window._ytT=setTimeout(()=>loadYT(q,1),500); };

window.loadCat = async function(p){
  p=p||1;
  const grid=document.getElementById('cat-grid'), count=document.getElementById('cat-count'), more=document.getElementById('cat-more');
  if(!grid) return;
  if(p===1) grid.innerHTML=skGrid(24);
  try{
    let items=[], total=1, cardFn=CardKK;
    if(S.cat==='phim-moi'){ const d=await kkNew(p); items=d&&d.items||[]; total=(d&&d.pagination&&d.pagination.totalPages)||1; }
    else if(['phim-le','phim-bo','hoat-hinh','tv-shows'].includes(S.cat)){ const d=await kkCat(S.cat,p); items=kkI(d); total=kkP(d); }
    else if(S.cat==='anime'){ const d=await jkTop(p); items=d&&d.data||[]; total=(d&&d.pagination&&d.pagination.last_visible_page)||1; cardFn=CardAnime; }
    else if(S.cat==='anime-now'){ const d=await jkSeason(); items=d&&d.data||[]; total=1; cardFn=CardAnime; }
    const cards=items.map(cardFn).join('');
    if(p===1){ grid.innerHTML=cards||'<div style="text-align:center;padding:48px;color:var(--mu)">Không có dữ liệu.</div>'; }
    else{ grid.insertAdjacentHTML('beforeend',cards); }
    if(count) count.textContent=`Trang ${p}${total>1?'/'+total:''}`;
    if(more) more.innerHTML=p<Math.min(total,20)?`<button class="btn btn-ghost" onclick="loadCat(${p+1})">Tải thêm ↓</button>`:'';
  }catch(e){ if(grid) grid.innerHTML=`<div style="text-align:center;padding:48px;color:var(--mu)">Lỗi: ${esc(e.message)}</div>`; }
};

// ═══════════════════════════════════════
//  DETAIL — KKPhim
// ═══════════════════════════════════════
async function pgDetKK(){
  const app=document.getElementById('app');
  app.innerHTML=renderNav()+`<div class="det page"><div class="loading"><div class="spin spin-lg"></div><p>Đang tải phim...</p></div></div>`;
  setupNavScroll();
  let data, movie, episodes=[];
  try{ data=await kkDetail(S.slug); movie=data&&data.movie||data; episodes=data&&data.episodes||[]; }
  catch(e){ app.innerHTML=renderNav()+`<div class="det page"><div class="empty-state" style="padding-top:80px"><div class="ico">😕</div><h3>Không tìm thấy phim</h3><p>${esc(e.message)}</p><button class="btn btn-red" onclick="go('home')" style="margin-top:13px">Về trang chủ</button></div></div>`; return; }

  const title=movie.name||'', ori=movie.origin_name||'', year=movie.year||'';
  const ep=movie.episode_current||'', tot=movie.episode_total||'';
  const lang=(movie.lang||'').toLowerCase();
  const isLT=lang.includes('lồng')||lang.includes('long')||lang.includes('thuyết');
  const bg=fixImg(movie.thumb_url)||fixImg(movie.poster_url)||'';
  const po=fixImg(movie.poster_url)||fixImg(movie.thumb_url)||PH(180,270);
  const gens=(movie.category||[]).map(g=>`<span class="gtag vn">${esc(g.name||g)}</span>`).join('');
  const countries=(movie.country||[]).map(c=>c.name||c).join(', ');
  const wl=inWL('kk_'+(movie._id||movie.slug));
  const wlData=JSON.stringify({uid:'kk_'+(movie._id||movie.slug),name:movie.name,thumb:fixImg(movie.thumb_url||movie.poster_url),year,src:'kk',slug:movie.slug||S.slug});

  let epHTML='';
  if(episodes.length>0){
    const svTabs=episodes.map((sv,i)=>`<button class="sv-tab${i===0?' on':''}" id="svt${i}" onclick="swSv(${i})">${esc(sv.server_name||'Server '+(i+1))}</button>`).join('');
    const firstEps=(episodes[0]&&episodes[0].server_data)||[];
    const epBtns=firstEps.map((e,i)=>`<button class="ep-btn${i===0?' on':''}" onclick="playEp(${i},0)">${esc(e.name||'Tập '+(i+1))}</button>`).join('');
    epHTML=`<div class="ep-box">
      <h2 class="ep-box-title">Danh sách tập</h2>
      <div class="sv-tabs" id="sv-tabs">${svTabs}</div>
      <div class="ep-list" id="ep-list">${epBtns}</div>
    </div>`;
  }

  let simH='';
  try{ const sim=await kkNew(2); simH=(sim&&sim.items||[]).slice(0,10).map(CardKK).join(''); }catch(e){}

  app.innerHTML=renderNav()+`<div class="det page">
    <div class="det-hero">
      <div class="det-bg" style="background-image:url('${esc(bg)}')"></div>
      <div class="det-fog"></div>
      <div class="det-body">
        <div class="det-poster"><img src="${po}" onerror="this.src='${PH(180,270)}'"/></div>
        <div class="det-info">
          <div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:9px">
            <span style="display:inline-flex;align-items:center;gap:4px;background:rgba(16,185,129,.15);color:var(--green);font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;letter-spacing:1px">🇻🇳 KKPhim</span>
            ${isLT?`<span style="display:inline-flex;align-items:center;gap:4px;background:rgba(245,158,11,.15);color:var(--gold);font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px">🔊 Lồng tiếng</span>`:''}
          </div>
          <h1 class="det-title">${esc(title)}</h1>
          ${ori&&ori!==title?`<div class="det-ori">${esc(ori)}</div>`:''}
          <div class="det-chips">
            ${movie.quality?`<span class="det-chip" style="color:#22c55e">${esc(movie.quality)}</span>`:''}
            ${movie.lang?`<span class="det-chip">${esc(movie.lang)}</span>`:''}
            ${year?`<span class="det-chip">${year}</span>`:''}
            ${ep?`<span class="det-chip">Tập ${esc(ep)}${tot?'/'+esc(tot):''}</span>`:''}
            ${countries?`<span class="det-chip">🌍 ${esc(countries)}</span>`:''}
          </div>
          <div class="det-genres">${gens}</div>
          <p class="det-desc">${esc(movie.content||movie.description||'Chưa có mô tả.')}</p>
          <div class="det-acts">
            <button class="btn btn-red" onclick="go('play-kk',{slug:'${esc(movie.slug||S.slug)}'})">▶ Xem phim</button>
            <button class="fav-btn${wl?' on':''}" id="fav-btn" onclick='toggleWL(${JSON.stringify(wlData)})'>${wl?'❤️':'🤍'}</button>
            <button class="btn btn-ghost" onclick="history.length>1?history.back():go('home')">← Quay lại</button>
          </div>
        </div>
      </div>
    </div>
    ${epHTML}
    ${simH?`<section class="sec"><div class="sec-head"><h2 class="sec-title">Phim liên quan</h2></div><div class="row">${simH}</div></section>`:''}
    ${renderFooter()}
  </div>`;
  setupNavScroll();

  window._eps=episodes;
  window.swSv=function(i){
    window._eps.forEach((_,j)=>{ const t=document.getElementById('svt'+j); if(t) t.className='sv-tab'+(j===i?' on':''); });
    const eps=(window._eps[i]&&window._eps[i].server_data)||[];
    const el=document.getElementById('ep-list');
    if(el) el.innerHTML=eps.map((e,k)=>`<button class="ep-btn${k===0?' on':''}" onclick="playEp(${k},${i})">${esc(e.name||'Tập '+(k+1))}</button>`).join('');
  };
  window.playEp=function(ei,si){ S.epIdx=ei; S.svIdx=si; go('play-kk',{slug:movie.slug||S.slug}); };
}

// ═══════════════════════════════════════
//  DETAIL — Anime
// ═══════════════════════════════════════
async function pgDetAni(){
  const app=document.getElementById('app');
  app.innerHTML=renderNav()+`<div class="det page"><div class="loading"><div class="spin spin-lg"></div><p>Đang tải anime...</p></div></div>`;
  setupNavScroll();
  let anime;
  try{ const d=await jkDetail(S.malId); anime=d&&d.data||d; }
  catch(e){ app.innerHTML=renderNav()+`<div class="det page"><div class="empty-state" style="padding-top:80px"><div class="ico">😕</div><h3>Không tìm thấy</h3><button class="btn btn-red" onclick="go('home')" style="margin-top:13px">Về trang chủ</button></div></div>`; return; }

  const title=anime.title||'', eng=anime.title_english||anime.title_japanese||'';
  const year=anime.year||'', rat=anime.score?anime.score.toFixed(1):'';
  const eps=anime.episodes||0;
  const imgs=anime.images||{};
  const po=(imgs.jpg&&imgs.jpg.large_image_url)||(imgs.webp&&imgs.webp.image_url)||PH(180,270);
  const gens=(anime.genres||[]).map(g=>`<span class="gtag ani">${esc(g.name)}</span>`).join('');
  const wl=inWL('ani_'+anime.mal_id);
  const wlData=JSON.stringify({uid:'ani_'+anime.mal_id,name:title,thumb:po,year,src:'ani',malId:anime.mal_id});

  const epCount=Math.max(eps||24,1);
  const epOpts=Array.from({length:Math.min(epCount,1000)},(_,i)=>`<option value="${i+1}">Tập ${i+1}</option>`).join('');
  const relH=(anime.recommendations||[]).slice(0,8).map(r=>r.entry?CardAnime(r.entry):null).filter(Boolean).join('');

  app.innerHTML=renderNav()+`<div class="det page">
    <div class="det-hero">
      <div class="det-bg" style="background-image:url('${esc(po)}');filter:blur(3px) brightness(.22)"></div>
      <div class="det-fog"></div>
      <div class="det-body">
        <div class="det-poster"><img src="${po}" onerror="this.src='${PH(180,270)}'"/></div>
        <div class="det-info">
          <span style="display:inline-flex;align-items:center;gap:4px;background:rgba(168,85,247,.15);color:var(--purple);font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;letter-spacing:1px;margin-bottom:9px">🎌 Anime · VidSrc.icu</span>
          <h1 class="det-title">${esc(title)}</h1>
          ${eng&&eng!==title?`<div class="det-ori">${esc(eng)}</div>`:''}
          <div class="det-chips">
            ${rat?`<span style="color:var(--gold);font-weight:700;font-size:13px">⭐${rat}</span>`:''}
            ${year?`<span class="det-chip">${year}</span>`:''}
            ${eps?`<span class="det-chip">${eps} tập</span>`:''}
            ${anime.status?`<span class="det-chip" style="color:#fb923c">${esc(anime.status)}</span>`:''}
          </div>
          <div class="det-genres">${gens}</div>
          <p class="det-desc">${esc(anime.synopsis||'Chưa có mô tả.')}</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
            <select id="ani-ep" class="sel">${epOpts}</select>
            <select id="ani-dub" class="sel">
              <option value="0">Phụ đề (Sub)</option>
              <option value="1">Lồng tiếng (Dub)</option>
            </select>
            <button class="btn btn-red" onclick="watchAniEp()">▶ Xem tập này</button>
          </div>
          <div class="det-acts">
            <button class="btn btn-red" onclick="go('play-ani',{malId:${anime.mal_id}})">▶ Xem tập 1</button>
            <button class="fav-btn${wl?' on':''}" id="fav-btn" onclick='toggleWL(${JSON.stringify(wlData)})'>${wl?'❤️':'🤍'}</button>
            <button class="btn btn-ghost" onclick="history.length>1?history.back():go('home')">← Quay lại</button>
          </div>
        </div>
      </div>
    </div>
    ${relH?`<section class="sec"><div class="sec-head"><h2 class="sec-title">Anime liên quan</h2></div><div class="row">${relH}</div></section>`:''}
    ${renderFooter()}
  </div>`;
  setupNavScroll();
  window.watchAniEp=function(){
    const e=document.getElementById('ani-ep'), d=document.getElementById('ani-dub');
    S.epNum=parseInt((e&&e.value)||1); S.dub=parseInt((d&&d.value)||0);
    go('play-ani',{malId:anime.mal_id});
  };
}

// ═══════════════════════════════════════
//  PLAYER — KKPhim
// ═══════════════════════════════════════
async function pgPlayKK(){
  const app=document.getElementById('app');
  app.innerHTML=renderNav()+`<div class="player-page page"><div class="loading"><div class="spin spin-lg"></div><p>Đang tải player...</p></div></div>`;
  setupNavScroll();
  let data, movie, episodes=[];
  try{ data=await kkDetail(S.slug); movie=data&&data.movie||data; episodes=data&&data.episodes||[]; }
  catch(e){ go('home'); return; }

  addHist({uid:'kk_'+(movie._id||movie.slug),name:movie.name,thumb:fixImg(movie.thumb_url||movie.poster_url),year:movie.year,src:'kk',slug:movie.slug||S.slug});

  const title=movie.name||'', year=movie.year||'';
  const svIdx=Math.min(S.svIdx,Math.max(0,episodes.length-1));
  const server=episodes[svIdx]||null;
  const epList=(server&&server.server_data)||[];
  const epIdx=Math.min(S.epIdx,Math.max(0,epList.length-1));
  const curEp=epList[epIdx]||null;
  const embed=curEp&&curEp.link_embed||null;
  const m3u8=curEp&&curEp.link_m3u8||null;
  const wl=inWL('kk_'+(movie._id||movie.slug));
  const wlData=JSON.stringify({uid:'kk_'+(movie._id||movie.slug),name:movie.name,thumb:fixImg(movie.thumb_url||movie.poster_url),year,src:'kk',slug:movie.slug||S.slug});

  const epSW=epList.length>1?`<div style="margin-top:10px"><div style="font-size:12px;font-weight:600;margin-bottom:6px;color:var(--mu)">📋 Chọn tập:</div><div class="ep-sw">${epList.map((e,i)=>`<button class="ep-btn${i===epIdx?' on':''}" onclick="S.epIdx=${i};S.svIdx=${svIdx};go('play-kk',{slug:'${esc(movie.slug||S.slug)}'})">${esc(e.name||'Tập '+(i+1))}</button>`).join('')}</div></div>`:'';
  const svSW=episodes.length>1?`<div style="margin-top:8px"><div style="font-size:12px;font-weight:600;margin-bottom:6px;color:var(--mu)">🔄 Server:</div><div style="display:flex;gap:6px;flex-wrap:wrap">${episodes.map((sv,i)=>`<button class="ep-btn${i===svIdx?' on':''}" onclick="S.svIdx=${i};S.epIdx=0;go('play-kk',{slug:'${esc(movie.slug||S.slug)}'})">${esc(sv.server_name||'Server '+(i+1))}</button>`).join('')}</div></div>`:'';

  let playerHTML;
  if(embed){
    playerHTML=`<iframe src="${esc(embed)}" allow="autoplay;fullscreen;picture-in-picture" allowfullscreen></iframe>`;
  } else if(m3u8){
    playerHTML=`<video id="hls-v" controls autoplay style="position:absolute;inset:0;width:100%;height:100%"></video>`;
  } else {
    playerHTML=`<div class="no-video"><div style="font-size:48px;opacity:.4">🎬</div><h3>Chưa có nguồn phim</h3><p style="font-size:12.5px;color:var(--mu)">Thử server hoặc tập khác.</p></div>`;
  }

  let simH='';
  try{ const sim=await kkNew(2); simH=(sim&&sim.items||[]).slice(0,8).map(CardKK).join(''); }catch(e){}

  app.innerHTML=renderNav()+`<div class="player-page page">
    <div class="player-wrap">${playerHTML}</div>
    <div class="player-info">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:10px">
        <div style="flex:1">
          <div class="player-title">${esc(title)}${curEp&&curEp.name?` <span style="color:var(--green);font-size:17px">— ${esc(curEp.name)}</span>`:''}</div>
          <div class="player-meta">${year}${server?' · '+esc(server.server_name):''}${embed||m3u8?' · 🟢 Đang phát':' · ⚠️ Không có nguồn'} · <span style="color:var(--green);font-weight:600">🇻🇳 KKPhim</span></div>
          ${epSW}${svSW}
        </div>
        <div style="display:flex;gap:7px;align-items:center;flex-shrink:0">
          <button class="fav-btn${wl?' on':''}" id="fav-btn" onclick='toggleWL(${JSON.stringify(wlData)})'>${wl?'❤️':'🤍'}</button>
          <button class="btn btn-ghost" onclick="go('det-kk',{slug:'${esc(movie.slug||S.slug)}'})">ℹ Chi tiết</button>
        </div>
      </div>
    </div>
    ${simH?`<section class="sec"><h2 class="sec-title" style="margin-bottom:13px">Phim liên quan</h2><div class="row">${simH}</div></section>`:''}
    ${renderFooter()}
  </div>`;
  setupNavScroll();

  if(!embed && m3u8){
    const sc=document.createElement('script');
    sc.src='https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.4.10/hls.min.js';
    sc.onload=function(){
      const v=document.getElementById('hls-v'); if(!v) return;
      if(window.Hls&&Hls.isSupported()){ const h=new Hls(); h.loadSource(m3u8); h.attachMedia(v); }
      else if(v.canPlayType('application/vnd.apple.mpegurl')){ v.src=m3u8; }
    };
    document.head.appendChild(sc);
  }
}

// ═══════════════════════════════════════
//  PLAYER — Anime / VidSrc
// ═══════════════════════════════════════
async function pgPlayAni(){
  const app=document.getElementById('app');
  const id=S.malId, epn=S.epNum||1, dub=S.dub||0;
  app.innerHTML=renderNav()+`<div class="player-page page"><div class="loading"><div class="spin spin-lg"></div><p>Đang tải anime player...</p></div></div>`;
  setupNavScroll();
  try{
    const d=await jkDetail(id); const anime=d&&d.data||d;
    const title=anime.title||'', year=anime.year||'';
    const totalEps=anime.episodes||100;
    const imgs=anime.images||{};
    const po=(imgs.jpg&&imgs.jpg.large_image_url)||(imgs.webp&&imgs.webp.image_url)||'';
    addHist({uid:'ani_'+id,name:title,thumb:po,year,src:'ani',malId:id});
    const wl=inWL('ani_'+id);
    const wlData=JSON.stringify({uid:'ani_'+id,name:title,thumb:po,year,src:'ani',malId:id});
    const eMax=Math.min(totalEps||200,1000);
    const eOpts=Array.from({length:eMax},(_,i)=>`<option value="${i+1}"${i+1===epn?' selected':''}>Tập ${i+1}</option>`).join('');
    const dOpts=`<option value="0"${dub===0?' selected':''}>Sub</option><option value="1"${dub===1?' selected':''}>Dub</option>`;

    app.innerHTML=renderNav()+`<div class="player-page page">
      <div class="player-wrap">
        <iframe id="ani-fr" src="${esc(vsAnime(id,epn,dub))}" allow="autoplay;fullscreen;picture-in-picture" allowfullscreen></iframe>
      </div>
      <div class="player-info">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:10px">
          <div style="flex:1">
            <div class="player-title">${esc(title)} <span style="color:var(--purple);font-size:17px">Tập ${epn} · ${dub?'Dub':'Sub'}</span></div>
            <div class="player-meta">${year} · 🟢 VidSrc.icu · <span style="color:var(--purple);font-weight:600">🎌 Anime</span></div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
              <select id="a-ep" class="sel" onchange="swAniEp()">${eOpts}</select>
              <select id="a-dub" class="sel" onchange="swAniEp()">${dOpts}</select>
            </div>
          </div>
          <div style="display:flex;gap:7px;align-items:center;flex-shrink:0">
            <button class="fav-btn${wl?' on':''}" id="fav-btn" onclick='toggleWL(${JSON.stringify(wlData)})'>${wl?'❤️':'🤍'}</button>
            <button class="btn btn-ghost" onclick="go('det-ani',{malId:${id}})">ℹ Chi tiết</button>
          </div>
        </div>
      </div>
      ${renderFooter()}
    </div>`;
    setupNavScroll();
    window.swAniEp=function(){
      const e=document.getElementById('a-ep'), db=document.getElementById('a-dub');
      const ne=parseInt((e&&e.value)||1), nd=parseInt((db&&db.value)||0);
      const fr=document.getElementById('ani-fr');
      if(fr) fr.src=vsAnime(id,ne,nd);
    };
  }catch(e){
    app.innerHTML=renderNav()+`<div class="player-page page"><div class="no-video" style="height:50vh"><div style="font-size:48px;opacity:.4">🎌</div><h3>Không tải được</h3><p style="color:var(--mu);font-size:13px">${esc(e.message)}</p></div>${renderFooter()}</div>`;
    setupNavScroll();
  }
}

// ═══════════════════════════════════════
//  PLAYER — YouTube
// ═══════════════════════════════════════
function pgPlayYT(){
  const app=document.getElementById('app');
  const id=S.ytId||'';
  if(!id){ go('home'); return; }
  const embed=`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
  const thumb=`https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  addHist({uid:'yt_'+id,name:'YouTube: '+id,thumb:thumb,year:'',src:'yt',ytId:id});
  app.innerHTML=renderNav()+`<div class="player-page page">
    <div class="player-wrap">
      <iframe src="${esc(embed)}" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;fullscreen" allowfullscreen></iframe>
    </div>
    <div class="player-info">
      <div class="player-title">🔴 YouTube Video</div>
      <div class="player-meta">Video ID: ${esc(id)} · <span style="color:var(--yt);font-weight:600">YouTube Embed</span></div>
      <div style="display:flex;gap:9px;margin-top:12px;flex-wrap:wrap">
        <a href="https://www.youtube.com/watch?v=${esc(id)}" target="_blank" class="btn btn-yt">🔴 Mở trên YouTube</a>
        <button class="btn btn-ghost" onclick="go('cat',{cat:'yt'})">🔍 Tìm video khác</button>
      </div>
    </div>
    ${renderFooter()}
  </div>`;
  setupNavScroll();
}

// ═══════════════════════════════════════
//  SEARCH PAGE
// ═══════════════════════════════════════
let _srchT;
async function pgSearch(){
  const app=document.getElementById('app');
  const q=S.q, src=S.src||'all';
  app.innerHTML=renderNav()+`<div class="search-page page">
    <h1>Tìm kiếm</h1>
    <div class="big-search-wrap">
      <span>🔍</span>
      <input class="big-search" id="srch-q" type="text" placeholder="Tìm phim, anime, YouTube..." value="${esc(q)}" autocomplete="off"
        oninput="liveSearch(this.value)"
        onkeydown="if(event.key==='Enter'){clearTimeout(_srchT);runSearch(this.value,1)}"/>
    </div>
    <div class="filter-tabs">
      <button class="f-tab${src==='all'?' on-all':''}" id="f-all" onclick="setSrc('all')">🔍 Tất cả</button>
      <button class="f-tab${src==='vn'?' on-vn':''}" id="f-vn" onclick="setSrc('vn')">🇻🇳 Phim Việt</button>
      <button class="f-tab${src==='lt'?' on-lt':''}" id="f-lt" onclick="setSrc('lt')">🔊 Lồng tiếng</button>
      <button class="f-tab${src==='ani'?' on-ani':''}" id="f-ani" onclick="setSrc('ani')">🎌 Anime</button>
      <button class="f-tab${src==='yt'?' on-yt':''}" id="f-yt" onclick="setSrc('yt')">🔴 YouTube</button>
    </div>
    <div id="s-count" class="result-count">${q?'Đang tìm...':''}</div>
    <div id="s-grid" class="${src==='yt'?'yt-grid':'grid'}">${q?skGrid(12):''}</div>
    <div id="s-more" style="text-align:center;margin-top:18px"></div>
  </div>`;
  setupNavScroll();
  const inp=document.getElementById('srch-q'); if(inp) inp.focus();
  if(q) await runSearch(q,1);
}

window.setSrc=function(s){ S.src=s; go('search',{q:S.q,src:s}); };
window.liveSearch=function(q){ S.q=q; clearTimeout(_srchT); const g=document.getElementById('s-grid'); if(!q.trim()){if(g)g.innerHTML='';return;} _srchT=setTimeout(()=>runSearch(q,1),480); };

window.runSearch=async function(q,p){
  p=p||1; S.q=q;
  const grid=document.getElementById('s-grid'), count=document.getElementById('s-count'), more=document.getElementById('s-more');
  if(!grid) return;
  const src=S.src||'all';
  if(p===1){ grid.className=src==='yt'?'yt-grid':'grid'; grid.innerHTML=src==='yt'?skGrid(12):skGrid(12); }
  if(count) count.textContent='Đang tìm...';
  try{
    if(src==='yt'){
      grid.className='yt-grid';
      const vids=await ytSearch(q,p);
      if(p===1){ grid.innerHTML=vids.map(CardYT).join('')||`<div style="text-align:center;padding:48px;color:var(--mu)">Không tìm thấy.</div>`; }
      else{ grid.insertAdjacentHTML('beforeend',vids.map(CardYT).join('')); }
      if(count) count.textContent=vids.length?`${vids.length} video YouTube cho "${q}"`:' ';
      if(more) more.innerHTML=vids.length>=5?`<button class="btn btn-ghost" onclick="runSearch('${esc(q)}',${p+1})">Tải thêm ↓</button>`:'';
      return;
    }
    grid.className='grid';
    const doVN=src==='all'||src==='vn';
    const doLT=src==='lt';
    const doAni=src==='all'||src==='ani';
    const doYT=src==='all';

    const [kkR,kkLR,jkR,ytR]=await Promise.all([
      doVN?kkSearch(q,p).catch(()=>null):null,
      doLT?kkSearch(q+' lồng tiếng',1).catch(()=>null):null,
      doAni?jkSearch(q,p).catch(()=>null):null,
      doYT?ytSearch(q,1).catch(()=>[]):null,
    ]);

    const kkItems2=kkR?kkI(kkR):[];
    const kkLItems=kkLR?kkI(kkLR).filter(m=>!kkItems2.some(x=>x.slug===m.slug)):[];
    const jkItems2=jkR?(jkR.data||[]):[];
    const ytItems=(ytR||[]).slice(0,4);

    let cards=[];
    const ml=Math.max(kkItems2.length,kkLItems.length,jkItems2.length);
    for(let i=0;i<ml;i++){
      if(i<kkItems2.length) cards.push(CardKK(kkItems2[i]));
      if(i<kkLItems.length) cards.push(CardKK(kkLItems[i]));
      if(i<jkItems2.length) cards.push(CardAnime(jkItems2[i]));
    }
    ytItems.forEach(v=>{
      const vid=v.videoId||''; const t=esc(v.title||''); const thumb=ytThumb(v);
      cards.push(`<div class="card" onclick="go('play-yt',{ytId:'${vid}'})">
        <div class="c-poster"><img src="${esc(thumb)}" alt="${t}" loading="lazy" onerror="this.src='${PH()}'">
        <span class="c-badge cb-yt">🔴 YT</span>
        <div class="c-ov"><div class="c-play">▶</div></div></div>
        <div class="c-info"><div class="c-title">${t}</div><div class="c-sub">${esc(v.author||'')}</div></div>
      </div>`);
    });

    const total=kkItems2.length+kkLItems.length+jkItems2.length+ytItems.length;
    if(p===1){ grid.innerHTML=cards.join('')||`<div style="text-align:center;padding:48px;color:var(--mu)">Không tìm thấy "<strong>${esc(q)}</strong>"</div>`; }
    else{ grid.insertAdjacentHTML('beforeend',cards.join('')); }
    if(count) count.textContent=total?`${total} kết quả cho "${q}"`:' ';
    if(more) more.innerHTML=total>=20?`<button class="btn btn-ghost" onclick="runSearch('${esc(q)}',${p+1})">Tải thêm ↓</button>`:'';
  }catch(e){
    if(grid) grid.innerHTML=`<div style="text-align:center;padding:48px;color:var(--mu)">Lỗi: ${esc(e.message)}</div>`;
  }
};

// ═══════════════════════════════════════
//  WATCHLIST PAGE
// ═══════════════════════════════════════
function pgWatchlist(){
  const app=document.getElementById('app');
  function srcTag(m){
    if(m.src==='ani') return '<span class="tag ani">🎌</span>';
    if(m.src==='yt')  return '<span class="tag yt">🔴</span>';
    return '<span class="tag vn">🇻🇳</span>';
  }
  function wCard(m){
    const t=esc(m.name||'?'), po=m.thumb||PH(), y=m.year||'';
    let oc,pc;
    if(m.src==='ani'){oc=`go('det-ani',{malId:${m.malId}})`;pc=`go('play-ani',{malId:${m.malId}})`;}
    else if(m.src==='yt'){oc=`go('play-yt',{ytId:'${esc(m.ytId||m.uid.replace('yt_',''))}'})`; pc=oc;}
    else{oc=`go('det-kk',{slug:'${esc(m.slug)}'})`;pc=`go('play-kk',{slug:'${esc(m.slug)}'})` ;}
    return `<div class="card" onclick="${oc}">
      <div class="c-poster"><img src="${po}" loading="lazy" onerror="this.src='${PH()}'">
      <div class="c-ov"><div class="c-play" onclick="event.stopPropagation();${pc}">▶</div></div></div>
      <div class="c-info"><div class="c-title">${t}</div><div class="c-sub">${y} ${srcTag(m)}</div></div>
    </div>`;
  }
  app.innerHTML=renderNav()+`<div class="wl-page page">
    <h1>Thư viện của tôi</h1>
    <p style="font-size:13px;color:var(--mu)">Phim yêu thích & lịch sử — 🇻🇳 Phim Việt · 🎌 Anime · 🔴 YouTube</p>
    <div class="wl-tabs">
      <button class="wl-tab on" id="wt1" onclick="swWL('wl')">❤️ Yêu thích (${S.wl.length})</button>
      <button class="wl-tab" id="wt2" onclick="swWL('hi')">🕑 Lịch sử (${S.hist.length})</button>
    </div>
    <div id="wtc1">${S.wl.length?`<div class="grid">${S.wl.map(wCard).join('')}</div>`:`<div class="empty-state"><div class="ico">🎬</div><h3>Chưa có yêu thích</h3><p>Bấm ❤️ để lưu phim.</p><button class="btn btn-red" onclick="go('home')" style="margin-top:13px">Khám phá</button></div>`}</div>
    <div id="wtc2" style="display:none">${S.hist.length?`<div class="grid">${S.hist.map(wCard).join('')}</div>`:`<div class="empty-state"><div class="ico">🕑</div><h3>Chưa có lịch sử</h3><p>Xem phim để xuất hiện ở đây.</p></div>`}</div>
  </div>`;
  window.swWL=t=>{
    document.getElementById('wtc1').style.display=t==='wl'?'':'none';
    document.getElementById('wtc2').style.display=t==='hi'?'':'none';
    document.getElementById('wt1').className='wl-tab'+(t==='wl'?' on':'');
    document.getElementById('wt2').className='wl-tab'+(t==='hi'?' on':'');
  };
  setupNavScroll();
}
