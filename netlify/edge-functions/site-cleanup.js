export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  const url = new URL(request.url);
  const path = url.pathname.toLowerCase();
  let html = await response.text();

  // Keep the top nav clean: no New / Soon badges anywhere.
  html = html.replaceAll('<span class="new">New</span>', '');
  html = html.replaceAll('<span class="new">Soon</span>', '');
  html = html.replaceAll('<span class="new">Coming Soon</span>', '');

  // Force the Woods card/page cover to reload from the root asset instead of the old cached broken card image.
  html = html.replaceAll('src="woods-cover.jpg"', 'src="/woods-cover.jpg?v=5"');
  html = html.replaceAll("src='woods-cover.jpg'", "src='/woods-cover.jpg?v=5'");
  html = html.replaceAll('poster="woods-cover.jpg"', 'poster="/woods-cover.jpg?v=5"');
  html = html.replaceAll("url('woods-cover.jpg')", "url('/woods-cover.jpg?v=5')");

  // Add a continuous blue police-light reflection to the Woods page only.
  if (path === "/woods.html" || path.endsWith("/woods.html") || path === "/woods") {
    const woodsPoliceLights = `<style id="woods-police-light-flash">
html{background:#030712!important}
body{position:relative!important;isolation:auto!important}
#woodsBluePoliceFlash{position:fixed!important;inset:0!important;z-index:2147483000!important;pointer-events:none!important;background:radial-gradient(circle at 88% 15%,rgba(77,166,255,.95) 0 5%,rgba(77,166,255,.55) 10%,transparent 31%),radial-gradient(circle at 10% 85%,rgba(19,100,255,.55) 0 7%,transparent 28%),linear-gradient(112deg,transparent 0 30%,rgba(29,124,255,.42) 43%,rgba(88,179,255,.24) 52%,transparent 68%);mix-blend-mode:screen!important;opacity:.18;animation:woodsPoliceStrobe 1.05s infinite steps(2,end),woodsPoliceSweep 2.6s linear infinite;filter:blur(.2px) saturate(1.25)}
#woodsBluePoliceFlash:before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(43,135,255,.18),transparent 18%,transparent 62%,rgba(31,104,255,.22));opacity:.55;animation:woodsPoliceBlink .7s infinite steps(2,end)}
.nav,.slap-nav,.album-hero,.hero,.cover,.card,.track,.song-card,.player,.fplayer,.audio-player,.deck,footer,section{animation:woodsPoliceGlow 1.05s infinite steps(2,end)!important}
.fplayer,.player,.audio-player,.deck{box-shadow:0 -10px 42px rgba(36,142,255,.35),0 0 34px rgba(36,142,255,.24)!important}
@keyframes woodsPoliceStrobe{0%,100%{opacity:.12}10%{opacity:.58}20%{opacity:.18}34%{opacity:.66}50%{opacity:.14}66%{opacity:.50}82%{opacity:.20}}
@keyframes woodsPoliceBlink{0%,100%{opacity:.20}45%{opacity:.78}70%{opacity:.32}}
@keyframes woodsPoliceSweep{0%{transform:translateX(-12%) skewX(-8deg)}50%{transform:translateX(9%) skewX(-8deg)}100%{transform:translateX(-12%) skewX(-8deg)}}
@keyframes woodsPoliceGlow{0%,100%{filter:none}10%,34%,66%{filter:drop-shadow(0 0 12px rgba(70,156,255,.45)) brightness(1.08)}}
@media (prefers-reduced-motion: reduce){#woodsBluePoliceFlash,.nav,.slap-nav,.album-hero,.hero,.cover,.card,.track,.song-card,.player,.fplayer,.audio-player,.deck,footer,section{animation:none!important}#woodsBluePoliceFlash{opacity:.24!important}}
</style>`;
    html = html.replace("</head>", woodsPoliceLights + "</head>");
    if (!html.includes('id="woodsBluePoliceFlash"')) {
      html = html.replace("<body>", '<body><div id="woodsBluePoliceFlash" aria-hidden="true"></div>');
    }
  }

  // Add the Warning video hero when warning-hero.mp4 is present in the repo root.
  if (path === "/warning.html" || path.endsWith("/warning.html")) {
    const warningVideoStyle = `<style id="warning-video-hero-patch">
.album-hero{isolation:isolate!important}
.album-hero .hero-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 44%;z-index:0;background:#000}
.album-hero:before{z-index:-2!important}
.album-hero.video-ready:before{opacity:0!important}
.album-hero:after{z-index:1!important}
.album-hero .wrap{z-index:2!important}
</style>`;
    html = html.replace("</head>", warningVideoStyle + "</head>");
    if (!html.includes('warning-hero.mp4')) {
      html = html.replace(
        '<header class="album-hero">',
        '<header class="album-hero" id="top"><video class="hero-video" id="heroVideo" autoplay muted loop playsinline preload="metadata" poster="warning-cover.jpg" aria-hidden="true"><source src="warning-hero.mp4" type="video/mp4"></video>'
      );
      html = html.replace(
        "</body>",
        `<script id="warning-video-ready">
(function(){var v=document.getElementById('heroVideo'),h=document.querySelector('.album-hero');if(v&&h){v.addEventListener('canplay',function(){h.classList.add('video-ready')});v.play().catch(function(){});}})();
</script></body>`
      );
    }
  }

  // Add Welcome to the Woods to plain static nav rows when a page does not have it yet.
  if (!html.includes('href="woods.html"')) {
    html = html.replaceAll(
      '<a href="fall.html">The Fall</a><a href="wall.html">The Wall</a>',
      '<a href="fall.html">The Fall</a><a href="woods.html">Welcome to the Woods</a><a href="wall.html">The Wall</a>'
    );
  }

  // Add Welcome to the Woods to slap-nav static rows when a page does not have it yet.
  if (!html.includes('data-page="woods.html"')) {
    html = html.replaceAll(
      '<a class="lnk" data-page="fall.html" href="fall.html">The Fall</a><a class="lnk" data-page="wall.html" href="wall.html">The Wall</a>',
      '<a class="lnk" data-page="fall.html" href="fall.html">The Fall</a><a class="lnk" data-page="woods.html" href="woods.html">Welcome to the Woods</a><a class="lnk" data-page="wall.html" href="wall.html">The Wall</a>'
    );
  }

  // Add Welcome to the Woods to JS-built NAV_LINKS arrays when a page does not have it yet.
  if (!html.includes('file:"woods.html"') && !html.includes('file: "woods.html"')) {
    html = html.replaceAll(
      '{ file:"fall.html",       label:"The Fall" },\n    { file:"wall.html",       label:"The Wall" },',
      '{ file:"fall.html",       label:"The Fall" },\n    { file:"woods.html",      label:"Welcome to the Woods" },\n    { file:"wall.html",       label:"The Wall" },'
    );
    html = html.replaceAll(
      '{ file:"fall.html",   label:"The Fall" },\n    { file:"wall.html",       label:"The Wall" },',
      '{ file:"fall.html",   label:"The Fall" },\n    { file:"woods.html",  label:"Welcome to the Woods" },\n    { file:"wall.html",       label:"The Wall" },'
    );
    html = html.replaceAll(
      '{ file: "fall.html", label: "The Fall" },\n      { file: "wall.html", label: "The Wall" },',
      '{ file: "fall.html", label: "The Fall" },\n      { file: "woods.html", label: "Welcome to the Woods" },\n      { file: "wall.html", label: "The Wall" },'
    );
  }

  // Remove the booking/contact form from The Warning page only.
  if (path === "/warning.html" || path.endsWith("/warning.html")) {
    const start = html.indexOf('<section id="booking">');
    const footer = html.indexOf('<footer>', start);
    if (start !== -1 && footer !== -1) {
      html = html.slice(0, start) + html.slice(footer);
    }
  }

  const headers = new Headers(response.headers);
  headers.set("content-type", contentType);
  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};
