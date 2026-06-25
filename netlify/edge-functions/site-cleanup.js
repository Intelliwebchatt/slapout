export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  const url = new URL(request.url);
  let html = await response.text();

  html = html.replaceAll('<span class="new">New</span>', '');
  html = html.replaceAll('<span class="new">Soon</span>', '');
  html = html.replaceAll('<span class="new">Coming Soon</span>', '');

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
