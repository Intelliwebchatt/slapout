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

  // Force fresh Woods cover loading on pages/cards after upload/cache changes.
  html = html.replaceAll('src="woods-cover.jpg"', 'src="/woods-cover.jpg?v=3"');
  html = html.replaceAll('poster="woods-cover.jpg"', 'poster="/woods-cover.jpg?v=3"');
  html = html.replaceAll("url('woods-cover.jpg')", "url('/woods-cover.jpg?v=3')");
  html = html.replaceAll('content="https://rydermccoy.com/woods-cover.jpg"', 'content="https://rydermccoy.com/woods-cover.jpg?v=3"');

  // Keep the homepage hero on the Ryder McCoy logo art and restore the clean logo-button version.
  if (url.pathname === "/" || url.pathname.endsWith("/index.html")) {
    html = html.replaceAll(
      "background-image:url('hero-mobile.png?v=7'),url('hero-stage.jpg')",
      "background-image:url('ryder-mccoy-logo-hero-square.webp?v=4'),url('ryder-mccoy-logo-hero-wide-2.webp?v=4')"
    );
    html = html.replaceAll(
      "background-image:url('hero-stage.jpg')",
      "background-image:url('ryder-mccoy-logo-hero-wide-2.webp?v=4')"
    );
    html = html.replaceAll(
      "background-size:cover,cover;background-position:center 30%,center 22%;background-repeat:no-repeat",
      "background-size:contain,cover;background-position:center center,center center;background-repeat:no-repeat"
    );
    html = html.replaceAll(
      "background-position:center 22%}.hero-img:after",
      "background-size:contain;background-position:center 34%;background-repeat:no-repeat}.hero-img:after"
    );
    html = html.replaceAll(
      '<header class="hero"><div class="hero-img" role="img" aria-label="The Ryder McCoy Band on stage"></div><div class="hero-content"><p class="eyebrow type">Slapout, Alabama · Biloxi Blues Records</p><h1>The Ryder<br>McCoy Band</h1><h2 class="display">Free Albums From The Backroads</h2><p class="tag">Outlaw country, swamp blues, and slow trap drums with dirt under their nails.</p><div class="hero-cta"><a class="start-btn" href="#start"><span class="pulse">▶</span> Start Here</a></div></div></header>',
      '<header class="hero"><div class="hero-img" role="img" aria-label="Ryder McCoy Band crow logo"></div><div class="hero-content"><p class="eyebrow type">Slapout, Alabama · Biloxi Blues Records</p><p class="tag">Outlaw country, swamp blues, and slow trap drums with dirt under their nails.</p><div class="hero-cta"><a class="start-btn" href="#start"><span class="pulse">▶</span> Start Here</a></div></div></header>'
    );
    html = html.replace(
      '</head>',
      '<style id="hero-logo-restore">.hero h1,.hero h2{display:none!important}.hero{border-bottom:1px solid var(--line)!important}.hero-img{height:48vh!important;min-height:370px!important;max-height:560px!important;background-size:contain,cover!important;background-position:center center,center center!important;background-repeat:no-repeat!important}.hero-content{max-width:620px!important;margin:-48px auto 0!important;padding:0 18px 54px!important}.hero-cta{margin:26px auto 0!important;display:flex!important;justify-content:center!important;width:100%!important}.start-btn{position:relative!important;isolation:isolate!important;overflow:hidden!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:13px!important;min-height:64px!important;min-width:255px!important;padding:16px 42px!important;border:1px solid rgba(233,224,207,.62)!important;border-radius:7px!important;background:linear-gradient(135deg,#191918 0%,#7b776e 14%,#2d2c29 30%,#b9b3a6 52%,#3d3a35 70%,#8e8779 100%)!important;color:#080704!important;font-family:Anton,Impact,sans-serif!important;text-transform:uppercase!important;letter-spacing:.14em!important;font-size:1.08rem!important;text-shadow:0 1px 0 rgba(255,255,255,.22),0 -1px 0 rgba(0,0,0,.72)!important;box-shadow:inset 0 2px 0 rgba(255,255,255,.32),inset 0 -5px 0 rgba(0,0,0,.55),inset 0 0 24px rgba(0,0,0,.45),0 0 28px rgba(255,138,42,.22),0 14px 30px rgba(0,0,0,.62)!important}.start-btn:before{content:""!important;position:absolute!important;inset:0!important;z-index:-1!important;background:repeating-linear-gradient(112deg,rgba(0,0,0,.34) 0 1px,transparent 1px 9px),radial-gradient(circle at 16% 26%,rgba(0,0,0,.48) 0 2px,transparent 3px),radial-gradient(circle at 74% 68%,rgba(0,0,0,.38) 0 2px,transparent 3px),linear-gradient(90deg,rgba(255,255,255,.24),transparent 20%,rgba(0,0,0,.24) 45%,transparent 70%,rgba(255,255,255,.14))!important;mix-blend-mode:multiply!important;opacity:.88!important}.start-btn:after{content:""!important;position:absolute!important;inset:4px!important;border:1px solid rgba(0,0,0,.55)!important;border-radius:4px!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.14)!important;pointer-events:none!important}.start-btn:hover,.start-btn:focus-visible{transform:translateY(-2px)!important;filter:brightness(1.12) contrast(1.06)!important;color:#050403!important;box-shadow:inset 0 2px 0 rgba(255,255,255,.35),inset 0 -5px 0 rgba(0,0,0,.55),inset 0 0 24px rgba(0,0,0,.42),0 0 34px rgba(255,138,42,.38),0 18px 34px rgba(0,0,0,.7)!important}.start-btn .pulse{font-size:1.05rem!important;color:#080704!important;text-shadow:0 1px 0 rgba(255,255,255,.2)!important}@media(min-width:820px){.hero{min-height:82vh!important;display:flex!important;align-items:flex-end!important;justify-content:center!important}.hero-img{position:absolute!important;inset:0!important;height:auto!important;min-height:0!important;max-height:none!important;background-image:url(\'ryder-mccoy-logo-hero-wide-2.webp?v=4\')!important;background-size:contain!important;background-position:center 34%!important;background-repeat:no-repeat!important}.hero-content{margin-top:0!important;padding:80px 20px 72px!important}}</style></head>'
    );
  }

  // Add Welcome to the Woods to plain static nav rows.
  if (!html.includes('href="woods.html"')) {
    html = html.replaceAll(
      '<a href="fall.html">The Fall</a><a href="wall.html">The Wall</a>',
      '<a href="fall.html">The Fall</a><a href="woods.html">Welcome to the Woods</a><a href="wall.html">The Wall</a>'
    );
  }

  // Add Welcome to the Woods to slap-nav static rows.
  if (!html.includes('data-page="woods.html"')) {
    html = html.replaceAll(
      '<a class="lnk" data-page="fall.html" href="fall.html">The Fall</a><a class="lnk" data-page="wall.html" href="wall.html">The Wall</a>',
      '<a class="lnk" data-page="fall.html" href="fall.html">The Fall</a><a class="lnk" data-page="woods.html" href="woods.html">Welcome to the Woods</a><a class="lnk" data-page="wall.html" href="wall.html">The Wall</a>'
    );
  }

  // Add Welcome to the Woods to JS-built NAV_LINKS arrays.
  if (!html.includes('file:"woods.html"') && !html.includes('file: "woods.html"')) {
    html = html.replaceAll(
      '{ file:"fall.html",   label:"The Fall" },\n    { file:"wall.html",       label:"The Wall" },',
      '{ file:"fall.html",   label:"The Fall" },\n    { file:"woods.html",  label:"Welcome to the Woods" },\n    { file:"wall.html",       label:"The Wall" },'
    );
    html = html.replaceAll(
      '{ file: "fall.html", label: "The Fall" },\n      { file: "wall.html", label: "The Wall" },',
      '{ file: "fall.html", label: "The Fall" },\n      { file: "woods.html", label: "Welcome to the Woods" },\n      { file: "wall.html", label: "The Wall" },'
    );
  }

  // Add the new album card to the home page records grid when the source page does not have it yet.
  if ((url.pathname === "/" || url.pathname.endsWith("/index.html")) && !html.includes('href="woods.html"')) {
    const woodsCard = '<a class="card" href="woods.html"><div class="cover"><img src="/woods-cover.jpg?v=3" alt="Welcome to the Woods album cover" loading="lazy"></div><div class="body"><div class="kicker">Record Four</div><div class="name">Welcome to the Woods</div><div class="meta">13 Tracks · Free</div></div></a>';
    html = html.replace(
      '</div></div></section><div class="strip">',
      woodsCard + '</div></div></section><div class="strip">'
    );
    html = html.replaceAll('Three records.', 'Four records.');
    html = html.replaceAll('one off each record', 'one from the road in');
    html = html.replaceAll('Three Songs To Understand It', 'Three Songs To Start With');
  }

  // Remove the booking/contact form from The Warning page only.
  const path = url.pathname.toLowerCase();
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
