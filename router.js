// ═══════════════════════════════════════
//  ROUTER
// ═══════════════════════════════════════
function render(){
  clearInterval(window._ht);
  switch(S.page){
    case 'home':      pgHome();      break;
    case 'lt':        pgLT();        break;
    case 'cat':       pgCat();       break;
    case 'det-kk':    pgDetKK();     break;
    case 'det-ani':   pgDetAni();    break;
    case 'play-kk':   pgPlayKK();    break;
    case 'play-ani':  pgPlayAni();   break;
    case 'play-yt':   pgPlayYT();    break;
    case 'search':    pgSearch();    break;
    case 'watchlist': pgWatchlist(); break;
    default:          pgHome();
  }
}
window.render = render;
render();
