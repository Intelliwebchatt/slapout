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
    const woodsCard = '<a class="card" href="woods.html"><div class="cover"><img src="woods-cover.jpg" alt="Welcome to the Woods album cover" loading="lazy"></div><div class="body"><div class="kicker">Record Four</div><div class="name">Welcome to the Woods</div><div class="meta">13 Tracks · Free</div></div></a>';
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
