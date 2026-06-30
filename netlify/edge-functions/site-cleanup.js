export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  const url = new URL(request.url);
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
  const path = url.pathname.toLowerCase();
  if (path === "/woods.html" || path.endsWith("/woods.html")) {
    const woodsPoliceLights = `<style id="woods-police-light-flash">
html{background:#05070b}
body{position:relative;isolation:isolate}
body:before,body:after{content:"";position:fixed;inset:-18vh -18vw;pointer-events:none;z-index:9997;mix-blend-mode:screen}
body:before{background:radial-gradient(circle at 82% 18%,rgba(47,145,255,.62) 0 7%,rgba(47,145,255,.24) 15%,transparent 36%),radial-gradient(circle at 18% 72%,rgba(20,95,255,.32) 0 8%,transparent 34%),linear-gradient(115deg,transparent 0 28%,rgba(0,98,255,.20) 44%,transparent 64%);opacity:.14;animation:woodsBluePulse 1.55s infinite steps(2,end)}
body:after{background:linear-gradient(100deg,transparent 0 35%,rgba(62,153,255,.30) 46%,rgba(14,77,255,.18) 54%,transparent 72%);opacity:.08;filter:blur(10px);animation:woodsBlueSweep 3.1s linear infinite}
.nav,.album-hero,.hero,.card,.track,.player,.fplayer,.audio-player,footer,section{position:relative;box-shadow:0 0 0 rgba(0,126,255,0);animation:woodsBlueEdge 1.55s infinite steps(2,end)}
.fplayer,.player,.audio-player{box-shadow:0 -10px 36px rgba(22,119,255,.18),0 0 24px rgba(22,119,255,.16)!important}
@keyframes woodsBluePulse{0%,100%{opacity:.10}12%{opacity:.36}24%{opacity:.16}38%{opacity:.42}52%{opacity:.12}70%{opacity:.32}}
@keyframes woodsBlueSweep{0%{transform:translateX(-38%) skewX(-10deg);opacity:.03}35%{opacity:.19}70%{opacity:.06}100%{transform:translateX(38%) skewX(-10deg);opacity:.03}}
@keyframes woodsBlueEdge{0%,100%{filter:none;box-shadow:0 0 0 rgba(0,126,255,0)}12%,38%,70%{filter:drop-shadow(0 0 9px rgba(41,128,255,.22));box-shadow:0 0 22px rgba(31,123,255,.12)}}
@media (prefers-reduced-motion: reduce){body:before,body:after,.nav,.album-hero,.hero,.card,.track,.player,.fplayer,.audio-player,footer,section{animation:none!important}body:before{opacity:.18}}
</style>`;
    html = html.replace("</head>", woodsPoliceLights + "</head>");
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
