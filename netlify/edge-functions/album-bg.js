export default async (request, context) => {
  const r = await context.next();
  const t = r.headers.get("content-type") || "";
  if (!t.includes("text/html")) return r;

  let h = await r.text();
  h = h.replace(/(<div class="cta-row" style="margin-top:14px">\s*)(<a class="btn" href="wall\.html">The Wall<\/a>)/, '$1<a class="btn" href="glass-rose-sessions.html">The Glass Rose Sessions</a>\n      $2');

  const src = String.fromCharCode(47,119,97,114,110,105,110,103,45,115,105,103,110,46,109,112,52);

  const css = `
  #listen.album-video-section{position:relative!important;overflow:hidden!important;isolation:isolate!important;background:radial-gradient(circle at 50% 10%,rgba(138,75,50,.16),transparent 38%),var(--asphalt)!important;}
  #listen.album-video-section>.album-bg{position:absolute!important;inset:-10%!important;width:120%!important;height:120%!important;object-fit:cover!important;object-position:center!important;transform:rotate(-7deg) scale(1.06)!important;opacity:.105!important;filter:brightness(.24) contrast(1.22) saturate(.72)!important;mix-blend-mode:screen!important;pointer-events:none!important;z-index:0!important;}
  #listen.album-video-section:after{content:"";position:absolute;inset:0;pointer-events:none;z-index:1;background:linear-gradient(to bottom,rgba(11,10,8,.88) 0%,rgba(11,10,8,.66) 28%,rgba(11,10,8,.72) 58%,rgba(11,10,8,.92) 100%),radial-gradient(circle at 50% 42%,transparent 0%,rgba(0,0,0,.62) 70%);}
  #listen.album-video-section>.wrap{position:relative!important;z-index:2!important;}
  @media(max-width:560px){#listen.album-video-section>.album-bg{opacity:.085!important;transform:rotate(-7deg) scale(1.16)!important;}}
  @media(prefers-reduced-motion:reduce){#listen.album-video-section>.album-bg{display:none!important;}}
  `;
  h = h.replace("</style>", css + "</style>");

  const tag = '<video class="album-bg" autoplay muted loop playsinline preload="metadata" aria-hidden="true"><source src="' + src + '" type="video/mp4"></video>';
  h = h.replace('<section id="listen">', '<section id="listen" class="album-video-section">\n  ' + tag);

  const headers = new Headers(r.headers);
  headers.set("content-type", t);
  headers.set("cache-control", "no-cache, no-store, must-revalidate");
  return new Response(h, { status: r.status, statusText: r.statusText, headers });
};